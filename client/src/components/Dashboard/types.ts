export interface DashboardProps {
  code: string
}

// User-related
export interface User {
  userId: string | null
  userName: string | null
  userProfilePic: string | null
}

export interface ProfileData {
  id: string
  displayName: string
  images: { url: string }[]
}

export interface TopArtistResponse {
  itemList: TopArtistItem[]
}

// Artist Related
export interface TopArtistItem {
  external_urls: {
    spotify: string
  }
  followers: {
    href: string | null
    total: number
  }
  genres: string[]
  href: string
  id: string
  images: {
    height: number
    url: string
    width: number
  }[]
  name: string
  popularity: number
  type: string
  uri: string
}

export interface TopTrackResponse {
  itemList: TopTrackItem[]
}

// Track-related
export interface TopTrackItem {
  album: AlbumData
  artists: {
    external_urls: {
      spotify: string
    }
    href: string
    id: string
    name: string
    type: string
    uri: string
  }[]
  available_markets: string[]
  disc_number: number
  duration_ms: number
  explicit: boolean
  external_ids: {
    isrc: string
  }
  external_urls: {
    spotify: string
  }
  href: string
  id: string
  is_local: boolean
  name: string
  popularity: number
  preview_url: string
  track_number: number
  type: string
  uri: string
}

interface AlbumData {
  album_type: string
  artists: {
    external_urls: {
      spotify: string
    }
    href: string
    id: string
    name: string
    type: string
    uri: string
  }[]
  available_markets: string[]
  external_urls: {
    spotify: string
  }
  href: string
  id: string
  images: {
    height: number
    url: string
    width: number
  }[]
  name: string
  release_date: string
  release_date_precision: string
  total_tracks: number
  type: string
  uri: string
}
