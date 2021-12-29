import React from 'react';
import styled from 'styled-components';

import { useHistory } from "react-router-dom";

import ButtonGroup from '@material-ui/core/ButtonGroup';
import Avatar from '@material-ui/core/Avatar';

import { makeStyles } from '@material-ui/core/styles';
import HomeIcon from '@material-ui/icons/Home';
import SearchIcon from '@material-ui/icons/Search';
import AddIcon from '@material-ui/icons/Add';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import AccountCircleSharpIcon from '@material-ui/icons/AccountCircleSharp';
import Button from '@material-ui/core/Button';
import { connect } from 'react-redux';
import StyledBadge from './../UI/AvatarOnline/AvatarStyledBadge'

const FooterWrap = styled.footer` 
    background-color: var(--color-mainDark); 
    width: 100%; 
    position: fixed;
    bottom: 0;
    width: 100%;
`;


const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        '& > *': {
            margin: theme.spacing(0),
            borderRadius: 0,
        },
        '& a': {
            borderRadius: 0,
        }
    },
    small: {
        width: theme.spacing(3),
        height: theme.spacing(3),
    },

}));

const Footer = ({ loggedIn, firebase }) => {
    const classes = useStyles();
    const history = useHistory();


    return (
        <FooterWrap>
            <div className={classes.root}>
                <ButtonGroup fullWidth size="large" color="primary" aria-label="outlined primary button group">
                    <Button fullWidth variant="contained" onClick={() => history.push('/')} style={{ borderRadius: 0 }}>
                        <HomeIcon />
                    </Button>
                    <Button fullWidth variant="contained" onClick={() => history.push('/posts')}>
                        <SearchIcon />
                    </Button>
                    <Button fullWidth variant="contained" onClick={() => history.push('/addPost')}>
                        <AddIcon />
                    </Button>
                    <Button fullWidth variant="contained" onClick={() => history.push('/posts')}>
                        <FavoriteBorderIcon />
                    </Button>
                    {loggedIn.uid ? (
                        <Button fullWidth variant="contained" onClick={() => history.push('/profile')} style={{ borderRadius: 0 }}>

                            <StyledBadge className={firebase.profile.isOnline ? 'online' : 'offline'}>
                                <Avatar alt={firebase.profile.userName} src={firebase.profile.file ? firebase.profile.file : firebase.profile.userName} className={classes.small} />
                            </StyledBadge>


                            {/* <AccountCircleSharpIcon /> */}
                            {/* </Avatar> */}
                        </Button>
                    ) : (
                        <Button fullWidth variant="contained" onClick={() => history.push('/profile')} style={{ borderRadius: 0 }}>
                            <AccountCircleSharpIcon />
                        </Button>
                    )}


                </ButtonGroup>
            </div>
        </FooterWrap>
    );
};



const mapStateToProps = ({ firebase }) => ({
    firebase,

});
export default connect(
    mapStateToProps,
)(Footer);
