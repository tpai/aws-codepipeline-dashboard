# Pipeline Dashboard

## How to run

1. Setup env variables

Create `.env.local` from template and fill with your AWS credentials

```
cp .env.sample .env.local
```

Or generate by script if you've logged in AWS in terminal

```
yarn env
```

2. Install dependencies
```
yarn install
```

3. Serve with development mode by
```
yarn serve
```

or run with production build
```
yarn build && cd dist/ && npx http-server
```

4. Open `http://localhost:8080` and select the pipelines you want to subscribe :)

**Caveats:** [Notification API](https://developer.mozilla.org/en-US/docs/Web/API/Notifications_API/Using_the_Notifications_API) will be used to inform status changes of pipelines, and the feature is available only in secure contexts (HTTPS) or "localhost".

**Notice:** Add `?nosummary=1` query if you don't want to see commit messages.

## Deploy client to S3

```
S3_BUCKET_DIR=<your s3 bucket + prefix> yarn release
```

## References

* [aws-sdk: AWS.CodePipeline](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CodePipeline.html)


## Project setup

### Compiles and hot-reloads for development
```
yarn run serve
```

### Compiles and minifies for production
```
yarn run build
```

### Run your tests
```
yarn run test
```

### Lints and fixes files
```
yarn run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
