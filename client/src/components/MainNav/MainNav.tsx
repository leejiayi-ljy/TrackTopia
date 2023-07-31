import React from 'react'
import UserNav from '../UserNav/UserNav'
import TrackTopiaLogo from '../../assets/TrackTopia.png'

interface NavProps {
  userId: string | null
  userName: string | null
  userProfilePic: string | null
  accessToken: string | null
  selection: string | null
  setSelection: React.Dispatch<React.SetStateAction<string | null>>
  setIsLoading: React.Dispatch<React.SetStateAction<boolean | false>>
  logout: () => void
}

const Nav: React.FC<NavProps> = ({
  userId,
  userName,
  userProfilePic,
  logout,
  selection,
  setSelection,
  setIsLoading,
}) => {
  const toggleSelection = (key: string | null): void => {
    if (selection === key) return
    setIsLoading(true)
    setSelection(key)
  }

  return (
    <div className='border-b'>
      <div className='flex h-16 items-center px-4 justify-between'>
        <nav className={'flex items-center space-x-4 lg:space-x-6'}>
          <img src={TrackTopiaLogo} alt='TrackTopia Logo' width={68} />
          <div
            className={`${
              selection !== 'Tracks' ? 'text-muted-foreground' : ''
            } text-sm font-medium transition-colors hover:text-primary cursor-pointer	`}
            onClick={() => toggleSelection('Tracks')}
          >
            Tracks
          </div>
          <div
            className={`${
              selection !== 'Artists' ? 'text-muted-foreground' : ''
            } text-sm font-medium transition-colors hover:text-primary cursor-pointer	`}
            onClick={() => toggleSelection('Artists')}
          >
            Artists
          </div>
          <div
            className={`${
              selection !== 'Search' ? 'text-muted-foreground' : ''
            } text-sm font-medium transition-colors hover:text-primary cursor-pointer	`}
            onClick={() => toggleSelection('Search')}
          >
            Search
          </div>
        </nav>

        <nav className={'flex items-center space-x-4 lg:space-x-6'}>
          <div className='text-sm font-medium transition-colors hover:text-primary'>
            <UserNav
              userId={userId}
              userName={userName}
              userProfilePic={userProfilePic}
              logout={logout}
            />
          </div>
        </nav>
      </div>
    </div>
  )
}

export default Nav
