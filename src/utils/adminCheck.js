import React from 'react';
import { connect } from 'react-redux';

const checkUserIsAdmin = ({ firebase }) => {
    const currentUser = firebase.profile;
    if (!currentUser || !Array.isArray(currentUser.userRoles)) return false;
    const role = currentUser.profile.userRoles;
    if (role.includes('admin')) return true;

    return false;
}


const mapStateToProps = ({ firebase }) => ({
    firebase,
});

export default connect(
    mapStateToProps
)(checkUserIsAdmin);