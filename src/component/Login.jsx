import React, { useState, useEffect } from 'react';
import User from './User';

import Cookies from 'js-cookie';

import { LinearProgress, Typography, Snackbar } from '@mui/material';
import MuiAlert from '@mui/material/Alert';

import { Routes, Route, Link, Navigate, useNavigate } from "react-router-dom";
import SignIn from './connection/Signin';
import SignUp from './connection/Signup';

import { connection, creacteUserAndConnect, autoReconnect } from "../RESTApi";
import withRouter from './utils/routerComponent';
import {useSnackbar} from "notistack";

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function Copyright() {
    return (
        <Typography variant="body2" color="textSecondary" align="center">
            {'Copyright Edwin HELET © '}
            <Link color="inherit" to="/">Retour au site</Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

export default function Login(props) {
    const { enqueueSnackbar } = useSnackbar();
    let navigate = useNavigate();
    const [userLogged, setLoginState] = useState(null);
    const [waiting, isWaiting] = useState(false);

    useEffect(() => {
        autoConnect();
    }, []);

    const disconnect = () => {
        setLoginState(null);
        Cookies.remove("login_key");
        navigate("/signin");
    }

    const autoConnect = () => {
        isWaiting(true);
        autoReconnect().then(data => {
            setLoginState(data);
        })
            .catch(error => {
                //enqueueSnackbar(String(error), {variant: 'error', autoHideDuration: 2000});
            }).finally(() => {
                isWaiting(false);
            });

    }

    const addUser = (name, email, password, remember) => {
        return creacteUserAndConnect(name, email, password, remember).then(data => {
            setLoginState(data[Object.keys(data)[0]]);
        }).catch(error => {
            enqueueSnackbar(String(error), {variant: 'error', autoHideDuration: 2000});
        }).finally(() => {
            isWaiting(false);
        });
    }

    const verifyUser = (email, password, remember) => {
        return connection(email, password, remember).then(data => {
            setLoginState(data.user);
        }).catch(error => {
            enqueueSnackbar(String(error), {variant: 'error', autoHideDuration: 2000});
        }).finally(() => {
            isWaiting(false);
        });
    }


    if (waiting) {
        return (<LinearProgress color="secondary" />);
    }
    else if (userLogged) {
        return (
            <Routes>
                <Route exact path="/" element={
                    <User user={userLogged} changeMode={props.changeMode} disconnect={disconnect} dark={props.dark} />
                } />
            </Routes>
        )
    } else {
        return (
            <>
                <Routes>
                    <Route exact path="/" element={
                        <Navigate replace to="signin" />
                    }>
                        <Route path="signin" element={
                            <SignIn copyright={Copyright()} signin={(email, password, remember) => verifyUser(email, password, remember)} />
                        } />
                        <Route path="signup" element={
                            <SignUp copyright={Copyright()} signup={(name, email, password, remember) => addUser(name, email, password, remember)} />
                        } />
                    </Route>
                </Routes>
            </>
        )
    }
}

/*class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = { remember: false, waiting: true };

        this.setLoginState = this.setLoginState.bind(this);
        this.disconnect = this.disconnect.bind(this);

        this.addUser = this.addUser.bind(this);
        this.verifyUser = this.verifyUser.bind(this);
    }

    componentDidMount() {
        this.autoConnect();
    }

    setLoginState(user) {
        this.setState({ userLogged: user })
        this.props.router.navigate("/dash");
    }

    disconnect() {
        this.setState({ userLogged: null })
        Cookies.remove("login_key");
        this.props.router.navigate("/signin");
    }

    autoConnect() {
        autoReconnect().then(data => {
            this.setLoginState(data);
        }).catch(error => {
            this.setState({ errorMessage: error.toString() });
        }).finally(() => {
            this.setState({ waiting: false })
        });

    }

    addUser(name, email, password, remember) {
        return creacteUserAndConnect(name, email, password, remember).then(data => {
            this.setLoginState(data[Object.keys(data)[0]]);
        }).catch(error => {
            this.setState({ errorMessage: error.toString() });
        }).finally(() => {
            this.setState({ waiting: false })
        });
    }

    verifyUser(email, password, remember) {
        return connection(email, password, remember).then(data => {
            this.setLoginState(data.user);
        }).catch(error => {

            enqueueSnackbar(error.toString(), {variant: 'error', autoHideDuration: 2000});
        }).finally(() => {
            this.setState({ waiting: false })
        });
    }

    render() {
        const { userLogged, errorMessage, waiting } = this.state;

        if (waiting) {
            return (<LinearProgress color="secondary" />);
        }
        else if (userLogged) {
            return (
                <User user={userLogged} changeMode={this.props.changeMode} disconnect={this.disconnect} dark={this.props.dark} />
            )
        } else {
            return (
                <Routes>
                    <Route exact path="/" element={
                        <Navigate replace to="/signin" />
                    }>

                    </Route>
                    <Route path="signin" element={
                            <SignIn copyright={Copyright()} signin={(email, password, remember) => this.verifyUser(email, password, remember)} />
                        } />
                        <Route path="signup" element={
                            <SignUp copyright={Copyright()} signup={(name, email, password, remember) => this.addUser(name, email, password, remember)} />
                        } />
                </Routes>

            )
        }
    }
}

export default withRouter(Login);*/