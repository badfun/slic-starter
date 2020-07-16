#!/usr/bin/env node

const AWS = require('aws-sdk')
AWS.config.update({region:'us-west-2'})

//const jsonFile = process.argv[2]
// if (!jsonFile) {
//   console.error(`Usage: ${process.argv[1]} JSON_FILE`)
//   process.exit(1)
// }

// had to force node to load this file.
const jsonFile = "../tmp/ssm-params.json"
const inputs = require(jsonFile)

const ssm = new AWS.SSM()

Promise.all(
  inputs.map(({ name, type, value }) => {
    console.log(`Creating ${name}`)
    return ssm
      .putParameter({
        Name: name,
        Type: type,
        Value: value,
        Overwrite: true
      })
      .promise()
      .then(() => name)
      .catch(err => `${name} FAILED with ${err}`)
  })
).then(result => console.log(result.join('\n')))
