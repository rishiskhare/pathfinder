'use client'

import dynamic from 'next/dynamic'

const Pathfinder = dynamic(() => import('@/components/pathfinder'), { ssr: false })

export default function Home() {
  return <Pathfinder />
}
