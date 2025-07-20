---
sidebar_position: 3
sidebar_label: Chirpstack-HPR Setup
slug: chirpstack-hpr-setup
id: Chirpstack-HPR Setup
tags:
    - chirpstack-hpr-setup
    - docker compose
    - environment variables
---

:::note

This page documents the Docker setup and environment variable configuration required to run chirpstack-hpr in a Docker container. It provides details on the Docker environment required and optional environment variables, and configuration approaches for containerised deployment.

:::

:::warning
Please ensure you have followed the initial setup procedures outlined in the official documentation for running a Helium IOT Network LNS.
    1. [Run a LoRaWAN Network Server](https://docs.helium.com/iot/run-an-lns).
    2. [LoRaWAN Roaming on Helium](https://docs.helium.com/iot/lorawan-roaming).

Before continuing further you should already have a fully operational Chirpstack LNS operating on docker compose.
:::

## Git Clone Chirpstack-HPR

```bash title="docker-compose.yml"
git clone https://github.com/ccall48/chirpstack-hpr.git
cd chirpstack-hpr
```

## Environment Variable Values

| ENV VAR | Value | Description |
| :-- | :-- | :-- |
| HELIUM_NET_ID | 00003C | Only change if using netid assigned by Lora Alliance |
| HELIUM_OUI | 1234 | OUI Assigned to you by Helium Foundation |
| HELIUM_MAX_COPIES | 15 | Default copies purchased if not set per device |
| ROUTE_ID | UUID | [The generated route id by iot-config on setup](https://docs.helium.com/iot/run-an-lns/configure-routing-rules/#generate-route-in-helium-config-service) |
| CHIRPSTACK_APIKEY | JWT Token | Global APIKEY generated via Webui or Terminal |

:::tip Generate Global APIKEY from terminal

`docker exec chirpstack chirpstack --config /etc/chirpstack create-api-key --name globalKey`

:::

## Example Docker Compose for Chirpstack-HPR

```yml title="docker-compose.yml"
services:
  chirpstack-hpr:
    image: ghcr.io/ccall48/chirpstack-hpr:latest
    container_name: chirpstack-hpr
    restart: unless-stopped
    volumes:
      - './app:/app'
      - '/path/to/helium/delegate_key.bin:/app/delegate_key.bin:ro'
    environment:
      - HELIUM_CONFIG_HOST=config.iot.mainnet.helium.io
      - HELIUM_PORT=6080
      - HELIUM_KEYPAIR_BIN=/app/delegate_key.bin
      - HELIUM_NET_ID=00003C
      - HELIUM_OUI=<OUI>
      - HELIUM_MAX_COPIES=15
      - ROUTE_ID=<ROUTE_ID>
      # ChirpStack (Required)
      - CHIRPSTACK_SERVER=chirpstack:8080
      - CHIRPSTACK_APIKEY="Generate & paste Global APIKEY Here"
      - REDIS_HOST=chirpstack-redis
      # Database (Required)
      - POSTGRES_USER=chirpstack
      - POSTGRES_PASS=chirpstack
      - POSTGRES_HOST=chirpstack-postgres
      - POSTGRES_PORT=5432
      - POSTGRES_SSL_MODE="false"
      - POSTGRES_DB=chirpstack
      # Usage Event Publisher (Optional)
      -  PUBLISH_USAGE_EVENTS=False
    command: bash -c 'cd /app && python app.py'

networks:
  default:
    name: iot-net
    external: true
```

<!--
## Environment Variables Required
| ENV Variable Name | Values | Description |
| :--- | :--- | :--- |
| HELIUM_HOST | default: config.iot.mainnet.helium.io | Helium Iot Config URI |
| HELIUM_PORT | default: 6080 | Helium Iot Config Port |
| HELIUM_KEYPAIR_BIN | /path/to/your/delegate.bin | Local path to your delegate key file |
| HELIUM_NET_ID | 00003C | If not helium replace with your lora alliance issued netid |
| HELIUM_OUI | Helium OUI | OUI issued to you by Helium Foundation |
| HELIUM_MAX_COPIES | 15 | Default packet copies to purchase if max copies not set |
| ROUTE_ID | UUID | UUID Value generated when you registered the route during inital setup |
| CHIRPSTACK_SERVER | CHIRPSTACK HOST:PORT | Chirpstack container name and port |
| CHIRPSTACK_APIKEY | CHIRPSTACK ADMIN APIKEY | Generate value from terminal or webui |
| REDIS_HOST | REDIS HOST | Chirpstack redis container name |
| POSTGRES_USER | DB USERNAME (default: chirpstack) | Chirpstack postgres container username |
| POSTGRES_PASS | DB PASSWORD (default: chirpstack) | Chirpstack postgres container password |
| POSTGRES_HOST | DB HOSTNAME (default: chirpstack-postgres) | Chirpstack postgres container host name |
| POSTGRES_PORT | DB PORT (default: 5432) | Chirpstack postgres container port number |
| POSTGRES_SSL_MODE | false, require | Chirpstack require" # "false" |
| POSTGRES_DB | DB NAME (default: chirpstack) | Chirpstack postgres database name |

## Environment Variables Optional
| Variable Name | Values | Description |
| :--- | :--- | :--- |
PUBLISH_USAGE_EVENTS | True, False | Publish events to an external service or provider |
PUBLISH_USAGE_EVENTS_PROVIDER | AWS_SQS, POSTGRES, HTTP |  |
PUBLISH_USAGE_EVENTS_SQS_URL | SQS URL | Assigned AWS SQS URL |
PUBLISH_USAGE_EVENTS_SQS_REGION | AWS Region | AWS region your sqs is running on |
AWS_ACCESS_KEY_ID | AWS Access Key | Assigned AWS Access key... |
AWS_SECRET_ACCESS_KEY | AWS Secret Key | Assigned AWS Secret key... |
PG_EVENTS_USER | Postgres Username | Postgres Events Username |
PG_EVENTS_PASS | Postgres Password | Postgres Events password |
PG_EVENTS_PORT | Postgres Port | Postgres Events Port |
PG_EVENTS_HOST | Postgres Host | Postgres Events Host |
PG_EVENTS_DB | Postgres Database | Postgres Events Database |
HTTP_PUBLISHER_ENDPOINT | https://example.com | Your publisher Endpoint |
-->
