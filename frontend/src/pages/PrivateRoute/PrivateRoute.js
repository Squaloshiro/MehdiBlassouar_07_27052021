import { Route, Redirect } from "react-router-dom";

const PrivateRoute = ({
  componant: Componant,
  isLoggedin,
  setIsLoggedin,
  myUserId,
  admin,
  avatar,
  setCheckLogin,
  ...rest
}) => {
  return (
    <Route
      {...rest}
      render={(props) =>
        isLoggedin ? (
          <Componant
            {...props}
            setCheckLogin={setCheckLogin}
            myUserId={myUserId}
            setIsLoggedin={setIsLoggedin}
            admin={admin}
            avatar={avatar}
          />
        ) : (
          <Redirect to={{ pathname: "/connexion" }} />
        )
      }
    ></Route>
  );
};

export default PrivateRoute;
