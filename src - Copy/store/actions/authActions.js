import * as actions from './actionTypes';
import fire from "../../Firebase/Firebase";


// Sign up action creator  
export const signUp = data => async (
    dispatch,
    getState,
    { getFirebase, getFirestore }
) => {
    const firebase = getFirebase();
    const firestore = getFirestore();
    dispatch({ type: actions.AUTH_START });
    try {
        const res = await firebase
            .auth()
            .createUserWithEmailAndPassword(data.email, data.password);

        const user = firebase.auth().currentUser;
        // set database entry
        const userData = {
            userName: data.userName,
            firstName: data.firstName,
            lastName: data.lastName,
            createdAt: new Date(),
            updatedAt: new Date(),
            file: null,
            userRoles: [data.role],
            uid: res.user.uid,
            isOnline: true
        }

        await firestore
            .collection('users')
            .doc(res.user.uid)
            .set(userData)
            .then((doc) => {
                const fileUpload = fire
                    .storage()
                    .ref(`profile/${res.user.uid}`)
                    .put(data.file);

                fileUpload.on(
                    "state_changed",
                    (snapshot) => {
                        const progress = Math.round(snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        console.log(progress);
                    },
                    (error) => {
                        return console.log(error.message);
                    },
                    () => {
                        fileUpload.snapshot.ref.getDownloadURL().then((downloadURL) => {
                            fire
                                .firestore()
                                .collection('users')
                                .doc(res.user.uid)
                                .update({
                                    file: downloadURL,
                                })
                        });
                    }
                );
            });

        // Send the verfication email 
        await user.sendEmailVerification();

        // dispatch uth 
        // dispatch({ type: actions.SET_USERS, payload: userData });
        dispatch({ type: actions.AUTH_SUCCESS });

    } catch (err) {
        dispatch({ type: actions.AUTH_FAIL, payload: err.message });
    }
    dispatch({ type: actions.AUTH_END });
};

// Logout action creator
export const signOut = (uid) => async (dispatch, getState, { getFirebase, getFirestore }) => {
    const firebase = getFirebase();
    const firestore = getFirestore(); 

    try {
        await
            firestore.collection('users')
                .doc(uid)
                .update({
                    isOnline: false
                }).then(() => {
                    firebase.auth().signOut()
                })
    } catch (err) {
        console.log(err.message);
    }
};

// Login action creator
export const signIn = data => async (dispatch, getState, { getFirebase, getFirestore }) => {
    const firebase = getFirebase();
    const firestore = getFirestore(); 
    dispatch({ type: actions.AUTH_START });
    try {
        await firebase.auth().signInWithEmailAndPassword(data.email, data.password).then((res) => {  
            firestore.collection('users')
                .doc(res.user.uid)
                .update({
                    isOnline: true
                })
        })
        dispatch({ type: actions.AUTH_SUCCESS });
    } catch (err) {
        dispatch({ type: actions.AUTH_FAIL, payload: err.message });
    }
    dispatch({ type: actions.AUTH_END });
};


export const signInWithGoogle = () => async ({ getFirebase }) => {
    debugger
    const firebase = getFirebase();

    firebase.auth().signInWithPopup(new fire.auth.GoogleAuthProvider()).then((res) => {
        console.log(res.user)
    }).catch((error) => {
        console.log(error.message)
    })
}

// Clean up messages
export const clean = () => ({
    type: actions.CLEAN_UP,
});

// Verify email actionTypes
export const verifyEmail = () => async (
    dispatch,
    getState,
    { getFirebase }
) => {
    const firebase = getFirebase();
    dispatch({ type: actions.VERIFY_START });
    try {
        const user = firebase.auth().currentUser;
        await user.sendEmailVerification();
        dispatch({ type: actions.VERIFY_SUCCESS });
    } catch (err) {
        dispatch({ type: actions.VERIFY_FAIL, payload: err.message });
    }
};

// Send recover password
export const recoverPassword = data => async (
    dispatch,
    getState,
    { getFirebase }
) => {
    const firebase = getFirebase();
    dispatch({ type: actions.RECOVERY_START });
    try {
        // send email ehre
        await firebase.auth().sendPasswordResetEmail(data.email);
        dispatch({ type: actions.RECOVERY_SUCCESS });
    } catch (err) {
        dispatch({ type: actions.RECOVERY_FAIL, payload: err.message });
    }
};

// Edit profile
export const editProfile = data => async (
    dispatch,
    getState,
    { getFirebase, getFirestore }
) => {
    const firebase = getFirebase();
    const firestore = getFirestore();
    const user = firebase.auth().currentUser;
    const { uid: userId, email: userEmail } = getState().firebase.auth;
    dispatch({ type: actions.PROFILE_EDIT_START });
    try {
        //edit the user profile
        if (data.email !== userEmail) {
            await user.updateEmail(data.email);
        }

        await firestore
            .collection('users')
            .doc(userId)
            .update({
                userName: data.userName,
                firstName: data.firstName,
                lastName: data.lastName,
                createdAt: new Date(),
                updatedAt: new Date(),
            })

        if (data.password.length > 0) {
            await user.updatePassword(data.password);
        }
        dispatch({ type: actions.PROFILE_EDIT_SUCCESS });
    } catch (err) {
        dispatch({ type: actions.PROFILE_EDIT_FAIL, payload: err.message });
    }
};

export const changeProfileImage = data => async (
    dispatch,
    getState,
    { getFirebase, getFirestore }
) => {
    const firebase = getFirebase();
    const firestore = getFirestore();
    const user = firebase.auth().currentUser;
    const { uid: userId } = getState().firebase.auth;
    dispatch({ type: actions.PROFILE_EDIT_START });
    try {

        await firestore
            .collection('users')
            .doc(userId)
            .update({
                file: null
            })
            .then((doc) => {
                const fileUpload = fire
                    .storage()
                    .ref(`profile/${userId}`)
                    .put(data.file);

                fileUpload.on(
                    "state_changed",
                    (snapshot) => {
                        const progress = Math.round(snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        console.log(progress);
                    },
                    (error) => {
                        return console.log(error.message);
                    },
                    () => {
                        fileUpload.snapshot.ref.getDownloadURL().then((downloadURL) => {
                            fire
                                .firestore()
                                .collection('users')
                                .doc(userId)
                                .update({
                                    file: downloadURL,
                                })
                        });
                    }
                );
            });

        if (data.password.length > 0) {
            await user.updatePassword(data.password);
        }
        dispatch({ type: actions.PROFILE_EDIT_SUCCESS });
    } catch (err) {
        dispatch({ type: actions.PROFILE_EDIT_FAIL, payload: err.message });
    }
};

// Delete user
export const deleteUser = () => async (
    dispatch,
    getState,
    { getFirebase, getFirestore }
) => {
    const firebase = getFirebase();
    const firestore = getFirestore();
    const user = firebase.auth().currentUser;
    const userId = getState().firebase.auth.uid;
    dispatch({ type: actions.DELETE_START });
    try {
        await firestore
            .collection('users')
            .doc(userId)
            .delete();


        await user.delete();
    } catch (err) {
        dispatch({ type: actions.DELETE_FAIL, payload: err.message });
    }
};
