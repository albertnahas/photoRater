import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { Providers } from './components/Providers/Providers';
import { registerSW } from 'virtual:pwa-register';

const updateSW = registerSW({
    onNeedRefresh() {},
    onOfflineReady() {}
});

ReactDOM.render(
    <React.StrictMode>
        <Providers>
            <App />
        </Providers>
    </React.StrictMode>,
    document.getElementById('root')
);
