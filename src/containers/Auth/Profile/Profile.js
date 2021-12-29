import React, { useState, useEffect } from "react";
import Button from '@material-ui/core/Button';
import './Profile.css'
import { connect } from 'react-redux';
import { Formik, Field, ErrorMessage, Form } from 'formik';
import * as Yup from 'yup';
import * as actions from '../../../store/actions/authActions';
import Heading from '../../../components/UI/Headings/Heading';
import Message from '../../../components/UI/Message/Message';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import IconButton from '@material-ui/core/IconButton';


import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import TwitterIcon from '@material-ui/icons/Twitter';
import YouTubeIcon from '@material-ui/icons/YouTube';
import InstagramIcon from '@material-ui/icons/Instagram';

import EditIcon from '@material-ui/icons//Edit';

import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { toast } from "react-toastify";
import { Avatar } from "@material-ui/core";


// tab start
import DashboardIcon from '@mui/icons-material/Dashboard';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';


function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`scrollable-auto-tabpanel-${index}`}
            aria-labelledby={`scrollable-auto-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box p={3}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};

function a11yProps(index) {
    return {
        id: `scrollable-auto-tab-${index}`,
        'aria-controls': `scrollable-auto-tabpanel-${index}`,
    };
}

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        width: '100%',
        backgroundColor: theme.palette.background.paper,
    },
}));
// tab end


// profile
class Thumb extends React.Component {
    state = {
        loading: false,
        thumb: undefined,
    };

    componentWillReceiveProps(nextProps) {
        if (!nextProps.file) { return; }

        this.setState({ loading: true }, () => {
            let reader = new FileReader();

            reader.onloadend = () => {
                this.setState({ loading: false, thumb: reader.result });
            };

            reader.readAsDataURL(nextProps.file);
        });
    }

    render() {
        const { file } = this.props;
        const { loading, thumb } = this.state;

        if (!file) { return null; }

        if (loading) { return <p>loading...</p>; }

        return (<img src={thumb}
            alt={file.name}
            className="img-thumbnail mt-2"
            height={200}
            width={200} />);
    }
}

const SUPPORTED_FORMATS = [
    "image/jpg",
    "image/jpeg",
    "image/png"
];

// end profile

const ProfileSchema = Yup.object().shape({
    userName: Yup.string()
        .min(3, 'Too short.')
        .max(25, 'Too long.')
        .required('Your first name is required.'),
    firstName: Yup.string()
        .min(3, 'Too short.')
        .max(25, 'Too long.')
        .required('Your first name is required.'),
    lastName: Yup.string()
        .min(3, 'Too short.')
        .max(25, 'Too long.')
        .required('Your last name is required.'),
    email: Yup.string()
        .email('Invalid email.')
        .required('The email is required.'),
    password: Yup.string().min(6, 'The password is too short.'),
    confirmPassword: Yup.string().when('password', {
        is: password => password.length > 0,
        then: Yup.string()
            .required('You need to confirm your password.')
            .oneOf([Yup.ref('password'), null], `Password doesn't match`),
    }),
    file: Yup
        .mixed()
        .required("A file is required")
        .test(
            "fileFormat",
            "Unsupported Format",
            value => value && SUPPORTED_FORMATS.includes(value.type)
        ),
    role: Yup.string()
        .required('The role is required.'),
});

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const Profile = ({
    firebase,
    editProfile,
    changeProfileImage,
    loading,
    error,
    loadingDelete,
    errorDelete,
    deleteUser,
    cleanUp,
    loggedIn
}) => {


    // tab
    const classes = useStyles();
    const [value, setValue] = useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    //tab


    useEffect(() => {
        return () => {
            cleanUp();
        };
    }, [cleanUp]);

    const [editProfileImage, setEditProfileImage] = useState(false);
    const [modalOpened, setModalOpened] = useState(false);
    const [profileModal, setProfileModal] = useState(false);


    if (!firebase.profile.isLoaded) return null;



    return (
        <>
            <section className="profile">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-md-12">
                            <div className="profile-content text-center">
                                <div className="p-2 profile">
                                    <div className="avatar mb-5 position-relative">
                                        <Avatar
                                            src={firebase.profile.file ? firebase.profile.file : firebase.profile.userName}
                                            alt={firebase.profile.userName}
                                            style={{ width: 150, height: 150, margin: '0 auto', }}
                                            className="img-raised rounded-circle img-fluid">
                                        </Avatar>
                                        <Button
                                            style={{
                                                borderRadius: '50%',
                                                width: '50px',
                                                height: '50px',
                                                position: 'absolute',
                                                top: '15px',
                                                maxWidth: '50px',
                                                maxHeight: '50px',
                                                minWidth: '50px',
                                                right: '50%',
                                                transform: 'translateX(70px) translateY(-50%)'
                                            }}
                                            onClick={() => setEditProfileImage(true)}
                                            variant="contained"
                                            color="primary">
                                            <EditIcon />
                                        </Button>
                                    </div>
                                    <div className="deatils">
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={() => setProfileModal(true)}>
                                            Edit Profile
                                        </Button>
                                        <h3 className="name">{firebase.profile.firstName}</h3>
                                        <h3 className="name">{firebase.profile.userName}</h3>

                                        <h3 className="name">{new Date(firebase.profile.createdAt.toDate()).toUTCString()}</h3>
                                        <h6>Designer</h6>
                                        <div className="icon py-3">
                                            <IconButton aria-label="youTube" color="primary" className="p-3 mx-2">
                                                <YouTubeIcon />
                                            </IconButton>
                                            <IconButton aria-label="twitter" className="p-3 mx-2">
                                                <TwitterIcon />
                                            </IconButton>
                                            <IconButton aria-label="instagram" color="secondary" className="p-3 mx-2">
                                                <InstagramIcon />
                                            </IconButton>
                                        </div>
                                        <div className="description">
                                            <p>An artist of considerable range, Chet Faker — the name taken by Melbourne-raised, Brooklyn-based Nick Murphy — writes, performs and records all of his own music, giving it a warm, intimate feel with a solid groove structure. </p>
                                        </div>
                                    </div>
                                </div>
                                <div className={classes.root}>
                                    <AppBar position="static" color="inherit">
                                        <Tabs
                                            value={value}
                                            onChange={handleChange}
                                            indicatorColor="primary"
                                            textColor="primary"
                                            variant="scrollable"
                                            scrollButtons="auto"
                                            aria-label="scrollable auto tabs example"
                                            fullWidth
                                        // variant="fullWidth"
                                        >
                                            <Tab icon={<DashboardIcon />} label="DashboardIcon" {...a11yProps(0)} />
                                            <Tab icon={<VideoLibraryIcon />} label="VideoLibraryIcon" {...a11yProps(0)} />
                                            <Tab icon={<PeopleAltIcon />} label="PeopleAltIcon" {...a11yProps(0)} />
                                        </Tabs>
                                    </AppBar>
                                    <TabPanel value={value} index={0}>
                                        Item One
                                    </TabPanel>
                                    <TabPanel value={value} index={1}>
                                        Item Two
                                    </TabPanel>
                                    <TabPanel value={value} index={2}>
                                        Item Three
                                    </TabPanel>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <div className="profile-dialog">
                <Dialog
                    open={profileModal}
                    TransitionComponent={Transition}
                    keepMounted
                    onClose={() => setProfileModal(false)}
                    className="pb-3"
                    fullWidth
                >
                    <div className="card shadow p-5">
                        <Formik
                            initialValues={{
                                userName: firebase.profile.userName,
                                firstName: firebase.profile.firstName,
                                lastName: firebase.profile.lastName,
                                email: firebase.auth.email,
                                password: '',
                                confirmPassword: '',
                            }}
                            validationSchema={ProfileSchema}
                            onSubmit={async (values, { setSubmitting }) => {
                                // edit the profile here
                                await editProfile(values);
                                setSubmitting(false);
                            }}
                        >
                            {({ isSubmitting, isValid, setFieldValue, values }) => (
                                <>
                                    <Form>
                                        <div className="form-group py-2">
                                            <Field
                                                type="text"
                                                name="userName"
                                                className="form-control"
                                                placeholder="user Name"
                                            />
                                            <ErrorMessage name="userName" />
                                        </div>
                                        <div className="form-group py-2">
                                            <Field
                                                type="text"
                                                name="firstName"
                                                className="form-control"
                                                placeholder="first Name"
                                            />
                                            <ErrorMessage name="firstName" />
                                        </div>
                                        <div className="form-group py-2">
                                            <Field
                                                type="text"
                                                name="lastName"
                                                className="form-control"
                                                placeholder="last Name"
                                            />
                                            <ErrorMessage name="lastName" />
                                        </div>
                                        <div className="form-group py-2">
                                            <Field
                                                type="email"
                                                name="email"
                                                className="form-control"
                                                placeholder="Email"
                                            />
                                            <ErrorMessage name="email" />
                                        </div>
                                        <div className="form-group py-2">
                                            <Field
                                                type="password"
                                                name="password"
                                                className="form-control"
                                                placeholder="New Password"
                                            />
                                            <ErrorMessage name="password" />
                                        </div>
                                        <div className="form-group py-2">
                                            <Field
                                                type="password"
                                                name="confirmPassword"
                                                className="form-control"
                                                placeholder="New Confirm Password"
                                            />
                                            <ErrorMessage name="confirmPassword" />
                                        </div>
                                        <div className="form-group py-2">
                                            <Button
                                                fullWidth
                                                variant="contained" color="primary"
                                                disabled={!isValid || isSubmitting}
                                                loading={loading ? 'Editing...' : null}
                                                type="submit"
                                            // onClick={() => setProfileModal(false)}
                                            >
                                                Edit
                                            </Button>
                                            <div>
                                                <Message error show={error}>
                                                    {error}
                                                    {toast({ error })}
                                                </Message>
                                            </div>
                                            <div>
                                                <Message success show={error === false}>
                                                    Profile was updated!
                                                </Message>
                                            </div>

                                            <Button
                                                fullWidth
                                                variant="contained"
                                                color="primary"
                                                className="my-3"
                                                onClick={() => setModalOpened(true)}>
                                                Delete my account
                                            </Button>
                                            <Button
                                                fullWidth
                                                variant="contained"
                                                color="secondary"
                                                className="my-3"
                                                onClick={() => setProfileModal(false)}>
                                                close
                                            </Button>
                                        </div>
                                    </Form>
                                </>
                            )}
                        </Formik>
                    </div>
                </Dialog>
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
                        <Heading bold size="h2" noMargin>Delete your account</Heading>
                    </DialogTitle>
                    <DialogContent className="pb-5">
                        <Heading size="h5">
                            Do you really want to delete your account?
                        </Heading>
                        <ButtonGroup
                            fullWidth
                            aria-label="contained primary button group"
                            variant="contained"
                        >
                            <Button color="secondary" onClick={() => setModalOpened(false)}>
                                Cancel
                            </Button>
                            <Button color="primary" onClick={() => deleteUser()}>
                                Delete Agree
                            </Button>
                        </ButtonGroup>
                    </DialogContent>
                    <div>
                        <Message severity="error" error show={errorDelete}>
                            {errorDelete}
                        </Message>
                    </div>
                </Dialog>

                <Dialog
                    open={editProfileImage}
                    TransitionComponent={Transition}
                    keepMounted
                    onClose={() => setEditProfileImage(false)}
                    aria-labelledby="alert-dialog-slide-title"
                    aria-describedby="alert-dialog-slide-description"
                    className="pb-3"
                    fullWidth
                >
                    <DialogTitle id="alert-dialog-slide-title">
                        <Heading bold size="h2" noMargin>Change Your Profile</Heading>
                    </DialogTitle>
                    <DialogContent className="pb-5">
                        <Formik
                            initialValues={{
                                file: ''
                            }}
                            validationSchema={ProfileSchema}
                            onSubmit={async (values, { setSubmitting, setEditProfileImage }) => {
                                // edit the profile here
                                await changeProfileImage(values);
                                setSubmitting(false);
                            }}
                        >
                            {({ isSubmitting, isValid, setFieldValue, values }) => (
                                <>
                                    <Form>
                                        <div className="form-group">
                                            <label>Your Profile Picture</label>
                                            <input id="file" name="file" type="file"
                                                accept="image/png, image/jpeg, image/jpg"
                                                onChange={(e) => {
                                                    setFieldValue("file", e.currentTarget.files[0]);
                                                }} className="form-control" />
                                            <Thumb file={values.file} />
                                        </div>
                                        <div className="form-group py-2">
                                            <Button
                                                fullWidth
                                                variant="contained" color="primary"
                                                disabled={!isValid || isSubmitting}
                                                loading={loading ? 'Editing...' : null}
                                                type="submit"
                                            // onClick={() => setProfileModal(false)}
                                            // onClick={() => setEditProfileImage(false)}
                                            >
                                                Edit
                                            </Button>
                                            <div>
                                                <Message error show={error}>
                                                    {error}
                                                    {toast({ error })}
                                                </Message>
                                            </div>
                                            <div>
                                                <Message success show={error === false}>
                                                    Profile was updated!
                                                </Message>
                                            </div>
                                            <Button
                                                fullWidth
                                                variant="contained"
                                                color="secondary"
                                                className="my-3"
                                                onClick={() => setEditProfileImage(false)}>
                                                close
                                            </Button>
                                        </div>
                                    </Form>
                                </>
                            )}
                        </Formik>
                    </DialogContent>
                    <div>
                        <Message severity="error" error show={errorDelete}>
                            {errorDelete}
                        </Message>
                    </div>
                </Dialog>
            </div>
        </>
    );
};


const mapStateToProps = ({ firebase, auth }) => ({
    firebase,
    loading: auth.profileEdit.loading,
    error: auth.profileEdit.error,
    loadingDelete: auth.deleteUser.loading,
    errorDelete: auth.deleteUser.error,
    loggedIn: firebase.auth,
});

const mapDispatchToProps = {
    editProfile: actions.editProfile,
    changeProfileImage: actions.changeProfileImage,
    cleanUp: actions.clean,
    deleteUser: actions.deleteUser,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Profile);