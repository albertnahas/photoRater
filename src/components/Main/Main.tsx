import React from 'react'
import { Header } from '../Header/Header'
import { MyPhotos } from '../MyPhotos/MyPhotos'
import { Profile } from '../Profile/Profile'
import { RatingTab } from '../RatingTab/RatingTab'

export const Main = (props: any) => {
    return (
        <>
            <Header tabId={props.tabId} setTabId={props.setTabId} />
            <main style={{ flexGrow: 1 }}>
                {props.tabId === 2 && <Profile />}
                {props.tabId === 1 && <RatingTab />}
                {props.tabId === 0 && <MyPhotos />}
            </main>
        </>
    )
}
