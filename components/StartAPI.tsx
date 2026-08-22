'use client'
import { useEffect } from 'react'

export default function StartApi() {
  useEffect(() => {
    fetch('https://nhl-ml-predictor.onrender.com/docs', { mode: 'no-cors' })
      .catch(() => {})   // waking it up is the only goal
  }, [])
  return null
}