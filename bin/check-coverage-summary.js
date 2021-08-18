#!/usr/bin/env node

const { join, resolve } = require('path')
const arg = require('arg')

const args = arg({
  '--from': String, // default coverage/coverage-summary.json
  '--lines': Number, // default 80
  '--statements': Number, // default 80
  '--functions': Number, // default 80
  '--branches': Number, // default 80
})

const fromFilename = args['--from'] || join('coverage', 'coverage-summary.json')
const coverageFilename = resolve(fromFilename)
const percentages = {};
percentages.lines = args['--lines'] || 80
percentages.statements = args['--statements'] || 80
percentages.functions = args['--functions'] || 80
percentages.branches = args['--branches'] || 80

const coverage = require(coverageFilename)
const total = coverage.total
if (!total) {
  console.error('Could not find "total" object in %s', fromFilename)
  process.exit(1)
}

// total should have objects for lines, statements, functions and branches
// each object should have total, covered, skipped and pct numbers
const arr = ['lines', 'statements', 'functions', 'branches'];
for (let i = 0; i < arr.length; i++) {
  const type = arr[i];
  const item = total[type]
  if (!item) {
    console.error(`Could not find ${type} in ${total}`)
    process.exit(1)
  }

  if (item.pct < percentages[type]) {
    console.log(`🚨 ${type} coverage %d is below minimum %d%%`, item.pct, percentages[type])
    console.log('file %s', coverageFilename)
    process.exit(1)
  }
}

console.log('✅ lines, statements, functions and branches all match coverage minimum check')
