import { Route, Redirect } from "react-router-dom";
import useLoggin from "../../helper/useLoggin";
const PrivateRoute = ({
  componant: Componant,

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
  const loggin = useLoggin();

  return (
    <Route
      {...rest}
      render={(props) =>
        loggin.isLoggedin ? (
          <Componant
            {...props}
            messages={messages}
            setMessages={setMessages}
            setDataUser={setDataUser}
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
