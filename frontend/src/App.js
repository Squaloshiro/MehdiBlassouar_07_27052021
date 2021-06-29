import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
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
import './assets/fontawesome';
import MessageLike from "./componants/MessageLike/MessageLike";
import MessageDestroy from "./componants/DestroyMsg/DestroyMsg";



const App = () => {


  const [isLoggedin, setIsLoggedin] = useState(false)
  const [checkLogin, setCheckLogin] = useState(false)



  useEffect(() => {
    const token = JSON.parse(JSON.stringify(sessionStorage.getItem('groupomaniaToken')));


    if (!isLoggedin && token) {
      const getUser = async () => {
        try {
          await api({
            url: '/users/me',
            method: 'get',
            headers: { Authorization: `Bearer ${token}` }
          })
          setIsLoggedin(true)
          setCheckLogin(true)

        } catch (error) {
          setCheckLogin(true)
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

      {checkLogin && <PrivateRoute exact path='/' componant={LandingPage} isLoggedin={isLoggedin} />
      }
      {checkLogin && <PrivateRoute exact path='/like-message/:id/' componant={MessageLike} isLoggedin={isLoggedin} />
      }
      {checkLogin && <PrivateRoute exact path='/drop-message/:id/' componant={MessageDestroy} isLoggedin={isLoggedin} />
      }
      {checkLogin && <PrivateRoute exact path='/post-message' componant={MessageImage} isLoggedin={isLoggedin} />
      }


      <Route path="/connexion" render={() => (
        isLoggedin ? (<Redirect to="/" />) : (<SignIn setIsLoggedin={setIsLoggedin} isLoggedin={isLoggedin} />)
      )}>


      </Route>

      <Route path="/inscription" render={() => (
        isLoggedin ? (<Redirect to="/" />) : (<SignUp setIsLoggedin={setIsLoggedin} isLoggedin={isLoggedin} />)
      )}>
      </Route>

    </Switch>
    <Footer />
  </Router>

}

export default App


