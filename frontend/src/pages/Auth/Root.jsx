import React, { useContext } from 'react'
import { UserContext } from '../../context/userContext'
import { Navigate, Outlet } from 'react-router-dom'

const Root = () => {
  const {user, loading} = useContext(UserContext)

  if(loading) return <div>Loading...</div>

  if(!user){
    return <Navigate to="/login"/>
  }

  return user.role === "admin" 
    ? <Navigate to="/admin/dashboard"/> 
    : <Navigate to="/user/dashboard"/>
}

export default Root