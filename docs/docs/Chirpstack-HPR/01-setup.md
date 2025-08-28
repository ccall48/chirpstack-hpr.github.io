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
```

## Environment Variable Configuration

| ENV VAR | Value | Description |
| :-- | :-- | :-- |
| HELIUM_NET_ID | 00003C | Only change if using netid assigned by Lora Alliance |
| HELIUM_OUI | 0000 | OUI Assigned to you by Helium Foundation |
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
    name: helium-iot-net
    external: true
```
