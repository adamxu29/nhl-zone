import type { SkaterStats, GoalieStats } from '@/lib/types'

const SEASON = 20252026
const BASE = 'https://api.nhle.com/stats/rest/en'

// limit=-1 returns every row; anything else silently caps at 100
const ALL = 'limit=-1'

/** Every skater's season totals. */
export async function fetchSkaters(): Promise<SkaterStats[]> {
  const res = await fetch(
    `${BASE}/skater/summary?cayenneExp=seasonId=${SEASON}%20and%20gameTypeId=2&${ALL}`
  )
  const { data } = await res.json()
  // the skater and goalie endpoints name this field differently — normalise here
  // so everything downstream can just read `name`
  return data.map((s: any) => ({ ...s, name: s.skaterFullName }))
}

/**
 * Goalie season totals, restricted to 20+ games so that rate stats
 * (GAA, SV%) aren't topped by one-game call-ups.
 */
export async function fetchGoalies(): Promise<GoalieStats[]> {
  const res = await fetch(
    `${BASE}/goalie/summary?cayenneExp=seasonId=${SEASON}%20and%20gameTypeId=2%20and%20gamesPlayed%3E=20&${ALL}`
  )
  const { data } = await res.json()
  return data.map((g: any) => ({ ...g, name: g.goalieFullName }))
}
