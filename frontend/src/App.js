import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import Header from "./componants/Header/Header";
import Footer from "./componants/Footer/Footer";
import SignIn from "./pages/SignIn/SignIn";
import SignUp from './pages/SignUp/SignUp';
import LandingPage from './pages/LandingPage/LandingPage';
import MessageImage from './pages/PostMessage/PostMessage';
import "./componants/Header/header.scss";
import PrivateRoute from './pages/PrivateRoute/PrivateRoute';
import api from './config/api';




const App = () => {

  const [isLoggedin, setIsLoggedin] = useState(false)
  const [checkLogin, setCheckLogin] = useState(false)

  useEffect(() => {
    const token = JSON.parse(JSON.stringify(sessionStorage.getItem('groupomaniaToken')));

    console.log('---------------isLoggedin---------------------');
    console.log(isLoggedin, token);
    console.log('------------------------------------');
    if (!isLoggedin && token) {
      const getUser = async () => {
        try {
          const response = await api({
            url: '/users/me',
            method: 'get',
            headers: { Authorization: `Bearer ${token}` }
          })
          setIsLoggedin(true)
          setCheckLogin(true)
          console.log('-----------------response-------------------');
          console.log(response);
          console.log('------------------------------------');
        } catch (error) {
          setCheckLogin(true)
          console.log('------------error------------------------');
          console.log(error);
          console.log('------------------------------------');
        }
      }
      getUser()

    } else {
      setCheckLogin(true)
    }
  }, [isLoggedin])

  return <Router>

    <Header isLoggedin={isLoggedin} setIsLoggedin={setIsLoggedin} />


    <Switch>
      <Route exact path="/">

        <LandingPage />

      </Route>
      {checkLogin && <PrivateRoute exact path='/post-message' componant={MessageImage} isLoggedin={isLoggedin} />
      }


      <Route path="/connexion">

        <SignIn setIsLoggedin={setIsLoggedin} />
      </Route>
      <Route path="/inscription">
        <SignUp />
      </Route>
    </Switch>
    <Footer />
  </Router>

}

export default App


