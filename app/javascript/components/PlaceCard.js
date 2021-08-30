import React from 'react';

import Slide from '@material-ui/core/Slide';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import LocationOnIcon from '@material-ui/icons/LocationOn';

function fullAddress({address1, address2, address3, zip_code, city, state, country}) {
  const address = [address1, address2, address3].filter(address => address);

  return `${address}, ${zip_code} ${city} ${state} ${country}`;
}

export default function PlaceCard({place, classes, idx}) {
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
            subheader={<p><LocationOnIcon fontSize={'small'} />{fullAddress(place.location)}</p>}
          />
          <CardMedia
            className={classes.media}
            image={place.image_url}
            title={place.name}
          />
          <CardContent>
            <Typography variant="body2" component="div">
              Price: {place.price || 'N/A'}
            </Typography>
            <Typography variant="body2" component="div">
              Rating: {place.rating ? `${place.rating}/10` : 'N/A'}
            </Typography>

            <Typography variant="body2" component="div">
              Phone: <a href={`tel:${place.phone}`}>{place.phone || 'N/A'}</a>
            </Typography>
          </CardContent>
        </Card>
      </div>
    </Slide>
  );
}
