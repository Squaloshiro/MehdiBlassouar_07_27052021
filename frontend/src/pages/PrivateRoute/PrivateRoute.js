import { Route, Redirect } from "react-router-dom";

const PrivateRoute = ({
  componant: Componant,
  isLoggedin,
  setIsLoggedin,
  myUserId,
  admin,
  avatar,
  setCheckLogin,
  setAvatar,
  setUserNewName,
  setDataUser,
  messages,
  setMessages,
  profil,
  setProfil,
  ...rest
}) => {
  return (
    <Route
      {...rest}
      render={(props) =>
        isLoggedin ? (
          <Componant
            {...props}
            messages={messages}
            setMessages={setMessages}
            setDataUser={setDataUser}
            setUserNewName={setUserNewName}
            setAvatar={setAvatar}
            setCheckLogin={setCheckLogin}
            myUserId={myUserId}
            setIsLoggedin={setIsLoggedin}
            admin={admin}
            avatar={avatar}
            profil={profil}
            setProfil={setProfil}
          />
        ) : (
          <Redirect to={{ pathname: "/connexion" }} />
        )
      }
    ></Route>
  );
};

export default PrivateRoute;
