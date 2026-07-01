# S1 — Mozaik multi-participant tree.js example

A standalone example that demonstrates `@mozaik-ai/core` with multiple
participants arranged in a simple tree topology.

## Files

| File          | Purpose                             |
|---------------|-------------------------------------|
| `tree.js`     | The example entry point             |
| `package.json` | Dependency manifest (node ESM)     |

## Prerequisites

- Node.js >= 18
- An OpenAI API key (the default provider used by the example)

## Setup

```bash
cd S1
npm install
```

## Run

```bash
export OPENAI_API_KEY=sk-…   # or set in .env
node tree.js
```

## What it does

1. Creates an `AgenticEnvironment` named `"tree-demo"`.
2. Creates three `BaseParticipant` instances: `root`, `leftLeaf`, `rightLeaf`.
3. All join the same environment.
4. `root` sends a message → both leaves receive it via `onMessage` and log it.
5. `root` collects replies and logs them once both have responded.
