---
id: max-copies
title: Max Copies
sidebar_position: 2
sidebar_label: Max Copies
slug: /chirpstack-hpr/max-copies
tags:
    - dc
    - per device
    - max copies
---

## What is max copies

By default Chirpstack-HPR sets a max copies session key per device with the helium config service if
not set by the user. The default max copies if not set per device reverts to the default setting set
for the route-id when it was created.

## How to set max copies

### From Chirpstack WebUI

Applications/*application name*/

![applications](/img/01-max-copies.jpg)

Click on the device `DevEui` link for the device you wish to alter or set the max copies for.
![applications](/img/02-max-copies.jpg)

Once in the device dashboard, click on the `Configuration` tab.
![applications](/img/03-max-copies.jpg)

When in the configuration tab click on the `Variables` tab.
![applications](/img/04-max-copies.jpg)

### From Chirpstack REST API

```json title="Endpoint: /api/devices/{device.devEui} Update the given device 1234 copies"
{
  "device": {
    "applicationId": "string",
    "description": "string",
    "deviceProfileId": "string",
    "isDisabled": false,
    "joinEui": "string",
    "name": "string",
    "skipFcntCheck": false,
    "tags": {},
    },
    "variables": {
      "max_copies": "1234" // <- Must be input as a string
    }
}
```

### From Chirpstack gRPC API

```py title="Example Python Script, Update the given device 1234 copies"
from chirpstack_api import api
import grpc

server = '<IP|HOST:PORT>'
apikey = '<APIKEY>'
auth_token = [('authorization', f'Bearer {apikey}')]

with grpc.insecure_channel(server) as channel:
    try:
        client = api.DeviceServiceStub(channel)
        update_device = api.UpdateDeviceRequest()
        update_device.device.application_id = 'string'
        update_device.device.description = 'string'
        update_device.device.dev_eui = 'string'
        update_device.device.device_profile_id = 'string'
        update_device.device.is_disabled = False
        update_device.device.join_eui = 'string'
        update_device.device.name = 'string'
        update_device.device.skip_fcnt_check = False
        update_device.device.variables['max_copies'] = '1234' # <- Must be input as a string
        update_device_resp = client.Update(update_device, metadata=auth_token)
    except Exception as e:
        print(f'gRPC Update Error: {e}')

print('gRPC Update Completed!')
```
