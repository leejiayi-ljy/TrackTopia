import React from 'react'

import { Card } from '../ui/card'
import { Skeleton } from '../ui/skeleton'

const ArtistSkeletonCard: React.FC = () => {
  return (
    <Card className='flex justify-between items-center w-fit p-4 m-2 w-128'>
      <div className='flex flex-col justify-center items-center'>
        <Skeleton className='aspect-square mb-2 rounded-lg w-52 h-52' />
        <div>
          <Skeleton className='h-6 w-[100px]' />
        </div>
      </div>
    </Card>
  )
}

export default ArtistSkeletonCard
