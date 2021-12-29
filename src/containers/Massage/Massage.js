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
import Avatar from '@mui/material/Avatar';
import fire from '../../Firebase/Firebase';
import { connect, useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { getRealtimeMassage, getRealtimeUsers, updateMassage } from '../../store/actions/userActions';
import StyledBadge from '../../components/UI/AvatarOnline/AvatarStyledBadge'
import LeftUser from './LeftUser';
// import MassageEditor from './MassageEditor';
import "./Message.css"



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
    headBG: {
        backgroundColor: '#e0e0e0'
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
                <Grid container component={Paper} className="chatSection">
                    <Grid item xs={12} md={3} className="borderRight">
                        <List>
                            <ListItem button key="RemySharp">
                                <ListItemIcon>
                                    <StyledBadge className={firebase.profile.isOnline ? 'online' : 'offline'}>
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
                        <List className="leftUserlist">

                            {user.users.length > 0 ?
                                user.users.map(user => (
                                    <LeftUser user={user} onClick={initChat} />
                                ))
                                : null
                            }
                        </List>
                    </Grid>
                    {/* <MassageEditor chatStarted={chatStarted} chatUser={chatUser} /> */}
                    <Grid item xs={12} md={9} className="borderRight500" style={{ position: 'relative' }}>
                        <Grid >
                            <List className="chatUserHeader">
                                {
                                    chatStarted ? (
                                        <ListItem key="RemySharp">
                                            <ListItemIcon>
                                                <Avatar alt={chatUser.userName} src={chatUser.file} />
                                            </ListItemIcon>
                                            <ListItemText primary={
                                                <React.Fragment>
                                                    <Typography
                                                        sx={{ display: 'inline' }}
                                                        component="span"
                                                        variant="body1"
                                                        color="text.primary"
                                                    >{chatUser.userName}
                                                    </Typography>
                                                </React.Fragment>
                                            }
                                                secondary={
                                                    <React.Fragment>
                                                        <Typography
                                                            sx={{ display: 'inline' }}
                                                            component="span"
                                                            variant="body2"
                                                            color="text.primary"
                                                        >{new Date(chatUser.createdAt.toDate()).toUTCString()}
                                                        </Typography>
                                                    </React.Fragment>
                                                }
                                            />
                                        </ListItem>
                                    ) : null
                                }
                            </List>
                            <Divider />
                        </Grid>
                        <React.Fragment>
                            <CssBaseline />
                            <Grid item xs={12}>
                                <React.Fragment>
                                    <List className="messageArea" sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                                        {
                                            chatStarted ? (
                                                user.massage.map(con => (
                                                    <>
                                                        <ListItem button alignItems="flex-start" style={{ textAlign: con.userId === firebase.auth.uid ? 'right' : 'left' }}>
                                                            {
                                                                con.userId !== firebase.auth.uid ?
                                                                    <ListItemAvatar style={{ minWidth: '40px', paddingTop: '10px' }}>
                                                                        <Avatar sx={{ width: 24, height: 24 }} alt={chatUser.userName} src={chatUser.file} />
                                                                    </ListItemAvatar>
                                                                    :
                                                                    null
                                                            }

                                                            {
                                                                con.userId !== firebase.auth.uid ?
                                                                    <ListItemText
                                                                        primary={
                                                                            <React.Fragment>
                                                                                <Typography
                                                                                    sx={{ display: 'inline' }}
                                                                                    component="span"
                                                                                    variant="body1"
                                                                                    color="text.primary"
                                                                                >{chatUser.userName}
                                                                                </Typography>
                                                                            </React.Fragment>
                                                                        }
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
                                                                    :
                                                                    null
                                                            }
                                                            {
                                                                con.userId === firebase.auth.uid ?
                                                                    <ListItemText
                                                                        primary={
                                                                            <React.Fragment>
                                                                                <Typography
                                                                                    sx={{ display: 'inline' }}
                                                                                    component="span"
                                                                                    variant="body1"
                                                                                    color="text.primary"
                                                                                >{firebase.profile.userName}
                                                                                </Typography>
                                                                            </React.Fragment>
                                                                        }
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
                                                                    :
                                                                    null
                                                            }

                                                            {
                                                                con.userId === firebase.auth.uid ?
                                                                    <ListItemAvatar style={{ minWidth: '40px', paddingTop: '10px', marginLeft: '10px' }}>
                                                                        <Avatar sx={{ width: 24, height: 24 }} alt={firebase.profile.userName} src={firebase.profile.file} />
                                                                    </ListItemAvatar>
                                                                    :
                                                                    null
                                                            }
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
                        <form onSubmit={submitMassage} style={{ position: 'absolute', bottom: 0, width: '100%' }}>
                            {/* <Divider /> */}
                            <Grid container style={{ padding: '20px', }}>
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
