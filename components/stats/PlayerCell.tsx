import type { PlayerBase } from '@/lib/types'

/**
 * The leading cell of a stat table row: rank, headshot, name, team.
 * Generic because it only reads the fields every stat row has.
 */
function PlayerCell<T extends PlayerBase>({ item, index }: { item: T; index: number }) {
  // traded players carry several abbrevs ("TOR,BOS") — the last one is their current team
  const team = item.teamAbbrevs.split(',').pop()!.trim()

  return (
    <div className='flex items-center gap-2 md:gap-3'>
      <p className='w-5 text-gray-400'>{index + 1}</p>
      <img
        className='hidden md:flex w-[35px] h-[35px] md:w-[45px] md:h-[45px] shrink-0 rounded-full'
        src={`https://assets.nhle.com/mugs/nhl/20262027/${team}/${item.playerId}.png`}
        alt={`${item.name} headshot`}
      />
      <p className='text-sm md:text-md font-semibold'>{item.name}</p>
      <span className='text-xs text-gray-500'>{item.teamAbbrevs}</span>
    </div>
  )
}

export default PlayerCell
