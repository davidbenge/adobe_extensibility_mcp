/*
Copyright 2022 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

/**
 * Adobe Developer Skills MCP Server
 *
 * Serves a curated library of Adobe developer skills via the Model Context Protocol.
 * Implements the Agent Skills progressive disclosure pattern: agents list skills,
 * load full skill bodies, and read specific reference files on demand.
 *
 * Tools:
 *   list_skills           — returns catalog of all available skills (name + description)
 *   load_skill            — returns full SKILL.md body for a named skill
 *   read_skill_resource   — returns a specific reference file for a named skill
 *
 * Deployed as a stateless Adobe I/O Runtime action (StreamableHTTP, JSON mode).
 */

const { Core } = require('@adobe/aio-sdk')
const { McpServer } = require('@modelcontextprotocol/sdk/server/mcp.js')
const { StreamableHTTPServerTransport } = require('@modelcontextprotocol/sdk/server/streamableHttp.js')
const { z } = require('zod')
const { catalog, registry, resourceCache } = require('./registry.js')

// Global logger variable
let logger = null

/**
 * Build MCP server with the 3 skills tools
 */
function buildMcpServer () {
    const server = new McpServer({
        name: 'adobe-developer-skills',
        version: '1.0.0'
    }, {
        capabilities: {
            tools: {},
            logging: {}
        }
    })

    // Tool: list_skills — no args, returns catalog (name + description for each skill)
    server.tool(
        'list_skills',
        'List all available Adobe developer skills. Returns an array of skill names and descriptions. Call this first to discover which skills are available before loading one.',
        {},
        async () => {
            return {
                content: [
                    {
                        type: 'text',
                        text: JSON.stringify(catalog, null, 2)
                    }
                ]
            }
        }
    )

    // Tool: load_skill — loads the full SKILL.md body for a named skill
    server.tool(
        'load_skill',
        'Load the full content of a named skill. Returns the SKILL.md body including when-to-load guidance for reference files. Use list_skills first to get valid skill names.',
        {
            skill_name: z.string().describe('The name of the skill to load (e.g. "app-builder-actions")')
        },
        async ({ skill_name }) => {
            const skill = registry[skill_name]
            if (!skill) {
                const available = Object.keys(registry).join(', ')
                return {
                    isError: true,
                    content: [
                        {
                            type: 'text',
                            text: `Skill not found: "${skill_name}". Available skills: ${available}`
                        }
                    ]
                }
            }
            return {
                content: [
                    {
                        type: 'text',
                        text: skill.body
                    }
                ]
            }
        }
    )

    // Tool: read_skill_resource — loads a specific reference file for a skill
    server.tool(
        'read_skill_resource',
        'Read a specific reference file for a skill. Use after load_skill to get detailed reference content. The skill body will tell you which files to load and when.',
        {
            skill_name: z.string().describe('The name of the skill (e.g. "app-builder-actions")'),
            resource_path: z.string().describe('The relative path to the resource file (e.g. "references/ACTION_STRUCTURE.md")')
        },
        async ({ skill_name, resource_path }) => {
            const skill = registry[skill_name]
            if (!skill) {
                const available = Object.keys(registry).join(', ')
                return {
                    isError: true,
                    content: [
                        {
                            type: 'text',
                            text: `Skill not found: "${skill_name}". Available skills: ${available}`
                        }
                    ]
                }
            }

            const key = `${skill_name}/${resource_path}`
            const content = resourceCache.get(key)

            if (content === undefined) {
                const availablePaths = skill.references.map(r => r.path).join(', ')
                return {
                    isError: true,
                    content: [
                        {
                            type: 'text',
                            text: `Resource not found: "${resource_path}" in skill "${skill_name}". Available paths: ${availablePaths}`
                        }
                    ]
                }
            }

            return {
                content: [
                    {
                        type: 'text',
                        text: content
                    }
                ]
            }
        }
    )

    if (logger) {
        logger.info('MCP Server built with 3 skills tools: list_skills, load_skill, read_skill_resource')
    }

    return server
}

/**
 * Parse request body from Adobe I/O Runtime parameters
 */
function parseRequestBody (params) {
    if (!params.__ow_body) {
        return null
    }

    try {
        if (typeof params.__ow_body === 'string') {
            try {
                const decoded = Buffer.from(params.__ow_body, 'base64').toString('utf8')
                return JSON.parse(decoded)
            } catch (e) {
                return JSON.parse(params.__ow_body)
            }
        } else {
            return params.__ow_body
        }
    } catch (error) {
        logger?.error('Failed to parse request body:', error)
        throw new Error(`Failed to parse request body: ${error.message}`)
    }
}

