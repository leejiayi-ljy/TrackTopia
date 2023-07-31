import React from 'react'

import { Card } from '../ui/card'
import { Skeleton } from '../ui/skeleton'

const TrackSkeletonCard: React.FC = () => {
  return (
    <Card className={`p-2 h-full`}>
      <div className='flex items-center space-x-4'>
        <Skeleton className='h-16 w-16' />
        <div className='space-y-2'>
          <Skeleton className='h-4 w-[250px]' />
          <Skeleton className='h-4 w-[200px]' />
        </div>
      </div>
    </Card>
  )
}

export default TrackSkeletonCard
