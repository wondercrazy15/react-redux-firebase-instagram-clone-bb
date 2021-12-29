import { useEffect } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../../store/actions';

const Logout = ({ logout, firebase }) => {
    useEffect(() => {
        logout(firebase.auth.uid);
    }, [logout]);
    return firebase.auth.uid;
};


const mapStateToProps = ({ firebase }) => ({
    firebase,
});

const mapDispatchToProps = {
    logout: actions.signOut,
};

export default connect(mapStateToProps, mapDispatchToProps)(Logout);
