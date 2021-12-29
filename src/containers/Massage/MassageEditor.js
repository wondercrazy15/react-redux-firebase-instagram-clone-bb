import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import TextField from '@material-ui/core/TextField';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import SendIcon from '@material-ui/icons/Send';
import CircularProgress from '@material-ui/core/CircularProgress';
import fire from '../../Firebase/Firebase';
import { connect } from 'react-redux';
import { useHistory, useParams } from 'react-router';
import { Box } from '@mui/system';
import CssBaseline from '@mui/material/CssBaseline';
import Paper from '@mui/material/Paper';
import Fab from '@mui/material/Fab';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';

const useStyles = makeStyles({
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

const Massage = (props, { firebase }) => {
    const [massageInput, setMassageInput] = useState('');
    const classes = useStyles();
    const { id } = useParams();
    const history = useHistory();


    const { chatStarted, chatUser } = props;

    const messages = [
        {
            id: 1,
            primary: 'Brunch this week?',
            secondary: "I'll be in the neighbourhood this week. Let's grab a bite to eat",
            person: '/static/images/avatar/5.jpg',
        },
    ];

    const submitMassage = (e) => {
        e.preventDefault();

        const msgObj = {
            userId: firebase.auth.uid,
            chatUserId: chatUser.uid,
            massageInput,
        }
        console.log(msgObj)
    }

    return (
        <div className="container py-2">
            <div>
                <Grid container component={Paper} className={classes.chatSection}>
                    <Grid item xs={12} className={classes.borderRight500}>
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
                        <Grid item xs={12} style={{ padding: '10px' }}>
                            <TextField id="outlined-basic-email" label="Search" variant="outlined" fullWidth />
                        </Grid>
                        <Divider />
                    </Grid>
                    <React.Fragment>
                        <CssBaseline />
                        <Grid item xs={12}>
                            <List className={classes.messageArea} sx={{ mb: 2 }}>
                                {
                                    chatStarted ? (
                                        messages.map(({ id, primary, secondary, person }) => (
                                            <React.Fragment key={id}>
                                                {id === 1 && (
                                                    <ListSubheader sx={{ bgcolor: 'background.paper' }}>
                                                        Today
                                                    </ListSubheader>
                                                )}

                                                {id === 3 && (
                                                    <ListSubheader sx={{ bgcolor: 'background.paper' }}>
                                                        Yesterday
                                                    </ListSubheader>
                                                )}

                                                <ListItem button>
                                                    <ListItemAvatar>
                                                        <Avatar alt="Profile Picture" src={person} />
                                                    </ListItemAvatar>
                                                    <ListItemText primary={primary} secondary={secondary} />
                                                </ListItem>
                                            </React.Fragment>
                                        ))
                                    ) : null
                                }
                            </List>
                        </Grid>
                    </React.Fragment>
                    <Divider />
                    <Grid container style={{ padding: '20px' }}>
                        {
                            chatStarted ? (
                                <>
                                    <Grid item sm={11} xs={9}>
                                        <TextField id="outlined-basic-email" label="Type Something" fullWidth
                                            value={massageInput}
                                            onChange={(e) => setMassageInput(e.target.value)}
                                        />
                                    </Grid>
                                    <Grid item sm={1} xs={3} align="right">
                                        <Fab color="primary" aria-label="add" type="submit"
                                            onClick={submitMassage}
                                        ><SendIcon /></Fab>
                                    </Grid>
                                </>
                            ) : null
                        }

                    </Grid>
                    <Divider />
                </Grid>
            </div>
        </div >
    )
}

const mapStateToProps = ({ firebase }) => ({
    firebase,
});

export default connect(mapStateToProps)(Massage);
