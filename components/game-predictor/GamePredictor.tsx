'use client'
import { useState } from 'react'
import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from '@headlessui/react'
import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore'
import type { TeamData } from '@/lib/types'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

const logo = (abbrev: string) => `https://assets.nhle.com/logos/nhl/svg/${abbrev}_light.svg`
const API_URL = "https://nhl-ml-predictor.onrender.com"

interface Prediction {
  home: string
  away: string
  home_win_prob: number
  pick: string                 // winning team's abbrev
  confidence: number           // 0–1
  home_expected_goals: number
  away_expected_goals: number
  home_elo: number
  away_elo: number
}

/**
 * One team picker. Each instance owns its own `query` so typing in the home
 * field doesn't filter the away field.
 */
function TeamCombobox({
  label,
  teams,
  value,
  onChange,
}: {
  label: string
  teams: TeamData[]
  value: TeamData | null
  onChange: (team: TeamData | null) => void
}) {
  const [query, setQuery] = useState('')

  const filtered =
    query === ''
      ? teams
      : teams.filter(
          (t) =>
            t.name.toLowerCase().includes(query.toLowerCase()) ||
            t.abbrev.toLowerCase().includes(query.toLowerCase())
        )

  return (
    <div className='flex flex-col items-center gap-4 px-6 py-6'>
      <h2 className='text-2xl font-semibold'>{label}</h2>

      {/* selected crest, or a placeholder so the card doesn't jump on select */}
      <div className='flex items-center justify-center h-24 w-24'>
        {value ? (
          <img className='max-h-24 max-w-24' src={logo(value.abbrev)} alt={`${value.name} logo`} />
        ) : (
          <div className='h-20 w-20 rounded-full border-2 border-dashed border-gray-300' />
        )}
      </div>

      <Combobox immediate value={value} onChange={onChange} onClose={() => setQuery('')}>
        <div className='relative w-64'>
          <ComboboxInput
            className='w-full rounded-md border border-gray-300 bg-white py-2 pl-3 pr-9 text-sm
                       focus:border-black focus:outline-none focus:ring-1 focus:ring-black'
            placeholder='Search teams…'
            aria-label={label}
            displayValue={(team: TeamData | null) => team?.name ?? ''}
            onChange={(e) => setQuery(e.target.value)}
          />
          <ComboboxButton className='absolute inset-y-0 right-0 flex items-center pr-2 text-gray-400'>
            <UnfoldMoreIcon fontSize='small' />
          </ComboboxButton>

          <ComboboxOptions
            anchor='bottom start'
            className='z-50 mt-1 max-h-72 w-[var(--input-width)] overflow-auto rounded-md border
                       border-gray-200 bg-white shadow-lg empty:invisible'
          >
            {query === '' && (
              <ComboboxOption
                value={null}
                className='flex cursor-pointer items-center gap-3 px-3 py-2 text-sm italic text-gray-400
                           data-focus:rounded m-2 data-focus:bg-gray-100'
              >
                <span className='h-6 w-9 shrink-0' />
                <span className='flex-1'></span>
              </ComboboxOption>
            )}

            {filtered.map((team) => (
              <ComboboxOption
                key={team.id}
                value={team}
                className='flex cursor-pointer items-center gap-3 px-3 py-2 text-sm
                           data-focus:rounded m-2 data-focus:bg-gray-100 data-selected:font-semibold'
              >
                <img className='h-6 w-9 shrink-0 object-contain' src={logo(team.abbrev)} alt='' />
                <span className='flex-1 truncate'>{team.name}</span>
                <span className='text-xs text-gray-400'>{team.abbrev}</span>
              </ComboboxOption>
            ))}
          </ComboboxOptions>
        </div>
      </Combobox>
    </div>
  )
}

