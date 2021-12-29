import ReactDOM from 'react-dom';
import React from 'react';
// import { ThemeProvider } from 'styled-components';

import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import styled from 'styled-components';


import Theme from './utils/theme';
// import GlobalStyles from './utils/global';
import store from './store';

import App from './App';
import Loader from './components/UI/Loader/Loader';

const Wrapper = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const root = document.getElementById('root');

ReactDOM.render(
    <Theme>
        <Wrapper>
            <Loader />
        </Wrapper>
        {/* <GlobalStyles /> */}
    </Theme>,
    root
);

store.firebaseAuthIsReady.then(() => {
    ReactDOM.render(
        <Provider store={store}>
            <BrowserRouter>
                <Theme>
                    <>
                        <App />
                        {/* <GlobalStyles /> */}
                    </>
                </Theme>
            </BrowserRouter>
        </Provider>,
        root
    );
});




// import React, { Suspense, useState, useEffect } from 'react';
// import { Route, Switch, Redirect } from 'react-router-dom';
// import { connect } from 'react-redux';
// import "./App.css";
// import Layout from './layout/Layout';
// import Login from './containers/Auth/Login/Login';
// import SignUp from './containers/Auth/SignUp/SignUp';
// import Profile from './containers/Auth/Profile/Profile';
// import VerifyEmail from './containers/Auth/VerifyEmail/VerifyEmail';
// import RecoverPassword from './containers/Auth/RecoverPassword/RecoverPassword';
// import Logout from './containers/Auth/Logout/Logout';
// import Home from './containers/Home/Home';
// import Massage from './containers/Massage/Massage';

// import SeePost from './containers/Post/SeePost';
// import EditPost from './containers/Post/EditPost';
// import AddPost from './containers/Post/AddPost';
// import Posts from './containers/Post/Posts';

// import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
// import AdminLayout from './layout/AdminLayout';
// import AdminDashboard from './containers/Admin/Dashboard/Dashboard'
// import PageNotFound from './components/PageNotFound/PageNotFound';
// import AllUsers from './containers/Admin/AllUsers/AllUsers';
// import AllPosts from './containers/Admin/AllPosts/AllPosts';
// import AdminActive from './components/AdminActive/AdminActive';

// const App = ({ loggedIn, emailVerified, firebase }) => {
//     let routes;
//     let adminRoutes;
//     let userRole = firebase.profile.userRoles
//     const [role, setRole] = useState();


//     useEffect(() => {
//         if (userRole) {
//             setRole(userRole.includes('admin'))
//         }
//     }, [userRole])
//     return (
//         <>
//             <AdminActive />
//             {role ?
//                 <Switch>
//                     <Route exact path="/admin/users" render={() => (
//                         <AdminLayout>
//                             <AllUsers />
//                         </AdminLayout>
//                     )}
//                     />
//                     <Route exact path="/admin/posts" render={() => (
//                         <AdminLayout>
//                             <AllPosts />
//                         </AdminLayout>)}
//                     />
//                     <Route exact path="/admin/dashboard" render={() => (
//                         <AdminLayout>
//                             <AdminDashboard />
//                         </AdminLayout>)}
//                     />
//                     <Redirect path="/admin/dashboard" render={() => (
//                         <AdminLayout>
//                             <AdminDashboard />
//                         </AdminLayout>)}
//                     />
//                     <Route path="*" render={() => (
//                         <AdminLayout>
//                             <PageNotFound />
//                         </AdminLayout>)}
//                     />
//                 </Switch >
//                 : null
//             }
//             {loggedIn && !emailVerified ?
//                 <Switch>
//                     <Route exact path="/verify-email" render={() => (
//                         <Layout>
//                             <VerifyEmail />
//                         </Layout>)}
//                     />
//                     <Route exact path="/profile" render={() => (
//                         <Layout>
//                             <Profile />
//                         </Layout>)}
//                     />
//                     <Route exact path="/logout" render={() => (
//                         <Layout>
//                             <Logout />
//                         </Layout>)}
//                     />
//                     <Redirect to="/verify-email" />
//                     <Route path="*" render={() => (
//                         <Layout>
//                             <PageNotFound />
//                         </Layout>)}
//                     />
//                 </Switch>
//                 :
//                 loggedIn && emailVerified ?
//                     <Suspense fallback={<div>Loading...</div>}>
//                         <Switch>
//                             <Route path="/massage" render={() => (
//                                 <Layout>
//                                     <Massage />
//                                 </Layout>)}
//                             />
//                             <Route path="/addpost" render={() => (
//                                 <Layout>
//                                     <AddPost />
//                                 </Layout>)}
//                             />
//                             <Route path="/posts" render={() => (
//                                 <Layout>
//                                     <Posts />
//                                 </Layout>)}
//                             />
//                             <Route path="/post/:id" render={() => (
//                                 <Layout>
//                                     <SeePost />
//                                 </Layout>)}
//                             />
//                             <Route path="/post/:id/edit" render={() => (
//                                 <Layout>
//                                     <EditPost />
//                                 </Layout>)}
//                             />
//                             <Route path="/profile" render={() => (
//                                 <Layout>
//                                     <Profile />
//                                 </Layout>)}
//                             />
//                             <Route path="/logout" render={() => (
//                                 <Layout>
//                                     <Logout />
//                                 </Layout>)}
//                             />
//                             <Route path="/" render={() => (
//                                 <Layout>
//                                     <Home />
//                                 </Layout>)}
//                             />
//                             <Route path="*" render={() => (
//                                 <Layout>
//                                     <PageNotFound />
//                                 </Layout>)}
//                             />
//                         </Switch>
//                     </Suspense>
//                     :
//                     <Switch>
//                         <Route exact path="/login" render={() => (
//                             <Layout>
//                                 <Login />
//                             </Layout>)}
//                         />
//                         <Route exact path="/signup" render={() => (
//                             <Layout>
//                                 <SignUp />
//                             </Layout>)}
//                         />
//                         <Route exact path="/recover" render={() => (
//                             <Layout>
//                                 <RecoverPassword />
//                             </Layout>)}
//                         />
//                         <Redirect to="/login"
//                         />
//                         <Route path="/" render={() => (
//                             <Layout>
//                                 <Home />
//                             </Layout>)}
//                         />
//                         <Route path="*" render={() => (
//                             <Layout>
//                                 <PageNotFound />
//                             </Layout>)}
//                         />
//                     </Switch>
//             }
//         </>
//     );
// };

// const mapStateToProps = ({ firebase }) => ({
//     firebase,
//     loggedIn: firebase.auth.uid,
//     emailVerified: firebase.auth.emailVerified,
// });

// export default connect(mapStateToProps)(App);
