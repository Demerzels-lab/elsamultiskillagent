---
name: raglite
version: 1.0.0
description: "Local-first RAG cache: distill docs into structured Markdown, then index/query with Chroma + hybrid search (vector + keyword)."
metadata:
  {
    "openclaw": {
      "emoji": "🔎",
      "requires": { "bins": ["python3", "pip"] }
    }
  }
---

# RAGLite — a local RAG cache (not a memory replacement)

RAGLite is a **local-first RAG cache**.

It does **not** replace model memory or chat context. It gives your agent a durable place to store and retrieve information the model wasn’t trained on — especially useful for **local/private knowledge** (school work, personal notes, medical records, internal runbooks).

## Why it’s better than paid RAG / knowledge bases (for many use cases)

- **Local-first privacy:** keep sensitive data on your machine/network.
- **Open-source building blocks:** **Chroma** 🧠 + **ripgrep** ⚡ — no managed vector DB required.
- **Compression-before-embeddings:** distill first → less fluff/duplication → cheaper prompts + more reliable retrieval.
- **Auditable artifacts:** distilled Markdown is human-readable and version-controllable.

## Default engine

This skill defaults to **OpenClaw** 🦞 for condensation unless you pass `--engine` explicitly.

## Install

```bash
./scripts/install.sh
```

## Usage

```bash
./scripts/raglite.sh run /path/to/docs \
  --out ./raglite_out \
  --collection my-docs \
  --chroma-url http://127.0.0.1:8100 \
  --skip-existing \
  --skip-indexed \
  --nodes
```

## Pitch

RAGLite is a **local RAG cache** for repeated lookups.

When you (or your agent) keep re-searching for the same non-training data — local notes, school work, medical records, internal docs — RAGLite gives you a private, auditable library:

1) **Distill** to structured Markdown (compression-before-embeddings)
2) **Index** locally into Chroma
3) **Query** with hybrid retrieval (vector + keyword)

It doesn’t replace memory/context — it’s the place to store what you need again.
