const AWS = require('aws-sdk')

const credentials = new AWS.Credentials({
  accessKeyId: process.env.VUE_APP_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.VUE_APP_AWS_SECRET_ACCESS_KEY,
})

const pipeline = new AWS.CodePipeline({
  region: 'ap-southeast-1',
  credentials
})

export const getPipelines = () => pipeline.listPipelines().promise()

export const getPipelineState = (name) => pipeline.getPipelineState({
  name
}).promise()
