import React from 'react'
import { Button } from '../ui/button'

import SpotifyIcon from '../../assets/Spotify_Icon_RGB_Green.png'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card'

export default function Login(): JSX.Element {
  const handleLoginClick = (): void => {
    window.location.href = 'http://localhost:3001/login'
  }

  return (
    <div
      className='md:container md:mx-auto flex justify-center items-center'
      style={{ height: '100vh' }}
    >
      <Card className='justify-center'>
        <CardHeader>
          <CardTitle>Tracktopia</CardTitle>
          <CardDescription>
            Where your Fav Tracks meet your New Favs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={handleLoginClick}
            className='login-btn w-full justify-between'
          >
            Login with Spotify
            <img src={SpotifyIcon} alt='Spotify Icon' width={25} height={25} />
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
