import React from 'react';

import { Outlet } from 'react-router';

const AuthLayout = () => {
    return (
        <div className='bg-base-200 min-h-screen'>
            <main className="w-full mx-auto ">
                <Outlet></Outlet>
            </main>
        </div>
    );
};

export default AuthLayout;