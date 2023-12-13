import React, { useState } from 'react';
import { Grid, Paper, TextField, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import backgroundImage from "../images/background.jpg";
import axios from "axios";
import {useHistory} from "react-router-dom";

const useStyles = makeStyles((theme) => ({
    loginPage: {
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        height: '100vh',
    },
    loginContainer: {
        background: 'rgba(255, 255, 255, 0.7)',
        padding: theme.spacing(4),
        borderRadius: 5,
        textAlign: 'center',
    },
    inputGroup: {
        marginBottom: theme.spacing(3),
    },
    buttonGroup: {
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: theme.spacing(3),
    },
}));

const LogInPage = (props) => {
    const { setUser } = props;
    const classes = useStyles();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const history = useHistory();

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const handleLogIn = () => {
        axios.post(process.env.REACT_APP_USER_SERVICE + '/login/authenticate', {email: email, password: password})
            .then((response) => {
            if (response.data.length !== 0) {
                setUser(response.data);
                if (response.data.userRole === "CLIENT")
                    history.push('/client', {user: response.data});
                if (response.data.userRole === "ADMIN")
                    history.push('/admin', {user: response.data});
            } else {
                setErrorMessage('Invalid credentials. Please try again.');
            }
        })
            .catch(error => {
                setErrorMessage('An error occurred. Please try again later.');
            });
    };
    const handleRegister = () => {
        history.push('/register');
    };

    return (
        <Grid container className={classes.loginPage} justifyContent="center" alignItems="center">
            <Grid item xs={10} sm={6} md={4}>
                <Paper elevation={3} className={classes.loginContainer}>
                    <h2>Login</h2>
                    {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
                    <form >
                        <div className={classes.inputGroup}>
                            <TextField
                                label="Email"
                                type="email"
                                value={email}
                                onChange={handleEmailChange}
                                fullWidth
                            />
                        </div>
                        <div className={classes.inputGroup}>
                            <TextField
                                label="Password"
                                type="password"
                                value={password}
                                onChange={handlePasswordChange}
                                fullWidth
                            />
                        </div>
                        <div className={classes.buttonGroup}>
                            <Button onClick={handleLogIn} variant="contained" color="primary">
                                LogIn
                            </Button>
                            <Button onClick={handleRegister} variant="contained" color="primary">
                                Register
                            </Button>
                        </div>
                    </form>
                </Paper>
            </Grid>
        </Grid>
    );
};

export default LogInPage;
