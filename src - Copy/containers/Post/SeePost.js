import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
    doComment,
    doReply,
    getPosts,
    deleteComment,
} from "../../store/actions/postsActions";
import { connect } from 'react-redux';
import AddReply from "./AddReply";
import Button from '@material-ui/core/Button';
import fire from "../../Firebase/Firebase";
import { Avatar } from "@material-ui/core";

const SeePost = ({ loggedIn, firebase }) => {
    const { id } = useParams();
    const [comment, setComment] = useState("");

    const { posts, postsLoading, userId } = useSelector(
        (state) => ({
            posts: state.posts.posts,
            postsLoading: state.posts.postsLoading,
            user: state.auth.user,
            userId: loggedIn.uid,
        }),
        shallowEqual
    );
    const dispatch = useDispatch();

    const currentPost = posts.find((post) => post.postId === id && post);
    const [replyBox, setReplyBox] = useState([]);
    const [showReplies, setShowReplies] = useState([]);

    useEffect(() => {
        if (postsLoading) {
            dispatch(getPosts());
        }
    }, [dispatch, postsLoading]);

    const replyBoxSet = (data, id) => {
        setReplyBox(
            currentPost.post.comments.map((reply, i) => (i === id ? data : false))
        );
    };
    const showRepliesSet = (data, id) => {
        setShowReplies(
            currentPost.post.comments.map((reply, i) => (i === id ? data : false))
        );
    };
    const makeComment = async (e) => {
        e.preventDefault();
        if (loggedIn) {
            if (!comment) {
                return toast.warning("Please add comment!");
            }
            const data = {
                name: firebase.profile.userName,
                email: loggedIn.email,
                comment,
                replies: [],
                admin: true,
                userId,
                postOwner: currentPost.post.authorId === userId,
            };
            setComment("");

            await dispatch(
                doComment(currentPost.postId, currentPost.post.comments, data)
            );
            return toast.success("Comment added Successfully!");
        }
    };

    const handleReply = async ({ i, reply }) => {
        let data = {};
        if (loggedIn) {
            if (!reply.reply) return toast.warning("Please add Reply!");
            data = {
                name: firebase.profile.userName,
                email: loggedIn.email,
                reply: reply.reply,
                admin: true,
                userId,
                postOwner: currentPost.post.authorId === userId,
            };
        } else {
            if (!reply.reply || !reply.email || !reply.name)
                return toast.warning("Please fill in all fields!");
            data = {
                name: reply.name,
                email: reply.email,
                reply: reply.reply,
                admin: false,
                userId: null,
                postOwner: false,
            };
        }
        const postId = id;
        await dispatch(doReply(i, postId, currentPost.post.comments, data));
        toast.success("Reply added Successfully!");
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

    return (
        <section className="single-post">
            {postsLoading ? (
                <h1 className="text-center">Post Loading...</h1>
            ) : currentPost ? (
                <>
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-md-12 p-0" style={{ height: "400px" }}>
                                <img
                                    className="h-100 w-100"
                                    style={{ objectFit: "cover", objectPosition: "center" }}
                                    src={currentPost.post.image}
                                    alt={currentPost.post.title}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="container">
                        <div className="row">
                            <div className="col-md-12 py-2 px-md-5 mb-3">
                                <div className="row align-items-center justify-content-between">
                                    <div className="col-md-6">
                                        <h3 className="display-4 text-capitalize">
                                            {currentPost.post.title}
                                        </h3>
                                    </div>
                                    <div className="col-md-4 align-items-center justify-content-end text-right">
                                        {currentPost.post.category.split(",").map((category, id) => (
                                            <span key={id} className="bg-primary px-2 py-1 text-white">
                                                {category.trim()}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-12">
                                        <p className="card-text py-4 text-justify">
                                            {currentPost.post.description}
                                        </p>
                                    </div>
                                    <div className="col-md-12">
                                        <div className="comments py-4 ">
                                            <form className="" onSubmit={makeComment}>
                                                <div className="form-group">
                                                    <textarea
                                                        className="form-control"
                                                        placeholder="Add Comment"
                                                        value={comment}
                                                        onChange={(e) => setComment(e.target.value)}
                                                    ></textarea>
                                                </div>
                                                <div className="form-group">
                                                    <Button type="submit" variant="contained" color="primary" className="my-2">
                                                        Add Comment
                                                    </Button>
                                                </div>
                                            </form>
                                            {currentPost.post.comments.length > 0 ? (
                                                currentPost.post.comments.map((comment, id) => (
                                                    <>
                                                        <form
                                                            className="p-3 my-3 mb-2  card"
                                                            key={id + 100}
                                                        >
                                                            <div className="row align-items-center justify-content-between profile">
                                                                <div className="col-md-6">
                                                                    <div className="d-flex">
                                                                        <div className="p-3">
                                                                            <Avatar src={getUserProfile(comment.userId)} />
                                                                        </div>
                                                                        <div className="ml-2 mt-1">
                                                                            <h5 className="card-title mb-0 text-capitalize">
                                                                                {comment.name}
                                                                            </h5>
                                                                            <a
                                                                                className="small"
                                                                                href={`mailto:${comment.email}`}
                                                                            >
                                                                                {comment.email}
                                                                            </a>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="col-md-6 text-right">
                                                                    {comment.admin ? (
                                                                        comment.postOwner ? (
                                                                            <div className="d-flex">
                                                                                <p className="small bg-dark text-white py-1 px-2 ml-auto">
                                                                                    Owner
                                                                                </p>
                                                                                <p className="small bg-dark text-white py-1 px-2 ml-2">
                                                                                    Admin
                                                                                </p>
                                                                            </div>
                                                                        ) : (
                                                                            <p className="small bg-dark text-white py-1 px-2">
                                                                                Admin
                                                                            </p>
                                                                        )
                                                                    ) : null}
                                                                </div>
                                                            </div>
                                                            <div className="form-group py-3 px-3">
                                                                <p className="card-text">{comment.comment}</p>
                                                            </div>
                                                            <p
                                                                className="bg-dark text-center mx-3 py-2 px-3 text-white"
                                                                style={{ width: "100px" }}
                                                            >
                                                                Replies
                                                            </p>
                                                            <div className="form-group px-3">
                                                                {showReplies[id] === true ? (
                                                                    comment.replies.length > 0 ? (
                                                                        <>
                                                                            {comment.replies.map((rply, i) => (
                                                                                <>
                                                                                    <div
                                                                                        className={`row m-0 form-group py-3 d-flex align-items-center justify-content-between profile`}
                                                                                        key={i}
                                                                                    >
                                                                                        <div className="col-md-6  pb-md-0">
                                                                                            <div className="d-flex">
                                                                                                <div className="rounded-circle p-3 text-center bg-dark text-white text-uppercase">
                                                                                                    {rply.name.split(" ").length < 2
                                                                                                        ? rply.name[0] + rply.name[1]
                                                                                                        : rply.name.split(" ")[0][0] +
                                                                                                        rply.name.split(" ")[1][0]}

                                                                                                    <Avatar src={getUserProfile(comment.userId)} />
                                                                                                </div>
                                                                                                <div className="ml-2 mt-1">
                                                                                                    <h5 className="card-title mb-0 text-capitalize">
                                                                                                        {rply.name}
                                                                                                    </h5>
                                                                                                    <a
                                                                                                        className="small"
                                                                                                        href={`mailto:${rply.email}`}
                                                                                                    >
                                                                                                        {rply.email}
                                                                                                    </a>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                        <div className="col-md-6 text-right">
                                                                                            {rply.admin ? (
                                                                                                rply.postOwner ? (
                                                                                                    <div className="d-flex">
                                                                                                        <p className="small bg-dark text-white py-1 px-2 ml-auto">
                                                                                                            Owner
                                                                                                        </p>
                                                                                                        <p className="small bg-dark text-white py-1 px-2 ml-2">
                                                                                                            Admin
                                                                                                        </p>
                                                                                                    </div>
                                                                                                ) : (
                                                                                                    <p className="small bg-dark text-white py-1 px-2">
                                                                                                        Admin
                                                                                                    </p>
                                                                                                )
                                                                                            ) : null}
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="col-md-12 pb-3 border-bottom">
                                                                                        {rply.reply}
                                                                                    </div>
                                                                                </>
                                                                            ))}

                                                                            <Button
                                                                                variant="contained"
                                                                                color="secondary"
                                                                                className="mt-3"
                                                                                onClick={() => showRepliesSet(false, id)}
                                                                            >
                                                                                Hide Replies
                                                                            </Button>
                                                                        </>
                                                                    ) : (
                                                                        <p className="card-text">No Replies</p>
                                                                    )
                                                                ) : comment.replies.length > 0 ? (
                                                                    <Button
                                                                        variant="contained"
                                                                        color="secondary"
                                                                        onClick={() => showRepliesSet(true, id)}
                                                                    >
                                                                        view {comment.replies.length} replies
                                                                    </Button>
                                                                ) : (
                                                                    <p className="card-text">No Replies</p>
                                                                )}
                                                            </div>
                                                            <div className="form-group px-3">
                                                                {replyBox[id] === true ? (
                                                                    <AddReply
                                                                        id={id}
                                                                        handleReply={handleReply}
                                                                        replyBoxSet={replyBoxSet}
                                                                    />
                                                                ) : (
                                                                    <Button
                                                                        variant="contained"
                                                                        color="primary"
                                                                        onClick={() => replyBoxSet(true, id)}
                                                                    >
                                                                        Reply
                                                                    </Button>
                                                                )}
                                                            </div>
                                                            {loggedIn.uid && currentPost.post.authorId === userId && (
                                                                <div className="col-md-12 text-right">
                                                                    <Button
                                                                        variant="contained"
                                                                        color="secondary"
                                                                        type="button"
                                                                        onClick={async () => {
                                                                            await dispatch(
                                                                                deleteComment(
                                                                                    id,
                                                                                    currentPost.postId,
                                                                                    currentPost.post.comments
                                                                                )
                                                                            );
                                                                            toast.success("Comment Deleted Successfully!");
                                                                        }}
                                                                    >
                                                                        Delete Comment
                                                                    </Button>
                                                                </div>
                                                            )}
                                                        </form>
                                                    </>
                                                ))
                                            ) : (
                                                <h1 className="card-heading text-center my-3">No comments</h1>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                <h1 className="text-center">
                    Post with id <span className="text-primary">{id}</span> does not
                    exists
                </h1>
            )
            }{" "}
        </section>
    );
};

const mapStateToProps = ({ firebase }) => ({
    loggedIn: firebase.auth,
    firebase
});
export default connect(mapStateToProps)(SeePost);
