#!/usr/bin/env bash

# Load .env
export $(cat ./.env | grep -v ^# | xargs) >/dev/null

# Check
./ngrok http http://localhost:${PORT}