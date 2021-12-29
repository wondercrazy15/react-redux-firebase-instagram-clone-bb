import React, { useEffect } from "react";
import Button from '@material-ui/core/Button';
import { useHistory } from "react-router";

import { connect } from 'react-redux';
import Message from '../../../components/UI/Message/Message';

import { Formik, Field, ErrorMessage, Form } from 'formik';
import * as Yup from 'yup';
import * as actions from '../../../store/actions/authActions';


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

const SignUpSchema = Yup.object().shape({
    userName: Yup.string()
        .min(3, 'Too short.')
        .max(25, 'Too long.')
        .required('Your user name is required.'),
    firstName: Yup.string()
        .min(3, 'Too short.')
        .max(25, 'Too long.')
        .required('Your first name is required.'),
    lastName: Yup.string()
        .min(3, 'Too short.')
        .max(25, 'Too long.')
        .required('Your first name is required.'),
    email: Yup.string()
        .email('Invalid email.')
        .required('The email is required.'),
    password: Yup.string()
        .min(6, 'The password is too short.')
        .required('The passoword is required.'),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], `Password doesn't match`)
        .required('You need to confirm your password.'),
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

const SignUp = ({ signUp, loading, error, cleanUp }) => {
    const history = useHistory();

    useEffect(() => {
        return () => {
            cleanUp();
        };
    }, [cleanUp]);


    // const signInWithGoogle = () => {
    //     signInWithGoogle()
    // }

    return (
        <div className="container">
            <div className="row justify-content-center">
                <h1 className="text-center font-weight-bolder">
                    React Firebase Register
                    <span className="text-primary"> [Admin]</span>
                </h1>

                <div className="col-md-7 shadow p-md-5 p-2 mt-md-5 mx-auto">
                    <Formik
                        initialValues={{
                            userName: '',
                            firstName: '',
                            lastName: '',
                            email: '',
                            password: '',
                            confirmPassword: '',
                            file: '',
                            role: []
                        }}
                        validationSchema={SignUpSchema}
                        onSubmit={async (values, { setSubmitting }) => {
                            await signUp(values);
                            setSubmitting(false);
                            history.push('/')
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
                                        <ErrorMessage name="firstname" />
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
                                            placeholder="Password"
                                        />
                                        <ErrorMessage name="password" />
                                    </div>
                                    <div className="form-group py-2">
                                        <Field
                                            type="password"
                                            name="confirmPassword"
                                            className="form-control"
                                            placeholder="Confirm Password"
                                        />
                                        <ErrorMessage name="confirmPassword" />
                                    </div>
                                    <div className="form-group">
                                        <label>Your Profile Picture</label>
                                        <input id="file" name="file" type="file"
                                            accept="image/png, image/jpeg, image/jpg"
                                            onChange={(e) => {
                                                setFieldValue("file", e.currentTarget.files[0]);
                                            }} className="form-control" />
                                        <Thumb file={values.file} />
                                    </div>
                                    <div class="form-group">
                                        <label for="role">Role</label>
                                        <Field
                                            component="select"
                                            id="role"
                                            name="role"
                                        >
                                            <option value="" label="Select Role" />
                                            <option value="userRole">user role</option>
                                            <option value="adminRole" disabled>admin role</option>
                                        </Field>
                                    </div>
                                    <div className="form-group py-2">
                                        <Button
                                            fullWidth
                                            variant="contained" color="primary"
                                            disabled={!isValid || isSubmitting}
                                            loading={loading ? 'Logging in...' : null}
                                            type="submit"
                                        >
                                            signup
                                        </Button>
                                        {/* <div className="login-buttons">
                                            <Button
                                                fullWidth
                                                variant="contained"
                                                color="primary"
                                                className="login-provider-button" onClick={signInWithGoogle}>
                                                <img src="https://img.icons8.com/ios-filled/50/000000/google-logo.png" alt="google icon" />
                                                <span> Continue with Google</span>
                                            </Button>
                                        </div> */}
                                        <Button
                                            variant="contained"
                                            color="secondary"
                                            className="my-3"
                                            onClick={() => history.push('/login')}>
                                            login Page Here
                                        </Button>
                                        <div>
                                            <Message error show={error}>
                                                {error}
                                            </Message>
                                        </div>
                                    </div>
                                </Form>
                            </>
                        )}
                    </Formik>
                </div>
            </div>
        </div >
    );
};


const mapStateToProps = ({ auth }) => ({
    loading: auth.loading,
    error: auth.error,
});

const mapDispatchToProps = {
    signUp: actions.signUp,
    cleanUp: actions.clean,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SignUp);

// export default Register;
