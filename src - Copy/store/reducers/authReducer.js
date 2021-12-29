import * as actions from '../actions/actionTypes';

const initialState = {
    error: null,
    loading: false,

    isLoggedIn: false,  

    verifyEmail: {
        error: null,
        loading: false,
    },
    recoverPassword: {
        error: null,
        loading: false,
    },
    profileEdit: {
        error: null,
        loading: false,
    },
    deleteUser: {
        loading: false,
        error: null,
    },

};

const cleanUp = state => {
    return {
        ...state,
        error: null,
        loading: false,

        verifyEmail: {
            ...state.verifyEmail,
            loading: false,
            error: null,
        },
        recoverPassword: {
            ...state.recoverPassword,
            loading: false,
            error: null,
        },
        profileEdit: {
            ...state.profileEdit,
            loading: false,
            error: null,
        },
        deleteUser: {
            ...state.deleteUser,
            loading: false,
            error: null,
        },
    };
}; 

export default (state = initialState, { type, payload }, action) => {
    switch (type) {
        case actions.CLEAN_UP:
            return cleanUp(state);

        case actions.AUTH_START:
            return {
                ...state,
                loading: true,
                isLoggedIn: false,
            };
        case actions.AUTH_END:
            return {
                ...state,
                loading: false,
                isLoggedIn: true,
            };

        case actions.AUTH_FAIL:
            return {
                ...state,
                error: payload,
                isLoggedIn: false,
            };

        case actions.AUTH_SUCCESS:
            return {
                ...state,
                error: false,
                isLoggedIn: true,
            };
   

        case actions.VERIFY_START:
            return {
                ...state,
                verifyEmail: { ...state.verifyEmail, loading: true },
            };

        case actions.VERIFY_SUCCESS:
            return {
                ...state,
                verifyEmail: { ...state.verifyEmail, loading: false, error: false },
            };

        case actions.VERIFY_FAIL:
            return {
                ...state,
                verifyEmail: { ...state.verifyEmail, loading: false, error: payload },
            };

        case actions.RECOVERY_START:
            return {
                ...state,
                recoverPassword: { ...state.recoverPassword, loading: true },
            };

        case actions.RECOVERY_SUCCESS:
            return {
                ...state,
                recoverPassword: {
                    ...state.recoverPassword,
                    loading: false,
                    error: false,
                },
            };

        case actions.RECOVERY_FAIL:
            return {
                ...state,
                recoverPassword: {
                    ...state.recoverPassword,
                    loading: false,
                    error: payload,
                },
            };

        case actions.PROFILE_EDIT_START:
            return {
                ...state,
                profileEdit: { ...state.profileEdit, loading: true },
            };

        case actions.PROFILE_EDIT_SUCCESS:
            return {
                ...state,
                profileEdit: { ...state.profileEdit, loading: false, error: false },
            };

        case actions.PROFILE_EDIT_FAIL:
            return {
                ...state,
                profileEdit: { ...state.profileEdit, loading: false, error: payload },
            };

        case actions.DELETE_START:
            return { ...state, deleteUser: { ...state.deleteUser, loading: true } };

        case actions.DELETE_FAIL:
            return {
                ...state,
                deleteUser: { ...state.deleteUser, loading: false, error: payload },
            };

        default:
            return state;
    }
};
