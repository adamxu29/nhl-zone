import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function seedPlayers(){
  const { data: teams, error: teamError } = await supabase
    .from('teams')
    .select('id, abbrev')

  if (teamError) return console.error(`Error loading teams: ${teamError.message}`)
    
  for(const team of teams){
    const res = await fetch(`https://api-web.nhle.com/v1/roster/${team.abbrev}/current`)
    const data = await res.json()
    const players = [...data.forwards, ...data.defensemen, ...data.goalies]
    for(const player of players){
      const { error } = await supabase.from('players').upsert({
        id: player.id,
        team_id: team.id,
        first_name: player.firstName.default,
        last_name: player.lastName.default,
        position: player.positionCode,
        jersey_number: player.sweaterNumber,
        shoots_catches: player.shootsCatches,
        height_inches: player.heightInInches,
        weight_pounds: player.weightInPounds,
        birth_date: player.birthDate,
        birth_country: player.birthCountry,
      }, { onConflict: 'id' })

      if(error) console.error(`Player ${player.id} failed:`, error.message)
    }
    console.log(`Processed ${players.length} players on ${team.abbrev}`)
  }
}

seedPlayers()