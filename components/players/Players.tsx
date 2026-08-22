import Section from '@/components/stats/Section'
import { fetchSkaters, fetchGoalies } from '@/lib/nhlStats'
import { formatTOI, formatSavePct, formatGAA } from '@/lib/format'

// TODO: Add player pages
async function Players() { 
  const [skaters, goalies] = await Promise.all([fetchSkaters(), fetchGoalies()])

  return (
    <div className='max-w-7xl mx-auto p-6'>
      <h1 className='text-4xl font-bold mb-5'>NHL Stat Leaders (2025-2026)</h1>
      <div>
        <Section title='Skaters' basePath='/players/skaters' players={skaters} sections={[
          { label: 'Goals', key: 'goals' },
          { label: 'Assists', key: 'assists' },
          { label: 'Points', key: 'points' },
          { label: 'Plus/Minus', key: 'plusMinus' },
          { label: 'TOI', key: 'timeOnIcePerGame', format: formatTOI },
          { label: 'PIM', key: 'penaltyMinutes' },
        ]}/>

        <Section title='Goalies' basePath='/players/goalies' players={goalies} sections={[
          { label: 'GAA', key: 'goalsAgainstAverage', asc: true, format: formatGAA },
          { label: 'SV %', key: 'savePct', format: formatSavePct },
          { label: 'Shutouts', key: 'shutouts' },
        ]}/>
      </div>
    </div>
  )
}

export default Players
