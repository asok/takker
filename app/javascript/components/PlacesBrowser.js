import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { makeStyles } from '@material-ui/core/styles';
import { red } from '@material-ui/core/colors';
import Container from '@material-ui/core/Container';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Typography from '@material-ui/core/Typography';
import Slide from '@material-ui/core/Slide';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';

import store, { nextPlace, getPlaces, discardPlace, keepPlace } from '../store';
import PlaceCard from './PlaceCard';

const useStyles = makeStyles((theme) => ({
  root: {},
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
}));

function fullAddress({address1, address2, address3, zip_code, city, state, country}) {
  const address = [address1, address2, address3].filter(address => address);

  return `${address}, ${zip_code} ${city} ${state} ${country}`;
}

async function goToNextPlace(dispatch, value, place) {
  const { authenticity_token, browser } = store.getState();
  const { places, currentPlaceIdx } = browser;

  switch(value) {
  case 'discard':
    await dispatch(discardPlace({authenticity_token, place}));
    break;
  case 'keep':
    await dispatch(keepPlace({authenticity_token, place}));
    break;
  }

  if (currentPlaceIdx >= places.length - 1)
    await dispatch(getPlaces());

  dispatch(nextPlace());
}

export default function PlacesBrowser() {
  const classes   = useStyles();
  const dispatch  = useDispatch();
  const { currentPlaceIdx, places } = useSelector((state) => state.browser);
  const place = places[currentPlaceIdx];

  const nextEnabled = place && currentPlaceIdx < places.length;

  useEffect(
    () => dispatch(getPlaces()),
    []
  );

  return(
    <Container component="main" maxWidth="md">
      <Card className={classes.root}>
        <CardContent>
          <BottomNavigation
            onChange={(ev, value) => goToNextPlace(dispatch, value, place)}
            showLabels
          >
            <BottomNavigationAction
              label="Save"
              value="keep"
              icon={<FavoriteBorderIcon />}
              disabled={!place}
            />
            <BottomNavigationAction
              label="Next"
              value="discard"
              icon={<ArrowForwardIosIcon />}
              disabled={!nextEnabled}
            />
          </BottomNavigation>
        </CardContent>
      </Card>

      {place ?
       <PlaceCard place={place} classes={classes} idx={currentPlaceIdx} /> :
       <Typography>No restaurants matching your location and criteria</Typography>}
    </Container>
  );
}
