import * as actions from '../actions/actionTypes';

const initialState = {
    users: [],
    massage: [],    
};

export default (state = initialState, action) => {
    switch (action.type) {
        case `${actions.GET_REALTIME_USERS}_REQUEST`:
            break;
        case `${actions.GET_REALTIME_USERS}_SUCCESS`:
            state = {
                ...state,
                users: action.payload.users
            };
            break;

        case actions.GET_REALTIME_MASSAGE:
            state = {
                ...state,
                massage: action.payload.massage
            }
            break

        default:
            return state;
    }
    return state;
};
