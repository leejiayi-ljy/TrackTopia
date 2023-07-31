import React from 'react'
import axios, { AxiosResponse } from 'axios'

import { Card } from '../ui/card'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip'

import { TopTrackItem } from '../Dashboard/types'
import { saveTrackRoute } from '../../constants/routes'

import toast from 'react-hot-toast'
import 'bootstrap-icons/font/bootstrap-icons.css'

interface RecoTrackCardProps {
  accessToken: string | null
  track: TopTrackItem | null
  index: number | null
  isPlayingTrackId: string | null
  setIsPlayingTrackId: React.Dispatch<React.SetStateAction<string | null>>
}

const RecoTrackCard: React.FC<RecoTrackCardProps> = ({
  accessToken,
  track: { id, name, artists, album, external_urls, preview_url },
  index,
  isPlayingTrackId,
  setIsPlayingTrackId,
}) => {
  const trackId = id
  // const artistId = artists.map((artist) => artist.id).join(',')
  const artistNames = artists.map((artist) => artist.name).join(', ')
  const albumURL = album.images[0].url
  const linkToSpotify = external_urls.spotify
  const audioPreview = preview_url

  const toggleAudio = () => {
    const audioElement = document.getElementById(
      'audioPreview-' + trackId
    ) as HTMLAudioElement

    // pause current track
    if (isPlayingTrackId === trackId) {
      audioElement.pause()
      setIsPlayingTrackId(null)
    } else {
      // Pause prev playing track
      const prevPlayingAudioElement = document.getElementById(
        'audioPreview-' + isPlayingTrackId
      ) as HTMLAudioElement

      if (prevPlayingAudioElement) {
        prevPlayingAudioElement.pause()
      }
      // Play new track
      setIsPlayingTrackId(trackId)
      audioElement.play()
    }
  }

  const handleOnRecoTrackClick = () => {
    window.open(linkToSpotify, '_blank')
  }

  const handleSaveTrackClick = () => {
    const saveTrack = async (): Promise<void> => {
      try {
        const response: AxiosResponse<null> = await axios.post(saveTrackRoute, {
          trackId: trackId,
          accessToken,
        })
        if (response.status !== 200) {
          toast.error('Failed to save track!')
          return
        }
        toast.success('Track saved to library.')
      } catch {
        toast.error('Failed to save track!')
      }
    }
    saveTrack()
  }

  return (
    <Card
      className={`py-2 px-3 cursor-pointer h-full w-full bg-[#121212] text-white border-0`}
      onClick={() => handleOnRecoTrackClick()}
    >
      <div key={index} className='flex items-center'>
        <div className='flex justify-between items-center w-full'>
          <div className='flex justify-between items-center w-full'>
            <div className='flex items-center justify-start'>
              <img
                className='rounded relative w-14 h-14'
                src={albumURL}
                alt='album image'
              />
              <div className='ml-4'>
                <p className='text-sm text-start font-medium'>{name}</p>
                <p className='text-xs mt-1 text-start text-gray-300	'>
                  {artistNames}
                </p>
              </div>
            </div>
            <TooltipProvider>
              <div className='flex items-center p-3 gap-2'>
                {audioPreview && (
                  <Tooltip>
                    <TooltipTrigger>
                      <div
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleAudio()
                        }}
                      >
                        <i
                          className={`bi ${
                            isPlayingTrackId === trackId
                              ? 'bi-pause'
                              : 'bi-play-fill'
                          } text-xl text-gray-300 hover:text-white`}
                        ></i>
                        <audio
                          id={`audioPreview-${trackId}`}
                          src={audioPreview}
                          preload='auto'
                          onEnded={() => setIsPlayingTrackId(null)}
                        />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Preview Song</p>
                    </TooltipContent>
                  </Tooltip>
                )}

                <Tooltip>
                  <TooltipTrigger>
                    <a
                      onClick={(e) => {
                        e.stopPropagation()
                        handleSaveTrackClick()
                      }}
                    >
                      <i className='bi bi-plus-lg text-lg text-gray-300	hover:text-white'></i>
                    </a>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Save to Library</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </TooltipProvider>
          </div>
        </div>
      </div>
    </Card>
  )
}

export default RecoTrackCard
