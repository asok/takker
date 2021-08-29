import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Slide from '@material-ui/core/Slide';
import SearchIcon from '@material-ui/icons/Search';

import store, { progressWizard, regressWizard, saveSearch } from '../store';

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
  },
  avatarImg: {
    width: '100%',
    height: '100%',
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  icon: {
    margin: '20px',
    fontSize: 'xxx-large',
  }
}));

function backButton(regress) {
  return (
    <Button
      type="button"
      fullWidth
      variant="contained"
      color="default"
      onClick={() => regress()}
    >
      Back
    </Button>
  );
}

function renderSlides(classes) {
  const dispatch  = useDispatch();
  const { search, wizard }  = useSelector((state) => state);

  const direction = wizard.progressing ? 'left' : 'right';
  const progress = searchDiff => dispatch(progressWizard(searchDiff));
  const regress  = () => dispatch(regressWizard());
  const finish   = searchDiff => {
    progress(searchDiff);
    dispatch(saveSearch(store.getState()));
  };

  return(
    <>
      <Slide direction={direction} in={wizard.currentStep == 0} mountOnEnter unmountOnExit timeout={{enter: 225, exit: 0}}>
        <div>
          <Typography component="h1" variant="h5">
            Look for places that are currently open?
          </Typography>
          <div className={classes.form}>
            <ButtonGroup fullWidth>
              <Button
                type="button"
                fullWidth
                variant="contained"
                color="secondary"
                className={classes.submit}
                onClick={() => progress({open: false})}
              >
                No
              </Button>

              <Button
                type="button"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
                onClick={() => progress({open: true})}
              >
                Yes
              </Button>
            </ButtonGroup>
          </div>
        </div>
      </Slide>
      <Slide direction={direction} in={wizard.currentStep == 1} mountOnEnter unmountOnExit timeout={{enter: 225, exit: 0}}>
        <div>
          <Typography component="h1" variant="h5">
            Look for places which are hot and new?
          </Typography>
          <div className={classes.form}>
            <ButtonGroup fullWidth>
              <Button
                type="button"
                fullWidth
                variant="contained"
                color="secondary"
                className={classes.submit}
                onClick={() => progress({hot: false})}
              >
                No
              </Button>

              <Button
                type="button"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
                onClick={() => progress({hot: true})}
              >
                Yes
              </Button>
            </ButtonGroup>

            {backButton(regress)}
          </div>
        </div>
      </Slide>
      <Slide direction={direction} in={wizard.currentStep == 2} mountOnEnter unmountOnExit timeout={{enter: 225, exit: 0}}>
        <div>
          <Typography component="h1" variant="h5">
            What price range are you looking for?
          </Typography>
          <div className={classes.form}>
            <RadioGroup
              aria-label="gender"
              name="price"
              value={search.price || 0}
              onChange={(ev) => finish({price: parseInt(ev.target.value)})}
            >
              <FormControlLabel value="1" control={<Radio />} label="$" />
              <FormControlLabel value="2" control={<Radio />} label="Up to $$" />
              <FormControlLabel value="3" control={<Radio />} label="Up to $$$" />
              <FormControlLabel value="4" control={<Radio />} label="Up to $$$$" />
            </RadioGroup>
            <Button
              type="button"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick={() => finish({price: 0})}
            >
              Look for any price range
            </Button>

            {backButton(regress)}
          </div>
        </div>
      </Slide>
    </>
  );
}

export default function SearchWizard() {
  const classes = useStyles();

  return (
    <Container component="main">
      <div className={classes.paper}>
        <SearchIcon className={classes.icon} />

        {renderSlides(classes)}
      </div>
      <Box mt={8}>
      </Box>
    </Container>
  );
}
