import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { Providers } from './components/Providers/Providers';
// @ts-ignore
import { registerSW } from 'virtual:pwa-register';

const intervalMS = 15 * 60 * 1000;

const updateSW = registerSW({
    onNeedRefresh() {},
    onOfflineReady() {},
    onRegistered(r: any) {
        r &&
            setInterval(() => {
                r.update();
            }, intervalMS);
    }
});

ReactDOM.render(
    <React.StrictMode>
        <Providers>
            <App />
        </Providers>
    </React.StrictMode>,
    document.getElementById('root')
);
