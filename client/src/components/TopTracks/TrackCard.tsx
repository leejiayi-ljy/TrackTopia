import React, { useState } from 'react'
import axios, { AxiosResponse } from 'axios'

import TrackAccordian from './TrackAccordian'
import { Card } from '../ui/card'
import { Dialog, DialogContent, DialogTrigger } from '../ui/dialog'

import { TopTrackItem } from '../Dashboard/types'
import { TrackFeaturesData } from './types'
import { getTrackFeaturesRoute } from '../../constants/routes'

interface TrackProps {
  accessToken: string | null
  track: TopTrackItem | null
  index: number | null
}

const TrackCard: React.FC<TrackProps> = ({
  accessToken,
  track: { id, name, artists, album, external_urls },
  index,
}) => {
  const trackId = id
  const artistId = artists.map((artist) => artist.id).join(',')
  const artistNames = artists.map((artist) => artist.name).join(', ')
  const albumURL = album.images[0].url
  const trackName = name
  // const linkToSpotify = external_urls.spotify

  const [trackFeatures, setTrackFeatures] = useState<TrackFeaturesData>({
    id: null,
    acousticness: 0,
    danceability: 0,
    energy: 0,
    instrumentalness: 0,
    key: 0,
    liveness: 0,
    loudness: 0,
    speechiness: 0,
    tempo: 0,
    valence: 0,
  })

  const handleTrackClick = () => {
    const getTrackAudioFeatures = async (): Promise<void> => {
      try {
        const response: AxiosResponse<TrackFeaturesData> = await axios.post(
          getTrackFeaturesRoute,
          {
            trackId,
            accessToken,
          }
        )
        if (response.status !== 200)
          return console.error('Failed to get track features.')
        const { ...trackFeatures } = response.data
        setTrackFeatures(trackFeatures)
      } catch (err) {
        console.error('Error fetching track features:', err)
      }
    }
    getTrackAudioFeatures()
  }

  return (
    <Dialog>
      <DialogTrigger>
        <Card
          className={`p-2 cursor-pointer h-full duration-200 transition hover:ease-in hover:bg-accent`}
          onClick={() => handleTrackClick()}
        >
          <div key={index} className='flex items-center'>
            <div className='flex justify-between items-center w-full'>
              <div className='flex justify-center items-center'>
                <img
                  className='rounded relative w-16 h-16'
                  src={albumURL}
                  alt='album image'
                />
                <div className='ml-4'>
                  <p className='text-sm text-start font-medium'>{trackName}</p>
                  <p className='text-xs mt-1 text-start'>{artistNames}</p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </DialogTrigger>
      <DialogContent className='bg-[#121212]'>
        <iframe
          style={{ borderRadius: '12px' }}
          src={`https://open.spotify.com/embed/track/${trackId}?utm_source=generator&theme=0`}
          width='100%'
          height='152'
          allowFullScreen={true}
          allow='autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture'
          loading='lazy'
        ></iframe>

        <TrackAccordian
          trackFeatures={trackFeatures}
          artistId={artistId}
          trackId={trackId}
          accessToken={accessToken}
        />
      </DialogContent>
    </Dialog>
  )
}

export default TrackCard
