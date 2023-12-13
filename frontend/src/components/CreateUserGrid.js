import React, { useState } from 'react';
import axios from 'axios';
import { Select } from "@material-ui/core";
import ChatIcon from "../images/ChatIcon.svg";
import ChatBox from "./ChatBox";

const columnStyle = {
    flex: 1,
    margin: '10px',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    padding: '20px',
    border: '1px solid #e0e0e0',
    borderRadius: '10px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.8)',
};

const inputStyle = {
    width: '100%',
    padding: '5px',
    marginTop: '5px',
    paddingRight: '0px',
    border: '1px solid #ccc',
    borderRadius: '5px',
};

const CreateUserGrid = (props) => {
    const { setUpdateUser } = props;
    const [newUser, setNewUser] = useState({
        name: '',
        email: '',
        password: '',
        userRole: 'Client',
    });

    const createUser = () => {
        newUser.userRole = newUser.userRole.toString().toUpperCase();
        axios.post(process.env.REACT_APP_USER_SERVICE + "/user/add", newUser)
            .then(response => {
                setUpdateUser(prevState => !prevState);
            });
    };

    return (
        <div style={columnStyle}>
            {/*<h2>Create a New User</h2>*/}
            <form>
                <input
                    style={inputStyle}
                    type="text"
                    placeholder="Name"
                    value={newUser.name}
                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                />
                <input
                    style={inputStyle}
                    type="email"
                    placeholder="Email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                />
                <input
                    style={inputStyle}
                    type="password"
                    placeholder="Password"
                    value={newUser.password}
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                />
                <Select style={inputStyle} value={newUser.userRole}
                    onChange={(e) =>
                        setNewUser({ ...newUser, userRole: e.target.value})} native>
                        <option value="Client">Client</option>
                        <option value="Admin">Admin</option>
                </Select>
                <br />
                <button style={inputStyle} type="button" onClick={createUser}>Create User</button>
            </form>
        </div>
    );
};

export default CreateUserGrid;
