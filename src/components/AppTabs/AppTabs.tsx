import React, { useEffect } from 'react'
import { AppBar, BottomNavigation, BottomNavigationAction } from '@mui/material'
import { Link, useLocation } from 'react-router-dom'

import PersonIcon from '@mui/icons-material/Person'
import { useSelector } from 'react-redux'
import { State } from '../../types/state'
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary'
import FavoriteIcon from '@mui/icons-material/Favorite'

export var AppTabs = function () {
  const [value, setValue] = React.useState(1)
  const user = useSelector((state: State) => state.user.value)

  const location = useLocation()

  useEffect(() => {
    if (location.pathname.indexOf('profile') > -1) {
      setValue(2)
      return
    }
    if (location.pathname.indexOf('rate') > -1) {
      setValue(1)
      return
    }
    if (location.pathname.indexOf('photos') > -1) {
      setValue(1)
      return
    }
    setValue(0)
  }, [location])

  return user !== null && user?.complete ? (
    <BottomNavigation
      showLabels
      value={value}
      onChange={(event, newValue) => {
        setValue(newValue)
      }}
      sx={{
        '& > a': {
          minWidth: 60
        }
      }}
    >
      <BottomNavigationAction
        label="My Photos"
        icon={<PhotoLibraryIcon />}
        component={Link}
        to="/"
      />
      <BottomNavigationAction
        label="Rate"
        icon={<FavoriteIcon />}
        component={Link}
        to="/rate"
      />
      <BottomNavigationAction
        label="Profile"
        icon={<PersonIcon />}
        component={Link}
        to="/profile"
      />
    </BottomNavigation>
  ) : (
    <></>
  )
}
