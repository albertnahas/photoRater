import React, { useState } from 'react'
import './Home.css'
import { Header } from '../Header/Header'
import { Profile } from '../Profile/Profile'
import { RatingTab } from '../RatingTab/RatingTab'
import { MyPhotos } from '../MyPhotos/MyPhotos'

export const Home = () => {

    const [tabId, setTabId] = useState<number>(0)

    return (
        <div className="HomeWrapper">
            <Header tabId={tabId} setTabId={setTabId} />
            <main>
                {tabId === 2 && <Profile />}
                {tabId === 1 && <RatingTab />}
                {tabId === 0 && <MyPhotos />}
            </main>
        </div >

    )
}
