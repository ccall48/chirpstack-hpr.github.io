---
id: HTTP Integration
sidebar_position: 2
sidebar_label: HTTP
slug: /integration/http
tags:
    - gRPC
    - http
    - integration
---

:::note

This documentation does not cover how to create or setup an HTTP endpoint. I have supplied a basic
snippet of what a python flask endpoint might look like.

:::

## HTTP Integration

To use this integration the following environment variables will need to be added and setup in the
chirpstack-hpr docker compose file.

```yml title="Environment Variables Required"
    # Usage Event Publisher
    - PUBLISH_USAGE_EVENTS=True
    - PUBLISH_USAGE_EVENTS_PROVIDER=HTTP
    # Usage Event Http Publisher
    - HTTP_PUBLISHER_ENDPOINT=<https://example.com/uplink>
```

The integration message gets sent over http as a gRPC encoded message. It will need to be decoded using the protobuf file, a python decoder is available in the Publishers section of the [repository](https://github.com/ccall48/chirpstack-hpr/tree/master/app/Publishers).


## Example Flask Endpoint

```python title="Example python flask decoding"
from flask import Flask, request, jsonify
import tenant_usage_pb2

@app.post('/tenant_dc')
def tenant_dc():
    event = tenant_usage_pb2.TenantUsage()
    if request.method == 'POST':
        msg = request.get_data()
        pl = event.FromString(msg)

        # Do something with the data here
        data = {
            'datetime': pl.datetime,
            'dev_eui': pl.dev_eui,
            'tenant_id': pl.tenant_id,
            'application_id': pl.application_id,
            'dc_used': pl.dc_used,
        }

        print(data)

        return jsonify({'proto': 'received', 'code': 200}), 200
    return jsonify({'error': 'invalid request', 'code': 500}), 500
```
