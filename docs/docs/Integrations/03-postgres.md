---
id: Postgres Integration
sidebar_position: 3
sidebar_label: Postgres
slug: /integration/postgres
tags:
    - postgres
    - integration
---

:::note
This documentation does not cover how to create or setup an Postgres database. You will need to
ensure a database is operational and ready to accept incoming connections.
:::

## Postgres Integration

```yml title="Environment Variables Required"
    # Usage Event Publisher
    - PUBLISH_USAGE_EVENTS=True
    - PUBLISH_USAGE_EVENTS_PROVIDER=POSTGRES
    # Usage Event Postgres Publisher
    - PG_EVENTS_USER=<postgres username>
    - PG_EVENTS_PASS=<postress password>
    - PG_EVENTS_PORT=<port>
    - PG_EVENTS_HOST=<hostname or ip>
    - PG_EVENTS_DB=<database name>
```

## External Links

[How to Use the Postgres Docker Official Image](https://www.docker.com/blog/how-to-use-the-postgres-docker-official-image/)
