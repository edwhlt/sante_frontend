import './App.css';
import React, {useEffect} from 'react';
import Login from './component/Login'
import {createTheme, ThemeProvider, useTheme} from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { MemoryRouter as Router, Routes, Route } from "react-router-dom";
import { SnackbarProvider } from "notistack";
import useMediaQuery from "@mui/material/useMediaQuery";

const getDesignTokens = (mode) => ({
  spacing: 6,
  typography: {
    fontFamily: 'Roboto',
  },
  /*...isMobile ? {
    spacing: 6
  } : {},*/
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        html: {
          ...mode === 'light' ? {
          '*::-webkit-scrollbar': {
            width: '15px'
          },
          '*::-webkit-scrollbar-track': {
            backgroundColor: '#ffffff'
          },
          '*::-webkit-scrollbar-corner': {
            backgroundColor: '#212529'
          },
          '*::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgb(136 136 136 / 0.5)',
            borderRadius: '10px',
            border: '4px solid #ffffff',
            backgroundClip: 'content-box',
            minWidth: '32px',
            minHeight: '32px'
          }} : {
          '*::-webkit-scrollbar': {
            width: '15px'
          },
          '*::-webkit-scrollbar-track': {
            backgroundColor: '#353535'
          },
          '*::-webkit-scrollbar-corner': {
            backgroundColor: '#212529'
          },
          '*::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgb(136 136 136 / 0.5)',
            borderRadius: '10px',
            border: '4px solid #353535',
            backgroundClip: 'content-box',
            minWidth: '32px',
            minHeight: '32px'
          }}
        }
      }
    }
  },
    palette: {
      mode,
      ...(mode === 'light'
      ? {
          // palette values for light mode
          primary: {main: "#7FB3D5"},
          secondary: {main: "#b35f50"},
        }
      : {
          // palette values for dark mode
          primary: {main: "#7FB3D5"},
          secondary: {main: "#b35f50"},
          background: {
            paper: "#1a1a1a",
          },
      }),
    },
});

function App() {
  const [dark, setDark] = React.useState(true);
  const theme = createTheme(getDesignTokens(dark ? 'dark' : 'light'));
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (<>
    <meta
        name="viewport"
        content={`width=device-width, initial-scale=1, maximum-scale=${isMobile ? '1' : '5.0'}, minimum-scale=1, user-scalable=no`}
    />
    <div className="App">
        <ThemeProvider theme={theme}>
          <CssBaseline/>
          <Router>
            <SnackbarProvider maxSnack={3}>
              <Login changeMode={(dark) => setDark(dark)} dark={dark}/>
            </SnackbarProvider>
          </Router>
        </ThemeProvider>
      </div>
  </>);
}

export default App;
