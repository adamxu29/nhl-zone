import React from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

interface GameData {
  id: number
  date: string
  home: { name: string; abbrev: string }
  away: { name: string; abbrev: string }
}

interface playerData{
  id: number
  first_name: string
  last_name: string
  position: string
  jersey_number: number
  shoots_catches: string
  height_inches: number
  weight_pounds: number
  birth_date: string
  birth_country: string
  t: { abbrev: string }
}

function Game({ game }: { game: GameData}) {
  return(
    <div className='grid grid-cols-[1fr_auto_1fr] grid-rows-3 items-center justify-items-center my-3 h-35 w-75 px-2 rounded-md bg-white font-medium'>
      {/* row 1 — logos */}
      <img className='mt-6 w-12 h-8' src={`https://assets.nhle.com/logos/nhl/svg/${game.home.abbrev}_light.svg`} alt={`${game.home.name} logo`}/>
      <span/>
      <img className='mt-6 w-12 h-8' src={`https://assets.nhle.com/logos/nhl/svg/${game.away.abbrev}_light.svg`} alt={`${game.away.name} logo`}/>

      {/* row 2 — names */}
      <p className='text-sm font-bold text-center w-25'>{game.home.name}</p>
      <p>@</p>
      <p className='text-sm font-bold text-center w-25'>{game.away.name}</p>

      {/* row 3 — date */}
      <h1 className='col-span-3 font-semibold text-lg mb-4'>{game.date}</h1>
    </div>
  )
}

function Statistic({ title, value }: { title: string; value: number }){
  return (
    <div className='bg-white p-4 flex flex-col items-center'>
      <p className='text-sm text-gray-500'>{title}</p>
      <p className='text-2xl font-bold'>{value.toFixed(2)}</p>
    </div>
  )
}


const rosterCols = 'grid grid-cols-[2.6fr_0.5fr_0.6fr_0.5fr_0.7fr_0.6fr_1.3fr_1.5fr] items-center gap-x-2 px-4'

function formatHeight(inches: number){
  return `${Math.floor(inches / 12)}' ${inches % 12}"`
}

function formatBirthDate(date: string){
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC',
  })
}

function Player({ player, team_abbrev }: { player: playerData; team_abbrev: string }){
  return(
    <div className={`${rosterCols} py-1 border-b border-gray-200 text-sm`}>
      <div className='flex items-center gap-3'>
        <img className='w-[45px] h-[45px] shrink-0 rounded-full' src={`https://assets.nhle.com/mugs/nhl/20262027/${team_abbrev}/${player.id}.png`} alt={`${player.first_name} ${player.last_name}`}/>
        <p className='font-semibold'>{player.first_name} {player.last_name}</p>
      </div>
      <p>{player.jersey_number}</p>
      <p>{player.position}{(player.position === 'L' || player.position === 'R') && 'W'}</p>
      <p>{player.shoots_catches}</p>
      <p>{formatHeight(player.height_inches)}</p>
      <p>{player.weight_pounds}</p>
      <p>{formatBirthDate(player.birth_date)}</p>
      <p>{player.birth_country}</p>
    </div>
  )
}

async function TeamHome({ abbrev }: { abbrev: string }) {
  const today = new Date().toLocaleDateString('en-Ca', {timeZone: 'America/Los_angeles'})
  const { data: team, error: teamError } = await supabase
    .from('teams')
    .select('*')
    .eq('abbrev', abbrev).single()

  if (teamError) return <div>Error loading teams: {teamError.message}</div>

  const { data: games, error: gamesError } = await supabase
    .from('games')
    .select('id, date, home:teams!home_team_id(name, abbrev), away:teams!away_team_id(name, abbrev)')
    .or(`home_team_id.eq.${team.id},away_team_id.eq.${team.id}`)
    .eq('season', 20262027)
    .gte('date', today)
    .order('date', { ascending: true })
    .limit(4)
    .overrideTypes<GameData[], { merge: false }>()

  if (gamesError) return <div>Error loading teams: {gamesError.message}</div>

  const { data: players, error: playersError } = await supabase
    .from('players')
    .select('*, t:teams!team_id(abbrev)')
    .eq('team_id', team.id)
    .order('last_name', { ascending: true })
    .overrideTypes<playerData[], { merge: false }>()

  if (playersError) return <div>Error loading teams: {playersError.message}</div>

  const positionOrder: Record<string, number> = { C: 0, L: 1, R: 2, D: 3, G: 4 }

  players.sort((a, b) =>
    positionOrder[a.position] - positionOrder[b.position] ||
    a.last_name.localeCompare(b.last_name)
  )

  const res = await fetch(`https://api.nhle.com/stats/rest/en/team/summary?cayenneExp=seasonId=20252026%20and%20gameTypeId=2%20and%20teamId=${team.id}`)
  const { data } = await res.json()
  const stats = data[0]

  return (
    <div className=''>
      {/* Upcoming Games */}
      <div className='max-w-7xl mx-auto mb-5'>
        <h1 className='text-4xl font-bold mt-10'>Upcoming Games</h1>
        <div className='flex justify-between mt-4'>
          {games.map((g) => {
            return<Game key={g.id} game={g}/>
          })}
        </div>
      </div>
        
      <div className='max-w-7xl mx-auto mb-5 grid grid-cols-[2.4fr_1fr] gap-5'>
        {/* Roster */}
        <div id='roster' className='rounded-md mb-5 bg-white'>
          <h2 className='text-xl font-semibold pl-4 py-1 bg-black text-white rounded-t-md'>Roster</h2>
          {/* Table of players */}
          <div className=''>
            <div className={`${rosterCols} py-2 bg-[#e6e6e6] font-semibold`}>
              <h3>Player</h3>
              <h3>#</h3>
              <h3>Pos</h3>
              <h3>Sh</h3>
              <h3>Ht</h3>
              <h3>Wt</h3>
              <h3>Born</h3>
              <h3>Birthplace</h3>
            </div>
            {players.map((p) => (
              <Player key={p.id} player={p} team_abbrev={p.t.abbrev}/>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className='rounded-md mb-5 bg-white h-min'>
          <h2 className='text-xl font-semibold ml-4 mt-2'>Team Statistics (2025-2026)</h2>
          <div className='grid grid-cols-2 gap-px bg-gray-300 mx-3 my-2'>
            <Statistic title='Goals For / Game' value={stats.goalsForPerGame}/>
            <Statistic title='Goals Against / Game' value={stats.goalsAgainstPerGame}/>
            <Statistic title='Power Play %' value={stats.powerPlayPct * 100}/>
            <Statistic title='Penalty Kill %' value={stats.penaltyKillPct * 100}/>
          </div>
        </div>
      </div>
    </div>
  )
}



export default TeamHome