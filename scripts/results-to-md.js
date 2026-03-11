/**
 * scripts/results-to-md.js
 *
 * Purpose: Converts jest --json output to a human-readable markdown test report.
 * Usage: node scripts/results-to-md.js <input.json> <output.md> [title]
 */

'use strict'

const fs = require('fs')

const [,, inputFile, outputFile, title = 'Test Results'] = process.argv

if (!inputFile || !outputFile) {
    console.error('Usage: node scripts/results-to-md.js <input.json> <output.md> [title]')
    process.exit(1)
}

const data = JSON.parse(fs.readFileSync(inputFile, 'utf8'))

const passed = data.numPassedTests
const failed = data.numFailedTests
const total = data.numTotalTests
const duration = ((data.testResults || []).reduce((sum, s) => sum + (s.endTime - s.startTime), 0) / 1000).toFixed(2)
const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC'
const statusIcon = failed === 0 ? '✅' : '❌'
const statusLabel = failed === 0 ? 'PASSED' : 'FAILED'

const lines = [
    `# ${title}`,
    '',
    `**${statusIcon} ${statusLabel}** — ${passed}/${total} tests passed in ${duration}s`,
    '',
    `_${timestamp}_`,
    '',
    '---',
    '',
]

for (const suite of data.testResults || []) {
    const suitePath = (suite.name || suite.testFilePath || '').replace(process.cwd() + '/', '')
    const tests = suite.assertionResults || suite.testResults || []
    const suitePassCount = tests.filter(t => t.status === 'passed').length
    const suiteFailCount = tests.filter(t => t.status === 'failed').length
    const suiteIcon = suiteFailCount === 0 ? '✅' : '❌'

    lines.push(`## ${suiteIcon} \`${suitePath}\` (${suitePassCount}/${tests.length})`)
    lines.push('')

    // Group tests by describe block
    const groups = {}
    for (const test of tests) {
        const group = (test.ancestorTitles || []).join(' › ') || '(root)'
        if (!groups[group]) groups[group] = []
        groups[group].push(test)
    }

    for (const [group, tests] of Object.entries(groups)) {
        lines.push(`### ${group}`)
        lines.push('')
        for (const test of tests) {
            const icon = test.status === 'passed' ? '✅' : '❌'
            const dur = test.duration != null ? ` _(${test.duration}ms)_` : ''
            const name = test.title || test.fullName || ''
            lines.push(`- ${icon} ${name}${dur}`)
            if (test.failureMessages && test.failureMessages.length > 0) {
                const msg = test.failureMessages[0].split('\n').slice(0, 6).join('\n    ')
                lines.push(`  <details><summary>failure details</summary>`)
                lines.push('')
                lines.push('  ```')
                lines.push(`  ${msg}`)
                lines.push('  ```')
                lines.push('  </details>')
            }
        }
        lines.push('')
    }
}

fs.mkdirSync(require('path').dirname(outputFile), { recursive: true })
fs.writeFileSync(outputFile, lines.join('\n'), 'utf8')
console.log(`Written: ${outputFile}`)
