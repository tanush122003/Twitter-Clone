import './Sidebar.css'
import React, { useEffect, useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import ContainerLarge from '../../../ContainerLarge/ContainerLarge'
import Modal from '../Modal/Modal'
import { useAuth } from '../../../context/auth/AuthContext'
import { useTweetContext } from '../../../context/auth/TweetContext'
import axios from 'axios'


const Sidebar = () => 
{
    const [auth,setAuth] = useAuth();
    const {authDetails,setAuthDetails} = useTweetContext()
    console.log(auth)
    const navigate = useNavigate();
    console.log(auth)

    const logOut = () => 
    {
        setAuth({ ...auth, user: null, token: '' });
        setAuthDetails({ ...auth, user: null, token: '' });
        localStorage.removeItem('auth');
        navigate('/login')
        console.log('after navigate')
    }
    return (
    <ContainerLarge>
        <div class="sidebar">
            <i class="fa-regular fa-message fa-beat-fade"></i>
            <div class="sidebarcontent active">
                <span class="fa-solid icon fa-house fa-lg"></span>
                <NavLink className="side-heading" to='/'><h2>Home</h2></NavLink>
            </div>
            <div class="sidebarcontent">
                <span class="fa-solid icon fa-user fa-lg"></span>
                <NavLink className="side-heading" to='/profile'><h2>Profile</h2></NavLink>
            </div>
            <div class="sidebarcontent yoooo">
                <span class="fa-solid icon fa-right-from-bracket fa-lg"></span>
                <a className="side-heading" onClick={()=>logOut()}><h2>logout</h2></a>
            </div>
            <div class="sidebarcontent2 justify-content-center gap-2 last-sidebar-item">
                <div class="user-profile">
                    {auth?.user?.profile_picture ? <img src={auth?.user?.profile_picture}  alt="" /> : <img src={require('../images/images/blank-profile-picture.webp')}/> }
                </div>
                <div class="name-n-username-container">
                    <h2>{auth?.user?.name}</h2>
                    <div class="username-container">
                        <span>@{auth?.user?.username}</span>
                    </div>
                </div>
            </div>
        </div>
    <Outlet/>
    </ContainerLarge>
  )
}

export default Sidebar