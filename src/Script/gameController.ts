import {
  bankPoints,
  clamp,
  DEFAULT_MAX_TURNS,
  JokerType,
  Loot,
  RunState,
  SlotType,
  TROPHY_THRESHOLDS,
} from "./gameState";

export type TrophyTier = "NONE" | "BRONZE" | "SILVER" | "GOLD";

export type TurnResult =
  | { kind: "READY" }
  | {
      kind: "GAME_OVER";
      reason: "TURNS" | "LIVES";
      totalScore: number;
      trophyTier: TrophyTier;
    }
  | {
      kind: "BOMB_HIT";
      shieldSaved: boolean;
      gameOver: boolean;
      reason?: "TURNS" | "LIVES";
      turnsLeft: number;
    }
  | {
      kind: "TREASURE";
      loot: Loot;
      duplicateBusted: boolean;
      shieldSaved: boolean;
      gameOver: boolean;
      turnsLeft: number;
    }
  | {
      kind: "BANKED";
      points: number;
      totalScore: number;
      trophyTier: TrophyTier;
    };

export function newGame(maxTurns: number = DEFAULT_MAX_TURNS): RunState {
  return {
    lives: 3,
    totalScore: 0,

    turnsLeft: maxTurns,
    maxTurns,

    streak: 0,
    uniques: new Set<number>(),
    hasShield: false,
    scramblerCharges: 0,
    jammerTurns: 0,
    leftSlot: "TREASURE",
    rightSlot: "TREASURE",
  };
}

export function trophyTier(totalScore: number): TrophyTier {
  if (totalScore >= TROPHY_THRESHOLDS.gold) return "GOLD";
  if (totalScore >= TROPHY_THRESHOLDS.silver) return "SILVER";
  if (totalScore >= TROPHY_THRESHOLDS.bronze) return "BRONZE";
  return "NONE";
}

function computePBomb(streak: number, jammerTurns: number): number {
  // pBomb = clamp(0.20 + 0.06*streak, 0.20, 0.56) then jammer reduces by 0.15
  let p = clamp(0.2 + 0.06 * streak, 0.2, 0.56);
  if (jammerTurns > 0) p = Math.max(0, p - 0.15);
  return p;
}

function isGameOver(
  state: RunState,
): { over: true; reason: "TURNS" | "LIVES" } | { over: false } {
  if (state.lives <= 0) return { over: true, reason: "LIVES" };
  if (state.turnsLeft <= 0) return { over: true, reason: "TURNS" };
  return { over: false };
}

export function startNextTurn(state: RunState): TurnResult {
  const over = isGameOver(state);
  if (over.over) {
    return {
      kind: "GAME_OVER",
      reason: over.reason,
      totalScore: state.totalScore,
      trophyTier: trophyTier(state.totalScore),
    };
  }

  // decrement jammer at turn start
  const pBomb = computePBomb(state.streak, state.jammerTurns);
  if (state.jammerTurns > 0) state.jammerTurns -= 1;

  const bombPresent = Math.random() < pBomb;
  const slots: SlotType[] = bombPresent
    ? ["BOMB", "TREASURE"]
    : ["TREASURE", "TREASURE"];

  // randomize left/right
  if (Math.random() < 0.5) {
    state.leftSlot = slots[0];
    state.rightSlot = slots[1];
  } else {
    state.leftSlot = slots[1];
    state.rightSlot = slots[0];
  }

  state.lastEvent = `Turn ready. (Turns left: ${state.turnsLeft})`;
  return { kind: "READY" };
}

function drawLoot(): Loot {
  const jokerRoll = Math.random() < 0.15;
  if (jokerRoll) {
    const jokers: JokerType[] = ["SHIELD", "SCRAMBLER", "JAMMER"];
    const j = jokers[Math.floor(Math.random() * jokers.length)];
    return { kind: "JOKER", value: j };
  }
  const n = 1 + Math.floor(Math.random() * 7);
  return { kind: "NUMBER", value: n };
}

function resetRun(state: RunState): void {
  state.streak = 0;
  state.uniques = new Set<number>();
  state.hasShield = false;
  state.scramblerCharges = 0;
  state.jammerTurns = 0;
}

export function canBank(state: RunState): boolean {
  // banking is allowed even if turnsLeft == 0? up to you.
  // I recommend: allow bank only during active play.
  return state.uniques.size > 0 && state.lives > 0 && state.turnsLeft > 0;
}

export function bank(state: RunState): Extract<TurnResult, { kind: "BANKED" }> {
  const u = state.uniques.size;
  const points = bankPoints(u);
  state.totalScore += points;

  const tier = trophyTier(state.totalScore);
  state.lastEvent = `Banked ${points} points (u=${u}).`;
  resetRun(state);

  return {
    kind: "BANKED",
    points,
    totalScore: state.totalScore,
    trophyTier: tier,
  };
}

