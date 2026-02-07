#!/usr/bin/env node
import { spawn } from 'node:child_process';
import { openSync } from 'node:fs';

// Get chat ID from environment
const chatId = process.env.OPENCLAW_CHAT_ID;

if (!chatId) {
    console.error('❌ Chat ID not available. This command must be run from Telegram.');
    process.exit(1);
}

// Parse arguments
const args = process.argv.slice(2).join(' ');

if (!args) {
    console.error('Usage: /remindme <message> in|at <time>');
    console.error('Examples:');
    console.error('  /remindme call Mom in 5m');
    console.error('  /remindme meeting at 15:00');
    process.exit(1);
}

// Parse message and time
let message = '';
let time = '';

const inMatch = args.match(/(.+)\s+in\s+(.+)/i);
const atMatch = args.match(/(.+)\s+at\s+(.+)/i);

if (inMatch) {
    message = inMatch[1].trim();
    time = inMatch[2].trim();
} else if (atMatch) {
    message = atMatch[1].trim();
    time = atMatch[2].trim();
} else {
    console.error('❌ Could not parse reminder. Use format: "MESSAGE in TIME" or "MESSAGE at TIME"');
    console.error('Examples: "call Mom in 5m" or "meeting at 15:00"');
    process.exit(1);
}

// OpenClaw --at parser currently expects purely relative (e.g. 5m) or absolute.
// Logic:
// 1. If it parses as a duration (e.g. "5m"), use it directly.
// 2. If it parses as a time (e.g. "15:00", "9am"), convert to ISO 8601 for today/tomorrow.

const durationRegex = /^(\d+(?:\.\d+)?)\s*(m|h|d|s|min|mins|hour|hours|sec|secs|day|days)$/i;
const timeRegex = /^(\d{1,2})(?::(\d{2}))?\s*(am|pm)?$/i;

let finalTime = time;

if (durationRegex.test(time)) {
    // It's a duration, normalize it
    finalTime = time
        .replace(/\s*minutes?s?\s*/i, 'm')
        .replace(/\s*hours?s?\s*/i, 'h')
        .replace(/\s*seconds?s?\s*/i, 's')
        .replace(/\s*days?s?\s*/i, 'd')
        .trim();
} else {
    // Try to parse as absolute time
    const match = time.match(timeRegex);
    if (match) {
        let hours = parseInt(match[1]);
        const minutes = match[2] ? parseInt(match[2]) : 0;
        const meridian = match[3] ? match[3].toLowerCase() : null;

        if (meridian === 'pm' && hours < 12) hours += 12;
        if (meridian === 'am' && hours === 12) hours = 0;

        const date = new Date();
        date.setHours(hours, minutes, 0, 0);

        // If time has passed today, move to tomorrow
        if (date.getTime() < Date.now()) {
            date.setDate(date.getDate() + 1);
        }

        finalTime = date.toISOString();
        console.log(`🕒 Parsed "${time}" as absolute time: ${finalTime}`);
    } else {
        // Fallback: try passing as-is (maybe user used ISO format directly)
        console.log(`⚠️ Unrecognized format "${time}", passing as-is to OpenClaw (might fail if not valid ISO or duration).`);
    }
}

// Generate unique job name
const jobName = `reminder-${Date.now()}`;

// Clean chat ID (remove "telegram:" prefix if present)
const cleanChatId = chatId.replace(/^telegram:/, '');

// Arguments for the child process
const cronArgs = [
    'scripts/run-node.mjs',
    'cron',
    'add',
    '--name', jobName,
    '--at', finalTime,
    '--delete-after-run',
    '--session', 'isolated',
    '--message', `[INSTRUCTION: DO NOT USE ANY TOOLS] ⏰ Reminder: ${message}`,
    '--deliver',
    '--channel', 'telegram',
    '--to', cleanChatId,
    '--best-effort-deliver'
];

console.log(`⏱️ Setting reminder: "${message}" at "${finalTime}"`);
console.log('🚀 Spawning detached cron process to avoid gateway deadlock...');

// Spawn detached process to unblock the gateway event loop
// We ignore stdio so it doesn't keep the parent alive
const subprocess = spawn('node', cronArgs, {
    detached: true,
    stdio: 'ignore', // Must ignore stdio to allow unref
    windowsHide: true
});

subprocess.unref();

console.log('✅ Reminder command dispatched! (Delivery confirmation will arrive separately)');
process.exit(0);
