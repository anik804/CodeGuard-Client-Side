import React from 'react';

import { Outlet } from 'react-router';
import Navbar from '../components/Navbar';
import Footer from '../components/Shared/Footer';


const AuthLayout = () => {
    return (
        <div className='bg-base-200 min-h-screen'>
            <header>
                <Navbar></Navbar>
            </header>

            <main className="w-full mx-auto ">
                <Outlet></Outlet>
            </main>

            <Footer></Footer>
        </div>
    );
};

export default AuthLayout;