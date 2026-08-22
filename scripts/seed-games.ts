// import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// The NHL issues a new team id when a franchise moves or rebrands, so one team's
// history is split across several ids. `teams` only holds the current row, so
// historical ids are remapped to keep a single stable key per team — otherwise the
// FK rejects the game and the team's rolling-form history breaks in two.
//   53 ARI -> Arizona Coyotes, through 2023-24
//   59 UTA -> Utah Hockey Club, 2024-25 only
//   68 UTA -> Utah Mammoth, 2025-26 onward
// Arizona is aliased too: the roster and contracts carried over intact, so it's the
// same team as far as the model is concerned, even though the NHL counts Utah as a
// new franchise.
const TEAM_ID_ALIASES: Record<number, number> = { 53: 68, 59: 68 }

const teamId = (id: number) => TEAM_ID_ALIASES[id] ?? id

async function seedAllGames(season: number, startDate: string) {
  let currentDate = startDate

  while (true) {
    const res = await fetch(`https://api-web.nhle.com/v1/schedule/${currentDate}`)
    if (!res.ok) {
      console.error(`Schedule fetch failed for ${currentDate}: ${res.status}`)
      break
    }
    const data = await res.json()

    await new Promise((r) => setTimeout(r, 200))

    const outOfSeason = data.gameWeek.some((d: any) =>
      d.games.some((g: any) => g.season && g.season !== season)
    )
    // if (outOfSeason) break
    
    const rows = []
    for (const date of data.gameWeek) {
      for (const game of date.games) {
        if(game.gameType !== 2) continue
        rows.push({
          id: game.id,
          date: date.date,
          result_type: game.gameOutcome?.lastPeriodType ?? null,
          start_time_utc: game.startTimeUTC,
          venue: game.venue.default,
        })
      }
      console.log(`Processed ${date.games.length} games for ${date.date}`)
    }

    if(rows.length){
      const { error } = await supabase.from('games').upsert(rows, { onConflict: 'id' })
      if(error) console.error(`Week ${currentDate} failed:`, error.message)
    }

    if (!data.nextStartDate || data.nextStartDate <= currentDate) break
    currentDate = data.nextStartDate

  }
}

seedAllGames(20212022, '2021-09-23')