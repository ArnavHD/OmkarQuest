
import useAuth from '../hooks/useAuth';
import Loading from '../pages/Loading/Loading';
import { Navigate, useLocation } from 'react-router';

const PrivateRoute = ({children}) => {
    const {user, loading} = useAuth();
    const location = useLocation();

    if(loading){
        return <Loading></Loading>
    }

    if(!user){
        return <Navigate to={"/login"} state={{ from: location }} replace></Navigate>;
    }
    return children;
};

export default PrivateRoute;