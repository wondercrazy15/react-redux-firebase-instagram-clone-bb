import React, { useState } from "react";
import { connect } from "react-redux";
import Button from '@material-ui/core/Button';


const AddReply = ({ id, handleReply, replyBoxSet, loggedIn, firebase }) => {
    const [reply, setReply] = useState("");

    const name = firebase.profile.userName;
    const email = loggedIn.email;

    return (
        <div key={id}>
            <textarea
                className="form-control mb-2"
                placeholder="Reply..."
                value={reply}
                onChange={(e) => setReply(e.target.value)}
            ></textarea>
            <div>
                <Button
                    variant="contained"
                    color="primary"
                    type="button"
                    className=" mr-2"
                    onClick={() => {
                        handleReply({ i: id, reply: { name, email, reply } });
                        replyBoxSet(false, id);
                        setReply("");
                    }}
                >
                    Reply
                </Button>
                <Button
                    variant="contained"
                    color="secondary"
                    type="button"
                    onClick={() => replyBoxSet(false, id)}
                >
                    Cancel
                </Button>
            </div>
        </div>
    );
};


const mapStateToProps = ({ firebase }) => ({
    loggedIn: firebase.auth,
    firebase
});

export default connect(mapStateToProps)(AddReply);
