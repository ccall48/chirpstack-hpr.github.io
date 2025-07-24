---
id: AWS SQS Integration
sidebar_position: 1
sidebar_label: AWS SQS
slug: /integration/aws-sqs
tags:
    - aws
    - integration
    - sqs
---

:::note

This documentation does not cover how to create or setup an AWS SQS endpoint. You will need to follow
any steps or documentation provided by AWS to get this operational and ready for incoming connections.

:::

## AWS SQS Integration

To use this integration the following environment variables will need to be added and setup in the
chirpstack-hpr docker compose file.

```yml title="Environment Variables Required"
    # Usage Event Publisher
    - PUBLISH_USAGE_EVENTS=True
    - PUBLISH_USAGE_EVENTS_PROVIDER=AWS_SQS
    # Usage Event SQS Publisher
    - PUBLISH_USAGE_EVENTS_SQS_URL=<your usage events sqs url>
    - PUBLISH_USAGE_EVENTS_SQS_REGION=<your usage events sqs region>
    - AWS_ACCESS_KEY_ID=<your aws access key id>
    - AWS_SECRET_ACCESS_KEY=<your aws secret access key>
```

## External Links

[Getting Started with Amazon SQS](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-getting-started.html)