import {BrowserRouter as Router, Redirect, Route, Switch} from 'react-router-dom';
import LogInPage from "./pages/LogInPage";
import RegisterPage from "./pages/RegisterPage";
import ClientPage from "./pages/ClientPage";
import AdminPage from "./pages/AdminPage";
import {useEffect, useState} from "react";

function App() {
    const storedUser = JSON.parse(localStorage.getItem('user')) || {
        id: null,
        name: "",
        email: "",
        userRole: "",
    };
    const [user, setUser] = useState(storedUser);

    function checkClientRole() {
        return user.userRole === "CLIENT";
    }

    function checkAdminRole() {
        return user.userRole === "ADMIN";
    }
    useEffect(() => {
        localStorage.setItem('user', JSON.stringify(user));
    }, [user]);
    return (
      <Router>
          <Switch>
              <Route path="/"
                     exact
                     render={(props) => <LogInPage setUser={setUser} />}
              />
              <Route path="/register" exact component={RegisterPage} />
              <Route
                  path="/client"
                  exact
                  render={(props) => checkClientRole() ? <ClientPage {...props} user={user}/> : <Redirect to="/" />}
              />
              <Route
                  path="/admin"
                  exact
                  render={(props) => checkAdminRole() ? <AdminPage {...props} user={user} /> : <Redirect to="/" />}
              />
          </Switch>
      </Router>
  );
}

export default App;
