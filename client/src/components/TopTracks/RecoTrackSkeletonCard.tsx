import React from 'react'

import { Card } from '../ui/card'
import { Skeleton } from '../ui/skeleton'

const RecoTrackSkeletonCard: React.FC = () => {
  return (
    <Card
      className={`py-2 px-3 cursor-pointer h-full w-full bg-[#121212] border-0`}
    >
      <div className='flex items-center space-x-4'>
        <Skeleton className='w-14 h-14 bg-[#353535]' />
        <div className='space-y-2'>
          <Skeleton className='h-4 w-[200px] bg-[#353535]' />
          <Skeleton className='h-4 w-[150px] bg-[#353535]' />
        </div>
      </div>
    </Card>
  )
}

export default RecoTrackSkeletonCard
