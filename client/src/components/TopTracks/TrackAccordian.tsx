import React, { useState } from 'react'
import axios, { AxiosResponse } from 'axios'

import RecoTrackCard from './RecoTrackCard'
import RecoTrackSkeletonCard from './RecoTrackSkeletonCard'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../ui/accordion'

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip'

import { Radar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
} from 'chart.js'
import 'chart.js/auto'

import {
  RadarData,
  RadarOptions,
  TrackFeaturesData,
  RecoTrack,
  RecoTracks,
} from './types'
import { getRecommendationsRoute } from '../../constants/routes'

interface TrackAccordianProps {
  trackFeatures: TrackFeaturesData
  artistId: string | null
  trackId: string | null
  accessToken: string | null
}

const TrackAccordian: React.FC<TrackAccordianProps> = ({
  trackFeatures,
  artistId,
  trackId,
  accessToken,
}) => {
  const [isTrackRecoLoading, setIsTrackRecoLoading] = useState<boolean | null>(
    false
  )
  const [recoTracks, setRecoTracks] = useState<RecoTrack[]>([])
  const [isPlayingTrackId, setIsPlayingTrackId] = useState<string | null>(null)

  ChartJS.register(RadialLinearScale, PointElement, LineElement)
  const data: RadarData = {
    labels: [
      'acousticness',
      'danceability',
      'energy',
      'instrumentalness',
      'speechiness',
      'liveness',
      'valence',
    ],
    datasets: [
      {
        label: '',
        data: [
          trackFeatures.acousticness,
          trackFeatures.danceability,
          trackFeatures.energy,
          trackFeatures.instrumentalness,
          trackFeatures.speechiness,
          trackFeatures.liveness,
          trackFeatures.valence,
        ],
        borderColor: 'rgb(30, 215, 96)',
        borderWidth: 2,
        backgroundColor: 'rgba(30, 215, 96, 0.4)',
        tension: 0.4,
        pointRadius: 1.5,
      },
    ],
  }

  const options: RadarOptions = {
    scales: {
      r: {
        grid: {
          circular: false,
          color: 'rgba(255, 255, 255, 0.2)',
        },
        angleLines: {
          display: false,
        },
        min: 0,
        max: 1,
        ticks: {
          font: {
            size: 10,
          },
          color: 'rgba(255, 255, 255, 0.7)',
          backdropColor: 'transparent',
          stepSize: 0.5,
        },
      },
    },
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        bodyFont: {
          size: 14,
        },
      },
    },
  }

  const handleTrackRecoClick = () => {
    setIsTrackRecoLoading(true)
    setRecoTracks([])
    const getTrackRecommendations = async (): Promise<void> => {
      try {
        const response: AxiosResponse<RecoTracks> = await axios.post(
          getRecommendationsRoute,
          {
            limit: 50,
            artistIds: artistId,
            trackId: trackId,
            trackFeatures,
            accessToken,
          }
        )
        if (response.status !== 200)
          return console.error('Failed to get recommended tracks.')

        const { tracks } = response.data
        setRecoTracks(tracks)
      } catch (err) {
        console.error('Error fetching track recommendations:', err)
      } finally {
        setIsTrackRecoLoading(false)
      }
    }
    getTrackRecommendations()
  }

  return (
    <Accordion type='single' collapsible>
      <AccordionItem value='statistics-tab'>
        <AccordionTrigger>View Stats</AccordionTrigger>
        <AccordionContent className='pb-4 pt-0 flex flex-row flex-wrap justify-around items-center'>
          <div className='m-4 w-64 h-64' id='radar-wrapper'>
            <Radar data={data} options={options} />
          </div>
          <div className='text-[#ffffff85]	text-xs text-start'>
            <TooltipProvider>
              <ul>
                <li>
                  <Tooltip>
                    <TooltipTrigger>
                      <span className='hover:text-white cursor-default'>
                        Acousticness:
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        A confidence measure from 0.0 to 1.0 of whether the
                        track is acoustic.
                      </p>
                    </TooltipContent>
                  </Tooltip>{' '}
                  {trackFeatures.acousticness}
                </li>
                <li>
                  <Tooltip>
                    <TooltipTrigger>
                      <span className='hover:text-white cursor-default'>
                        Danceability:
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        A measure from 0.0 to 1.0 on how suitable a track is for
                        dancing.
                      </p>
                    </TooltipContent>
                  </Tooltip>{' '}
                  {trackFeatures.danceability}
                </li>
                <li>
                  <Tooltip>
                    <TooltipTrigger>
                      <span className='hover:text-white cursor-default'>
                        Energy:
                      </span>
                    </TooltipTrigger>

                    <TooltipContent>
                      <p>
                        A measure from 0.0 to 1.0 and represents a perceptual
                        measure of intensity and activity.
                      </p>
                    </TooltipContent>
                  </Tooltip>{' '}
                  {trackFeatures.energy}
                </li>
                <li>
                  <Tooltip>
                    <TooltipTrigger>
                      <span className='hover:text-white cursor-default'>
                        Instrumentalness:
                      </span>
                    </TooltipTrigger>

                    <TooltipContent>
                      <p>
                        A measure from 0.0 to 1.0 that predicts whether a track
                        contains no vocals.
                      </p>
                    </TooltipContent>
                  </Tooltip>{' '}
                  {trackFeatures.instrumentalness}
                </li>
                <li>
                  <Tooltip>
                    <TooltipTrigger>
                      <span className='hover:text-white cursor-default'>
                        Key:
                      </span>
                    </TooltipTrigger>

                    <TooltipContent>
                      <p>The key the track is in.</p>
                    </TooltipContent>
                  </Tooltip>{' '}
                  {trackFeatures.key}
                </li>
                <li>
                  <Tooltip>
                    <TooltipTrigger>
                      <span className='hover:text-white cursor-default'>
                        Liveness:
                      </span>
                    </TooltipTrigger>

                    <TooltipContent>
                      <p>
                        Detects the presence of an audience in the recording.
                      </p>
                    </TooltipContent>
                  </Tooltip>{' '}
                  {trackFeatures.liveness}
                </li>
                <li>
                  <Tooltip>
                    <TooltipTrigger>
                      <span className='hover:text-white cursor-default'>
                        Loudness:
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>The overall loudness of a track in decibels (dB).</p>
                    </TooltipContent>
                  </Tooltip>{' '}
                  {trackFeatures.loudness}
                </li>
                <li>
                  <Tooltip>
                    <TooltipTrigger>
                      <span className='hover:text-white cursor-default'>
                        Speechiness:
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Detects the presence of spoken words in a track.</p>
                    </TooltipContent>
                  </Tooltip>{' '}
                  {trackFeatures.speechiness}
                </li>
                <li>
                  <Tooltip>
                    <TooltipTrigger>
                      <span className='hover:text-white cursor-default'>
                        Tempo:
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        The overall estimated tempo of a track in beats per
                        minute (BPM).
                      </p>
                    </TooltipContent>
                  </Tooltip>{' '}
                  {trackFeatures.tempo}
                </li>
                <li>
                  <Tooltip>
                    <TooltipTrigger>
                      <span className='hover:text-white cursor-default'>
                        Valence:
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        A measure from 0.0 to 1.0 describing the musical
                        positiveness conveyed by a track.
                      </p>
                    </TooltipContent>
                  </Tooltip>{' '}
                  {trackFeatures.valence}
                </li>
              </ul>
            </TooltipProvider>
          </div>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value='recommendations-tab'>
        <AccordionTrigger
          onClick={(e) => {
            e.stopPropagation()
            handleTrackRecoClick()
          }}
        >
          Find Songs like this
        </AccordionTrigger>
        <AccordionContent className='pb-4 pt-0 flex flex-row flex-wrap justify-around items-center max-h-[50vh] overflow-y-auto'>
          {isTrackRecoLoading
            ? Array.from({ length: 10 }, (_, index) => (
                <RecoTrackSkeletonCard key={index} />
              ))
            : recoTracks.map((item, index) => (
                <RecoTrackCard
                  key={index}
                  index={index}
                  accessToken={accessToken}
                  track={item}
                  isPlayingTrackId={isPlayingTrackId}
                  setIsPlayingTrackId={setIsPlayingTrackId}
                />
              ))}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}

export default TrackAccordian
