---
id: docker-compose
title: ChirpStack Helium on Docker Compose
pagination_label: ChirpStack Helium on Docker Compose
sidebar_label: Chirpstack Helium
description: ChirpStack Helium
image: https://docs.helium.com/img/link-image.png
slug: /chirpstack-helium
tags:
    - chirpstack-docker
    - chirpstack.toml
    - docker compose
    - docker-compose.yml
    - helium-config-service-cli
---

:::danger

**Helium Config Service Cli**
`helium-config-service-cli` is required for some of these steps.
1. Download latest suitable pre-compiled binary:
   [Latest Release Here](https://github.com/helium/helium-config-service-cli/releases).
2. Compile from source yourself locally:
   [Steps to compile from source](https://docs.helium.com/iot/run-an-lns/buy-an-oui#install-cli).

::::

## Infrastructure Requirements

The infrastructure requirements noted below are sufficient for getting a ChirpStack instance up and
running for experimentation purposes, but are not suggested for use in a mission critical, production
setting.

- 4 vCPU
- 8GB RAM
- 100GB SSD hard drive
- CPU with x86 architecture
- Ubuntu 22.04 or 24.04

## Server Configuration

While there are several methods for installing ChirpStack, this guide will demonstrate a
configuration using Docker and the
[chirpstack-docker](https://github.com/chirpstack/chirpstack-docker) repository.

Accordingly, on the server intended to run the ChirpStack instance,
[install Docker](https://docs.docker.com/engine/install/ubuntu/#install-using-the-repository) using
the `apt` repository on Ubuntu.

```sh title="Install Docker using the apt repository"
# Add Docker's official GPG key:
sudo apt-get update
sudo apt-get install ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc

# Add the repository to Apt sources:
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update

# Install the latest version:
sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Verify that the Docker Engine installation is successful by running the hello-world image:
sudo docker run hello-world
```

Next, clone the `chirpstack-docker` repository.

```sh title="Clone the chirpstack-docker repository."
git clone https://github.com/chirpstack/chirpstack-docker.git
```

## ChirpStack Port Accessibility

For the configuration described in this guide, the following ports need to be accessible on the
server running the ChirpStack instance.

1. TCP `8080`

- The ChirpStack web UI and gRPC API are accessible over `http://<public_ip_address>:8080`

2. UDP `1700`

- As described in further detail below, the `chirpstack-gateway-bridge` container for the EU868
  region binds to UDP `1700`. As such, for EU868-based sensor traffic to reach ChirpStack, UDP
  `1700` needs to be open.

3. UDP `1701`

- Similarly, the `chirpstack-gateway-bridge` container for the US915 region binds to UDP `1701`. As
  such, for US915-based sensor traffic to reach ChirpStack, UDP `1701` needs to be open.

Please note that if more `chirpstack-gateway-bridge` containers are added for additional LoRaWAN
regions, the corresponding UDP ports will need to be added in a similar manner to UDP `1700` and
`1701`.

## ChirpStack Configuration

The ChirpStack settings need to be configured so that ChirpStack can operate on the Helium Network.
In particular, the `chirpstack.toml` and `docker-compose.yml` files, respectively located in the
`./chirpstack-docker/configuration/chirpstack/` and `./chirpstack-docker/` directories, need to be
updated. Prior to doing so, however, Helium-specific information for the OUI needs to be gathered to
be applied in the ChirpStack configuration.

### Gather Helium DevAddr Subnet Information for OUI

Use the Helium Config Service CLI to determine the subnet masks for the `DevAddr` associated with
the LNS. In ChirpStack, the subnet masks will be referred to as `dev_addr_prefixes`.

To do so, first retrieve the `DevAddr` constraints for the OUI. The relevant values are each of the
`start_addr` and `end_addr` groups provided in the `devaddr_constraints` array.

```sh
helium-config-service-cli org get --oui <OUI>
```

```json title="Example result from helium-config-service-cli org get --oui command"
{
  "org": {
    "oui": <OUI>,
    "owner": <Owner Public Key>,
    "payer": <Payer Public Key>,
    "delegate_keys": [
      <Deletgate Public Key>
    ],
    "locked": <Locked status>
  },
  "net_id": <Net ID>,
  "devaddr_constraints": [
    {
      "start_addr": <Starting DevAddr>, // First DevAddr constraint
      "end_addr": <Ending DevAddr> // Second DevAddr constraint
    }
  ]
}
```

Next, using the `start_addr` and `end_addr` values, identify the `DevAddr` subnet masks, (e.g.,
labeled as `subnets` in the returned JSON). If there are multiple, non-contiguous
`devaddr_constraints`, this will need to be done for each set of constraints.

```sh
helium-config-service-cli subnet-mask <Starting DevAddr> <Ending DevAddr>
```

```json title="Example result from helium-config-service-cli subnet-mask command"
{
  "range": {
    "start_addr": <Starting DevAddr>,
    "end_addr": <Ending DevAddr>
  },
  "subnets": [
    <Subnet Mask> // Desired value corresponding to the ChirpStack dev_addr_prefixes
  ]
}
```

### Update chirpstack.toml

Access `./chirpstack-docker/configuration/chirpstack/chirpstack.toml`.

Modify the following sections of `chirpstack.toml`. All other sections can be left as is.

- Under `[network]`:
  - Set `net_id` to the Helium Net ID, `00003C`, e.g., `net_id="00003C"`.
  - Add `dev_addr_prefixes` with the value `[<Subnet Mask>]`, e.g.,
    `dev_addr_prefixes=[<Subnet Mask>]`.
    - As an illustrative example, if the `helium-config-service-cli subnet-mask` command indicated a
      subnet mask of `00000000/29`, then add `dev_addr_prefixes=["00000000/29"]`.
    - If the OUI has multiple non-sequential `DevAddr` ranges, separate the corresponding subnet
      masks by comma. For instance, `dev_addr_prefixes=["00000000/29", "00000010/29"]`.
  - Update the `enabled_regions` array to include the desired regions.
    - Multiple regions can be enabled simultaneously.
    - Each added region must match the `id` parameter of the `[[regions]]` configuration in the
      corresponding `./chirpstack-docker/configuration/chirpstack/<region>.toml` file. In other
      words, if the `id` parameter of the `[[regions]]` configuration is `us915_0`, add `us915_0` to
      the `enabled_regions` array.
- Under `[api]`:
  - Update the `secret` value used for generating login and API tokens.
  - Make sure this value is never exposed.
- Create a new, top level `[gateway]` section:
  - Below, add `allow_unknown_gateways=true`

An example of the above-mentioned modified sections of `chirpstack.toml` is provided below. Please
note that the these values are exemplary and need to be filled in with the correct information for
your ChirpStack configuration. Again, all other sections in `chirpstack.toml` can be left as is.

```toml
# Network related configuration.
[network]

  # Network identifier (NetID, 3 bytes) encoded as HEX (e.g. 010203).
  # Helium net_id="00003C"
  net_id="00003C"

  # Helium 8 block dev address prefix 29
  # If you have multiple blocks you can add them as an array
  dev_addr_prefixes=[
    "78000000/29"
  ]

  # Enabled regions.
  #
  # Multiple regions can be enabled simultaneously. Each region must match
  # the 'id' parameter of the region configuration in '[[regions]]'.
  enabled_regions=[
    "eu868",
    "us915_1",
  ]

# API interface configuration.
[api]

  # Secret.
  #
  # This secret is used for generating login and API tokens, make sure this
  # is never exposed. Changing this secret will invalidate all login and API
  # tokens. The following command can be used to generate a random secret:
  #   openssl rand -base64 32
  secret="REPLACE-WITH-YOUR-SECRET-HERE"

# Global gateway configuration.
# Please note that backend configuration can be found in the per-region
# configuration in ./chirpstack-docker/configuration/chirpstack/<region>.toml
[gateway]
  # Allow unknown gateways.
  #
  # If set to true, then uplinks received from gateways not configured in
  # ChirpStack will be allowed.
  allow_unknown_gateways=true
```

### Update docker-compose.yml

Remove the entire service definition for `chirpstack-gateway-bridge-basicstation`. If you do
not intended on using the REST API you can also go ahead and remove the `chirpstack-rest-api`
definition as it will needed.

<!--
Second, visit the [ChirpStack Docker Hub Image Repository](https://hub.docker.com/u/chirpstack) and
identify the most recent version tags for
[chirpstack](https://hub.docker.com/r/chirpstack/chirpstack/tags) and
[chirpstack-gateway-bridge](https://hub.docker.com/r/chirpstack/chirpstack-gateway-bridge/tags). At
the time of writing this manual, the current stable version of `chirpstack` is `4.13.0` and
`chirpstack-gateway-bridge` was `4.0` so these version will be used moving forward.

Third, update `image` definitions for `chirpstack` and `chirpstack-gateway-bridge` with the most
recent version tags found in Docker Hub as noted below:
-->

:::success Recommended Image Definitions

- `image: chirpstack/chirpstack:4`
- `image: chirpstack/chirpstack-gateway-bridge:4`

This will pull the latest stable images.

:::

To support every region beyond the default EU868 defined in the `enabled_regions` noted
above in the `settings.toml` file, add `chirpstack-gateway-bridge` service definitions for each
additional LoRaWAN region. Although this tutorial demonstrates adding support for US915 and EU868
these steps can be adapted for other regions.

To do so, amend the `chirpstack-gateway-bridge` label to be `chirpstack-gateway-bridge-eu868` then
create a new service definition for `chirpstack-gateway-bridge-us915` as provided below:

```yml
chirpstack-gateway-bridge-us915_1:
  image: chirpstack/chirpstack-gateway-bridge:4
  container_name: chirpstack-gateway-bridge-us915_1
  restart: unless-stopped
  ports:
    - 1701:1700/udp # The chirpstack-gateway-bridge-us915 container will bind to host port 1701
  volumes:
    - ./configuration/chirpstack-gateway-bridge:/etc/chirpstack-gateway-bridge
  environment:
    - INTEGRATION__MQTT__EVENT_TOPIC_TEMPLATE=us915_1/gateway/{{ .GatewayID }}/event/{{ .EventType }}
    - INTEGRATION__MQTT__STATE_TOPIC_TEMPLATE=us915_1/gateway/{{ .GatewayID }}/state/{{ .StateType }}
    - INTEGRATION__MQTT__COMMAND_TOPIC_TEMPLATE=us915_1/gateway/{{ .GatewayID }}/command/#
  depends_on:
    - mosquitto
```

See the
[ChirpStack Gateway Bridge documentation](https://www.chirpstack.io/docs/chirpstack-gateway-bridge/configuration.html)
for full description on the configuration possibilities for the `chirpstack-gateway-bridge` service.

### Example of a complete `docker-compose.yml` file

```yaml title="Example Chirpstack-Docker docker-compose.yml file."
services:
  chirpstack:
    image: chirpstack/chirpstack:4
    container_name: chirpstack
    command: -c /etc/chirpstack
    restart: unless-stopped
    volumes:
      - ./configuration/chirpstack:/etc/chirpstack
    depends_on:
      - postgres
      - mosquitto
      - redis
    environment:
      - MQTT_BROKER_HOST=mosquitto
      - REDIS_HOST=redis
      - POSTGRESQL_HOST=postgres
    ports:
      - "8080:8080"

  chirpstack-gateway-bridge-eu868:
    image: chirpstack/chirpstack-gateway-bridge:4
    container_name: chirpstack-gateway-bridge-eu868
    restart: unless-stopped
    ports:
      - "1700:1700/udp"
    volumes:
      - ./configuration/chirpstack-gateway-bridge:/etc/chirpstack-gateway-bridge
    environment:
      - INTEGRATION__MQTT__EVENT_TOPIC_TEMPLATE=eu868/gateway/{{ .GatewayID }}/event/{{ .EventType }}
      - INTEGRATION__MQTT__STATE_TOPIC_TEMPLATE=eu868/gateway/{{ .GatewayID }}/state/{{ .StateType }}
      - INTEGRATION__MQTT__COMMAND_TOPIC_TEMPLATE=eu868/gateway/{{ .GatewayID }}/command/#
    depends_on:
      - mosquitto

  chirpstack-gateway-bridge-us915_1:
    image: chirpstack/chirpstack-gateway-bridge:4
    container_name: chirpstack-gateway-bridge-us915_1
    restart: unless-stopped
    ports:
      - "1701:1700/udp"
    volumes:
      - ./configuration/chirpstack-gateway-bridge:/etc/chirpstack-gateway-bridge
    environment:
      - INTEGRATION__MQTT__EVENT_TOPIC_TEMPLATE=us915_1/gateway/{{ .GatewayID }}/event/{{ .EventType }}
      - INTEGRATION__MQTT__STATE_TOPIC_TEMPLATE=us915_1/gateway/{{ .GatewayID }}/state/{{ .StateType }}
      - INTEGRATION__MQTT__COMMAND_TOPIC_TEMPLATE=us915_1/gateway/{{ .GatewayID }}/command/#
    depends_on:
      - mosquitto

  chirpstack-rest-api:
    image: chirpstack/chirpstack-rest-api:4
    container_name: chirpstack-rest-api
    restart: unless-stopped
    command: --server chirpstack:8080 --bind 0.0.0.0:8090 --insecure
    ports:
      - "8090:8090"
    depends_on:
      - chirpstack

  postgres:
    image: postgres:14-alpine
    container_name: chirpstack-postgres
    restart: unless-stopped
    volumes:
      - ./configuration/postgresql/initdb:/docker-entrypoint-initdb.d
      - postgresqldata:/var/lib/postgresql/data
    environment:
      - POSTGRES_USER=chirpstack
      - POSTGRES_PASSWORD=chirpstack
      - POSTGRES_DB=chirpstack

  redis:
    image: redis:7-alpine
    container_name: chirpstack-redis
    restart: unless-stopped
    command: redis-server --save 300 1 --save 60 100 --appendonly no
    volumes:
      - redisdata:/data

  mosquitto:
    image: eclipse-mosquitto:2
    container_name: chirpstack-mosquitto
    restart: unless-stopped
    ports:
      - "1883:1883"
    volumes:
      - ./configuration/mosquitto/config/:/mosquitto/config/

volumes:
  postgresqldata:
  redisdata:
```

## Run ChirpStack

From the root of the `chirpstack-docker` directory, run `docker compose up --detach` to start the
containers defining the ChirpStack instance in the background. Container logs can be accessed by
running `docker compose logs --follow` and the ChirpStack instance can be taken down by running
`docker compose down`

The ChirpStack web console should now be accessible at `http://<public_ip_address>:8080`. The
default initial login credentials are:

:::info Default ChirpStack First Logon

**Username:** admin<br />
**Password:** admin

:::

## Next Steps

Now that the LNS is operational, proceed to establish routing rules. This ensures that the Helium
Network accurately directs device packets to the designated LNS. Learn how to implement this in the
[Configure Routing Rules](configure-routing-rules) guide.
