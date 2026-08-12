import React from 'react'
import Link from 'next/link'

function Navbar() {
  return (
    <div className='grid grid-cols-4 items-center bg-[#0D0D0D] text-white'>
      <Link className='w-25 ml-2 my-4' href='/'>
        <img src='/whitebull.svg' alt='logo'/>
      </Link>
      {/* Home */}

      <div className='col-span-2 col-start-2 flex justify-between font-extrabold text-lg'>
        <Link className='' href='/'>
          Home
        </Link>

        {/* Teams */}
        <Link className='' href='/teams'>
          Teams
        </Link>

        {/* Players */}
        <Link className='' href='/players'>
          Players
        </Link>

        <Link className='opacity-30' href=''>
          Match Predictor
        </Link>
      </div>
    </div>
  )
}

export default Navbar