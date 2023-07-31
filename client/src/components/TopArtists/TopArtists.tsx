import React, { useState, useEffect } from 'react'

import ArtistCard from './ArtistCard'
import ArtistSkeletonCard from './ArtistSkeletonCard'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'

import { TopArtistItem } from '../Dashboard/types'

interface TopArtistsProps {
  topArtistList: TopArtistItem[]
  getTopArtists: (timeRange?: string, limit?: number) => Promise<void>
  isLoading: boolean | false
}

const TopArtists: React.FC<TopArtistsProps> = ({
  topArtistList,
  getTopArtists,
  isLoading,
}) => {
  const [artistLimit, setArtistLimit] = useState<number | null>(10)

  const [artistTimeRange, setArtistTimeRange] = useState<string | null>(
    'short_term'
  )

  useEffect(() => {
    getTopArtists(artistTimeRange, artistLimit)
  }, [artistTimeRange, artistLimit])

  return (
    <div className='md:mx-auto flex justify-center items-center'>
      <Card className='flex flex-col w-full'>
        <CardHeader className='flex flex-row justify-between items-center flex-wrap '>
          <div>
            <CardTitle className='flex flex-row items-center'>
              Top Artists
            </CardTitle>
          </div>

          <div className='flex items-center justify-center'>
            <Select onValueChange={(val) => setArtistLimit(Number(val))}>
              <SelectTrigger className='w-28 mx-2 '>
                <SelectValue placeholder='Top 10' />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value='5'>Top 5</SelectItem>
                  <SelectItem value='10'>Top 10</SelectItem>
                  <SelectItem value='20'>Top 20</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <Select onValueChange={(val) => setArtistTimeRange(val)}>
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

        <CardContent className='flex flex-row flex-wrap'>
          {isLoading || topArtistList.length === 0
            ? Array.from({ length: artistLimit }, (_, index) => (
                <ArtistSkeletonCard key={index} />
              ))
            : topArtistList.map((item, index) => (
                <ArtistCard key={index} artist={item} index={index} />
              ))}
        </CardContent>
      </Card>
    </div>
  )
}

export default TopArtists
