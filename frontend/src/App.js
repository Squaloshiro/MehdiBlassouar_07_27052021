import React from "react";
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

const App = () => {
  return <Router>
    <Header />
    <Switch>
      <Route exact path="/">

        <LandingPage />

      </Route>
      <Route exact path="/post-message">

        <MessageImage />

      </Route>

      <Route path="/connexion">

        <SignIn />
      </Route>
      <Route path="/inscription">
        <SignUp />
      </Route>
    </Switch>
    <Footer />
  </Router>

}

export default App


