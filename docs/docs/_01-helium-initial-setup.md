---
sidebar_position: 1
sidebar_label: Helium Initial Setup
slug: /helium-initial-setup
id: Helium IOT Network
tags:
    - devaddr
    - foundation
    - helium
    - oui
    - route-id
---

## Helium IOT Network - Initial Setup

:::warning
This documentation takes into consideration that:
1. You have already purchased an Helium IOT Network OUI and a DevAddr block/s from the Helium Foundation.
    - Or you have purchased an Helium IOT Network OUI using an existing netid from the Lora Alliance.
2. That your Helium IOT Network OUI is properly funded with data credits (> 3.5m in DC).

Before continuing further with initial Chirpstack-HPR setup, you should already have a fully operational Chirpstack LNS operating on docker compose running on your destination machine, vps or RPi.

    - [Run a LoRaWAN Network Server](https://docs.helium.com/iot/run-an-lns)
    - [LoRaWAN Roaming on Helium](https://docs.helium.com/iot/lorawan-roaming)
:::


## 1. Install Helium Config Service Cli

There are two options for this step.
1. Download a suitable pre-compiled binary: [Latest Release Here](https://github.com/helium/helium-config-service-cli/releases).
2. Compile locally from source: [Steps to compile from source](https://docs.helium.com/iot/run-an-lns/buy-an-oui#install-cli).


## 2. 
## steps to walk through
1. add env vars.
2. have a copy of your delegate keypair file on machine and know its filepath.
3. create route.
4. add route-id to env vars.
5. add devaddr/s.
6. add gwmp regions & ports.
