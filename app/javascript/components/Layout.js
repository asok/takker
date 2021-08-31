import React from 'react';
import clsx from 'clsx';
import { useSelector, useDispatch } from 'react-redux';

import { makeStyles, useTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';

import SearchWizard from './SearchWizard';
import PlacesBrowser from './PlacesBrowser';
import KeptPlacesBrowser from './KeptPlacesBrowser';
import store, { mergeSearch, saveSearch, getPlaces, failGeo, toggleKeptPlacesBrowser } from '../store';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    minHeight: '1000px',
    backgroundImage: 'linear-gradient(to top right, #AD46FE 0%, #5546FE 25%, #AD46FE 65%, #5546FE 99%)',
  },
  appBar: {
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    backgroundColor: 'rgb(66, 66, 66)',
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    backgroundColor: 'rgb(66, 66, 66)',
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
  priceMoneyIcon: {
    minWidth: '24px',
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}));

function isSearchComplete(search) {
  const {
    longitude,
    latitude,
    open,
    hot,
    price
  } = search;

  return [longitude, latitude, open, hot, price].every(v =>
    v !== null && v !== undefined
  );
}

function renderMainContent() {
  const error                    = useSelector(state => state.geolocationError);
  const search                   = useSelector(state => state.search);
  const keptPlacesBrowserVisible = useSelector(state => state.keptPlacesBrowser.visible);

  if (error) {
    return <Typography>Could not find your location. It's not possible to use this app.</Typography>;
  } else if (keptPlacesBrowserVisible) {
    return <KeptPlacesBrowser />;
  } else if (isSearchComplete(search)) {
    return <PlacesBrowser />;
  } else {
    return <SearchWizard />;
  }
}

function SearchControls() {
  const classes  = useStyles();
  const dispatch = useDispatch();
  const search   = useSelector(state => state.search);
  const [preselectedPrice, setPreselectedPrice] = React.useState(search.price || 0);

  return (
    <List>
      <ListItem >
        <ListItemText primary="Search Preferences" />
      </ListItem>
      <ListItem button dense>
        <ListItemIcon>
          <Checkbox
            edge="start"
            checked={!!search.open}
            onChange={(ev) => updateSearch(dispatch, {open: ev.target.checked})}
          />
        </ListItemIcon>
        <ListItemText primary="Open now" />
      </ListItem>

      <ListItem button dense>
        <ListItemIcon>
          <Checkbox
            edge="start"
            checked={!!search.hot}
            onChange={(ev) => updateSearch(dispatch, {hot: ev.target.checked})}
          />
        </ListItemIcon>
        <ListItemText primary="Hot and new" />
      </ListItem>

      <ListItem button dense>
        {[1, 2, 3, 4].map((i) =>
          <ListItemIcon
            key={i}
            className={classes.priceMoneyIcon}
            onClick={() => updateSearch(dispatch, {price: preselectedPrice})}
          >
            <AttachMoneyIcon
              onMouseEnter={() => setPreselectedPrice(i)}
              onMouseLeave={() => setPreselectedPrice(i - 1)}
              color={i <= search.price || i <= preselectedPrice ? 'secondary' : 'inherit'}
            />
          </ListItemIcon>
        )}
        <ListItemText primary="Price" />
        {search.price > 0 && <Button
                               variant="outlined"
                               color="secondary"
                               onClick={() => updateSearch(dispatch, {price: 0}) && setPreselectedPrice(0)}
                            >
                              Any
                            </Button>}
      </ListItem>
      <Divider />
      <ListItem button dense>
        <ListItemIcon>
          <Button
            variant="text"
            color="default"
            onClick={() => dispatch(toggleKeptPlacesBrowser(true))}
          >
            Saved restaurants
          </Button>
        </ListItemIcon>
      </ListItem>
      <Divider />
      <ListItem button dense>
        <ListItemIcon>
          <Button
            variant="text"
            color="primary"
            onClick={() => window.location.href = '/sign_out'}
          >
            Sign out
          </Button>
        </ListItemIcon>
      </ListItem>
    </List>
  );
}

async function updateSearch(dispatch, diff) {
  await dispatch(mergeSearch(diff));
  await dispatch(saveSearch(store.getState()));

  dispatch(getPlaces());
}

function moneyIconColor(i, price, preselectedPrice) {
  if (i <= price || i <= preselectedPrice)
    return 'blue';
  else
    return 'inherit';
}

export default function Layout({user}) {
  const theme           = useTheme();
  const classes         = useStyles();
  const dispatch        = useDispatch();
  const [open,  setOpen] = React.useState(false);

  const search = useSelector(state => state.search);
  const backdropOpen = useSelector(state => state.ajax.backdropOpen);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            className={clsx(classes.menuButton, open && classes.hide)}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap>
            Takker
            &nbsp;
            <img src="https://takko.app/packs/media/images/takko-emblem-9119e188.png" style={{width: '24px', height: '24px'}}/>
            &nbsp;
            {user.email}
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="left"
        open={open}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.drawerHeader}>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </div>
        <Divider />
        {isSearchComplete(search) && <SearchControls />}
      </Drawer>
      <main
        className={clsx(classes.content, {
          [classes.contentShift]: open,
        })}
      >
        <div className={classes.drawerHeader} />

        <Backdrop open={backdropOpen} className={classes.backdrop}>
          <CircularProgress color="inherit" />
        </Backdrop>

        <Box>
          {renderMainContent()}
        </Box>
      </main>
    </div>
  );
}
