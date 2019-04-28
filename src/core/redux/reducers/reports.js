import {
  SET_REPORTS,
} from '../actions/reports/constants';

const defaultState = {
  geo: {},
};

const reducer = (state = defaultState, action) => {
  switch (action.type) {
    case SET_REPORTS: {
      return {
        ...state,
        geo: action.payload,
      };
    }

    default: {
      return state;
    }
  }
};

export default reducer;
