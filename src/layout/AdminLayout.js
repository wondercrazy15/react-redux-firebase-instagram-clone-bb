import React from 'react'
import { connect } from 'react-redux';
import styled from 'styled-components';
import Navbar from '../containers/Admin/Header/Navbar';
import 'react-toastify/dist/ReactToastify.css';

const MainWrapper = styled.main`
  width: 100%;
  min-height: calc(100vh - 6rem);
  margin-top: 110px;
  padding-bottom: 100px; 
`;


const AdminLayout = ({ children, loggedIn }) => {
    return (
        <>
            <Navbar loggedIn={loggedIn} />
            <MainWrapper loggedIn={loggedIn} >{children}</MainWrapper>
        </>
    )
}

const mapStateToProps = ({ firebase }) => ({
    loggedIn: firebase.auth,
});

export default connect(mapStateToProps)(AdminLayout);
