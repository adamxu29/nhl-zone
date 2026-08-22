'use client'
import React from 'react'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { usePathname } from 'next/navigation';

function Navbar() {
  const location = usePathname();
    
  const active = `/${location.split('/')[1]}`
  const [menu, setMenu] = useState(false);

  const links = [
    ['Home', '/'],
    ['Teams', '/teams'],
    ['Players', '/players'],
    ['Game Predictor', '/game-predictor'],
  ]
  
  return (
    <div className='sticky top-0 z-50'>
      <div className='relative z-50 bg-[#0D0D0D] text-white flex justify-between items-center md:grid grid-cols-4'>
        <Link className='w-15 md:w-25 ml-3 my-4' href='/'>
          <img src='/whitebull.svg' alt='logo'/>
        </Link>
        {/* Home */}

        <nav className='col-span-2 col-start-2 hidden md:flex justify-between font-extrabold text-lg'>
          {links.map(([title, path, disable]) => (
            <Link className={`${active === path ? "text-white": "text-[#939393]"}`} key={title} href={path}>
              {title}
            </Link>
          ))}
        </nav>
        
        <nav className={`mr-7 md:hidden`}>
          {menu ?
            <button className={`relative`} onClick={() => setMenu(false)}>
              <CloseIcon/>
            </button>
            :
            <button className={`relative`} onClick={() => setMenu(true)}>
              <MenuIcon/>
            </button>
          }
        </nav>
      </div>

      <div
        className={`${
            menu ? "-translate-x-[100vw]" : "translate-x-[0vw]"
        } top-15 left-0 ml-[100vw] fixed z-40 w-screen h-screen bg-[#0B0B0B] transition ease-in-out duration-[700ms] flex-col-centered`}
      >
        <div className='w-full flex flex-col justify-between items-center text-white text-xl mt-2'>
          {links.map(([title, path]) => (
            <Link className={`w-[95vw] flex justify-center rounded-xl mb-2 bg-black ${active === path ? "text-white": "text-[#939393]"} py-3`} key={title} href={path} onClick={() => setMenu(false)}>
              {title}
            </Link>
          ))}
        </div>
      </div>


    </div>
  )
}

export default Navbar