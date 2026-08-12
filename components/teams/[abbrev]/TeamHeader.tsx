import { supabase } from '@/lib/supabase'
import { formatOrdinal } from '@/lib/format'
import TeamNav from './TeamNav'

async function TeamHeader({ abbrev }: { abbrev: string }) {
  const { data: team, error } = await supabase
    .from('teams')
    .select('*')
    .eq('abbrev', abbrev)
    .single()

  if (error) return <div>Error loading team: {error.message}</div>

  const [summary, standingsRes] = await Promise.all([
    fetch(`https://api.nhle.com/stats/rest/en/team/summary?cayenneExp=seasonId=20252026%20and%20gameTypeId=2%20and%20teamId=${team.id}`).then(r => r.json()),
    fetch('https://api-web.nhle.com/v1/standings/now').then(r => r.json()),
  ])

  const stats = summary.data[0]
  const rank = standingsRes.standings.find((t: any) => t.teamAbbrev.default === abbrev)

  return (
    <div className='bg-[#0D0D0D]'>
      <div className='flex items-center text-white max-w-7xl mx-auto pt-3 pb-7'>
        <img className='h-25' src={`https://assets.nhle.com/logos/nhl/svg/${abbrev}_dark.svg`} alt={`${abbrev} logo`}/>
        <div>
          <h1 className='text-4xl font-bold'>{team.name}</h1>
          <h2 className='flex gap-2 mt-1'>
            <strong>{stats.wins}-{stats.losses}-{stats.otLosses}</strong> |
            <p>{formatOrdinal(rank.divisionSequence)} in {team.division} Division</p>
          </h2>
        </div>
      </div>

      <div className='border-t border-t-[#666666]'/>

      <TeamNav abbrev={abbrev}/>
    </div>
  )
}

export default TeamHeader
