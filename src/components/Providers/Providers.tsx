import React, { FC } from 'react';
import { Provider } from 'react-redux';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { blue, grey } from '@mui/material/colors';
import { ConfirmProvider } from 'material-ui-confirm';
import { BrowserRouter } from 'react-router-dom';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import store from '../../store/store';

export const Providers: FC = ({ children }) => {
    const theme = createTheme({
        palette: {
            primary: {
                main: blue[500]
            },
            secondary: {
                main: grey[500]
            }
        }
    });

    const paypalClientId = {
        sandbox:
            'Ae30WnZCRnL3Ja9fUfJnbpIr1L4OOheOUbRvErTgVlrk0bW7ky7ko8N4Xpfm1NBz_IaRJYjlKfKrQCxv',
        live: 'ARv9ES9WHwzwJDtEvdipM1uCcXbTLqjZHRPz5cBPIuNGbZ8GP2Opfc6mRZ2V-x4Qqajd8k6AHpGuEBG4'
    };

    return (
        <BrowserRouter>
            <ThemeProvider theme={theme}>
                <ConfirmProvider>
                    <PayPalScriptProvider
                        options={{ 'client-id': paypalClientId.live }}
                    >
                        <Provider store={store}>{children}</Provider>
                    </PayPalScriptProvider>
                </ConfirmProvider>
            </ThemeProvider>
        </BrowserRouter>
    );
};
