---
sidebar_position: 2
sidebar_label: Chirpstack Initial Setup
slug: /chirpstack-initial-setup
id: Chirpstack Docker Setup
tags:
    - chirpstack
    - chirpstack.toml
    - docker
    - docker-compose.yml
---

### Chirpstack-Docker - Initial Setup

:::warning
This documentation takes into consideration that you already have an operating docker compose instance installed and operating on the intented target machine.
:::

Official Helium Docs can be found here: [Configure Chirpstack - Docker Compose](https://docs.helium.com/iot/run-an-lns/docker-compose).

```bash title="Git clone chirpstack-docker repository"
git clone https://github.com/chirpstack/chirpstack-docker.git
cd chirpstack-docker
```

```yml title="docker-compose.yml"

```

```toml title="configuration/chirpstack/chirpstack.toml"
# Logging.
[logging]

  # Log level.
  #
  # Options are: trace, debug, info, warn error.
  level="info"


# PostgreSQL configuration.
[postgresql]

  # PostgreSQL DSN.
  #
  # Format example: postgres://<USERNAME>:<PASSWORD>@<HOSTNAME>/<DATABASE>?sslmode=<SSLMODE>.
  #
  # SSL mode options:
  #  * disable - Do not use TLS
  #  * prefer - Attempt to connect with TLS but allow sessions without
  #  * require - Require the use of TLS
  dsn="postgres://chirpstack:chirpstack@$POSTGRESQL_HOST/chirpstack?sslmode=disable"

  # Max open connections.
  #
  # This sets the max. number of open connections that are allowed in the
  # PostgreSQL connection pool.
  max_open_connections=10

  # Min idle connections.
  #
  # This sets the min. number of idle connections in the PostgreSQL connection
  # pool (0 = equal to max_open_connections).
  min_idle_connections=0


# Redis configuration.
[redis]

  # Server address or addresses.
  #
  # Set multiple addresses when connecting to a cluster.
  servers=[
    "redis://$REDIS_HOST/",
  ]

  # TLS enabled.
  tls_enabled=false

  # Redis Cluster.
  #
  # Set this to true when the provided URLs are pointing to a Redis Cluster
  # instance.
  cluster=false


# Network related configuration.
[network]

  # Network identifier (NetID, 3 bytes) encoded as HEX (e.g. 010203).
  # Helium DevAddr use 00003C for type 60 address.
  net_id="00003C"

  # Helium 8 block DevAddr address prefix 29, add or adjust to match the prefix/s supplied to you.
  dev_addr_prefixes=[
    "78000000/29",
  ]

  # Enabled regions.
  #
  # Multiple regions can be enabled simultaneously. Each region must match
  # the 'name' parameter of the region configuration in '[[regions]]'.
  enabled_regions=[
    "au915_1",
    "eu868",
    "us915_1",
  ]


# API interface configuration.
[api]

  # interface:port to bind the API interface to.
  bind="0.0.0.0:8080"

  # Secret.
  #
  # This secret is used for generating login and API tokens, make sure this
  # is never exposed. Changing this secret will invalidate all login and API
  # tokens. The following command can be used to generate a random secret:
  #   openssl rand -base64 32
  secret="REPLACE-WITH-YOUR-SECRET-HERE"


# Global gateway configuration.
# Please note that backend configuration can be found in the per-region
# configuration.
[gateway]

  # Allow unknown gateways.
  # If set to true, then uplinks received from gateways not configured in
  # ChirpStack will be allowed. *** Required for Helium Roaming ***.
  allow_unknown_gateways=true
```