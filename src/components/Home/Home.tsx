import React, { useState } from 'react'
import './Home.css'
import { Header } from '../Header/Header'
import { Footer } from '../Footer/Footer'
import { Main } from '../Main/Main'
import { Route, Routes } from 'react-router-dom'
import { About } from '../ControlPages/About/About'
import { Terms } from '../ControlPages/Terms/Terms'
import { ControlPage } from '../ControlPages/ControlPage'
import { Privacy } from '../ControlPages/Privacy/Privacy'
import { Contact } from '../ControlPages/Contact/Contact'

export const Home = () => {

    const [tabId, setTabId] = useState<number>(0)

    return (
        <div className="HomeWrapper">
            <Routes>
                <Route path="/" element={<Main setTabId={setTabId} tabId={tabId} />} />
                <Route path="/about" element={<ControlPage><About /></ControlPage>} />
                <Route path="/terms" element={<ControlPage><Terms /></ControlPage>} />
                <Route path="/privacy" element={<ControlPage><Privacy /></ControlPage>} />
                <Route path="/contact" element={<ControlPage><Contact /></ControlPage>} />
            </Routes>
            <Footer />
        </div >

    )
}
