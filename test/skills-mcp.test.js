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
 * Test suite for Adobe Developer Skills MCP Server
 */

const { main } = require('../actions/skills-mcp/index.js')

describe('Adobe Developer Skills MCP Server', () => {

    describe('Health Check', () => {
        test('should respond to GET request with health status', async () => {
            const params = {
                __ow_method: 'get',
                __ow_path: '/',
                LOG_LEVEL: 'info'
            }

            const result = await main(params)

            expect(result.statusCode).toBe(200)
            expect(result.headers['Content-Type']).toBe('application/json')

            const body = JSON.parse(result.body)
            expect(body.status).toBe('healthy')
            expect(body.server).toBe('adobe-developer-skills')
            expect(body.version).toBe('1.0.0')
        })
    })

    describe('CORS Support', () => {
        test('should handle OPTIONS request for CORS preflight', async () => {
            const params = {
                __ow_method: 'options',
                LOG_LEVEL: 'info'
            }

            const result = await main(params)

            expect(result.statusCode).toBe(200)
            expect(result.headers['Access-Control-Allow-Origin']).toBe('*')
            expect(result.headers['Access-Control-Allow-Methods']).toContain('POST')
        })
    })

    describe('MCP Protocol', () => {
        test('should handle initialize request', async () => {
            const initRequest = {
                jsonrpc: '2.0',
                id: 1,
                method: 'initialize',
                params: {
                    protocolVersion: '2024-11-05',
                    capabilities: {},
                    clientInfo: {
                        name: 'test-client',
                        version: '1.0.0'
                    }
                }
            }

            const params = {
                __ow_method: 'post',
                __ow_body: JSON.stringify(initRequest),
                LOG_LEVEL: 'info'
            }

            const result = await main(params)

            expect(result.statusCode).toBe(200)

            const body = JSON.parse(result.body)
            expect(body.jsonrpc).toBe('2.0')
            expect(body.id).toBe(1)
            expect(body.result.protocolVersion).toBe('2024-11-05')
            expect(body.result.serverInfo.name).toBe('adobe-developer-skills')
        })

        test('tools/list should return exactly 3 tools: list_skills, load_skill, read_skill_resource', async () => {
            const toolsListRequest = {
                jsonrpc: '2.0',
                id: 2,
                method: 'tools/list',
                params: {}
            }

            const params = {
                __ow_method: 'post',
                __ow_body: JSON.stringify(toolsListRequest),
                LOG_LEVEL: 'info'
            }

            const result = await main(params)

            expect(result.statusCode).toBe(200)

            const body = JSON.parse(result.body)
            expect(body.jsonrpc).toBe('2.0')
            expect(body.id).toBe(2)
            expect(Array.isArray(body.result.tools)).toBe(true)
            expect(body.result.tools).toHaveLength(3)

            const toolNames = body.result.tools.map(t => t.name)
            expect(toolNames).toContain('list_skills')
            expect(toolNames).toContain('load_skill')
            expect(toolNames).toContain('read_skill_resource')
        })

        test('list_skills should return JSON array with 6 skills, each with name + description', async () => {
            const toolCallRequest = {
                jsonrpc: '2.0',
                id: 3,
                method: 'tools/call',
                params: {
                    name: 'list_skills',
                    arguments: {}
                }
            }

            const params = {
                __ow_method: 'post',
                __ow_body: JSON.stringify(toolCallRequest),
                LOG_LEVEL: 'info'
            }

            const result = await main(params)

            expect(result.statusCode).toBe(200)

            const body = JSON.parse(result.body)
            expect(body.jsonrpc).toBe('2.0')
            expect(body.id).toBe(3)
            expect(body.result.content).toBeDefined()
            expect(body.result.content[0].type).toBe('text')

            const skills = JSON.parse(body.result.content[0].text)
            expect(Array.isArray(skills)).toBe(true)
            expect(skills).toHaveLength(6)

            for (const skill of skills) {
                expect(skill.name).toBeDefined()
                expect(skill.description).toBeDefined()
                expect(typeof skill.name).toBe('string')
                expect(typeof skill.description).toBe('string')
            }
        })

        test('load_skill with valid name returns non-empty markdown body', async () => {
            const toolCallRequest = {
                jsonrpc: '2.0',
                id: 4,
                method: 'tools/call',
                params: {
                    name: 'load_skill',
                    arguments: {
                        skill_name: 'app-builder-actions'
                    }
                }
            }

            const params = {
                __ow_method: 'post',
                __ow_body: JSON.stringify(toolCallRequest),
                LOG_LEVEL: 'info'
            }

            const result = await main(params)

            expect(result.statusCode).toBe(200)

            const body = JSON.parse(result.body)
            expect(body.result.content[0].text.length).toBeGreaterThan(100)
            expect(body.result.isError).toBeFalsy()
        })

        test('load_skill with invalid name returns isError: true', async () => {
            const toolCallRequest = {
                jsonrpc: '2.0',
                id: 5,
                method: 'tools/call',
                params: {
                    name: 'load_skill',
                    arguments: {
                        skill_name: 'nonexistent-skill'
                    }
                }
            }

            const params = {
                __ow_method: 'post',
                __ow_body: JSON.stringify(toolCallRequest),
                LOG_LEVEL: 'info'
            }

            const result = await main(params)

            expect(result.statusCode).toBe(200)

            const body = JSON.parse(result.body)
            expect(body.result.isError).toBe(true)
            expect(body.result.content[0].text).toContain('nonexistent-skill')
        })

        test('read_skill_resource with valid skill + valid path returns content', async () => {
            const toolCallRequest = {
                jsonrpc: '2.0',
                id: 6,
                method: 'tools/call',
                params: {
                    name: 'read_skill_resource',
                    arguments: {
                        skill_name: 'app-builder-actions',
                        resource_path: 'references/ACTION_STRUCTURE.md'
                    }
                }
            }

            const params = {
                __ow_method: 'post',
                __ow_body: JSON.stringify(toolCallRequest),
                LOG_LEVEL: 'info'
            }

            const result = await main(params)

            expect(result.statusCode).toBe(200)

            const body = JSON.parse(result.body)
            expect(body.result.isError).toBeFalsy()
            expect(body.result.content[0].text.length).toBeGreaterThan(100)
        })

        test('read_skill_resource with valid skill + invalid path returns isError: true with available paths', async () => {
            const toolCallRequest = {
                jsonrpc: '2.0',
                id: 7,
                method: 'tools/call',
                params: {
                    name: 'read_skill_resource',
                    arguments: {
                        skill_name: 'app-builder-actions',
                        resource_path: 'references/NONEXISTENT.md'
                    }
                }
            }

            const params = {
                __ow_method: 'post',
                __ow_body: JSON.stringify(toolCallRequest),
                LOG_LEVEL: 'info'
            }

            const result = await main(params)

            expect(result.statusCode).toBe(200)

            const body = JSON.parse(result.body)
            expect(body.result.isError).toBe(true)
            expect(body.result.content[0].text).toContain('Available paths')
        })

        test('read_skill_resource with invalid skill name returns isError: true', async () => {
            const toolCallRequest = {
                jsonrpc: '2.0',
                id: 8,
                method: 'tools/call',
                params: {
                    name: 'read_skill_resource',
                    arguments: {
                        skill_name: 'nonexistent-skill',
                        resource_path: 'references/ANYTHING.md'
                    }
                }
            }

            const params = {
                __ow_method: 'post',
                __ow_body: JSON.stringify(toolCallRequest),
                LOG_LEVEL: 'info'
            }

            const result = await main(params)

            expect(result.statusCode).toBe(200)

            const body = JSON.parse(result.body)
            expect(body.result.isError).toBe(true)
        })
    })

    describe('Error Handling', () => {
        test('should handle invalid JSON-RPC request', async () => {
            const params = {
                __ow_method: 'post',
                __ow_body: 'invalid json',
                LOG_LEVEL: 'info'
            }

            const result = await main(params)

            expect(result.statusCode).toBe(500)

            const body = JSON.parse(result.body)
            expect(body.jsonrpc).toBe('2.0')
            expect(body.error).toBeDefined()
        })

        test('should handle unknown tool call', async () => {
            const toolCallRequest = {
                jsonrpc: '2.0',
                id: 9,
                method: 'tools/call',
                params: {
                    name: 'nonexistent_tool',
                    arguments: {}
                }
            }

            const params = {
                __ow_method: 'post',
                __ow_body: JSON.stringify(toolCallRequest),
                LOG_LEVEL: 'info'
            }

            const result = await main(params)

            expect(result.statusCode).toBe(200)

            const body = JSON.parse(result.body)
            expect(body.jsonrpc).toBe('2.0')
            expect(body.error.code).toBe(-32602)
        })

        test('should handle unsupported HTTP method', async () => {
            const params = {
                __ow_method: 'put',
                LOG_LEVEL: 'info'
            }

            const result = await main(params)

            expect(result.statusCode).toBe(405)
        })
    })
})
