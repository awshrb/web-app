import * as actionTypes from "../actions/actionTypes";

const initialState = {
    activeMarketTab: 0,
    isLoading: true,
    isDark: true,
};

const globalReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.SET_THEME:
            return {
                ...state,
                isDark: action.isDark,
            };
        case actionTypes.SET_LOADING:
            return {
                ...state,
                isLoading: action.isLoading,
            };
        default:
            return state;
    }
};

export default globalReducer;
