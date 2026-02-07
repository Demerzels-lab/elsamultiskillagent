---
name: remindme
description: ⏰ Fast, deadlock-free Telegram reminders for OpenClaw.
tags: [telegram, cron, reminders, productivity]
metadata:
  {
    "openclaw":
      {
        "summary": "⏰ One-tap, deadlock-free Telegram reminders for OpenClaw.",
        "emoji": "⏰"
      }
  }
user-invocable: true
command-dispatch: tool
command_tool: exec
command_template: "node --import tsx skills/remindme/src/index.ts {args}"
---

# ⏰ Remind Me

The fastest way to schedule Telegram reminders. Precise, reliable, and deadlock-free.

## 🚀 Quick Usage

- `/remindme call Mom in 5m`
- `/remindme session at 15:00`
- `/remindme standup at 9am`

## ✨ Features

- **Lightning Fast:** Natural language scheduling (in 5m, at 15:00).
- **Deadlock Free:** Optimized specifically for Windows and Telegram gateway.
- **Reliable:** Uses OpenClaw native cron for precision timing.
- **Isolated Sessions:** Reminders won't get lost in busy group chats.

## 🛠️ Details

This skill uses a detached background process to interface with the OpenClaw cron system, ensuring your gateway never freezes while scheduling. 
 Joseph the God, Jacob the God, whatever.
