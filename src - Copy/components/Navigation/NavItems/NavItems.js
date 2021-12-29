import React, { useState } from 'react';
// import styled from 'styled-components';
// import NavItem from './NavItem/NavItem';
import { useHistory } from "react-router-dom";
import { connect } from 'react-redux';
import * as actions from '../../../store/actions/authActions';
import TelegramIcon from '@material-ui/icons/Telegram';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';

import ButtonGroup from '@material-ui/core/ButtonGroup';

import clsx from 'clsx';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';


const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
    },
    list: {
        width: 300,
    },
    fullList: {
        width: 'auto',
    },
    bottonLogout: {
        position: 'absolute',
        width: '100%',
        bottom: 0,
        right: 0,
        left: 0,
    },
}));

const NavItems = ({ loggedIn, editProfile, firebase }) => {
    const classes = useStyles();
    const history = useHistory();

    const [themeName, setThemeName] = useState('');


    const [drawer, setDrawer] = useState({ right: false });
    const toggleDrawer = (anchor, open) => (event) => {
        if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setDrawer({ ...drawer, [anchor]: open });
    };
    // console.log(loggedIn)

    return (
        <>
            <div className={classes.root}>
                <AppBar position="static" className="py-2">
                    <Toolbar>
                        {loggedIn.uid ? (
                            <div className="d-flex align-items-center">
                                {['left'].map((anchor) => (
                                    <React.Fragment key={anchor}>
                                        <IconButton onClick={toggleDrawer(anchor, true)} edge="start" className={classes.menuButton} size="large" color="inherit" aria-label="menu">
                                            <MenuIcon />
                                        </IconButton>
                                        {/* <Button onClick={toggleDrawer(anchor, true)}>{anchor}</Button> */}
                                        <SwipeableDrawer
                                            anchor={anchor}
                                            open={drawer[anchor]}
                                            onClose={toggleDrawer(anchor, false)}
                                            onOpen={toggleDrawer(anchor, true)}
                                        >
                                            <div
                                                className={clsx(classes.list)}
                                                role="presentation"
                                                onClick={toggleDrawer(anchor, false)}
                                                onKeyDown={toggleDrawer(anchor, false)}
                                            >
                                                <div className="p-3">
                                                    <Typography variant="h5" className="pb-3">
                                                        Your Custom Theme Color
                                                    </Typography>
                                                    <ButtonGroup size="large" color="inherit" variant="contained" className="ml-auto">
                                                        <Button color="primary" onClick={() => setThemeName('blue')} style={{ borderRadius: 0 }}>
                                                            Primary
                                                        </Button>
                                                        <Button color="secondary" onClick={() => setThemeName('green')} style={{ borderRadius: 0 }}>
                                                            secondary
                                                        </Button>
                                                    </ButtonGroup>
                                                </div>
                                                <div className={classes.bottonLogout}>
                                                    <Button size="large" color="primary" fullWidth variant="contained" className="py-3" onClick={() => history.push('/logout')} style={{ borderRadius: 0 }}>
                                                        logout
                                                    </Button>
                                                </div>
                                            </div>
                                        </SwipeableDrawer>
                                    </React.Fragment>
                                ))}
                                <div className="d-md-block d-none">
                                    <Typography onClick={() => history.push('/')} style={{ borderRadius: 0, cursor: 'pointer' }}>{firebase.profile.userName}</Typography>
                                </div>
                            </div>
                        ) :
                            (
                                <Typography variant="h6">Instragram Demo</Typography>
                            )
                        }

                        {loggedIn.uid ? (
                            <ButtonGroup size="large" color="inherit" variant="contained" className="ml-auto">
                                <Button color="primary" onClick={() => history.push('/massage')} style={{ borderRadius: 0 }}>
                                    <TelegramIcon />
                                </Button>
                            </ButtonGroup>
                        ) : (
                            <ButtonGroup size="large" color="primary" variant="contained" className="ml-auto">
                                <Button onClick={() => history.push('/login')} style={{ borderRadius: 0 }}>
                                    login
                                </Button>
                                <Button color="secondary" onClick={() => history.push('/signup')} style={{ borderRadius: 0 }}>
                                    signup
                                </Button>
                            </ButtonGroup>
                        )
                        }
                    </Toolbar>
                </AppBar>
            </div>
        </>
    )
};

const mapStateToProps = ({ firebase, auth }) => ({
    firebase,
    loading: auth.profileEdit.loading,
    error: auth.profileEdit.error,
    loadingDelete: auth.deleteUser.loading,
    errorDelete: auth.deleteUser.error,
});

const mapDispatchToProps = {
    editProfile: actions.editProfile,
    cleanUp: actions.clean,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(NavItems);
