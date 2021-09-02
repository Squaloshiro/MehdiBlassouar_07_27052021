import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import Header from "./componants/Header/Header";
import Footer from "./componants/Footer/Footer";
import SignIn from "./pages/SignIn/SignIn";
import SignUp from "./pages/SignUp/SignUp";
import LandingPage from "./pages/LandingPage/LandingPage";
import MessageImage from "./pages/PostMessage/PostMessage";
import "./componants/Header/header.scss";
import PrivateRoute from "./pages/PrivateRoute/PrivateRoute";
import api from "./config/api";
import "./assets/fontawesome";
import ProfilPage from "./pages/ProfilPage/ProfilPage";
import ProfilUser from "./pages/ProfilUser/ProfiUser";
import { ToastContainer } from "react-toastify";
import { toastTrigger } from "./helper/toast";
import AdminDashboard from "./pages/AdminDashBord/AdminDashboard";

const App = () => {
  const [isLoggedin, setIsLoggedin] = useState(false);
  const [checkLogin, setCheckLogin] = useState(false);
  const [admin, setAdmin] = useState(false);
  const [myUserId, setMyUserId] = useState("");
  const [avatar, setAvatar] = useState("");
  const [userNewName, setUserNewName] = useState("");
  const [dataUser, setDataUser] = useState([]);
  const [messages, setMessages] = useState([]);
  const [profil, setProfil] = useState([]);

  useEffect(() => {
    const token = JSON.parse(JSON.stringify(sessionStorage.getItem("groupomaniaToken")));

    if (!isLoggedin && token) {
      const getUser = async () => {
        try {
          const response = await api({
            url: "/users/me",
            method: "get",
            headers: { Authorization: `Bearer ${token}` },
          });
          try {
            const response = await api({
              method: "get",
              url: "/users/all",
              headers: { Authorization: `Bearer ${token}` },
            });
            setDataUser(response.data);
          } catch (error) {
            toastTrigger("error", "une erreur est survenu");
          }
          setAdmin(response.data.isAdmin);
          setMyUserId(response.data.id);
          setAvatar(response.data.avatar);
          setIsLoggedin(true);
          setCheckLogin(true);
        } catch (error) {
          setCheckLogin(true);
        }
      };
      getUser();
    } else {
      setCheckLogin(true);
    }
  }, [isLoggedin]);

  return (
    <Router>
      <Header
        setAvatar={setAvatar}
        dataUser={dataUser}
        setDataUser={setDataUser}
        setAdmin={setAdmin}
        userNewName={userNewName}
        avatar={avatar}
        myUserId={myUserId}
        setMyUserId={setMyUserId}
        setCheckLogin={setCheckLogin}
        isLoggedin={isLoggedin}
        setIsLoggedin={setIsLoggedin}
      />

      <Switch>
        {checkLogin && (
          <PrivateRoute
            exact
            path="/"
            componant={LandingPage}
            messages={messages}
            setMessages={setMessages}
            avatar={avatar}
            myUserId={myUserId}
            isLoggedin={isLoggedin}
            admin={admin}
          />
        )}

        {checkLogin && <PrivateRoute exact path="/post-message" componant={MessageImage} isLoggedin={isLoggedin} />}

        {checkLogin && (
          <PrivateRoute
            exact
            path="/profil"
            avatar={avatar}
            admin={admin}
            componant={ProfilPage}
            setUserNewName={setUserNewName}
            setAvatar={setAvatar}
            isLoggedin={isLoggedin}
            setIsLoggedin={setIsLoggedin}
            myUserId={myUserId}
          />
        )}
        {checkLogin && (
          <PrivateRoute
            exact
            path="/users/profils"
            componant={ProfilUser}
            avatar={avatar}
            setAvatar={setAvatar}
            setDataUser={setDataUser}
            setCheckLogin={setCheckLogin}
            isLoggedin={isLoggedin}
            admin={admin}
            setIsLoggedin={setIsLoggedin}
            myUserId={myUserId}
            setMessages={setMessages}
            profil={profil}
            setProfil={setProfil}
          />
        )}

        <Route
          path="/connexion"
          render={() =>
            isLoggedin ? (
              <Redirect to="/" />
            ) : (
              <SignIn
                setDataUser={setDataUser}
                setAdmin={setAdmin}
                setIsLoggedin={setIsLoggedin}
                isLoggedin={isLoggedin}
                setMyUserId={setMyUserId}
              />
            )
          }
        ></Route>

        <Route
          path="/inscription"
          render={() =>
            isLoggedin ? (
              <Redirect to="/" />
            ) : (
              <SignUp
                setDataUser={setDataUser}
                setAdmin={setAdmin}
                setIsLoggedin={setIsLoggedin}
                setMyUserId={setMyUserId}
              />
            )
          }
        ></Route>
        <Route
          path="/admin"
          render={() =>
            isLoggedin ? (
              <Redirect to="/" />
            ) : (
              <AdminDashboard
                setDataUser={setDataUser}
                setAdmin={setAdmin}
                setIsLoggedin={setIsLoggedin}
                setMyUserId={setMyUserId}
              />
            )
          }
        ></Route>
      </Switch>
      <Footer />
      <ToastContainer />
    </Router>
  );
};

export default App;
