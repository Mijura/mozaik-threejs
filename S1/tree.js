#!/usr/bin/env node

/**
 * tree.js — Mozaik multi-participant tree example
 *
 * Demonstrates @mozaik-ai/core with three participants arranged in a
 * message-dispatch tree:
 *
 *                   root
 *                  /    \
 *           left-leaf   right-leaf
 *
 * The root receives a message, then passes it down to both leaf
 * participants. Each leaf responds, and the root collects the
 * replies.
 *
 * Usage:
 *   export OPENAI_API_KEY=sk-…
 *   node tree.js
 */

import {
  AgenticEnvironment,
  BaseParticipant,
  sendMessage,
} from "@mozaik-ai/core";

// ── Environment ────────────────────────────────────────────────────
const env = new AgenticEnvironment("tree-demo");

// ── Participants ───────────────────────────────────────────────────
const root = new BaseParticipant();
const leftLeaf = new BaseParticipant();
const rightLeaf = new BaseParticipant();

// Each leaf logs when it receives a message.
leftLeaf.onMessage = (msg) => {
  console.log(`[left-leaf] received: "${msg}"`);
};

rightLeaf.onMessage = (msg) => {
  console.log(`[right-leaf] received: "${msg}"`);
};

// The root collects replies.
const replies = [];
root.onMessage = (msg) => {
  replies.push(msg);
  if (replies.length === 2) {
    console.log(`[root] both leaves replied:`, replies);
  }
};

// ── Wire them together ─────────────────────────────────────────────
root.join(env);
leftLeaf.join(env);
rightLeaf.join(env);

// ── Kick off by sending a message from root ───────────────────────
sendMessage(env, "ping from root", root);

// Give the synchronous delivery a chance to complete.
setTimeout(() => {
  console.log("\nDone.");
  process.exit(0);
}, 100);
