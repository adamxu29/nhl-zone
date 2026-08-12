import Link from 'next/link'
import React from 'react'

function GetStarted() {
  return (
    <div className='relative'>
      <img className='bg-black absolute brightness-70 inset-0 w-full h-[100vh] object-cover' src='/herobackground.jpg' alt='photo of hockey arena as background'/>
      
      <div className='flex flex-col justify-center text-white items-center relative z-10 min-h-screen pb-7'>
        <h1 className='font-bold text-7xl'>NHL Zone</h1>
        <h2 className='font-medium text-lg'>Everything you need to know NHL</h2>

        <Link className='border-1 border-white border-solid rounded-sm px-6 py-4 mt-1 shadow-md hover:bg-[#D8D8D8]/40 hover:scale-105 transition hover:shadow-lg hover:shadow-white/30' href='/teams'>
          <div className='font-bold'>Teams</div>
        </Link>
      </div>
    </div>
  )
}

export default GetStarted