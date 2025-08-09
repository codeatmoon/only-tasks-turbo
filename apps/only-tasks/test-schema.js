#!/usr/bin/env node

const { initializeSchema } = require('./lib/database/init.ts')

async function testSchema() {
  console.log('Testing schema initialization...')
  try {
    await initializeSchema()
    console.log('Schema initialization completed successfully!')
  } catch (error) {
    console.error('Schema initialization failed:', error)
    process.exit(1)
  }
}

testSchema()