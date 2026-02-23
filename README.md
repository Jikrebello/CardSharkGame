# CARD QUEST (V1)

## Gameplay
<img width="2552" height="1222" alt="image" src="https://github.com/user-attachments/assets/c5660160-a435-4001-883e-fe6c5423d727" />

<img width="2560" height="1222" alt="image" src="https://github.com/user-attachments/assets/7b49df24-b6d9-4b65-9901-da2011a1c5d0" />

### Win reveal + trophy
<img width="1539" height="889" alt="image" src="https://github.com/user-attachments/assets/861c0f38-bf78-4e58-8bd8-666f3098b044" />

### Rules modal
<img width="1213" height="528" alt="image" src="https://github.com/user-attachments/assets/10e96242-3fc8-4ba1-8714-f8c10fcc83e4" />

A small card guessing game built for the technical brief using **TypeScript**, **LESS**, and **Babylon.js**.

Pick one of two cards:
- one hides **Treasure**
- one hides a **Bomb**

Choose correctly to increase your **streak**.  
Choose the bomb and your streak resets.

When you win, the game shows a **3D trophy celebration** using the provided Babylon.js trophy model.

---

## Overview

This version is the **brief-aligned submission** (V1).

It focuses on the core requested experience:
- 2-card guessing gameplay
- randomized treasure/bomb placement
- card reveal animation/sequence
- streak counter
- trophy celebration on win
- responsive UI
- optional polish (SFX + rules modal)

---

## Features

- 🎴 **Two-card selection gameplay** (Left / Right)
- 🎲 **Randomized treasure/bomb placement each turn**
- ✨ **Reveal animation** for the selected card and both outcomes
- 🔢 **Streak counter** (correct guesses in a row)
- 🏆 **3D trophy celebration** (Babylon.js, using provided `Trophy.glb`)
- 🔊 **Card click SFX** (optional side-quest polish)
- ❓ **Rules/help modal** (optional UX polish)

---

## How to Play

1. Click **Left** or **Right** to choose a card.
2. If you pick the **Treasure**, your **streak increases by 1**.
3. If you pick the **Bomb**, your **streak resets to 0**.
4. Keep playing and try to build the highest streak you can.

---

## Tech Stack

- **TypeScript**
- **Babylon.js**
- **LESS**
- HTML / DOM UI

---

## Project Structure (high level)

- `src/Script/ui/` → UI bindings, rendering, animations
- `src/Script/domain/` → game state + game rules
- `src/Script/engine/` → Babylon scene setup + trophy system
- `src/Textures/Card/` → card textures
- `src/Models/` → `Trophy.glb`

---

## Running Locally

```powershell
npm install
npm run buildlocaldev
````

---

## Notes

* This branch is the **V1 brief submission**.
* An expanded **V2** version exists on the `main` branch with additional mechanics and scope beyond the original brief.


