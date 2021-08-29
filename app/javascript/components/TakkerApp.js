import React from "react";
import PropTypes from "prop-types";
import { Provider } from 'react-redux';
import { createTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';

import store, { mergeSearch, failGeo, initState } from '../store';
import Layout from './Layout';

// Uncomment this if you need to mock the backend server
// import '../server';

const theme = createTheme({
  palette: {
    type: 'dark',
  },
});

class TakkerApp extends React.Component {
  constructor(props) {
    super(props);

    store.dispatch(initState({
      search:             props.user.query,
      authenticity_token: props.authenticity_token
    }));
  }

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
    const { user } = this.props;

    return (
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <Layout user={user} />
        </ThemeProvider>
      </Provider>
    );
  }
}

export default TakkerApp;
