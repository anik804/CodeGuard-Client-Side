import React, { use } from 'react';
import { AuthContext } from './AuthProvider';
import { Navigate, useLocation } from 'react-router';

const PrivateRoute = ({children}) => {

    const {user ,loading } = use(AuthContext);

    //console.log(user)

    const location = useLocation();
    //console.log(location)


    if(loading){
        return (
            <div className="flex justify-center items-center h-screen gap-2">
              <span className="loading loading-infinity loading-xs"></span>
              <span className="loading loading-infinity loading-sm"></span>
              <span className="loading loading-infinity loading-md"></span>
              <span className="loading loading-infinity loading-lg"></span>
              <span className="loading loading-infinity loading-xl"></span>
            </div>
          );

    }

    // user thakle return korbe

    if(user && user?.email){
        return children;

    }

    else{
        return <Navigate state={location.pathname} to="/auth/login"></Navigate>
    }

    // na thakle login e niye jabo
};

export default PrivateRoute;