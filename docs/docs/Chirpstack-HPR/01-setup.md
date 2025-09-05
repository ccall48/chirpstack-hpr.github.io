---
id: Chirpstack-HPR Setup
title: Initial Setup
sidebar_position: 1
sidebar_label: Initial Setup
slug: /chirpstack-hpr/initial-setup
tags:
    - HPR setup
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
cp .env.sample .env
```

## Environment Variable Configuration

| ENV VAR | Value | Description |
| :-- | :-- | :-- |
| HELIUM_CONFIG_HOST | config.iot.mainnet.helium.io | Default value |
| HELIUM_PORT | 6080 | Default value |
| HELIUM_KEYPAIR_PATH | /path/to/your/delegate.bin | Path on your machine to delegate.bin file |
| HELIUM_NET_ID | 00003C | Only change if using netid assigned by Lora Alliance |
| HELIUM_OUI | 0000 | OUI Assigned to you by Helium Foundation |
| HELIUM_MAX_COPIES | 15 | Default copies purchased if not set per device |
| ROUTE_ID | UUID | [The generated route id by iot-config on setup](https://docs.helium.com/iot/run-an-lns/configure-routing-rules/#generate-route-in-helium-config-service) |
| CHIRPSTACK_SERVER | chirpstack-docker-1:8080 | Docker Chirpstack Hostname and Port |
| CHIRPSTACK_APIKEY | JWT Token | Global APIKEY generated via Webui or Terminal |
| REDIS_HOST | chirpstack-docker-redis-1 | Docker Chirpstack Redis Hostname |
| POSTGRES_USER | chirpstack | Chirpstack Postgres Username - set on setup |
| POSTGRES_PASS | chirpstack | Chirpstack Postgres Password - set on setup |
| POSTGRES_HOST | chirpstack-docker-postgres-1 | Docker Chirpstack Postgres Hostname |
| POSTGRES_PORT | 5432 | Default Postgres port |
| POSTGRES_SSL_MODE | "false" | Options: "require" or "false" |
| POSTGRES_DB | chirpstack | Chirpstack Postgres database name |
| PUBLISH_USAGE_EVENTS | False | Default false |

## Find container names

To find the name of all docker containers on your machine you run the following in terminal
`docker ps -a --format "{{.Names}}"` this should give you a list of container names you will
need to populate the hostname bellow in chirpstack-HPR environment.

## Compose Environment Variables

You can create your own docker compose file, or set the required environment variables in the
`.env` file which will populate the provided compose file values when you bring the container up.

There is a template `.env` file in the git repository you cloned. To use and add values to this
template if you did not follow the above steps `cd` if you are not already into the `chirpstack-hpr`
directory and `cp .env.sample .env`. This will add a skeleton `.env` file for you to populate with
values required using the editor of choice.

:::tip Generate Global APIKEY from terminal
`docker exec chirpstack-docker-chirpstack-1 chirpstack --config /etc/chirpstack create-api-key --name globalKey`
:::

```env title="Example .env file"
# Environment variables expected to run ChirpStack HPR. Customise as required.
# NB: the server and hosts are the docker hostnames!

# Helium (Required)
HELIUM_CONFIG_HOST=config.iot.mainnet.helium.io
HELIUM_PORT=6080
HELIUM_KEYPAIR_PATH=</path/to/your/delegate.bin>. # eg. /home/$USER/delegate.key
HELIUM_NET_ID=00003C  # 00003C Default Helium
HELIUM_OUI=<YOUR OUI>
HELIUM_MAX_COPIES=15
ROUTE_ID=<HELIUM ROUTE ID>

# ChirpStack (Required)
CHIRPSTACK_SERVER=<CHIRPSTACK HOST:PORT>
CHIRPSTACK_APIKEY=<CHIRPSTACK ADMIN APIKEY FROM WEBUI>
REDIS_HOST=<REDIS HOST>

# Database (Required)
POSTGRES_USER=<DB USERNAME>
POSTGRES_PASS=<DB PASSWORD>
POSTGRES_HOST=<DB HOSTNAME>
POSTGRES_PORT=5432
POSTGRES_SSL_MODE="false"  # "require" or "false"
POSTGRES_DB=<DB NAME>

# Usage Event Publisher (Optional)
PUBLISH_USAGE_EVENTS=False
PUBLISH_USAGE_EVENTS_PROVIDER=<Provider, e.g. AWS_SQS>

# Usage Event SQS Publisher (Optional)
PUBLISH_USAGE_EVENTS_SQS_URL=<SQS URL>
PUBLISH_USAGE_EVENTS_SQS_REGION=<AWS Region>
AWS_ACCESS_KEY_ID=<AWS Access Key>
AWS_SECRET_ACCESS_KEY=<AWS Secret Key>

# Usage Event Postgres Publisher (Optional)
PG_EVENTS_USER=<postgres username>
PG_EVENTS_PASS=<postgres password>
PG_EVENTS_PORT=<postgres port>
PG_EVENTS_HOST=<postgres host>
PG_EVENTS_DB=<postgres database>

# Usage Event HTTP Publisher (Optional)
HTTP_PUBLISHER_ENDPOINT=<https://example.com>
```

## Docker Compose File using .env

```yml title="Minimal docker-compose.yml, using .env file values"
services:
  chirpstack-hpr:
    image: ghcr.io/ccall48/chirpstack-hpr:latest
    container_name: chirpstack-hpr
    restart: unless-stopped
    volumes:
      - './app:/app'
      - '${HELIUM_KEYPAIR_PATH}:/app/delegate_key.bin:ro'
    environment:
      - HELIUM_CONFIG_HOST=${HELIUM_CONFIG_HOST}
      - HELIUM_KEYPAIR_BIN=/app/delegate_key.bin
      - HELIUM_NET_ID=${HELIUM_NET_ID}
      - HELIUM_OUI=${HELIUM_OUI}
      - HELIUM_MAX_COPIES=${HELIUM_MAX_COPIES}
      - ROUTE_ID=${ROUTE_ID}
      # ChirpStack (Required)
      - CHIRPSTACK_SERVER=${CHIRPSTACK_SERVER}
      - CHIRPSTACK_APIKEY=${CHIRPSTACK_APIKEY}
      - REDIS_HOST=${REDIS_HOST}
      # Database (Required)
      - POSTGRES_USER=${POSTGRES_USER}
      - POSTGRES_PASS=${POSTGRES_PASS}
      - POSTGRES_HOST=${POSTGRES_HOST}
      - POSTGRES_PORT=${POSTGRES_PORT}
      - POSTGRES_SSL_MODE=${POSTGRES_SSL_MODE}
      - POSTGRES_DB=${POSTGRES_DB}
      # Usage Event Publisher (Optional)
      - PUBLISH_USAGE_EVENTS=${PUBLISH_USAGE_EVENTS}
      - PUBLISH_USAGE_EVENTS_PROVIDER=${PUBLISH_USAGE_EVENTS_PROVIDER}
      # Usage Event SQS Publisher (Optional)
      - PUBLISH_USAGE_EVENTS_SQS_URL=${PUBLISH_USAGE_EVENTS_SQS_URL}
    command: bash -c 'cd /app && python app.py'

networks:
  default:
    name: helium-iot-net
    external: true
```

## Docker Compose File without using .env

```yml title="Minimal docker-compose.yml file without .env file"
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
    name: helium-iot-net
    external: true
```
