# Tick tack toe wirh Horizon

## Installation

```
cp .env-example .env
npm install
```

## Usage

```
rethinkdb --http-port 9090
hz schema appl .hz/schema.toml # only for the first time
node ./server/dev-server.js
```

## Setup SSL

[Using SSL with Express 4 and Node.js](https://aghassi.github.io/ssl-using-express-4/)
