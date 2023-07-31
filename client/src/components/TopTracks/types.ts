import { ChartDataset } from 'chart.js'

export interface TrackItem {
  trackId: string | null
  artistId: string | null
  artists: string | null
  albumURL: string | null
  name: string | null
  linkToSpotify: string | null
}

export interface TrackFeaturesData {
  id: string
  acousticness: number
  danceability: number
  energy: number
  instrumentalness: number
  key: number
  liveness: number
  loudness: number
  speechiness: number
  tempo: number
  valence: number
}

interface RadarDataset extends ChartDataset<'radar'> {
  label: string
  data: number[]
  borderColor: string
  backgroundColor: string
  borderWidth: number
  tension: number
  pointRadius: number
}

export interface RadarData {
  labels: string[]
  datasets: RadarDataset[]
}

export interface RadarOptions {
  scales: {
    r: {
      grid: {
        circular: boolean
        color: string
      }
      angleLines: {
        display: boolean
      }
      min: number
      max: number
      ticks: {
        font: {
          size: number
        }
        color: string
        backdropColor: string
        stepSize: number
      }
    }
  }
  responsive: boolean
  plugins: {
    legend: {
      display: boolean
    }
    tooltip: {
      backgroundColor: string
      bodyFont: {
        size: number
      }
    }
  }
}

export interface RecoTrackItem {
  trackId: string | null
  artistId: string | null
  artists: string | null
  albumURL: string | null
  name: string | null
  linkToSpotify: string | null
  audioPreview: string | null
}

export interface RecoTracks {
  tracks: RecoTrack[]
}

export interface RecoTrack {
  album: {
    album_type: string
    total_tracks: number
    available_markets: string[]
    external_urls: {
      spotify: string
    }
    href: string
    id: string
    images: {
      url: string
      height: number
      width: number
    }[]
    name: string
    release_date: string
    release_date_precision: string
    restrictions: {
      reason: string
    }
    type: string
    uri: string
    copyrights: {
      text: string
      type: string
    }[]
    external_ids: {
      isrc: string
      ean: string
      upc: string
    }
    genres: string[]
    label: string
    popularity: number
    album_group: string
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
  }
  artists: {
    external_urls: {
      spotify: string
    }
    followers: {
      href: string
      total: number
    }
    genres: string[]
    href: string
    id: string
    images: {
      url: string
      height: number
      width: number
    }[]
    name: string
    popularity: number
    type: string
    uri: string
  }[]
  available_markets: string[]
  disc_number: number
  duration_ms: number
  explicit: boolean
  external_ids: {
    isrc: string
    ean: string
    upc: string
  }
  external_urls: {
    spotify: string
  }
  href: string
  id: string
  is_playable: boolean
  linked_from: {}
  restrictions: {
    reason: string
  }
  name: string
  popularity: number
  preview_url: string
  track_number: number
  type: string
  uri: string
  is_local: boolean
}
