import React from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link';
import { formatGameDate } from '@/lib/format';
import { GameData } from '@/lib/types';
import TeamName from '@/components/teams/TeamName';

function Game({ game }: { game: GameData}) {
  // Show time for upcoming games?
  return(
    <div className={`flex flex-col items-center md:grid md:grid-cols-[150px_1fr_150px] my-5 h-35 w-[90vw] md:w-300 rounded-md shadow-md bg-white`}>
      <div className='col-start-1 flex flex-col items-center md:items-start justify-center md:text-wrap md:ml-5'>
        <h1 className='font-semibold text-lg'>{formatGameDate(game.date, false, false, false)}</h1>
        <p className='font-semibold'>{game.game_state === "LIVE" ? "LIVE" : (game.game_state === "FUT" ?  "Upcoming" : "FINAL")}</p>
      </div>

      <div className='grid grid-cols-[1fr_auto_1fr] items-center font-medium my-2 md:my-0'>
        <div className='flex items-center justify-end gap-2'>
          <TeamName abbrev={game.home.abbrev} name={game.home.name}/>
          <img className='w-12 h-8' src={`https://assets.nhle.com/logos/nhl/svg/${game.home.abbrev}_light.svg`} alt={`${game.home.name} logo`}/>
          {game.game_state !== "FUT" && (game.home_score)}
        </div>

        <p className='mx-5'>@</p>

        <div className='flex items-center justify-start gap-2'>
          {game.game_state !== "FUT" && (game.away_score)}
          <img className='w-12 h-8' src={`https://assets.nhle.com/logos/nhl/svg/${game.away.abbrev}_light.svg`} alt={`${game.away.name} logo`}/>
          <TeamName abbrev={game.away.abbrev} name={game.away.name}/>
        </div>
      </div>
      <Link className='col-start-3 flex justify-end items-center md:mr-5 text-blue-500' href={`https://www.nhl.com${game.game_center_link}`}>
        Gamecenter
      </Link>
    </div>
  )
}

async function TodaysGames() {
  const today = new Date().toLocaleDateString('en-Ca', {timeZone: 'America/Los_angeles'})
  const priority: Record<string, number> = { LIVE: 1, CRIT: 0, PRE: 2, FUT: 3, OFF: 4}
  const { data: games, error } = await supabase
    .from('games')
    .select('id, date, home_score, away_score, home:teams!home_team_id(name, abbrev), away:teams!away_team_id(name, abbrev), game_center_link, game_state, game_type')
    .eq('date', today)
    .overrideTypes<GameData[], { merge: false }>()
  if (error) return <div>Error loading teams: {error.message}</div>
  games.sort((a, b) => priority[a.game_state] - priority[b.game_state])

  return (
    <div className='bg-[#f2f2f2] min-h-[45vh]'>
      <h1 className='font-bold text-4xl flex justify-center md:justify-start md:pl-10 py-10'>Todays Games</h1>

      <div className='flex flex-col items-center'>
        {games.length === 0 ? <strong className='text-lg md:text-2xl'>No Scheduled Games For Today</strong> : games.map((g, i) => {
          return<Game key={i} game={g}/>
        })}
      </div>

    </div>
  )
}
export default TodaysGames