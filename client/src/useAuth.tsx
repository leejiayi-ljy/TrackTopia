import { useEffect, useState } from 'react'
import axios, { AxiosResponse } from 'axios'
import { callbackRoute, refreshTokenRoute } from './constants/routes'

interface AuthData {
  accessToken: string
  refreshToken: string
  expiresIn: number
}

export default function useAuth(code: string): {
  accessToken: string | null
  logout: () => void
} {
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [refreshToken, setRefreshToken] = useState<string | null>(null)
  const [expiresIn, setExpiresIn] = useState<number | null>(null)

  useEffect(() => {
    if (code) {
      fetchAccessToken(code)
      window.history.pushState({}, document.title, '/')
    } else {
      const storedAccessToken = localStorage.getItem('accessToken')
      const storedRefreshToken = localStorage.getItem('refreshToken')
      const storedExpiresIn = localStorage.getItem('expiresIn')

      // check validity
      if (storedAccessToken && storedRefreshToken && storedExpiresIn) {
        const expiresInMs = parseInt(storedExpiresIn) - Date.now()
        if (expiresInMs > 0) {
          setAccessToken(storedAccessToken)
          setRefreshToken(storedRefreshToken)
          setExpiresIn(expiresIn)
        }
      }
    }
  }, [code])

  useEffect(() => {
    if (!refreshToken || !expiresIn) return

    const interval = setInterval(() => {
      refreshAccessToken(refreshToken)
    }, (expiresIn - 60) * 1000)

    return () => clearInterval(interval)
  }, [refreshToken, expiresIn])

  const fetchAccessToken = async (code: string): Promise<void> => {
    try {
      const response: AxiosResponse<AuthData> = await axios.post(
        callbackRoute,
        { code }
      )

      if (response.status !== 200)
        return console.error('Failed to fetch access token.')

      const { accessToken, refreshToken, expiresIn } = response.data

      setAccessToken(accessToken)
      setRefreshToken(refreshToken)
      setExpiresIn(expiresIn)

      localStorage.setItem('accessToken', accessToken)
      localStorage.setItem('refreshToken', refreshToken)
      localStorage.setItem(
        'expiresIn',
        (Date.now() + expiresIn * 1000).toString()
      )
    } catch (err) {
      console.error('Error fetching access token:', err)
      window.location.href = '/'
    }
  }

  const refreshAccessToken = async (refreshToken: string): Promise<void> => {
    try {
      const response: AxiosResponse<AuthData> = await axios.post(
        refreshTokenRoute,
        { refreshToken }
      )

      if (response.status !== 200)
        return console.error('Failed to refresh access token.')

      const { accessToken, expiresIn } = response.data

      setAccessToken(accessToken)
      setExpiresIn(expiresIn)

      localStorage.setItem('accessToken', accessToken)
      localStorage.setItem(
        'expiresIn',
        (Date.now() + expiresIn * 1000).toString()
      )
    } catch (err) {
      console.error('Error resetting refresh token:', err)
      window.location.href = '/'
    }
  }

  const logout = (): void => {
    setAccessToken(null)
    setRefreshToken(null)
    setExpiresIn(null)

    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('expiresIn')

    window.location.href = '/'
  }

  return { accessToken, logout }
}