/**
 * Normalize headers to lowercase keys for consistent lookup
 */
function normalizeHeaders (headers) {
    const normalized = {}
    if (headers) {
        for (const key in headers) {
            normalized[key.toLowerCase()] = headers[key]
        }
    }
    return normalized
}

/**
 * Create minimal req object compatible with StreamableHTTPServerTransport
 */
function createCompatibleRequest (params) {
    const body = parseRequestBody(params)

    const incomingHeaders = normalizeHeaders(params.__ow_headers)

    if (incomingHeaders.accept && incomingHeaders.accept.includes('text/event-stream')) {
        logger?.info('Client requested SSE streaming, forcing JSON mode (serverless limitation)')
    }

    const headers = {
        'content-type': 'application/json',
        'mcp-session-id': params['mcp-session-id'] || incomingHeaders['mcp-session-id'],
        ...incomingHeaders,
        'accept': 'application/json, text/event-stream'
    }

    return {
        method: (params.__ow_method || 'GET').toUpperCase(),
        url: params.__ow_path || '/skills-mcp',
        path: params.__ow_path || '/skills-mcp',
        headers,
        body,
        socket: {
            remoteAddress: '127.0.0.1',
            encrypted: true
        },
        get (name) {
            return this.headers[name.toLowerCase()]
        }
    }
}

/**
 * Create minimal res object compatible with StreamableHTTPServerTransport
 */
function createCompatibleResponse () {
    let statusCode = 200
    let headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, DELETE',
        'Access-Control-Allow-Headers': 'Content-Type, Accept, Authorization, x-api-key, mcp-session-id, Last-Event-ID',
        'Access-Control-Expose-Headers': 'Content-Type, mcp-session-id, Last-Event-ID',
        'Access-Control-Max-Age': '86400'
    }
    let body = ''
    let headersSent = false

    const res = {
        status: code => {
            statusCode = code
            res.statusCode = code
            return res
        },
        setHeader: (name, value) => { headers[name] = value; return res },
        getHeader: name => headers[name],
        writeHead: (code, reasonOrHeaders, headerObj) => {
            statusCode = code
            res.statusCode = code
            const hdrs = typeof reasonOrHeaders === 'object' ? reasonOrHeaders : (headerObj || {})
            headers = { ...headers, ...hdrs }
            headersSent = true
            return res
        },

        write: chunk => {
            if (chunk) {
                body += typeof chunk === 'string' ? chunk : JSON.stringify(chunk)
            }
            return true
        },
        end: chunk => {
            if (chunk) {
                body += typeof chunk === 'string' ? chunk : JSON.stringify(chunk)
            }
            headersSent = true
            return res
        },
        json: obj => {
            headers['Content-Type'] = 'application/json'
            body = JSON.stringify(obj)
            headersSent = true
            return res
        },
        send: data => {
            if (data) {
                body = typeof data === 'string' ? data : JSON.stringify(data)
            }
            headersSent = true
            return res
        },

        get headersSent () { return headersSent },
        get writableEnded () { return false },
        get writableFinished () { return false },
        get finished () { return false },
        get writable () { return true },
        statusCode: 200,

        socket: {
            writable: true,
            destroyed: false,
            on: () => {},
            once: () => {},
            removeListener: () => {},
            write: () => true,
            end: () => {}
        },
        connection: null,

        flushHeaders: () => { headersSent = true },

        on: (event, handler) => { return res },
        once: (event, handler) => { return res },
        emit: (event, ...args) => { return true },
        removeListener: () => { return res },
        addListener: (event, handler) => { return res },
        off: (event, handler) => { return res },

        getResult: () => {
            logger?.info('Final response - Status:', statusCode, 'Body length:', body.length, 'Headers:', Object.keys(headers).join(', '))
            return { statusCode, headers, body }
        }
    }

    return res
}

/**
 * Handle health check requests
 */
