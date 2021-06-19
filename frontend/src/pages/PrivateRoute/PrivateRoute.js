import { Route, Redirect } from "react-router-dom"



const PrivateRoute = ({ componant: Componant, isLoggedin, ...rest }) => {
    console.log('-------------isLoggedin privat-----------------------');
    console.log(isLoggedin);
    console.log('------------------------------------');

    return <Route {...rest} render={props => isLoggedin ?
        <Componant {...props} /> :
        <Redirect to={{ pathname: '/connexion' }} />} ></Route>

}

export default PrivateRoute