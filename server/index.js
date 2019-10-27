const AWS = require('aws-sdk')
const s3 = new AWS.S3()
const pipeline = new AWS.CodePipeline({ region: 'ap-southeast-1' })
const getPipelines = () => pipeline.listPipelines().promise()
const getPipelineState = (name) => pipeline.getPipelineState({ name }).promise()
const s3Config = {
  bucket: 'micro-crm',
  prefix: 'codepipeline-states/'
}

exports.handler = async (event) => {
  const { syncStates, syncList, source } = event
  if (syncStates) return await syncAllPipelineStates()
  if (syncList) return await syncPipelineList()
  if (source !== 'aws.codepipeline') return

  const { detail: { pipeline } } = event
  await uploadPipelineState(pipeline)
  return true;
};

const syncPipelineList = async () => {
  const res = await getPipelines()
  await s3.upload({
    Bucket: s3Config.bucket,
    CacheControl: 'no-cache',
    Key: `${s3Config.prefix}pipeline_list.json`,
    Body: Buffer.from(JSON.stringify(res))
  }).promise()
}

const syncAllPipelineStates = async () => {
  const { pipelines } = await getPipelines()
  await Promise.all(pipelines.map(({ name }) => uploadPipelineState(name)))
}

const uploadPipelineState = async (pipeline) => {
  const state = await getPipelineState(pipeline)
  await s3.upload({
    Bucket: s3Config.bucket,
    CacheControl: 'no-cache',
    Key: `${s3Config.prefix}${pipeline}.json`,
    Body: Buffer.from(JSON.stringify(state))
  }).promise()
}
