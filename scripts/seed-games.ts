// import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function seedAllGames(season: number, startDate: string) {
  let currentDate = startDate

  while (true) {
    const res = await fetch(`https://api-web.nhle.com/v1/schedule/${currentDate}`)
    const data = await res.json()

    const outOfSeason = data.gameWeek.some((d: any) =>
      d.games.some((g: any) => g.season && g.season !== season)
    )
    // if (outOfSeason) break

    for (const date of data.gameWeek) {
      for (const game of date.games) {
        if(game.gameType < 4){
          const { error } = await supabase.from('games').upsert({
            id: game.id,
            date: date.date,
            season: game.season,
            home_team_id: game.homeTeam.id,
            away_team_id: game.awayTeam.id,
            home_score: game.homeTeam.score ?? null,
            away_score: game.awayTeam.score ?? null,
            game_center_link: game.gameCenterLink,
            game_state: game.gameState,
            game_type: game.gameType,
          }, { onConflict: 'id' })

          if(error) console.error(`Game ${game.id} failed:`, error.message)
        }

        else{
          continue
        }

      }
      console.log(`Processed ${date.games.length} games for ${date.date}`)
    }


    // if (currentDate === '2026-06-10') break // no more weeks — season's over
    currentDate = data.nextStartDate
  }
}

seedAllGames(20252026, '2025-09-23')