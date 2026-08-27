import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { formatGameDate } from '@/lib/format'
import { GameData } from '@/lib/types'
import TeamName from '@/components/teams/TeamName'
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';

const scheduleCols = 'grid grid-cols-[90px_auto] md:grid-cols-[200px_1fr_150px] items-center gap-x-2 px-4'

function Game({ game }: { game: GameData }) {
  const today = new Date().toLocaleDateString('en-Ca', {timeZone: 'America/Los_angeles'})
  return(
    <div className={`${scheduleCols} py-2 border-b border-gray-200 text-sm`}>
      <div className='flex flex-col'>
        <p className='text-xs md:text-md font-semibold'>{formatGameDate(game.date, true, true, true)}</p>
        <p className='text-xs text-gray-500'>
          {game.game_state === "LIVE" ? "LIVE" : (game.game_state === "FUT" ? "Upcoming" : "FINAL")}
        </p>
      </div>

      <div className='grid grid-cols-[1fr_auto_1fr] items-center md:font-medium'>
        <div className='flex items-center justify-end gap-2'>
          <TeamName abbrev={game.home.abbrev} name={game.home.name}/>
          <img className='w-10 h-6' src={`https://assets.nhle.com/logos/nhl/svg/${game.home.abbrev}_light.svg`} alt={`${game.home.name} logo`}/>
          {game.game_state !== "FUT" && (game.home_score)}
        </div>

        <p className='mx-5'>@</p>

        <div className='flex items-center justify-start gap-2'>
          {game.game_state !== "FUT" && (game.away_score)}
          <img className='w-10 h-6' src={`https://assets.nhle.com/logos/nhl/svg/${game.away.abbrev}_light.svg`} alt={`${game.away.name} logo`}/>
          <TeamName abbrev={game.away.abbrev} name={game.away.name}/>
        </div>
      </div>

      <Link className='hidden md:flex justify-end hover:underline text-md' href={game.date > today ? `/game-predictor?home=${game.home.abbrev}&away=${game.away.abbrev}` : `https://www.nhl.com${game.game_center_link}`}>
        {game.date > today ? 'Predict game' : 'Gamecenter'}
        <ArrowOutwardIcon fontSize='small'/>
      </Link>
    </div>
  )
}

async function TeamSchedule({ abbrev }: { abbrev: string }) {
  const { data: team, error: teamError } = await supabase
    .from('teams')
    .select('*')
    .eq('abbrev', abbrev).single()

  if (teamError) return <div>Error loading team: {teamError.message}</div>

  const { data: games, error: gamesError } = await supabase
    .from('games')
    .select('id, date, home_score, away_score, home:teams!home_team_id(name, abbrev), away:teams!away_team_id(name, abbrev), game_center_link, game_state')
    .or(`home_team_id.eq.${team.id},away_team_id.eq.${team.id}`)
    .eq('season', 20262027)
    .order('date', { ascending: true })
    .overrideTypes<GameData[], { merge: false }>()

  if (gamesError) return <div>Error loading games: {gamesError.message}</div>

  return (
    <div className='max-w-7xl mx-auto p-6'>
      <h1 className='text-4xl font-bold mb-5'>Schedule</h1>

      <div className='mb-5 rounded-md bg-white overflow-hidden'>
            <div className={`${scheduleCols} py-2 bg-[#e6e6e6] font-semibold`}>
              <h3>Date</h3>
              <h3 className='text-center'>Matchup</h3>
              <h3/>
            </div>

            {games.map((g) => (
              <Game key={g.id} game={g}/>
            ))}
          </div>
    </div>
  )
}

export default TeamSchedule
