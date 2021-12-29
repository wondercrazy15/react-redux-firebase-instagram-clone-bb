import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import TextField from '@material-ui/core/TextField';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import fire from '../../Firebase/Firebase';
import { connect, useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { getRealtimeMassage, getRealtimeUsers, updateMassage } from '../../store/actions/userActions';
import StyledBadge from '../../components/UI/AvatarOnline/AvatarStyledBadge'
import LeftUser from './LeftUser';
// import MassageEditor from './MassageEditor';



import CssBaseline from '@mui/material/CssBaseline';
import Fab from '@mui/material/Fab';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListSubheader from '@mui/material/ListSubheader';
import IconButton from '@mui/material/IconButton';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import SendIcon from '@material-ui/icons/Send';
import Typography from '@mui/material/Typography';

const useStyles = makeStyles({
    table: {
        minWidth: 650,
    },
    chatSection: {
        width: '100%',
        height: '80vh'
    },
    headBG: {
        backgroundColor: '#e0e0e0'
    },
    borderRight500: {
        borderRight: '1px solid #e0e0e0'
    },
    messageArea: {
        height: '70vh',
        overflowY: 'auto'
    },
    table: {
        minWidth: 650,
    },
    headBG: {
        backgroundColor: '#e0e0e0'
    },
    borderRight500: {
        borderRight: '1px solid #e0e0e0'
    },
    messageArea: {
        height: '45vh',
        overflowY: 'auto',
        paddingTop: '0 !important'
    }
});

const Massage = ({ firebase }) => {
    const classes = useStyles();
    const history = useHistory();
    const dispatch = useDispatch();
    const [chatStarted, setChatStarted] = useState(false);
    const [chatUser, setChatUser] = useState('');

    const [massage, setMassage] = useState('');
    const [userId, setUserId] = useState('');


    let unsubscribe;

    const user = useSelector(state => state.user)

    // const [allUser, setAllUser] = useState([]);
    // useEffect(() => {
    //     fire.firestore().collection("users").get().then(querySnapshot => {
    //         querySnapshot.docs.forEach(element => {
    //             var data = { ...element.data() };
    //             setAllUser(allUser => [...allUser, data]);
    //         });
    //     })
    // }, [])


    useEffect(() => {
        unsubscribe = dispatch(getRealtimeUsers(firebase.auth.uid))
            .then(unsubscribe => {
                return unsubscribe;
            })
            .catch(error => {
                console.log(error)
            })
    }, [])

    useEffect(() => {
        return () => {
            unsubscribe.then(f => f()).catch(error => console.log(error))
        }
    }, [])

    // console.log(unsubscribe)


    const initChat = (user) => {
        setChatStarted(true)
        setChatUser(user)
        // console.log(user)

        // history.push(`/massage/${user.uid}`)

        dispatch(getRealtimeMassage({ userId: firebase.auth.uid, chatUserId: user.uid }))
    }

    const submitMassage = (e) => {
        e.preventDefault();

        const msgObj = {
            userId: firebase.auth.uid,
            chatUserId: chatUser.uid,
            massage,
        }

        if (massage !== "") {
            dispatch(updateMassage(msgObj)).then(() => {
                setMassage('')
            })
        }
    }

    return (
        <div className="container pt-5">
            <div>
                <Grid container component={Paper} className={classes.chatSection}>
                    <Grid item xs={3} className={classes.borderRight500}>
                        <List>
                            <ListItem button key="RemySharp">
                                <ListItemIcon>
                                    <StyledBadge>
                                        <Avatar alt={firebase.profile.userName} src={firebase.profile.file} />
                                    </StyledBadge>
                                </ListItemIcon>
                                <ListItemText primary={firebase.profile.userName}></ListItemText>
                            </ListItem>
                        </List>
                        <Divider />
                        <Grid item xs={12} style={{ padding: '10px' }}>
                            <TextField id="outlined-basic-email" label="Search" variant="outlined" fullWidth />
                        </Grid>
                        <Divider />
                        <List>

                            {user.users.length > 0 ?
                                user.users.map(user => (
                                    <LeftUser user={user} onClick={initChat} />
                                ))
                                : null
                            }
                        </List>
                    </Grid>
                    {/* <MassageEditor chatStarted={chatStarted} chatUser={chatUser} /> */}
                    <Grid item xs={9} className={classes.borderRight500} style={{ position: 'relative' }}>
                        <Grid >
                            <List>
                                {
                                    chatStarted ? (
                                        <ListItem key="RemySharp">
                                            <ListItemIcon>
                                                <IconButton aria-label="delete" size="large" onClick={() => history.push('/massage')}>
                                                    <KeyboardBackspaceIcon fontSize="inherit" />
                                                </IconButton>
                                            </ListItemIcon>
                                            <ListItemIcon>
                                                <Avatar alt={chatUser.userName} src={chatUser.file} />
                                            </ListItemIcon>
                                            <ListItemText primary={chatUser.userName}></ListItemText>
                                        </ListItem>
                                    ) : null
                                }
                            </List>
                            <Divider />
                            {/* <Grid item xs={12} style={{ padding: '10px' }}>
                                <TextField id="outlined-basic-email" label="Search" variant="outlined" fullWidth />
                            </Grid>
                            <Divider /> */}
                        </Grid>
                        <React.Fragment>
                            <CssBaseline />
                            <Grid item xs={12}>
                                <React.Fragment>
                                    <List className={classes.messageArea} sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                                        {
                                            chatStarted ? (
                                                user.massage.map(con => (
                                                    <>
                                                        <ListItem alignItems="flex-start" style={{ textAlign: con.userId === firebase.auth.uid ? 'right' : 'left' }}>
                                                            {/* <ListItemAvatar>
                                                                <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
                                                            </ListItemAvatar> */}
                                                            <ListItemText
                                                                primary={con.userId !== firebase.auth.uid ? chatUser.userName : null}
                                                                secondary={
                                                                    <React.Fragment>
                                                                        <Typography
                                                                            sx={{ display: 'inline' }}
                                                                            component="span"
                                                                            variant="body2"
                                                                            color="text.primary"
                                                                        >
                                                                            {con.massage}
                                                                        </Typography>
                                                                    </React.Fragment>
                                                                }
                                                            />
                                                        </ListItem>
                                                        <Divider component="li" />
                                                    </>
                                                ))
                                            ) : null
                                        }
                                    </List>
                                </React.Fragment>
                            </Grid>
                        </React.Fragment>
                        <Divider />
                        <form onSubmit={submitMassage}>
                            <Grid container style={{ padding: '20px', position: 'absolute', bottom: 0, width: '100%' }}>
                                {
                                    chatStarted ? (
                                        <>
                                            <Grid item sm={11} xs={9}>
                                                <TextField id="outlined-basic-email" label="Type Something" fullWidth
                                                    value={massage}
                                                    onChange={(e) => setMassage(e.target.value)}
                                                />
                                            </Grid>
                                            <Grid item sm={1} xs={3} align="right">
                                                <Fab color="primary" aria-label="add" type="submit"

                                                ><SendIcon /></Fab>
                                            </Grid>
                                        </>
                                    ) : null
                                }
                            </Grid>
                        </form>
                        <Divider />
                    </Grid>



                </Grid>
            </div>
        </div>
    )
}

const mapStateToProps = ({ firebase }) => ({
    firebase,
});

export default connect(mapStateToProps)(Massage);
