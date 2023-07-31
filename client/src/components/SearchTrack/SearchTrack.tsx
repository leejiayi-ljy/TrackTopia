import React, { useState, useRef } from 'react'
import axios, { AxiosResponse } from 'axios'

import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Card, CardContent, CardHeader } from '../ui/card'
import TrackCard from '../TopTracks/TrackCard'
import TrackSkeletonCard from '../TopTracks/TrackSkeletonCard'

import { SearchTrackResponse } from './types'
import { TopTrackItem } from '../Dashboard/types'
import { searchTrackRoute } from '../../constants/routes'

import 'bootstrap-icons/font/bootstrap-icons.css'

interface SearchTrackProps {
  accessToken: string | null
}

const SearchTrack: React.FC<SearchTrackProps> = ({ accessToken }) => {
  const searchInputRef = useRef<HTMLInputElement>(null)

  const [isSearching, setIsSearching] = useState<boolean | null>(false)

  const [searchTrackList, setSearchTrackList] = useState<TopTrackItem[]>([])

  const handleSearch = () => {
    const getSearchTracks = async (searchTerm: string): Promise<void> => {
      try {
        setIsSearching(true)
        const response: AxiosResponse<SearchTrackResponse> = await axios.post(
          searchTrackRoute,
          {
            accessToken: accessToken,
            query: searchTerm,
          }
        )

        if (response.status !== 200)
          return console.error('Failed to fetch search results.')

        const itemList = response.data.itemList
        setSearchTrackList(itemList)
      } catch (err) {
        console.error('Error fetching search results:', err)
      } finally {
        setIsSearching(false)
      }
    }

    if (searchInputRef.current) {
      const searchTerm = searchInputRef.current.value
      if (searchTerm.length === 0) return
      getSearchTracks(searchTerm)
    }
  }

  return (
    <div className='md:mx-auto flex justify-start items-center'>
      <Card className='flex flex-col w-full border-none'>
        <CardHeader className='flex flex-row justify-between items-center flex-wrap '>
          <div className='flex w-full max-w-sm items-start space-x-2'>
            <Input
              type='text'
              placeholder='Search Tracks'
              ref={searchInputRef}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSearch()
              }}
            />
            <Button onClick={() => handleSearch()}>
              <i className='bi bi-search'></i>
            </Button>
          </div>
        </CardHeader>

        <CardContent className='grid gap-2'>
          {isSearching
            ? Array.from({ length: 20 }, (_, index) => (
                <TrackSkeletonCard key={index} />
              ))
            : searchTrackList.map((item, index) => (
                <TrackCard
                  key={index}
                  accessToken={accessToken}
                  track={item}
                  index={index}
                />
              ))}
        </CardContent>
      </Card>
    </div>
  )
}

export default SearchTrack
