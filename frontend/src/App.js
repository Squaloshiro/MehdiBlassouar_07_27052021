import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import Header from "./componants/Header/Header";
import Footer from "./componants/Footer/Footer";
import SignIn from "./pages/SignIn/SignIn";
import SignUp from "./pages/SignUp/SignUp";
import LandingPage from "./pages/LandingPage/LandingPage";

import "./componants/Header/header.scss";
import PrivateRoute from "./pages/PrivateRoute/PrivateRoute";
import api from "./config/api";
import "./assets/fontawesome";
import ProfilPage from "./pages/ProfilPage/ProfilPage";
import ProfilUser from "./pages/ProfilUser/ProfiUser";
import { ToastContainer } from "react-toastify";
import { toastTrigger } from "./helper/toast";
import AdminDashboard from "./pages/AdminDashBord/AdminDashboard";
import Error404 from "./componants/Error404/Error404";
import useLoggin from "./helper/useLoggin";

const App = () => {
  const loggin = useLoggin();
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

    if (!loggin.isLoggedin && token) {
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
          loggin.onLoggin();
          setCheckLogin(true);
        } catch (error) {
          setCheckLogin(true);
        }
      };
      getUser();
    } else {
      setCheckLogin(true);
    }
  }, [loggin]);

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
            admin={admin}
          />
        )}

        {checkLogin && (
          <PrivateRoute
            exact
            path="/profil"
            avatar={avatar}
            admin={admin}
            componant={ProfilPage}
            setUserNewName={setUserNewName}
            setAvatar={setAvatar}
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
            admin={admin}
            myUserId={myUserId}
            setMessages={setMessages}
            profil={profil}
            setProfil={setProfil}
          />
        )}

        <Route
          exact
          path="/connexion"
          render={() =>
            loggin.isLoggedin ? (
              <Redirect to="/" />
            ) : (
              <SignIn setDataUser={setDataUser} setAdmin={setAdmin} setMyUserId={setMyUserId} />
            )
          }
        ></Route>

        <Route
          exact
          path="/inscription"
          render={() =>
            loggin.isLoggedin ? (
              <Redirect to="/" />
            ) : (
              <SignUp setDataUser={setDataUser} setAdmin={setAdmin} setMyUserId={setMyUserId} />
            )
          }
        ></Route>
        <Route
          exact
          path="/admin"
          render={() =>
            loggin.isLoggedin ? (
              <Redirect to="/" />
            ) : (
              <AdminDashboard setDataUser={setDataUser} setAdmin={setAdmin} setMyUserId={setMyUserId} />
            )
          }
        ></Route>
        <Route path="*">
          <Error404 />
        </Route>
      </Switch>
      <Footer />
      <ToastContainer />
    </Router>
  );
};

export default App;
