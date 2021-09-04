import { Route, Redirect } from "react-router-dom";

const PrivateRoute = ({
  componant: Componant,

  myUserId,
  setDataUser,
  admin,
  avatar,
  setCheckLogin,
  setAvatar,
  setUserNewName,

  messages,
  setMessages,
  profil,
  setProfil,
  isLoggedin,
  setIsLoggedin,
  ...rest
}) => {
  return (
    <Route
      {...rest}
      render={(props) =>
        isLoggedin ? (
          <Componant
            {...props}
            isLoggedin={isLoggedin}
            setIsLoggedin={setIsLoggedin}
            setDataUser={setDataUser}
            messages={messages}
            setMessages={setMessages}
            setUserNewName={setUserNewName}
            setAvatar={setAvatar}
            setCheckLogin={setCheckLogin}
            myUserId={myUserId}
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
