import {
  SET_ADDRESS,
  SET_CLINIC,
  CLEAR_OPINION,
  SET_LATLNG,
  TOGGLE_CATEGORY,
} from '../actions/info/constants';

const defaultState = {
  address: '',
  longitude: 0,
  latitude: 0,
  clinic: {
    category: 0,
    subcategory: {},
    message: '',
    name: '',
  },
};

const reducer = (state = defaultState, action) => {
  switch (action.type) {
    case SET_ADDRESS: {
      return {
        ...state,
        address: action.payload,
      };
    }

    case SET_LATLNG: {
      const { latitude, longitude } = action.payload;
      return {
        ...state,
        address: '',
        latitude,
        longitude,
      };
    }

    case SET_CLINIC: {
      const { value, name } = action.payload;
      if (name === 'category') {
        return {
          ...state,
          clinic: {
            ...state.clinic,
            category: value,
            subcategory: [],
          },
        };
      }
      return {
        ...state,
        clinic: {
          ...state.clinic,
          [name]: value,
        },
      };
    }

    case TOGGLE_CATEGORY: {
      const { value } = action.payload;
      const { subcategory } = state.clinic;
      if (subcategory[value]) {
        delete subcategory[value];
        return {
          ...state,
          clinic: {
            ...state.clinic,
            subcategory,
          },
        };
      }
      return {
        ...state,
        clinic: {
          ...state.clinic,
          subcategory: {
            ...subcategory,
            [value]: true,
          },
        },
      };
    }

    case CLEAR_OPINION: {
      return {
        ...defaultState,
        latitude: state.latitude,
        longitude: state.longitude,
      };
    }

    default: {
      return state;
    }
  }
};

export default reducer;
