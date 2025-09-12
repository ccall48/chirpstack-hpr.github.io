---
id: intro
title: Chirpstack-HPR Documentation
pagination_label: Project Intro
sidebar_position: 1
sidebar_label: Project Intro
description: Project Intro
image: https://docs.helium.com/img/link-image.png
slug: /intro
tags:
    - intro
    - getting started
    - how to
---

## Project Description

This project aims to be a simple container to leverage the helium packet config cli using python to
interface between Chirpstack v4 and the helium packet router. It's main focus is to replicate
actions taken in Chirpstack by a tenant to add/update/remove device EUI's to the helium packet
router when a device is actioned on by a tenant.

You will need to make sure this container connects to the same docker network or network as your
Chirpstack container is running on so that it can interact with chirpstack when changes are made.

Max Copies per skfs are set to 0 by default and updated on a device activation if not set by the
tenant. In the case where they're not set by the tenant on a device the max copies per device will
match the number provided when creating the route id.

If you wish to set max copies on a per device basis in a situation where you require more or less
copies than the default set route amount you will need to set a value for the max copies in the
device configuration variables.

`device -> configuration -> variables`

Click on add variable, set key name to `max_copies`, set the value as an integer for the number of
packets per device you want to purchase if it is under or above the default route id max packets
setting.

latest test working Chirpstack version v4.11.0

If you find this useful give us a star or clone the repo and contribute.

## Quick Start

- Git clone this repository: `git clone https://gitbub.com/ccall48/chirpstack-hpr`
- Create an external attachable docker network eg. `docker network create helium-iot-net` to attach
  chirpstack-docker and chirpstack-hpr to.
- Edit network section in the docker compose to attach to the same docker network created above in
  chirpstack-docker compose.
- Rename `.env.sample` to `.env` and edit with required settings applicable to your installation.
  You should name the hosts needed by there docker container name and not docker IP address as this
  can change between restarts causing breakage.
- `docker compose up` should pull the current container from Github and start the container check
  for any errors. if you need to change things its usually best to recreate the containers ctrl-c to
  terminate current running container and discard with docker compose down --remove-orphans make
  and save any changes as needed. once you have it right start docker in detached mode with
  `docker compose up -d`

If you found this helpful share a tip.

Solana: `GKunRFVcfMem7oS5Yd3WV1Tm48jZoCFME8fbMMdprWS4`

:::note existing users upgrading.
If you're upgrading from Chirpstack version 4.7 or less first disable this connector until you run
the manual command required to migrate the session keys from redis to postgresql. otherwise if a
sync occurs before you do this your device session keys maybe removed from the helium packet router.
:::

## Project Thanks

[groot](https://github.com/mawdegroot) - For getting python working with helium-crypto.rs and
helium/proto so changes could be made programmatically over the wire. This allowed for getting the
initial rpc working for signing changes
[helium-iot-config-py](https://github.com/mawdegroot/helium-iot-config-py).

jerm - For helping me with reading, writing and signing as well ads delegate key byte related
questions for helium crypto related stuff.

[Helium Foundation](https://www.helium.foundation/) & Helium IOT Working Group - For approving an
grant for the initial development work.
