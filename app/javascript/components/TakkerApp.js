import React from "react";
import PropTypes from "prop-types";
import { Provider } from 'react-redux';
import { createTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';

import store, { mergeSearch, failGeo } from '../store';
import Layout from './Layout';

import '../server';

const theme = createTheme({
  palette: {
    type: 'dark',
  },
});

class TakkerApp extends React.Component {
  componentDidMount() {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;

        store.dispatch(mergeSearch({latitude, longitude}));
      },
      (e) => {
        console.error(e.message);

        store.dispatch(failGeo(e));
      }
    );
  }

  render () {
    return (
        <Provider store={store}>
          <ThemeProvider theme={theme}>
            <Layout />
          </ThemeProvider>
        </Provider>
    );
  }
}

export default TakkerApp;