function GamePredictor({ teams }: { teams: TeamData[] }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [homeTeam, setHomeTeam] = useState<TeamData | null>(
    () => teams.find((t) => t.abbrev === searchParams.get('home')) ?? null
  )
  const [awayTeam, setAwayTeam] = useState<TeamData | null>(
    () => teams.find((t) => t.abbrev === searchParams.get('away')) ?? null
  )

  const sameTeam = homeTeam !== null && homeTeam.id === awayTeam?.id
  const teamsSelected = homeTeam && awayTeam

  const [prediction, setPrediction] = useState<Prediction | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handlePredict() {
    if (!homeTeam || !awayTeam) return
    setLoading(true)
    setError(null)
    
    try {
      const res = await fetch(`${API_URL}/predict/${homeTeam.abbrev}/vs/${awayTeam.abbrev}`)
      if (!res.ok) throw new Error(`Prediction failed: ${res.status}`)
      router.replace(`?home=${homeTeam.abbrev}&away=${awayTeam.abbrev}`, { scroll: false })
      setPrediction(await res.json())
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  function handleReset() {
    setHomeTeam(null)
    setAwayTeam(null)
    setPrediction(null)
    setError(null)
    router.replace('/game-predictor', { scroll: false })
  }

  useEffect(() => {
    const [nav] = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[]
    if (nav?.type === 'reload') {
      handleReset()
    } else {
      teamsSelected && handlePredict()
      setLoading(false)
    }
  }, []);

  return (
    <div className='max-w-7xl mx-auto p-6 h-screen'>
      <h1 className='text-4xl font-bold mb-5'>Game Predictor</h1>

      <div className='rounded-md bg-white shadow-sm flex flex-col items-center'>
        <div className='grid grid-cols-1 w-full md:grid-cols-[1fr_auto_1fr]'>
          <TeamCombobox label='Home Team' teams={awayTeam ? teams.filter(t => t !== awayTeam) : teams} value={homeTeam} onChange={setHomeTeam} />

          <div className='flex items-center justify-center py-2 md:px-6 text-xl font-bold'>
            vs
          </div>

          <TeamCombobox label='Away Team' teams={homeTeam ? teams.filter(t => t !== homeTeam) : teams} value={awayTeam} onChange={setAwayTeam} />
        </div>

        {(teamsSelected && prediction) && (() => {
          const winner = teams.find((t) => t.abbrev === prediction.pick)
          const pct = prediction.confidence * 100

          // extra top padding on mobile so the absolute Reset button clears the heading
          return (
            <div className='relative w-full border-t border-gray-200 px-6 pb-6 pt-12 md:pt-6'>
              <button
                onClick={handleReset}
                className='absolute top-3 right-3 rounded border border-gray-300 px-3 py-1
                           text-xs font-semibold uppercase tracking-wider text-gray-600
                           transition-colors hover:bg-gray-100'
              >
                Reset
              </button>
              {/* winner */}
              <div className='flex flex-col items-center gap-2'>
                <p className='text-xs font-semibold uppercase tracking-wider text-gray-500'>
                  Predicted Winner
                </p>
                <div className='flex items-center gap-3'>
                  {winner && (
                    <img className='h-10 w-14 object-contain' src={logo(winner.abbrev)} alt='' />
                  )}
                  <span className='text-2xl font-bold'>{winner?.name ?? prediction.pick}</span>
                </div>
              </div>

              {/* confidence */}
              <div className='mx-auto mt-6 max-w-md'>
                <div className='mb-1 flex justify-between text-xs text-gray-500'>
                  <span className='font-semibold uppercase tracking-wider'>Confidence</span>
                  <span className='font-bold tabular-nums text-black'>{pct.toFixed(1)}%</span>
                </div>
                <div className='h-2 w-full overflow-hidden rounded-full bg-gray-200'>
                  <div className='h-full rounded-full bg-black' style={{ width: `${pct}%` }} />
                </div>
              </div>
              
              {/* expected goals - predicted winner can potentially have the lower expected goals */}
              <div className='mt-6 grid grid-cols-[1fr_auto_1fr] items-center'>
                <p className='text-center text-3xl font-bold tabular-nums'>
                  {prediction.home_expected_goals}
                </p>
                <p className='px-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-500'>
                  Expected<br/>Goals
                </p>
                <p className='text-center text-3xl font-bold tabular-nums'>
                  {prediction.away_expected_goals}
                </p>
              </div>

              {/* elo */}
              <div className='mt-6 grid grid-cols-[1fr_auto_1fr] items-center'>
                <p className='text-center text-3xl font-bold tabular-nums'>
                  {prediction.home_elo}
                </p>
                <p className='px-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-500'>
                  Calculated<br/>Elo
                </p>
                <p className='text-center text-3xl font-bold tabular-nums'>
                  {prediction.away_elo}
                </p>
              </div>

            </div>
          )
        })()}

        {error && (
          <p className='px-6 pb-3 text-sm text-red-600'>{error}</p>
        )}
      
        <button
          onClick={handlePredict}
          disabled={loading}
          className={`mb-3 rounded bg-black px-20 py-2 text-lg text-white transition-opacity
                      hover:opacity-90 disabled:opacity-50 ${teamsSelected ? 'visible' : 'hidden'}`}
        >
          {loading ? 'Predicting…' : 'Predict Game'}
        </button>

      </div>

      {sameTeam && (
        <p className='mt-4 text-sm text-red-600'>Pick two different teams.</p>
      )}
    </div>
  )
}

export default GamePredictor

// TODO:
//  add prediction links in team schedules