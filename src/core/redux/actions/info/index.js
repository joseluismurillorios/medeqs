import {
  SET_ADDRESS,
  SET_CLINIC,
  CLEAR_OPINION,
  SET_LATLNG,
  TOGGLE_CATEGORY,
} from './constants';

export const setAddress = payload => ({
  type: SET_ADDRESS,
  payload,
});

export const setLatLng = payload => ({
  type: SET_LATLNG,
  payload,
});

export const setClinic = payload => ({
  type: SET_CLINIC,
  payload,
});

export const saveOpinion = payload => ({
  type: SET_CLINIC,
  payload,
});

export const clearClinic = payload => ({
  type: CLEAR_OPINION,
  payload,
});

export const toggleCategory = payload => ({
  type: TOGGLE_CATEGORY,
  payload,
});
