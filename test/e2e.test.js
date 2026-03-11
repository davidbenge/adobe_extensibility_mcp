/**
 * test/e2e.test.js
 *
 * Purpose: End-to-end tests against a live deployed MCP endpoint.
 *   Verifies all three MCP tools work correctly over HTTP after a deploy.
 *
 * Usage:
 *   npm run test:e2e                          # runs against stage (default)
 *   E2E_URL=<url> npm run test:e2e            # runs against any deployed endpoint
 *
 * E2E_URL defaults to the stage endpoint. Override for prod or local dev server.
 */

'use strict'

const BASE_URL = process.env.E2E_URL ||
    'https://27200-adobeextmcp-stage.adobeioruntime.net/api/v1/web/adobe-extensibility-mcp/skills-mcp'

async function mcpPost (body) {
    const res = await fetch(BASE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    })
    return res.json()
}

describe(`E2E: Adobe Extensibility MCP — ${BASE_URL}`, () => {

    describe('Health check', () => {
        test('GET returns healthy status', async () => {
            const res = await fetch(BASE_URL)
            expect(res.status).toBe(200)
            const body = await res.json()
            expect(body.status).toBe('healthy')
            expect(body.server).toBe('adobe-developer-skills')
            expect(body.transport).toBe('StreamableHTTP')
        })
    })

    describe('MCP handshake', () => {
        test('initialize returns protocol version and server info', async () => {
            const d = await mcpPost({
                jsonrpc: '2.0',
                id: 1,
                method: 'initialize',
                params: {
                    protocolVersion: '2024-11-05',
                    capabilities: {},
                    clientInfo: { name: 'e2e-test', version: '1.0' }
                }
            })
            expect(d.error).toBeUndefined()
            expect(d.result.protocolVersion).toBe('2024-11-05')
            expect(d.result.serverInfo.name).toBe('adobe-developer-skills')
            expect(d.result.capabilities.tools).toBeDefined()
        })

        test('tools/list returns exactly 3 tools', async () => {
            const d = await mcpPost({ jsonrpc: '2.0', id: 2, method: 'tools/list', params: {} })
            expect(d.error).toBeUndefined()
            const names = d.result.tools.map(t => t.name).sort()
            expect(names).toEqual(['list_skills', 'load_skill', 'read_skill_resource'])
        })
    })

    describe('list_skills', () => {
        test('returns all 10 skill domains with name and description', async () => {
            const d = await mcpPost({
                jsonrpc: '2.0', id: 3,
                method: 'tools/call',
                params: { name: 'list_skills', arguments: {} }
            })
            expect(d.error).toBeUndefined()
            const skills = JSON.parse(d.result.content[0].text)
            expect(skills.length).toBe(10)
            for (const skill of skills) {
                expect(skill.name).toBeTruthy()
                expect(skill.description).toBeTruthy()
            }
            const names = skills.map(s => s.name)
            expect(names).toContain('app-builder-actions')
            expect(names).toContain('app-builder-frontend')
            expect(names).toContain('workfront-tasks-api')
            expect(names).toContain('workfront-approvals-api')
        })
    })

    describe('load_skill', () => {
        test('returns skill body for app-builder-actions', async () => {
            const d = await mcpPost({
                jsonrpc: '2.0', id: 4,
                method: 'tools/call',
                params: { name: 'load_skill', arguments: { skill_name: 'app-builder-actions' } }
            })
            expect(d.error).toBeUndefined()
            expect(d.result.isError).toBeUndefined()
            const text = d.result.content[0].text
            expect(text.length).toBeGreaterThan(100)
            expect(text).toContain('App Builder')
        })

        test('returns isError for unknown skill', async () => {
            const d = await mcpPost({
                jsonrpc: '2.0', id: 5,
                method: 'tools/call',
                params: { name: 'load_skill', arguments: { skill_name: 'nonexistent-skill' } }
            })
            expect(d.error).toBeUndefined()
            expect(d.result.isError).toBe(true)
        })
    })

    describe('read_skill_resource', () => {
        test('returns reference file content for app-builder-actions/ACTION_STRUCTURE.md', async () => {
            const d = await mcpPost({
                jsonrpc: '2.0', id: 6,
                method: 'tools/call',
                params: {
                    name: 'read_skill_resource',
                    arguments: {
                        skill_name: 'app-builder-actions',
                        resource_path: 'references/ACTION_STRUCTURE.md'
                    }
                }
            })
            expect(d.error).toBeUndefined()
            expect(d.result.isError).toBeUndefined()
            const text = d.result.content[0].text
            expect(text.length).toBeGreaterThan(100)
        })

        test('returns reference file content for workfront-tasks-api', async () => {
            const d = await mcpPost({
                jsonrpc: '2.0', id: 7,
                method: 'tools/call',
                params: {
                    name: 'read_skill_resource',
                    arguments: {
                        skill_name: 'workfront-tasks-api',
                        resource_path: 'references/TASK_FIELDS.md'
                    }
                }
            })
            expect(d.error).toBeUndefined()
            expect(d.result.isError).toBeUndefined()
            expect(d.result.content[0].text.length).toBeGreaterThan(100)
        })

        test('returns isError for unknown resource path', async () => {
            const d = await mcpPost({
                jsonrpc: '2.0', id: 8,
                method: 'tools/call',
                params: {
                    name: 'read_skill_resource',
                    arguments: {
                        skill_name: 'app-builder-actions',
                        resource_path: 'references/NONEXISTENT.md'
                    }
                }
            })
            expect(d.error).toBeUndefined()
            expect(d.result.isError).toBe(true)
        })
    })
})
