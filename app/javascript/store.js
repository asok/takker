import { configureStore, createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { client } from './client';

export const saveSearch = createAsyncThunk('searches/saveSearch', async ({search, authenticity_token}) => {
  await client.post('/searches', {authenticity_token, query: search});
});

export const getPlaces = createAsyncThunk('places/getPlaces', async () => {
  const response = await client.get('/places');

  return response.places;
});

export const getKeptPlaces = createAsyncThunk('places/getKeptPlaces', async () => {
  const response = await client.get('/kept_places');

  return response.places;
});

export const discardPlace = createAsyncThunk('places/discardPlace', async ({authenticity_token, place}) => {
  await client.post('/discarded_places', {authenticity_token, place});
});

export const keepPlace = createAsyncThunk('places/keepPlace', async ({authenticity_token, place}) => {
  await client.post('/kept_places', {authenticity_token, place});
});

export const slice = createSlice({
  name: 'takker',
  initialState: {
    geolocationError: null,
    authenticity_token: null,
    ajax:   {
      state: 'idle',
      backdropOpen: false,
    },
    search: {},
    wizard: {
      currentStep: 0,
      progressing: true,
    },
    browser: {
      places:          [],
      currentPlaceIdx: 0,
      direction:       'right',
    },
    keptPlacesBrowser: {
      visible:         false,
      places:          [],
      currentPlaceIdx: 0,
      direction:       'right',
    }
  },
  reducers: {
    initState: (state, action) => {
      const { authenticity_token, search } = action.payload;

      state.authenticity_token = authenticity_token;
      state.search             = search;
    },
    failGeo: (state, action) => {
      state.geolocationError = action.payload.message;
    },
    mergeSearch: (state, action) => {
      state.search = {...state.search, ...action.payload};
    },
    progressWizard: (state, action) => {
      state.search = {...state.search, ...action.payload};
      state.wizard = {
        ...state.wizard,
        currentStep: state.wizard.currentStep + 1,
        progressing: true,
      };
    },
    regressWizard: (state) => {
      state.wizard = {
        ...state.wizard,
        currentStep: state.wizard.currentStep - 1,
        progressing: false,
      };
    },
    nextPlace: (state) => {
      state.browser.currentPlaceIdx++;
    },
    nextKeptPlace: (state) => {
      state.keptPlacesBrowser.currentPlaceIdx++;
    },
    prevKeptPlace: (state) => {
      state.keptPlacesBrowser.currentPlaceIdx--;
    },
    toggleKeptPlacesBrowser: (state, action) => {
      state.keptPlacesBrowser.visible = action.payload;

    }
  },
  extraReducers: {
    [saveSearch.pending]: (state, action) => {
      state.ajax.state = 'loading';
      state.ajax.backdropOpen = true;
    },
    [saveSearch.fulfilled]: (state, action) => {
      state.ajax.state = 'succeeded';
      state.ajax.backdropOpen = false;
    },
    [saveSearch.rejected]: (state, action) => {
      state.ajax.state = 'failed';
      state.ajax.error = action.payload.error;
      state.ajax.backdropOpen = false;
    },

    [getPlaces.pending]: (state, action) => {
      state.ajax.state = 'loading';
      state.ajax.backdropOpen = true;
    },
    [getPlaces.fulfilled]: (state, action) => {
      state.ajax.state = 'succeeded';
      state.ajax.backdropOpen = false;

      const presentPlaceIds = state.browser.places.map(place => place.id);
      const places = action.payload.filter(place =>
        !presentPlaceIds.includes(place.id)
      );
      state.browser.places = (state.browser.places || []).concat(places);
    },
    [getPlaces.rejected]: (state, action) => {
      state.ajax.state = 'failed';
      state.ajax.error = action.payload.error;
      state.ajax.backdropOpen = false;
    },

    [getKeptPlaces.pending]: (state, action) => {
      state.ajax.state = 'loading';
      state.ajax.backdropOpen = true;
    },
    [getKeptPlaces.fulfilled]: (state, action) => {
      state.ajax.state = 'succeeded';
      state.keptPlacesBrowser.places = action.payload;
      state.ajax.backdropOpen = false;
    },
    [getKeptPlaces.rejected]: (state, action) => {
      state.ajax.state = 'failed';
      state.ajax.error = action.payload.error;
      state.ajax.backdropOpen = false;
    },

    [discardPlace.pending]: (state, action) => {
      state.ajax.state = 'loading';
    },
    [discardPlace.fulfilled]: (state, action) => {
      state.ajax.state = 'succeeded';
    },
    [discardPlace.rejected]: (state, action) => {
      state.ajax.state = 'failed';
      state.ajax.error = action.payload.error;
    },

    [keepPlace.pending]: (state, action) => {
      state.ajax.state = 'loading';
    },
    [keepPlace.fulfilled]: (state, action) => {
      state.ajax.state = 'succeeded';
    },
    [keepPlace.rejected]: (state, action) => {
      state.ajax.state = 'failed';
      state.ajax.error = action.payload.error;
    },
  },
});

export const {
  initState,
  failGeo,
  mergeSearch,
  progressWizard,
  regressWizard,
  nextPlace,
  nextKeptPlace,
  prevKeptPlace,
  toggleKeptPlacesBrowser,
} = slice.actions;

export default configureStore({
  reducer:  slice.reducer,
  devTools: process.env.NODE_ENV === 'development',
});
