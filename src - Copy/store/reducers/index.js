import { combineReducers } from 'redux';
import { firebaseReducer } from 'react-redux-firebase';
import { firestoreReducer } from 'redux-firestore';
import postReducer from './postReducer';
import authReducer from './authReducer';
import userReducer from './userReducer';


export default combineReducers({
    auth: authReducer,
    posts: postReducer,
    user: userReducer,
    firebase: firebaseReducer,
    firestore: firestoreReducer,
});
