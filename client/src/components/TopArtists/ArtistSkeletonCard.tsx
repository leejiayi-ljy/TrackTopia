import React from 'react'

import { Card } from '../ui/card'
import { Skeleton } from '../ui/skeleton'

const ArtistSkeletonCard: React.FC = () => {
  return (
    <Card>
      <div className='flex items-center space-x-4 gap-4'>
        <Skeleton className='h-24 w-24' />
        <div className='space-y-2'>
          <Skeleton className='h-6 w-[250px]' />
          <Skeleton className='h-6 w-[200px]' />
        </div>
      </div>
    </Card>
  )
}

export default ArtistSkeletonCard
