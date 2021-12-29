import * as actions from './actionTypes';
import fire from "../../Firebase/Firebase";

// Sign up action creator  
export const getRealtimeUsers = (uid) => {
    return async (dispatch) => {
        dispatch({
            type: `${actions.GET_REALTIME_USERS}_REQUEST`
        })

        const unsubscribe = fire.firestore().collection('users')
        fire.firestore().collection("users")
            .onSnapshot((res) => {
                const users = [];
                res.forEach(function (doc) {
                    if (doc.data().uid !== uid) {
                        users.push(doc.data());
                    }
                    console.log(users)
                })
                dispatch({
                    type: `${actions.GET_REALTIME_USERS}_SUCCESS`,
                    payload: { users }
                })

            })

        return unsubscribe;
    }
}



export const updateMassage = (msgObj) => {
    return async (dispatch) => {

        fire.firestore().collection("massage")
            .add({
                ...msgObj,
                isView: false,
                createAt: new Date(),

            }).then((data) => {
                // console.log(data)
                dispatch({
                    type: actions.GET_REALTIME_MASSAGE
                })
            })
            .catch(error => {
                console.log(error)
            })


        // return unsubscribe;
    }
}

export const getRealtimeMassage = (user) => {
    return async (dispatch) => {
        await fire.firestore().collection('massage')
            .where('userId', 'in', [user.userId, user.chatUserId])
            .orderBy('createAt', 'asc')
            .onSnapshot((res) => {
                const massage = [];

                res.forEach(doc => {
                    console.log(doc)

                    if (
                        (doc.data().userId === user.userId && doc.data().chatUserId === user.chatUserId) ||
                        (doc.data().userId === user.chatUserId && doc.data().chatUserId === user.userId)
                    ) {

                        massage.push(doc.data())
                    }

                    if (massage.length > 0) {
                        dispatch({
                            type: actions.GET_REALTIME_MASSAGE,
                            payload: { massage }
                        })
                    } else {
                        dispatch({
                            type: `${actions.GET_REALTIME_MASSAGE}_FAILURE`,
                            payload: { massage }
                        })
                    }

                })
                console.log(massage)
            })
    }
}