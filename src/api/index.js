const axios = require('axios')
const bucket = process.env.VUE_APP_S3_BUCKET_NAME
const prefix = process.env.VUE_APP_S3_BUCKET_PREFIX

export const getPipelines = () => axios.get(`https://${bucket}.s3-ap-southeast-1.amazonaws.com/${prefix}pipeline_list.json`)

export const getPipelineState = (name) => axios.get(`https://${bucket}.s3-ap-southeast-1.amazonaws.com/${prefix}${name}.json`)
