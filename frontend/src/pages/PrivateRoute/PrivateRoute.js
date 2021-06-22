import { Route, Redirect } from "react-router-dom"



const PrivateRoute = ({ componant: Componant, isLoggedin, ...rest }) => {


    return <Route {...rest} render={props => isLoggedin ?
        <Componant {...props} /> :
        <Redirect to={{ pathname: '/connexion' }} />} ></Route>

}

export default PrivateRoute