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

## What is Max Copies

Max copies sets the maximum amount of copies you want to buy per uplink on a per device basis.
Without setting this, the default amount applied when setting up the route-id will be used.

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

When in the `Configuration` tab click on the `Variables` tab below. If `max_copies` field doesn't
exist click on the `+ Add variable` and assign it the key name of `max_copies` followed by the amount
of copies you would like values column.
![applications](/img/04-max-copies.jpg)

### From Chirpstack REST API

```python title="Endpoint: /api/devices/{device.devEui} Update the given device 1234 copies"
import requests

chirpstack_server = '<REST Endpoint>'
api_key = '<APIKEY>'
device_eui = '<DEVICE EUI>'
headers = {
    'Content-Type': 'application/json',
    'authorization': 'Bearer ' + api_key
}

json_body = {
    "device": {
        "devEui": device_eui,
        "name": "String",
        "description": "String",
        "applicationId": "UUID String",
        "deviceProfileId": "UUID String",
        "skipFcntCheck": False,
        "isDisabled": False,
        "variables": {
            "max_copies": "1234"  # <- Must be input as a string
        },
        "tags": {},
        "joinEui": "Hex String"
    }
}

r = requests.put(
    url=chirpstack_server + '/api/devices/' + device_eui,
    headers=headers,
    json=json_body
)

if r.status_code == 200:
    print('Success:', r.status_code)
elif r.status_code >= 400 and r.status_code < 500:
    print('Client Error:', r.status_code)
elif r.status_code > 500:
    print('Server Error:', r.status_code)
else:
    print('Other Error:', r.status_code)
```

### From Chirpstack gRPC API

```py title="Example Python Script, Update the given device 1234 copies"
from chirpstack_api import api
import grpc

server = '<IP|HOST:PORT>'
apikey = '<APIKEY>'
device_eui = '<DEVICE EUI>'
auth_token = [('authorization', f'Bearer {apikey}')]

with grpc.insecure_channel(server) as channel:
    try:
        client = api.DeviceServiceStub(channel)
        update_device = api.UpdateDeviceRequest()
        update_device.device.application_id = 'UUID String'
        update_device.device.description = 'String'
        update_device.device.dev_eui = device_eui
        update_device.device.device_profile_id = 'UUID String'
        update_device.device.is_disabled = False
        update_device.device.join_eui = 'Hex String'
        update_device.device.name = 'String'
        update_device.device.skip_fcnt_check = False
        update_device.device.variables['max_copies'] = '1234' # <- Must be input as a string
        update_device_resp = client.Update(update_device, metadata=auth_token)
    except Exception as e:
        print(f'gRPC Update Error: {e}')

print('gRPC Update Completed!')
```