function handleHealthCheck () {
    return {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, DELETE',
            'Access-Control-Allow-Headers': 'Content-Type, Accept, Authorization, x-api-key, mcp-session-id, Last-Event-ID',
            'Access-Control-Expose-Headers': 'Content-Type, mcp-session-id, Last-Event-ID',
            'Access-Control-Max-Age': '86400',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            status: 'healthy',
            server: 'adobe-developer-skills',
            version: '1.0.0',
            description: 'Adobe Developer Skills MCP Server — serves Adobe developer knowledge on demand',
            timestamp: new Date().toISOString(),
            transport: 'StreamableHTTP',
            sdk: '@modelcontextprotocol/sdk'
        })
    }
}

/**
 * Handle CORS OPTIONS requests
 */
function handleOptionsRequest () {
    return {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, DELETE',
            'Access-Control-Allow-Headers': 'Content-Type, Accept, Authorization, x-api-key, mcp-session-id, Last-Event-ID',
            'Access-Control-Expose-Headers': 'Content-Type, mcp-session-id, Last-Event-ID',
            'Access-Control-Max-Age': '86400'
        },
        body: ''
    }
}

/**
 * Handle MCP requests using the SDK
 */
async function handleMcpRequest (params) {
    const server = buildMcpServer()

    try {
        logger?.info('Creating fresh MCP server and transport')

        const req = createCompatibleRequest(params)
        const res = createCompatibleResponse()

        logger?.info('Request method:', req.body?.method)

        const transport = new StreamableHTTPServerTransport({
            sessionIdGenerator: undefined,
            enableJsonResponse: true
        })

        await server.connect(transport)

        const responseComplete = new Promise(resolve => {
            const originalEnd = res.end.bind(res)
            res.end = function (chunk) {
                const result = originalEnd(chunk)
                setTimeout(() => resolve(), 10)
                return result
            }
        })

        await transport.handleRequest(req, res, req.body)
        await responseComplete

        logger?.info('MCP request processed by SDK')
        return res.getResult()

    } catch (error) {
        logger?.error('Error in handleMcpRequest:', error)

        try {
            server.close()
        } catch (cleanupError) {
            logger?.error('Error during cleanup:', cleanupError)
        }

        return {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                jsonrpc: '2.0',
                error: {
                    code: -32603,
                    message: `Internal server error: ${error.message}`
                },
                id: null
            })
        }
    }
}

/**
 * Main function for Adobe I/O Runtime
 */
async function main (params) {
    try {
        console.log('=== ADOBE DEVELOPER SKILLS MCP SERVER ===')
        console.log('Method:', params.__ow_method)

        try {
            logger = Core.Logger('adobe-developer-skills', { level: params.LOG_LEVEL || 'info' })
        } catch (loggerError) {
            console.error('Logger creation error:', loggerError)
            return {
                statusCode: 500,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ error: `Logger creation error: ${loggerError.message}` })
            }
        }

        logger.info('Adobe Developer Skills MCP Server v1.0.0')
        logger.info(`Request method: ${params.__ow_method}`)

        const incomingHeaders = normalizeHeaders(params.__ow_headers)

        switch (params.__ow_method?.toLowerCase()) {
        case 'get':
            if (incomingHeaders.accept && incomingHeaders.accept.includes('text/event-stream')) {
                logger.info('SSE stream requested - not supported in serverless, returning graceful response')
                return {
                    statusCode: 200,
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                        'Content-Type': 'text/event-stream',
                        'Cache-Control': 'no-cache',
                        'Connection': 'close'
                    },
                    body: 'event: error\ndata: {"error": "SSE not supported in serverless. Use HTTP transport."}\n\n'
                }
            }
            logger.info('Health check request')
            return handleHealthCheck()

        case 'options':
            logger.info('CORS preflight request')
            return handleOptionsRequest()

        case 'post':
            logger.info('MCP protocol request - delegating to SDK')
            return await handleMcpRequest(params)

        default:
            logger.warn(`Method not allowed: ${params.__ow_method}`)
            return {
                statusCode: 405,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    jsonrpc: '2.0',
                    error: {
                        code: -32000,
                        message: `Method '${params.__ow_method}' not allowed. Supported: GET, POST, OPTIONS`
                    },
                    id: null
                })
            }
        }

    } catch (error) {
        if (logger) {
            logger.error('Uncaught error in main function:', error)
        } else {
            console.error('Uncaught error in main function:', error)
        }

        return {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                jsonrpc: '2.0',
                error: {
                    code: -32603,
                    message: `Unhandled server error: ${error.message}`
                },
                id: null
            })
        }
    }
}

module.exports = { main }
