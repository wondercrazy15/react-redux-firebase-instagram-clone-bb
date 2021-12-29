import React, { Suspense, useState, useEffect } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import "./App.css";
import Layout from './layout/Layout';
import Login from './containers/Auth/Login/Login';
import SignUp from './containers/Auth/SignUp/SignUp';
import Profile from './containers/Auth/Profile/Profile';
import VerifyEmail from './containers/Auth/VerifyEmail/VerifyEmail';
import RecoverPassword from './containers/Auth/RecoverPassword/RecoverPassword';
import Logout from './containers/Auth/Logout/Logout';
import Home from './containers/Home/Home';
import Massage from './containers/Massage/Massage';

import SeePost from './containers/Post/SeePost';
import EditPost from './containers/Post/EditPost';
import AddPost from './containers/Post/AddPost';
import Posts from './containers/Post/Posts';

import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import AdminLayout from './layout/AdminLayout';
import AdminDashboard from './containers/Admin/Dashboard/Dashboard'
import PageNotFound from './components/PageNotFound';
import AllUsers from './containers/Admin/AllUsers/AllUsers';
import AllPosts from './containers/Admin/AllPosts/AllPosts';
import MassageEditor from './containers/Massage/MassageEditor';

const App = ({ loggedIn, emailVerified, firebase }) => {
    let routes;
    let adminRoutes;
    let userRole = firebase.profile.userRoles
    const [role, setRole] = useState();


    useEffect(() => {
        if (userRole) {
            setRole(userRole.includes('admin'))
        }
    }, [userRole])

    if (role) {
        adminRoutes = (
            <Switch>
                <Route exact path="/admin/users" component={AllUsers} />
                <Route exact path="/admin/posts" component={AllPosts} />
                <Route exact path="/admin/dashboard" component={AdminDashboard} />
                <Redirect to="/admin/dashboard" component={AdminDashboard} />
                <Route path="*" component={PageNotFound} />
            </Switch >
        )
    } else {
        if (loggedIn && !emailVerified) {
            routes = (
                <Switch>
                    <Route exact path="/verify-email" component={VerifyEmail} />
                    <Route exact path="/profile" component={Profile} />
                    <Route exact path="/logout" component={Logout} />
                    <Redirect to="/verify-email" />
                </Switch>
            );
        } else if (loggedIn && emailVerified) {
            routes = (
                <>
                    <Suspense fallback={<div>Loading...</div>}>
                        <Switch>
                            <Route exact path="/massage" component={Massage} />
                            <Route exact path="/massage/:id" component={MassageEditor} />
                            <Route exact path="/addpost" component={AddPost} />
                            <Route exact path="/posts" component={Posts} />
                            <Route exact path="/post/:id" component={SeePost} />
                            <Route exact path="/post/:id/edit" component={EditPost} />
                            <Route exact path="/profile" component={Profile} />
                            <Route exact path="/logout" component={Logout} />
                            <Route exact path="/" component={Home} />
                            {/* <Redirect to="/" component={Home} /> */}
                            <Route exact path="*" component={PageNotFound} />
                        </Switch>
                    </Suspense>
                </>
            );

        } else {
            routes = (
                <Switch>
                    <Route exact path="/login" component={Login} />
                    <Route exact path="/signup" component={SignUp} />
                    <Route exact path="/recover" component={RecoverPassword} />
                    <Redirect to="/login" />
                    <Route path="/" component={Home} />
                </Switch>
            );
        }
    }

    return (
        <>
            {
                role ? <AdminLayout>{adminRoutes}</AdminLayout> : <Layout>{routes}</Layout>
            }

        </>
    );
};

const mapStateToProps = ({ firebase }) => ({
    firebase,
    loggedIn: firebase.auth.uid,
    emailVerified: firebase.auth.emailVerified,
});

export default connect(mapStateToProps)(App);
