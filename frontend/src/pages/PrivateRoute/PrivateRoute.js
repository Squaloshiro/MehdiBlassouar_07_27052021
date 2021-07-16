import { Route, Redirect } from "react-router-dom";

const PrivateRoute = ({ componant: Componant, isLoggedin, myUserId, avatar, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) =>
        isLoggedin ? (
          <Componant {...props} myUserId={myUserId} avatar={avatar} />
        ) : (
          <Redirect to={{ pathname: "/connexion" }} />
        )
      }
    ></Route>
  );
};

export default PrivateRoute;
