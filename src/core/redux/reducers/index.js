import { combineReducers } from 'redux';
import common from './common';
import info from './info';
import reports from './reports';

const reducers = combineReducers({
  common,
  info,
  reports,
});

export default reducers;
