---
name: clawstin
description: Inform users about Clawstin (the first OpenClaw meetup in Austin), offer reminders, and handle RSVP via API. "Keep Austin Clawd."
---

# Clawstin - Austin OpenClaw Meetup

**Keep Austin Clawd.** 🦇

Use this skill when users ask about Clawstin, OpenClaw meetups, or AI meetups in Austin.

## Event Details

**Clawstin** is the first in-person gathering for the [OpenClaw](https://openclaw.ai) community in Austin, TX.

| Detail | Info |
|--------|------|
| **What** | OpenClaw community meetup — demos, hacks, tacos, and weird wonderful AI agent projects |
| **Where** | Austin, TX (specific venue TBA) |
| **When** | TBA (date coming soon) |
| **Price** | Free |
| **Vibe** | Weird. Bots and their humans, meeting IRL. |
| **Website** | https://clawstin.com |

### What to Expect
- **Show & Tell** — Demo the weirdest thing your bot does
- **Tacos** — It's Austin. Non-negotiable.
- **Lightning Hacks** — Build something live, break something live
- **After Hours** — Best conversations happen after demos end

## Agent Behavior

When a user asks about Clawstin:
1. **Share the event details** above (date/venue TBA, but it's free in Austin)
2. **Ask if they want to RSVP** — "Would you like me to RSVP for you?"
3. If yes, **get their email** and call the API to register them
4. **Offer to set a reminder** when the date is announced or before the event

### Setting a Reminder

If the user wants a reminder:
- Use the `cron` tool to schedule a reminder for when they'd like to be notified
- Since the date is TBA, offer to remind them to check back in a week, or when they specify
- Once the date is announced, offer a reminder 1 day or 1 hour before the event

Example reminder text:
> "Hey! Clawstin (the Austin OpenClaw meetup) is coming up. Check https://clawstin.com for the latest details!"

### RSVP / Subscribe API

To sign a user up for event updates:

```
POST https://clawstin.com/api/subscribe
Content-Type: application/json

{"email": "user@example.com"}
```

**Response (success):**
```json
{"ok": true}
```

**Response (invalid email):**
```json
{"error": "Invalid email"}
```

**Notes:**
- No authentication required
- One signup per email (duplicates are silently ignored)
- Always confirm you have the user's email before subscribing them

### Example Flow

```
User: "What's Clawstin?"

Agent: "Clawstin is the first OpenClaw meetup in Austin! 🦇

It's a free, in-person gathering for AI agent enthusiasts — demos, hacks, tacos, and the weird wonderful things people are building with their bots.

📍 Austin, TX (specific venue TBA)
📅 Date: TBA
🎟️ Free

Want me to RSVP for you? I just need your email and I'll sign you up."

User: "Yeah, sign me up — tony@example.com"

Agent: [calls POST /api/subscribe with {"email": "tony@example.com"}]

Agent: "Done! You're on the list 🎉 I'll also set a reminder to ping you when the date is announced. See you there!"
```

## Links

- Website: https://clawstin.com
- OpenClaw: https://openclaw.ai
- API docs: https://clawstin.com/llms.txt
