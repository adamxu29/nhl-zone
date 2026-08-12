// import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function seedDailyGames() {
  let currentDate = new Date().toLocaleDateString('en-Ca', {timeZone: 'America/Los_angeles'})

    const res = await fetch(`https://api-web.nhle.com/v1/schedule/${currentDate}`)
    const data = await res.json()

  for (const date of data.gameWeek) {
    for (const game of date.games) {
      if (date.date === currentDate){
        const { error } = await supabase.from('games').upsert({
          home_score: game.homeTeam.score ?? null,
          away_score: game.awayTeam.score ?? null,
          game_state: game.gameState,
        }, { onConflict: 'id' })

        if(error) console.error(`Game ${game.id} failed:`, error.message)

        break
      }
    }
    console.log(`Processed ${date.games.length} games for ${date.date}`)
  }
}

seedDailyGames()