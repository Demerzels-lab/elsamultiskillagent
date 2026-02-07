---
name: clawvault
version: 1.4.2
description: Structured memory system for OpenClaw agents. Context death resilience (checkpoint/recover), structured storage, Obsidian-compatible markdown, and local semantic search.
author: Versatly
repository: https://github.com/Versatly/clawvault
---

# ClawVault 🐘

An elephant never forgets. Structured memory for OpenClaw agents.

> **Built for [OpenClaw](https://openclaw.ai)** — install via `clawhub install clawvault`

## Install

```bash
npm install -g clawvault
```

## Quick Setup

```bash
# Auto-discover OpenClaw memory folder and configure
clawvault setup
```

## OpenClaw Hook Integration (Recommended)

ClawVault includes an OpenClaw hook for **automatic context death resilience**:

```bash
# Register the hook from clawvault package
openclaw hooks install clawvault
openclaw hooks enable clawvault
```

**What the hook handles automatically:**
- **Gateway startup** → Detects if previous session died, injects alert
- **On /new command** → Creates checkpoint before session reset

**Manual commands still valuable for:**
- `clawvault wake` — Full recap with projects and handoffs
- `clawvault sleep` — Detailed handoff with decisions and blockers
- `clawvault checkpoint` — Explicit save during heavy work

The hook is your safety net. Manual commands give richer context.

## New in v1.4.1

- **OpenClaw hook** — automatic context death resilience
- **clawvault wake** — all-in-one session start (recover + recap)
- **clawvault sleep** — all-in-one session end (handoff + git commit)

## New in v1.4.0

- **qmd required** — semantic search is now core functionality
- **clawvault setup** — auto-discovers OpenClaw's memory folder
- **clawvault status** — vault health, checkpoint age, qmd index
- **clawvault template** — list/create/add with 7 built-in templates
- **clawvault link --backlinks** — see what links to a file
- **clawvault link --orphans** — find broken wiki-links

## Setup

```bash
# Initialize vault (creates folder structure + templates)
clawvault init ~/my-vault

# Or set env var to use existing vault
export CLAWVAULT_PATH=/path/to/memory
```

## Core Commands

### Store memories by type

```bash
# Types: fact, feeling, decision, lesson, commitment, preference, relationship, project
clawvault remember decision "Use Postgres over SQLite" --content "Need concurrent writes for multi-agent setup"
clawvault remember lesson "Context death is survivable" --content "Checkpoint before heavy work"
clawvault remember relationship "Justin Dukes" --content "Client contact at Hale Pet Door"
```

### Quick capture to inbox

```bash
clawvault capture "TODO: Review PR tomorrow"
```

### Search (requires qmd installed)

```bash
# Keyword search (fast)
clawvault search "client contacts"

# Semantic search (slower, more accurate)
clawvault vsearch "what did we decide about the database"
```

## Context Death Resilience

### Checkpoint (save state frequently)

```bash
clawvault checkpoint --working-on "PR review" --focus "type guards" --blocked "waiting for CI"
```

### Recover (check on wake)

```bash
clawvault recover --clear
# Shows: death time, last checkpoint, recent handoff
```

### Handoff (before session end)

```bash
clawvault handoff \
  --working-on "ClawVault improvements" \
  --blocked "npm token" \
  --next "publish to npm, create skill" \
  --feeling "productive"
```

### Recap (bootstrap new session)

```bash
clawvault recap
# Shows: recent handoffs, active projects, pending commitments, lessons
```

### Wake (all-in-one session start)

```bash
clawvault wake
# Combines: recover + recap + summary
# Shows context death status + recent handoffs + what you were working on
```

### Sleep (all-in-one session end)

```bash
clawvault sleep "Finished PR review" \
  --next "merge after CI" \
  --blocked "waiting for approval" \
  --decisions "use strict mode" \
  --feeling "productive"
# Creates handoff, clears death flag, offers git commit
```

## Auto-linking

Wiki-link entity mentions in markdown files:

```bash
# Link all files
clawvault link --all

# Link single file
clawvault link memory/2024-01-15.md
```

## Folder Structure

```
vault/
├── .clawvault/           # Internal state
│   ├── last-checkpoint.json
│   └── dirty-death.flag
├── decisions/            # Key choices with reasoning
├── lessons/              # Insights and patterns
├── people/               # One file per person
├── projects/             # Active work tracking
├── handoffs/             # Session continuity
├── inbox/                # Quick captures
└── templates/            # Document templates
```

## Best Practices

1. **Checkpoint every 10-15 min** during heavy work
2. **Handoff before session end** — future you will thank you
3. **Recover on wake** — check if last session died
4. **Use types** — knowing WHAT you're storing helps WHERE to put it
5. **Wiki-link liberally** — `[[person-name]]` builds your knowledge graph

## Integration with qmd

ClawVault uses [qmd](https://github.com/tobi/qmd) for search:

```bash
# Install qmd
bun install -g github:tobi/qmd

# Add vault as collection
qmd collection add /path/to/vault --name my-memory --mask "**/*.md"

# Update index
qmd update && qmd embed
```

## Environment Variables

- `CLAWVAULT_PATH` — Default vault path (skips auto-discovery)

## Links

- npm: https://www.npmjs.com/package/clawvault
- GitHub: https://github.com/Versatly/clawvault
- Issues: https://github.com/Versatly/clawvault/issues
