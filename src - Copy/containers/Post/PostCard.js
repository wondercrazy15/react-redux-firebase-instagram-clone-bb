import React, { useState, useEffect } from "react";
import { connect, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import { postDel } from "../../store/actions/postsActions";
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import CardHeader from '@material-ui/core/CardHeader';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import Heading from '../../components/UI/Headings/Heading';
import fire from '../../Firebase/Firebase';

import CardMedia from '@material-ui/core/CardMedia';
import { CardActions, CardContent, Typography } from "@material-ui/core";
import FavoriteIcon from '@mui/icons-material/Favorite';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import TelegramIcon from '@mui/icons-material/Telegram';
import EditIcon from '@mui/icons-material/Edit';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import { CardActionArea } from '@mui/material';
import Card from '@mui/material/Card';
import DeleteIcon from '@mui/icons-material/Delete';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const PostCard = ({ post, id, loggedIn }) => {
    const history = useHistory();
    const dispatch = useDispatch();
    const [modalOpened, setModalOpened] = useState(false);
    const postDelete = () => {
        dispatch(postDel(post.postId));
        toast.success("Post deleted successfully!");
    };

    const [user, setUser] = useState([]);

    useEffect(() => {
        fire.firestore().collection("users").get().then(querySnapshot => {
            querySnapshot.docs.forEach(element => {
                var data = { ...element.data() };
                setUser(user => [...user, data]);
            });
        })
    }, [])

    const getUserProfile = (userPostId) => {
        if (userPostId && user.length > 0) {
            var result1 = user.filter(x => x.uid === userPostId).length === 1 ? user.filter(x => x.uid === userPostId)[0].file : null
            return result1
        }
    }


    const getUserName = (userPostId) => {
        if (userPostId && user.length > 0) {
            var result1 = user.filter(x => x.uid === userPostId).length === 1 ? user.filter(x => x.uid === userPostId)[0].userName : null
            return result1
        }
    }
    return (
        <>
            <div className="col-md-6 col-lg-4 pb-4" key={id}>
                <Card>
                    <CardHeader
                        className="px-2 py-3"
                        avatar={
                            <Avatar
                                style={{ cursor: 'pointer' }}
                                onClick={() => history.push('/profile')}
                                src={getUserProfile(post.post.authorId)}
                                alt={post.post.authorUserName} />
                        }
                        action={
                            <IconButton aria-label="settings">
                                <MoreVertIcon />
                            </IconButton>
                        }
                        title={getUserName(post.post.authorId)}
                        subheader={post.post.createdAt}
                    />
                    <CardMedia
                        component="img"
                        height="200"
                        src={post.post.image}
                        alt={post.post.title}
                        onClick={() => history.push(`/post/${post.postId}`)}
                        style={{ cursor: 'pointer' }}
                    />
                    <CardActions disableSpacing>
                        <IconButton aria-label="add to favorites">
                            <FavoriteIcon />
                        </IconButton>
                        <IconButton aria-label="ChatBubbleOutlineIcon">
                            <ChatBubbleOutlineIcon />
                        </IconButton>
                        <IconButton aria-label="TelegramIcon">
                            <TelegramIcon />
                        </IconButton>
                        {loggedIn.uid && post.post.authorId === loggedIn.uid ?
                            <IconButton aria-label="edit" onClick={() => history.push(`/post/${post.postId}/edit`)}>
                                <EditIcon />
                            </IconButton>
                            : null
                        }
                        <IconButton onClick={() => setModalOpened(true)} aria-label="delete">
                            <DeleteIcon />
                        </IconButton>
                        <IconButton aria-label="BookmarkIcon" className="ml-auto">
                            <BookmarkIcon />
                        </IconButton>
                    </CardActions>
                    <CardActionArea>
                        <CardContent className="pt-0">
                            <Typography variant="h6" color="text.secondary">
                                {post.post.title}
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                                {post.post.description.substring(0, 1).toUpperCase() +
                                    post.post.description.substring(1, 100)}
                                ...
                            </Typography>
                            {post.post.category.split(",").map((ctg, i) => (
                                <Typography variant="body1" color="text.secondary" key={i}>
                                    <b>category : </b>{ctg.trim()}
                                </Typography>
                            ))}
                        </CardContent>
                    </CardActionArea>
                </Card>
                <div>
                    <Dialog
                        open={modalOpened}
                        TransitionComponent={Transition}
                        keepMounted
                        onClose={() => setModalOpened(false)}
                        aria-labelledby="alert-dialog-slide-title"
                        aria-describedby="alert-dialog-slide-description"
                        className="pb-3"
                    >
                        <DialogTitle id="alert-dialog-slide-title">
                            <Heading bold size="h2" noMargin>Delete your post</Heading>
                        </DialogTitle>
                        <DialogContent className="pb-5">
                            <Heading size="h5">
                                Do you really want to delete your post?
                            </Heading>
                            <ButtonGroup
                                fullWidth
                                aria-label="contained primary button group"
                                variant="contained"
                            >
                                <Button color="secondary" onClick={() => setModalOpened(false)}>
                                    Cancel
                                </Button>
                                <Button color="primary" onClick={() => postDelete(false)}>
                                    Delete Agree
                                </Button>
                            </ButtonGroup>
                        </DialogContent>
                    </Dialog>
                </div>
            </div >
        </>
    );
};

const mapStateToProps = ({ firebase }) => ({
    loggedIn: firebase.auth,
});

export default connect(mapStateToProps)(PostCard);
