# CARD SHARK

A fast, risk/reward card game built with **TypeScript**, **LESS**, and **Babylon.js**.

Pick a card each turn, build a run, and decide when to **bank** your points before you bust. Push your luck too far and you lose the run (or a life). Play smart and finish with a **Bronze, Silver, or Gold trophy**.

## Features

- 🎴 **Pick-left / pick-right** card gameplay
- 💥 **Bomb card replaced with Shark card** (custom art)
- 💎 **7 unique loot cards** mapped to number logic (1–7)
- 🃏 **Joker cards** with special effects:
  - Shield
  - Scrambler
  - Jammer
- 🏆 **3D animated trophy end screen** (Babylon.js)
- 🔊 Card click SFX and polished UI feedback
- ❓ In-game rules/help modal

---

## How to Play

### The basic loop
Each turn, there are two face-down cards:
- one is **Treasure**
- one is **Shark** (bomb)

You choose **Left** or **Right**.

### If you hit Treasure
You gain loot for your current run:
- a **number card** (internally 1–7, shown as named loot like Ruby, Diamond, Ring, etc.)
- or a **joker card** (Shield, Scrambler, Jammer)

### If you hit Shark
- If you have a **Shield**, it saves you (and is consumed)
- Otherwise, you lose a **life** and your run resets

### Banking
At any point (when allowed), you can press **Bank** to convert your current run into score.

This is the main strategy:
- **keep pushing** for more value
- or **bank now** to lock points before a bust

### Duplicate risk (important)
Your run tracks unique number loot (1–7).
- If you draw a **duplicate** number, your run can **bust**
- **Shield** or **Scrambler** may save you depending on the situation

### Game Over
The game ends when you run out of:
- **Lives**, or
- **Turns**

At the end, your score determines your **Trophy Tier**:
- NONE
- BRONZE
- SILVER
- GOLD

---

## Tech Stack

- **TypeScript**
- **Babylon.js** (trophy rendering / animation)
- **LESS**
- HTML / DOM-based UI

---

## Project Highlights

- Modular trophy helpers for:
  - materials
  - particles
  - transforms
- Custom card art mapping for:
  - 7 numbered loot cards
  - jokers
  - shark bomb replacement

---

## Running Locally

Use your existing project build/dev workflow (the repo may be wired to a specific setup).

```powershell
npm install
npm run buildlocaldev
```

---

## Screenshots

Add screenshots/gifs for the GitHub page here (recommended):

* gameplay screen
* card reveal state
* end screen with trophy
* rules modal
<img width="2560" height="1226" alt="image" src="https://github.com/user-attachments/assets/770dd594-a624-4282-8d3a-7f786415aaa6" />

<img width="2560" height="1226" alt="image" src="https://github.com/user-attachments/assets/02aaaa63-92d2-40d9-9def-8030a5b505ab" />

<img width="2558" height="1223" alt="image" src="https://github.com/user-attachments/assets/c9b46a38-4348-4c66-958e-8104279bafdd" />

<img width="1694" height="1011" alt="image" src="https://github.com/user-attachments/assets/2b2ee708-69ba-41e6-9558-5907c7d27f9e" />

<img width="1384" height="1007" alt="image" src="https://github.com/user-attachments/assets/7a73ae09-b326-478c-b464-a9744ea7efdd" />

