import React, { useState, useEffect } from 'react'

import TrackCard from './TrackCard'
import TrackSkeletonCard from './TrackSkeletonCard'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'

import { TopTrackItem } from '../Dashboard/types'

interface TopTrackProps {
  accessToken: string | null
  topTrackList: TopTrackItem[]
  getTopTracks: (timeRange?: string, limit?: number) => Promise<void>
  isLoading: boolean | false
}

const TopTracks: React.FC<TopTrackProps> = ({
  accessToken,
  topTrackList,
  getTopTracks,
  isLoading,
}) => {
  const [timeRange, setTimeRange] = useState<string | null>('short_term')
  const [limit, setLimit] = useState<number | null>(5)

  useEffect(() => {
    getTopTracks(timeRange, limit)
  }, [timeRange, limit])

  return (
    <div className='md:mx-auto flex justify-center items-center'>
      <Card className='flex flex-col w-full border-none'>
        <CardHeader className='flex flex-row justify-between items-center flex-wrap '>
          <div>
            <CardTitle className='flex flex-row items-center'>
              Top Tracks
            </CardTitle>
          </div>

          <div className='flex items-center justify-center'>
            <Select onValueChange={(val) => setLimit(Number(val))}>
              <SelectTrigger className='w-28 mr-2 '>
                <SelectValue placeholder='Top 5' />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value='5'>Top 5</SelectItem>
                  <SelectItem value='10'>Top 10</SelectItem>
                  <SelectItem value='25'>Top 25</SelectItem>
                  <SelectItem value='50'>Top 50</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <Select onValueChange={(val) => setTimeRange(val)}>
              <SelectTrigger className='w-40'>
                <SelectValue placeholder='Last 4 weeks' />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value='short_term'>Last 4 weeks</SelectItem>
                  <SelectItem value='medium_term'>Last 6 months</SelectItem>
                  <SelectItem value='long_term'>Last few years</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>

        <CardContent className='grid gap-2'>
          {isLoading || topTrackList.length === 0
            ? Array.from({ length: limit }, (_, index) => (
                <TrackSkeletonCard key={index} />
              ))
            : topTrackList.map((item, index) => (
                <TrackCard
                  accessToken={accessToken}
                  key={index}
                  track={item}
                  index={index}
                />
              ))}
        </CardContent>
      </Card>
    </div>
  )
}

export default TopTracks
