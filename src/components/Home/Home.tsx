import React, { FC, useState } from 'react'
import { Tabs } from '../Tabs/Tabs'
import { useSelector } from 'react-redux'
import { State } from '../../types/state'
import { RegisterStep2 } from '../Auth/Register/RegisterStep2'
import ModalDialog from '../../molecules/ModalDialog/ModalDialog'
import { Landing } from '../Landing/Landing'
import { OnBoarding } from '../OnBoarding/OnBoarding'
import { useUser } from '../../hooks/useUser'
import { useNavigate } from 'react-router-dom'
import { MyPhotos } from '../MyPhotos/MyPhotos'

export const Home: FC<Props> = function () {
  const [onBoarding, setOnBoarding] = useState(true)
  //   const [tabId, setTabId] = useState<number>(0)

  const user = useSelector((state: State) => state.user.value)
  const { updateUser } = useUser()
  const navigate = useNavigate()

  const finishOnBoarding = () => {
    updateUser({ uid: user?.uid, onBoarding: true }).then((res) => {
      setOnBoarding(false)
    })
  }

  const showOnBoarding = () => (
    <ModalDialog maxWidth="sm" open={onBoarding} setOpen={setOnBoarding}>
      <OnBoarding done={finishOnBoarding} />
    </ModalDialog>
  )

  return user !== null ? (
    user?.complete ? (
      <>
        <MyPhotos />
        {!user?.onBoarding && showOnBoarding()}
      </>
    ) : (
      <RegisterStep2 uid={user?.uid} />
    )
  ) : (
    <Landing login={() => navigate('/login')} />
  )
}

interface Props {}
