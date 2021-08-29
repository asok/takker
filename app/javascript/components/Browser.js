import React from 'react';
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


import store, { nextPlace } from '../store';

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 800,
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
}));

function fullAddress({address1, address2, address3, zip_code, city, state, country}) {
  const address = [address1, address2, address3].filter(address => address);

  return `${address}, ${zip_code} ${city} ${state} ${country}`;
}

function PlaceCard({place, classes, idx}) {
  const [expanded, setExpanded] = React.useState(false);

  return (
    <Slide
      key={idx}
      direction={'left'}
      in={true}
      mountOnEnter
      unmountOnExit
      timeout={{enter: 225, exit: 0}}
    >
      <div>
        <Card className={classes.root}>
          <CardHeader
            title={place.name}
            subheader={<p><LocationOnIcon />{fullAddress(place.location)}</p>}
          />
          <CardMedia
            className={classes.media}
            image={place.image_url}
            title={place.name}
          />
          <CardContent>
            <Typography variant="body2" component="div">
              Rating: {place.rating}/10
            </Typography>

            <Typography variant="body2" component="div">
              Phone: <a href={`tel:${place.phone}`}>{place.phone}</a>
            </Typography>
          </CardContent>
        </Card>
      </div>
    </Slide>
  );
}

function goToNextPlace(dispatch, places, currentPlaceIdx) {
  if (currentPlaceIdx < places.length)
    dispatch(nextPlace());
}

export default function Browser() {
  const classes   = useStyles();
  const dispatch  = useDispatch();
  const { currentPlaceIdx, places } = useSelector((state) => state.browser);
  const place = places[currentPlaceIdx];

  return(
    <Container component="main">
      <Card className={classes.root}>
        <CardContent>
          <BottomNavigation
            onChange={() => goToNextPlace(dispatch, places, currentPlaceIdx)}
            showLabels
          >
            <BottomNavigationAction label="Save" icon={<FavoriteBorderIcon />} />
            <BottomNavigationAction label="Next" icon={<ArrowForwardIosIcon />} />
          </BottomNavigation>
        </CardContent>
      </Card>

      {place ?
       <PlaceCard place={place} classes={classes} idx={currentPlaceIdx} /> :
       <Typography>No restaurants matching your location and criteria</Typography>}
    </Container>
  );
}
