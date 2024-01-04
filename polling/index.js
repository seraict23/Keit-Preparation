const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')
const argv = yargs(hideBin(process.argv)).argv
const run = require('./main')
const init = (argv.init && argv.init !== 'false') ? true : false 

run(init)
