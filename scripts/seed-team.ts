import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function getTeamMapFromSchedule(sampleDate: string) {
  const res = await fetch(`https://api-web.nhle.com/v1/schedule/${sampleDate}`)
  const data = await res.json()

  const teamMap = new Map<string, { id: number; name?: string }>()

  for (const week of data.gameWeek) {
    for (const game of week.games) {
      teamMap.set(game.homeTeam.abbrev, { id: game.homeTeam.id })
      teamMap.set(game.awayTeam.abbrev, { id: game.awayTeam.id })
    }
  }
  return teamMap
}

async function seedTeams() {
  const [standingsRes, teamMap] = await Promise.all([
    fetch('https://api-web.nhle.com/v1/standings/now').then(r => r.json()),
    getTeamMapFromSchedule('2025-10-08'), // any regular-season date works
  ])

  const teams = standingsRes.standings.map((team: any) => {
    const abbrev = team.teamAbbrev.default
    const match = teamMap.get(abbrev)

    if (!match) console.warn(`No API-web ID found for ${abbrev}`)

    return {
      id: match?.id,
      abbrev,
      name: team.teamName.default,
      conference: team.conferenceName,
      division: team.divisionName,
    }
  })

  const { error } = await supabase.from('teams').upsert(teams, { onConflict: 'abbrev' })

  if (error) console.error('Error inserting teams:', error)
  else console.log(`Inserted ${teams.length} teams`)
}

seedTeams()