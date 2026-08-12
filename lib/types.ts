// Shared types used across pages.

// ---- teams ----

export interface TeamData {
  id: number
  abbrev: string
  name: string
  conference: string
  division: string
}

// --- games ---
export interface GameData {
  id: number
  date: string
  home_score: number | null
  away_score: number | null
  home: { name: string; abbrev: string }
  away: { name: string; abbrev: string }
  game_center_link: string
  game_state: string
}

// ---- stat leaderboards ----

// every row a leaderboard renders needs at least these, whatever endpoint it came from
export interface PlayerBase {
  playerId: number
  name: string
  teamAbbrevs: string
  gamesPlayed: number
}

export interface SkaterStats extends PlayerBase {
  positionCode: string
  goals: number
  assists: number
  points: number
  plusMinus: number
  penaltyMinutes: number
  timeOnIcePerGame: number
}

export interface GoalieStats extends PlayerBase {
  gamesStarted: number
  goalsAgainstAverage: number
  savePct: number
  shutouts: number
  wins: number
  losses: number
  otLosses: number
}

// one column of a leaderboard: which field to rank on, and how to show it
export interface StatCategory<T> {
  label: string
  key: keyof T
  asc?: boolean                    // GAA and friends: lower is better
  format?: (value: number) => string
}
