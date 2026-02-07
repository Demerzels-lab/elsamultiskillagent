# CIRF - Crypto Interactive Research Framework

Interactive crypto deep-research framework with agent-agent and human-agent collaboration for superior research outcomes.

**Author:** [Kudō](https://x.com/kudodefi)

---

> **For Humans:** This README is for you. Follow the instructions below to set up and use the framework.
>
> **For AI Agents:** Read [`SKILL.md`](./SKILL.md) for complete framework instructions and orchestration protocols.

---

## Requirements

This framework is designed to be used with AI CLI applications:
- [OpenClaw](https://openclaw.ai/) (Open-source AI assistant)
- [Claude Code](https://claude.com/product/claude-code) (Anthropic)
- [Codex CLI](https://openai.com/codex/) (OpenAI)
- Or any AI assistant with file read/write capabilities

## Installation

```bash
git clone https://github.com/kudodefi/cirf.git
cd cirf
```

## Quick Start

**Step 1:** Open your AI CLI in the project directory
```bash
# Claude Code
claude

# OpenClaw
openclaw

# Or your preferred AI CLI
```

**Step 2:** Activate an agent

You can activate any agent directly by tagging or calling their name:

```
# Option A: Full orchestration
You: Read @SKILL.md and help me research
AI: [Reads SKILL.md, creates plan, spawns agents, executes]

# Option B: Activate specific agent directly
You: @research-analyst wakeup
You: @technology-analyst wakeup
You: @content-creator wakeup
You: @qa-specialist wakeup

# Option C: Tag agent file
You: @framework/agents/research-analyst.yaml wakeup
```

**Step 3:** Describe your research goal
```
You: I want to evaluate Aave for investment
AI: [Creates execution plan, assigns workflows, tracks progress]
```

## Framework Structure

```
framework/
├── agents/                 # Agent definitions
│   ├── research-analyst    # Full-stack crypto research (recommended)
│   ├── technology-analyst  # Technical architecture & security
│   ├── content-creator     # Research-to-content
│   └── qa-specialist       # Quality assurance
├── workflows/              # 17 research workflows
├── components/             # Shared execution protocols
├── guides/                 # Research methodologies
├── core-config.yaml        # Framework configuration
└── _workspace.yaml         # Workspace template

workspaces/                 # Project workspaces (user-created)
└── {project}/
    ├── workspace.yaml      # Project configuration
    ├── documents/          # Source materials
    └── outputs/            # Research deliverables
```

## Agents

| Agent | Role | Primary Workflows |
|-------|------|-------------------|
| **Research Analyst** | Market intelligence, project fundamentals, investment synthesis | All 14 research workflows |
| **Technology Analyst** | Architecture assessment, security analysis | technology-analysis |
| **Content Creator** | Research-to-content transformation | create-content |
| **QA Specialist** | Quality validation, critical review | qa-review |

## Workflows

**Setup & Planning**
- `framework-init` - First-time configuration
- `create-research-brief` - Define research scope

**Market Intelligence**
- `sector-overview` - Sector structure & dynamics
- `sector-landscape` - Ecosystem mapping
- `competitive-analysis` - Head-to-head comparison
- `trend-analysis` - Trend identification

**Project Fundamentals**
- `project-snapshot` - Quick project overview
- `product-analysis` - Product deep-dive
- `team-and-investor-analysis` - Team & investor evaluation
- `tokenomics-analysis` - Token economics
- `traction-metrics` - Growth & retention
- `social-sentiment` - Community analysis

**Technical & Quality**
- `technology-analysis` - Architecture & security
- `qa-review` - Quality validation

**Content & Flexible**
- `create-content` - Multi-format content
- `open-research` - Custom research
- `brainstorm` - Ideation sessions

## Usage

**Option 1: Direct workflow execution**
```
User: Run sector-overview for DeFi lending
Agent: [Executes workflow with structured output]
```

**Option 2: Research goal description**
```
User: I want to evaluate Aave for investment
Agent: [Suggests appropriate workflows and execution plan]
```

## Configuration

User preferences are stored in `framework/core-config.yaml`:
- Name, date format, currency
- Communication and output language (en/vi/zh)

## Creating a Workspace

```
1. Copy framework/_workspace.yaml to workspaces/{project-id}/workspace.yaml
2. Create documents/ and outputs/ subdirectories
3. Update workspace metadata
```

## License

MIT
