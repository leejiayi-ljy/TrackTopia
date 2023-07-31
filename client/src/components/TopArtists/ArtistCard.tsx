import React from 'react'

import { Card } from '../ui/card'
import { TopArtistItem } from '../Dashboard/types'

interface ArtistCardProps {
  artist: TopArtistItem | null
  index: number | null
}

const ArtistCard: React.FC<ArtistCardProps> = ({ artist, index }) => {
  // const artistId = artist.id
  const artistName = artist.name
  const artistImg = artist.images[0].url

  return (
    <Card className='flex justify-between items-center w-fit p-4 m-2 w-128  duration-200 transition hover:ease-in hover:bg-accent'>
      <div className='flex flex-col justify-center items-center'>
        <img
          className='object-cover aspect-square mb-2 rounded-lg'
          src={artistImg}
          alt='album image'
          width='200'
          height='200'
        />
        <div>
          <p className='font-medium'>{artistName}</p>
        </div>
      </div>
    </Card>
  )
}

export default ArtistCard
