import React, { FC } from 'react'
import { TabsNav } from './TabsNav/TabsNav'
import { MyPhotos } from '../MyPhotos/MyPhotos'
import { Profile } from '../Profile/Profile'
import { RatingTab } from '../RatingTab/RatingTab'

export var Tabs: FC<Props> = function (props) {
  return (
    <>
      <TabsNav tabId={props.tabId} setTabId={props.setTabId} />
      <main style={{ flexGrow: 1 }}>
        {props.tabId === 2 && <Profile />}
        {props.tabId === 1 && <RatingTab />}
        {props.tabId === 0 && <MyPhotos />}
      </main>
    </>
  )
}

interface Props {
  tabId: number
  setTabId: (tabId: number) => void
}
