import React, { useEffect, useState } from 'react'
import axios, { AxiosResponse } from 'axios'
import useAuth from '../../useAuth'

import Nav from '../MainNav/MainNav'
import TopTracks from '../TopTracks/TopTracks'
import TopArtists from '../TopArtists/TopArtists'
import SearchTrack from '../SearchTrack/SearchTrack'

import {
  getProfileRoute,
  getTopTracksRoute,
  getTopArtistsRoute,
} from '../../constants/routes'

import {
  DashboardProps,
  User,
  ProfileData,
  TopTrackItem,
  TopArtistItem,
  TopTrackResponse,
  TopArtistResponse,
} from './types'

import { Toaster } from 'react-hot-toast'

export default function Dashboard({ code }: DashboardProps): JSX.Element {
  const { accessToken, logout } = useAuth(code)

  const [selection, setSelection] = useState<string | null>('Tracks')
  const [isLoading, setIsLoading] = useState<boolean | null>(false)

  const [user, setUser] = useState<User>({
    userId: null,
    userName: null,
    userProfilePic: null,
  })

  const [topTrackList, setTopTrackList] = useState<TopTrackItem[]>([])
  const [topArtistList, setTopArtistList] = useState<TopArtistItem[]>([])

  useEffect(() => {
    const getProfile = async (): Promise<void> => {
      try {
        const response: AxiosResponse<ProfileData> = await axios.post(
          getProfileRoute,
          { accessToken }
        )
        if (response.status !== 200)
          return console.error('Failed to fetch profile.')

        const { id, displayName, images } = response.data

        setUser({
          userId: id,
          userName: displayName,
          userProfilePic: images[0]?.url || null,
        })
      } catch (err) {
        console.error('Error fetching profile:', err)
      }
    }

    if (!accessToken) return
    getProfile()
  }, [accessToken])

  const getTopTracks = async (
    timeRange?: string,
    limit?: number
  ): Promise<void> => {
    try {
      setIsLoading(true)
      const response: AxiosResponse<TopTrackResponse> = await axios.post(
        getTopTracksRoute,
        {
          type: 'tracks',
          timeRange: timeRange,
          limit: limit,
          offset: 0,
          accessToken: accessToken,
        }
      )
      if (response.status !== 200)
        return console.error('Failed to get top track.')

      const { itemList } = response.data
      setTopTrackList(itemList)
    } catch (err) {
      console.error('Error fetching top tracks:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const getTopArtists = async (
    timeRange?: string,
    limit?: number
  ): Promise<void> => {
    try {
      setIsLoading(true)
      const response: AxiosResponse<TopArtistResponse> = await axios.post(
        getTopArtistsRoute,
        {
          type: 'artists',
          timeRange: timeRange,
          limit: limit,
          offset: 0,
          accessToken: accessToken,
        }
      )
      if (response.status !== 200)
        return console.error('Failed to get top artists.')

      const { itemList } = response.data
      setTopArtistList(itemList)
    } catch (err) {
      console.error('Error fetching top artists:', err)
    } finally {
      setIsLoading(false)
    }
  }

  if (!accessToken) return

  return (
    <div>
      <Toaster />
      <Nav
        {...user}
        accessToken={accessToken}
        selection={selection}
        setSelection={setSelection}
        logout={logout}
        setIsLoading={setIsLoading}
      />
      {selection === 'Tracks' && (
        <TopTracks
          accessToken={accessToken}
          topTrackList={topTrackList}
          getTopTracks={getTopTracks}
          isLoading={isLoading}
        />
      )}

      {selection === 'Artists' && (
        <TopArtists
          topArtistList={topArtistList}
          getTopArtists={getTopArtists}
          isLoading={isLoading}
        />
      )}
      {selection === 'Search' && <SearchTrack accessToken={accessToken} />}
    </div>
  )
}
