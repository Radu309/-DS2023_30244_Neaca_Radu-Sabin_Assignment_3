import React, { useState } from 'react';
import {Grid, Paper, TextField, Button, FormControl, InputLabel, Select} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import backgroundImage from '../images/background.jpg';

const useStyles = makeStyles((theme) => ({
  registerPage: {
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: 'cover',
    height: '100vh',
  },
  registerContainer: {
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

const RegisterPage = () => {
  const classes = useStyles();
  const [userName, setuserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Client');


  const handleuserNameChange = (event) => {
    setuserName(event.target.value);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleRoleChange = (event) => {
    setRole(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Add user registration logic here
    console.log('First Name:', userName);
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('role:', role.toUpperCase());
  };

  return (
      <Grid container className={classes.registerPage} justifyContent="center" alignItems="center">
        <Grid item xs={10} sm={6} md={4}>
          <Paper elevation={3} className={classes.registerContainer}>
            <h2>Register</h2>
            <form onSubmit={handleSubmit}>
              <div className={classes.inputGroup}>
                <TextField label="Name" value={userName} onChange={handleuserNameChange} fullWidth />
              </div>
              <div className={classes.inputGroup}>
                <TextField label="Email" type="email" value={email} onChange={handleEmailChange} fullWidth />
              </div>
              <div className={classes.inputGroup}>
                <TextField label="Password" type="password" value={password} onChange={handlePasswordChange} fullWidth />
              </div>
              <div className={classes.inputGroup}>
                <FormControl fullWidth>
                  <InputLabel>Role</InputLabel>
                  <Select value={role} onChange={handleRoleChange} native>
                    <option value="Client">Client</option>
                    <option value="Admin">Admin</option>
                  </Select>
                </FormControl>
              </div>
              <div className={classes.buttonGroup}>
                <Button variant="contained" color="primary" type="submit">
                  Register
                </Button>
                <Link to="/" style={{ textDecoration: 'none' }}>
                  <Button variant="contained" color="primary">
                    Login
                  </Button>
                </Link>
              </div>
            </form>
          </Paper>
        </Grid>
      </Grid>
  );
};

export default RegisterPage;
