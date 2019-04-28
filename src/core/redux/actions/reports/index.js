import {
  SET_REPORTS,
} from './constants';

export const setReports = payload => ({
  type: SET_REPORTS,
  payload,
});

export default setReports;
