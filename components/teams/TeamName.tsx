/**
 * Team abbreviation on small screens, full name from `md` up.
 * CSS can't swap text content, so both are rendered and one is hidden.
 */
function TeamName({ abbrev, name }: { abbrev: string; name: string }) {
  return (
    <>
      <span className='md:hidden'>{abbrev}</span>
      <span className='hidden md:inline'>{name}</span>
    </>
  )
}

export default TeamName
