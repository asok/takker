import { configureStore, createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { client } from './client';

export const finishWizard = createAsyncThunk('places/finishWizard', async ({search}) => {
  const url      = client.appendQuery('/fakeApi/places', search);
  const response = await client.get(url);

  return response.places;
});

export const slice = createSlice({
  name: 'takker',
  initialState: {
    geolocationError: null,
    ajax:   {
      state: 'idle',
    },
    search: {},
    wizard: {
      currentStep: 0,
      progressing: true,
    },
    browser: {
      places:          null,
      currentPlaceIdx: 0,
      direction:       'right',
    }
  },
  reducers: {
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
  },
  extraReducers: {
    [finishWizard.pending]: (state, action) => {
      state.ajax.state = 'loading';
    },
    [finishWizard.fulfilled]: (state, action) => {
      state.ajax.state = 'succeeded';
      state.browser.places = action.payload;
    },
    [finishWizard.rejected]: (state, action) => {
      state.ajax.state = 'failed';
      state.ajax.error = action.payload;
    },
  },
});

export const {
  failGeo,
  mergeSearch,
  progressWizard,
  regressWizard,
  nextPlace
} = slice.actions;

export default configureStore({
  reducer:  slice.reducer,
  devTools: process.env.NODE_ENV === 'development',
});