export function flip(state: RunState, side: "LEFT" | "RIGHT"): TurnResult {
  const overBefore = isGameOver(state);
  if (overBefore.over) {
    return {
      kind: "GAME_OVER",
      reason: overBefore.reason,
      totalScore: state.totalScore,
      trophyTier: trophyTier(state.totalScore),
    };
  }

  // Consume a turn on every flip attempt (win or lose)
  state.turnsLeft -= 1;

  const slot = side === "LEFT" ? state.leftSlot : state.rightSlot;

  if (slot === "BOMB") {
    if (state.hasShield) {
      state.hasShield = false;
      state.streak = 0; // penalty; keep uniques
      state.lastEvent = "Bomb hit, shield saved you. Streak reset.";

      const over = isGameOver(state);
      return {
        kind: "BOMB_HIT",
        shieldSaved: true,
        gameOver: over.over,
        reason: over.over ? over.reason : undefined,
        turnsLeft: state.turnsLeft,
      };
    }

    state.lives -= 1;
    const over = isGameOver(state);

    state.lastEvent = over.over
      ? "Bomb hit. Game over."
      : "Bomb hit. Lost a life. Run reset.";

    resetRun(state);

    return {
      kind: "BOMB_HIT",
      shieldSaved: false,
      gameOver: over.over,
      reason: over.over ? over.reason : undefined,
      turnsLeft: state.turnsLeft,
    };
  }

  // Treasure
  state.streak += 1;

  let loot = drawLoot();

  // resolve loot
  if (loot.kind === "JOKER") {
    if (loot.value === "SHIELD") {
      if (!state.hasShield) {
        state.hasShield = true;
        state.lastEvent = "Loot: Shield acquired.";
      } else {
        // overflow rule: convert to scrambler charge
        state.scramblerCharges = Math.min(4, state.scramblerCharges + 1);
        state.lastEvent =
          "Loot: Shield (already had one) converted to +1 scrambler charge.";
      }
    } else if (loot.value === "SCRAMBLER") {
      state.scramblerCharges = Math.min(4, state.scramblerCharges + 2);
      state.lastEvent = "Loot: Scrambler (+2 charges).";
    } else if (loot.value === "JAMMER") {
      state.jammerTurns = 3;
      state.lastEvent = "Loot: Jammer (bomb chance reduced for 3 turns).";
    }

    const over = isGameOver(state);
    return {
      kind: "TREASURE",
      loot,
      duplicateBusted: false,
      shieldSaved: false,
      gameOver: over.over,
      turnsLeft: state.turnsLeft,
    };
  }

  // NUMBER
  const n = loot.value;
  const isDup = state.uniques.has(n);

  if (!isDup) {
    state.uniques.add(n);
    state.lastEvent = `Loot: Number ${n} (new).`;

    const over = isGameOver(state);
    return {
      kind: "TREASURE",
      loot,
      duplicateBusted: false,
      shieldSaved: false,
      gameOver: over.over,
      turnsLeft: state.turnsLeft,
    };
  }

  // duplicate handling
  if (state.hasShield) {
    state.hasShield = false;
    state.lastEvent = `Loot: Number ${n} duplicate, shield saved you.`;

    const over = isGameOver(state);
    return {
      kind: "TREASURE",
      loot,
      duplicateBusted: false,
      shieldSaved: true,
      gameOver: over.over,
      turnsLeft: state.turnsLeft,
    };
  }

  if (state.scramblerCharges > 0) {
    state.scramblerCharges -= 1;
    // reroll once
    const reroll = 1 + Math.floor(Math.random() * 7);
    if (!state.uniques.has(reroll)) {
      state.uniques.add(reroll);
      state.lastEvent = `Loot: Duplicate ${n}, scrambler rerolled to ${reroll} (new).`;

      const over = isGameOver(state);
      return {
        kind: "TREASURE",
        loot: { kind: "NUMBER", value: reroll },
        duplicateBusted: false,
        shieldSaved: false,
        gameOver: over.over,
        turnsLeft: state.turnsLeft,
      };
    }

    // reroll still duplicate -> bust
    state.lastEvent = `Loot: Duplicate ${n}, scrambler reroll also duplicate (${reroll}). Run bust.`;
    resetRun(state);

    const over = isGameOver(state);
    return {
      kind: "TREASURE",
      loot,
      duplicateBusted: true,
      shieldSaved: false,
      gameOver: over.over,
      turnsLeft: state.turnsLeft,
    };
  }

  // bust
  state.lastEvent = `Loot: Number ${n} duplicate. Run bust.`;
  resetRun(state);

  const over = isGameOver(state);
  return {
    kind: "TREASURE",
    loot,
    duplicateBusted: true,
    shieldSaved: false,
    gameOver: over.over,
    turnsLeft: state.turnsLeft,
  };
}
