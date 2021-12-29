import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { newPost } from "../../store/actions/postsActions";
import Button from '@material-ui/core/Button';
import { connect } from 'react-redux';
import { CKEditor } from 'ckeditor4-react';



const AddPost = ({ loggedIn, firebase }) => {
    const dispatch = useDispatch();
    const [title, setTitle] = useState("");
    const [category, setCategory] = useState("");
    const [description, setDescription] = useState("");
    const [image, setImage] = useState("");
    const [progress, setProgress] = useState(0);

    const handleSubmit = (e) => {
        debugger
        e.preventDefault();

        if (!title || !category || !description) {
            return toast.warning("Please fill in all fields!");
        }

        if (!image || image === undefined) {
            return toast.warning("Please select an image!");
        }

        if (description.length < 50) {
            return toast.info("Description should be of atleast 50");
        }
        if (title.trim().split(" ").length < 2) {
            return toast.info("Title should be of atleast 2 words");
        }
        if (image.size > 3242880) {
            return toast.info("Image should be less than or equal to 3 MB");
        }
        const data = {
            title,
            category,
            description,
            image,
            authorId: loggedIn.uid,
        };

        dispatch(newPost(data, setProgress));
    };

    return (
        <div className="container">
            <div className="row">
                <div className="col-md-12 py-3">
                    <h1 className="display-4 text-dark text-center">Add Post</h1>
                </div>
                <div className="col-md-6 mx-auto mb-5 shadow p-md-5 p-2">
                    {progress ? (
                        progress !== 100 ? (
                            <div className="mx-auto p-5">
                                <h1 className="text-center my-2">
                                    Uploading Post - {progress}%
                                </h1>
                                <progress
                                    className="text-center"
                                    max={100}
                                    value={progress}
                                ></progress>
                            </div>
                        ) : (
                            <div className="mx-auto p-5   text-center ">
                                <i className="fa fa-tick text-success mx-auto my-2"></i>
                                <h1 className="text-center my-2">Post Uploaded successfully</h1>
                                <Link
                                    to={"/"}
                                    className="my-2 mx-auto btn btn-primary"
                                >
                                    See Posts
                                </Link>
                            </div>
                        )
                    ) : (
                        <form onSubmit={handleSubmit}>
                            <div className="form-group mb-3">
                                <input
                                    type="text"
                                    placeholder="Title"
                                    className="form-control"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                            </div>
                            <div className="form-group mb-3">
                                <input
                                    type="category"
                                    placeholder="Categories [followed with commas for multiple]"
                                    className="form-control"
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                />
                            </div>
                            <div className="form-group mb-3">
                                <CKEditor
                                    onChange={(evt) => setDescription(evt.editor.getData())}
                                />
                            </div>
                            <div className="form-group mb-3">
                                <input
                                    id="file"
                                    type="file"
                                    className="form-control"
                                    onChange={(e) => setImage(e.target.files[0])}
                                    accept="image/png, image/jpeg, image/jpg"
                                />
                                <img src={image ? URL.createObjectURL(image) : null} width="200px" height="200px" />
                            </div>
                            <div className="form-group mb-3">
                                <Button
                                    variant="contained" color="primary"
                                    type="submit"
                                    fullWidth
                                    value="Add Post"
                                >Add Post</Button>
                            </div>
                        </form>
                    )}
                </div>
            </div >
        </div >
    );
};

const mapStateToProps = ({ firebase }) => ({
    loggedIn: firebase.auth,
    firebase,
});

export default connect(mapStateToProps)(AddPost);
