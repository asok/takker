import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { makeStyles } from '@material-ui/core/styles';
import { red } from '@material-ui/core/colors';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import SearchIcon from '@material-ui/icons/Search';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

import store, { getKeptPlaces, nextKeptPlace, prevKeptPlace, toggleKeptPlacesBrowser } from '../store';
import PlaceCard from './PlaceCard';

const useStyles = makeStyles((theme) => ({
  root: {},
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
}));

async function changePlace(dispatch, value) {
  switch(value) {
  case 'search':
    dispatch(toggleKeptPlacesBrowser(false));
    break;
  case 'next':
    dispatch(nextKeptPlace());
    break;
  case 'prev':
    dispatch(prevKeptPlace());
    break;
  }
}

export default function PlacesBrowser() {
  const classes   = useStyles();
  const dispatch  = useDispatch();
  const { currentPlaceIdx, places } = useSelector((state) => state.keptPlacesBrowser);
  const place = places[currentPlaceIdx];

  const prevEnabled = currentPlaceIdx != 0;
  const nextEnabled = currentPlaceIdx < places.length - 1;

  useEffect(
    () => dispatch(getKeptPlaces()),
    []
  );

  return(
    <Container component="main" maxWidth="md">
      <Card className={classes.root}>
        <CardContent>
          <BottomNavigation
            onChange={(ev, value) => changePlace(dispatch, value)}
            showLabels
          >
            <BottomNavigationAction
              label="Go to search"
              value="search"
              icon={<SearchIcon />}
            />
            <BottomNavigationAction
              label="Previous"
              value="prev"
              icon={<ArrowBackIosIcon />}
              disabled={!prevEnabled}
            />
            <BottomNavigationAction
              label="Next"
              value="next"
              icon={<ArrowForwardIosIcon />}
              disabled={!nextEnabled}
            />
          </BottomNavigation>
        </CardContent>
      </Card>

      {place ?
       <PlaceCard place={place} classes={classes} idx={currentPlaceIdx} /> :
       <Typography>No saved restaurants yet.</Typography>}
    </Container>
  );
}
