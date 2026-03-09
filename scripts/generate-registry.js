/**
 * scripts/generate-registry.js
 *
 * Purpose: Walks actions/skills-mcp/skills/ and builds registry.json for the skills MCP server.
 * Usage: node scripts/generate-registry.js
 *   (also run automatically via package.json prebuild and pretest hooks)
 *
 * Output: actions/skills-mcp/registry.json
 */

'use strict'

const fs = require('fs')
const path = require('path')
const matter = require('gray-matter')

const ROOT = path.resolve(__dirname, '..')
const SKILLS_DIR = path.join(ROOT, 'actions', 'skills-mcp', 'skills')
const REGISTRY_OUT = path.join(ROOT, 'actions', 'skills-mcp', 'registry.json')
const DEPLOY_ID = 'skills-mcp-v1'

console.log('Generating skill registry...')

// Ensure skills directory exists
if (!fs.existsSync(SKILLS_DIR)) {
    console.error('ERROR: Skills directory not found:', SKILLS_DIR)
    process.exit(1)
}

const folders = fs.readdirSync(SKILLS_DIR).filter(f => {
    const stat = fs.statSync(path.join(SKILLS_DIR, f))
    return stat.isDirectory()
})

if (folders.length === 0) {
    console.error('ERROR: No skill folders found in', SKILLS_DIR)
    process.exit(1)
}

const skills = []

for (const folder of folders) {
    const skillMdPath = path.join(SKILLS_DIR, folder, 'SKILL.md')

    if (!fs.existsSync(skillMdPath)) {
        console.error(`ERROR: Missing SKILL.md in ${folder}`)
        process.exit(1)
    }

    const raw = fs.readFileSync(skillMdPath, 'utf8')
    const parsed = matter(raw)

    const { name, description } = parsed.data

    if (!name) {
        console.error(`ERROR: Missing required frontmatter field 'name' in ${folder}/SKILL.md`)
        process.exit(1)
    }
    if (!description) {
        console.error(`ERROR: Missing required frontmatter field 'description' in ${folder}/SKILL.md`)
        process.exit(1)
    }

    // Collect reference files
    const refsDir = path.join(SKILLS_DIR, folder, 'references')
    const references = []
    if (fs.existsSync(refsDir)) {
        const refFiles = fs.readdirSync(refsDir).filter(f => f.endsWith('.md'))
        for (const refFile of refFiles) {
            references.push({
                path: `references/${refFile}`,
                filename: refFile
            })
        }
    }

    skills.push({
        name,
        description,
        folder,
        body: parsed.content.trim(),
        references
    })

    console.log(`  + ${folder} (${references.length} references)`)
}

const registry = {
    deployId: DEPLOY_ID,
    skills
}

// Ensure output directory exists
fs.mkdirSync(path.dirname(REGISTRY_OUT), { recursive: true })
fs.writeFileSync(REGISTRY_OUT, JSON.stringify(registry, null, 2), 'utf8')

console.log(`Generated registry with ${skills.length} skills -> ${path.relative(ROOT, REGISTRY_OUT)}`)
