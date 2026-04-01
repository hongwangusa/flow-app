// XP & Level engine for Flow / 流动

export const XP_BY_DIFFICULTY: Record<string, number> = {
  easy:   10,
  medium: 25,
  hard:   50,
}

export function xpForLevel(level: number): number {
  return level * 100
}

export function totalXpForDisplay(level: number, xpCurrent: number): number {
  const completedLevelsXp = Math.max(0, (level - 1) * level * 50)
  return completedLevelsXp + xpCurrent
}

/** Apply earned XP to a user's current level/xp, returning new values. */
export function applyXP(
  xpCurrent: number,
  xpTotal: number,
  level: number,
  earned: number
): { xpCurrent: number; xpTotal: number; level: number; leveledUp: boolean } {
  let newXp = xpCurrent + earned
  const newTotal = xpTotal + earned
  let newLevel = level
  let leveledUp = false

  while (newXp >= xpForLevel(newLevel)) {
    newXp -= xpForLevel(newLevel)
    newLevel++
    leveledUp = true
  }

  return { xpCurrent: newXp, xpTotal: newTotal, level: newLevel, leveledUp }
}

/** Check streak: given last_active_date (ISO string or null), return new streak count. */
export function calcStreak(streakCurrent: number, lastActiveDate: string | null): number {
  const today = new Date().toISOString().slice(0, 10)
  if (!lastActiveDate) return 1
  const diff = Math.floor(
    (new Date(today).getTime() - new Date(lastActiveDate).getTime()) / 86400000
  )
  if (diff === 0) return streakCurrent       // already active today
  if (diff === 1) return streakCurrent + 1   // consecutive day
  return 1                                   // streak broken
}
