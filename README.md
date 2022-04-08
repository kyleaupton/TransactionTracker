# TransactionTracker

A discord bot to track Ethereum transactions

# Setting up TransactionTracker

## Engine requirements

Node version `^12.20.0 || ^14.13.1 || >=16.0.0` required. Top-level async/await and pure ESM packages are used.

## Env vars

A file named `.env` needs to be at the root of the repository with the following entries:

```
TOKEN=tokenhere
CLIENTID=tokenhere
GUILDID=tokenhere
```

## Starting

Use the following command to start the process:

```bash
npm run serve
# or
yarn serve
```

Use the following command to start the process with automatic hot-reload on file changes:

```bash
npm run dev
```

## Deploying commands

Define commands in `scripts/deployCommands.js`, then when you're ready to push them to discord run:

```
npm run deployCommands
```

Note: you only need to deploy commands when you need to change them, i.e. not on every serve.

# Using TransactionTracker

Interact with this bot via slash commands.

## Commands

| Command   | Description                               |
| --------- | ----------------------------------------- |
| `/list`   | Lists all wallets currently being tracked |
| `/add`    | Add a wallet to be tracked                |
| `/remove` | Remove a tracked wallet                   |
