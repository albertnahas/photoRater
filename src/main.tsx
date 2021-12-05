import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import { Provider } from 'react-redux'
import store from './store/store'
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import { blue, green, grey, orange, pink } from '@mui/material/colors'
import { ConfirmProvider } from 'material-ui-confirm'

const theme = createTheme({
  palette: {
    primary: {
      main: blue[500],
    },
    secondary: {
      main: grey[500],
    },
  },
});

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <ConfirmProvider>
        <Provider store={store}>
          <App />
        </Provider>
      </ConfirmProvider>
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
)
