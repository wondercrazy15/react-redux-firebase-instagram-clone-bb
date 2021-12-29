import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { getPosts } from "../../store/actions/postsActions";
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import CardHeader from '@material-ui/core/CardHeader';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import CardMedia from '@material-ui/core/CardMedia';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { connect } from 'react-redux';
import fire from '../../Firebase/Firebase'
import CircularProgress from '@material-ui/core/CircularProgress';
import Box from '@material-ui/core/Box';
import { CardActions, CardContent, Typography } from "@material-ui/core";
import FavoriteIcon from '@mui/icons-material/Favorite';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import TelegramIcon from '@mui/icons-material/Telegram';
import EditIcon from '@mui/icons-material/Edit';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import { CardActionArea } from '@mui/material';
import Card from '@mui/material/Card';

const Home = ({ loggedIn, firebase }) => {
    const history = useHistory();
    const { posts, postsLoading } = useSelector(
        (state) => ({
            posts: state.posts.posts,
            postsLoading: state.posts.postsLoading,
            isLoggedIn: state.auth.isLoggedIn,
        }),
        shallowEqual
    );

    const latestPosts = posts;
    latestPosts
        .sort((a, b) => {
            const postA = new Date(a.post.createdAt);
            const postB = new Date(b.post.createdAt);

            if (postA < postB) return 1;
            if (postA > postB) return -1;
            return 0;
        })
        .slice(0, 5);


    const dispatch = useDispatch();

    useEffect(() => {
        if (postsLoading) {
            dispatch(getPosts());
        }
    }, [dispatch, postsLoading]);



    // let x = []
    // const Fetchdata = async (id, index) => {
    //     await fire.firestore().collection("users").doc(id).get().then(res => {
    //         // querySnapshot.docs.forEach(element => {
    //         //     var id = element.id
    //         //     var data = { ...element.data(), id };
    //         //     setUser(user => [...user, data]);
    //         // }); 
    //         x = x.concat({ ...res.data() })
    //         if (index === latestPosts.length - 1) {
    //             setUser(x)
    //         }
    //     })
    // }
    // useEffect(() => {
    //     if (latestPosts && latestPosts.length > 0) {
    //         latestPosts.map((post, index) => {
    //             if (post.post.authorId) {
    //                 Fetchdata(post.post.authorId, index);
    //                 setPost({ ...post }, index);
    //             }
    //         })
    //     }
    // }, [latestPosts])


    // var userFilter = user.filter((x) => x.uid === post.post.authorId)
    // useEffect(() => {
    //     userFilter.map((user, index) => {
    //         setUserPostFilter(user, index)
    //     })
    // }, [userFilter])
    // console.log(user)
    const [user, setUser] = useState([]);

    useEffect(() => {
        fire.firestore().collection("users").get().then(querySnapshot => {
            querySnapshot.docs.forEach(element => {
                var data = { ...element.data() };
                setUser(user => [...user, data]);
            });
        })
    }, [])

    // var result = latestPosts.filter(function (post) {
    //     return user.some(function (user) {
    //         return post.post.authoerId === user.uid;
    //     });
    // });
    // var result1 = user.filter(user => latestPosts.some(post => user.uid === post.post.authorId));

    // console.log(user)
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
        <div className="container pt-5">
            <div className="row">
                {/* {let UserData = JSON.stringify(user)} */}
                {postsLoading
                    ? (
                        <Box sx={{ display: 'flex' }}>
                            <CircularProgress />
                        </Box>
                    )
                    : latestPosts.map((post, id) => (
                        <div className="col-md-6 col-lg-4 mb-3 px-2">
                            <div className="w-100 mb-2" key={id}>
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
                                    // onClick={() => history.push(`/post/${post.postId}`)}
                                    // style={{ cursor: 'pointer' }}
                                    />
                                    <CardActions disableSpacing>
                                        <IconButton aria-label="add to favorites">
                                            <FavoriteIcon />
                                        </IconButton>
                                        <IconButton aria-label="share">
                                            <ChatBubbleIcon />
                                        </IconButton>
                                        <IconButton aria-label="share">
                                            <TelegramIcon />
                                        </IconButton>
                                        {loggedIn.uid && post.post.authorId === loggedIn.uid ?
                                            <IconButton aria-label="edit" onClick={() => history.push(`/post/${post.postId}/edit`)}>
                                                <EditIcon />
                                            </IconButton>
                                            : null
                                        }
                                        <IconButton aria-label="share" className="ml-auto">
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
                            </div>
                        </div>
                    ))}
                {/* <Link to="/posts" className="btn btn-dark btn-block">
                    All Posts
                </Link> */}
            </div>
        </div>
    );
};

const mapStateToProps = ({ firebase }) => ({
    loggedIn: firebase.auth,
    firebase,
});
export default connect(mapStateToProps)(Home);
