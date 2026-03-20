import React from 'react'
import {BrowserRouter as Router, Routes, Route} from "react-router-dom"
import Login from './pages/Auth/Login'
import Singup from './pages/Auth/Singup'

import PrivateRoute from './route/PrivateRoute'

import Dashboad from './pages/Admin/Dashboad'
import MangeTask from './pages/Admin/MangeTask'
import MangeUser from './pages/Admin/MangeUser'
import CreateTask from './pages/Admin/CreateTask'

import UserDashboad from './pages/Users/UserDashboad'
import Mytask from './pages/Users/Mytask'
import ViewTaksDetails from './pages/Users/ViewTaksDetails'
import Root from './pages/Auth/Root'
import { Toaster } from 'react-hot-toast'
function App() {
  return (
    <>
    <div>
       <Router>
        <Routes>
          <Route path='/login' element={<Login/>}/>
          <Route path='/signup' element={<Singup/>}/>

          {/* admin route */}
           <Route element={<PrivateRoute allowedRoles={["admin"]}/>}> 
            <Route path='/admin/dashboard' element={<Dashboad/>}/>    
            <Route path='/admin/tasks' element={<MangeTask/>}/>
            <Route path='admin/create-task' element={<CreateTask/>}/>      
            <Route path='/admin/users' element={<MangeUser/>}/> 
           </Route>

           {/* User Route */}
           <Route element={<PrivateRoute allowedRoles={["user"]}/>}>
            <Route path='/user/dashboard' element={<UserDashboad/>}/>
            <Route path='/user/tasks' element={<Mytask/>}/>
            <Route path='/user/task-details/:id' element={<ViewTaksDetails/>}/>
           </Route>

           <Route path='/' element={<Root/>}/>
        </Routes>
       </Router>
      
    </div>
    <Toaster
    toastOptions={{
      className:"",
      style:{
        fontSize: "13px"
      }
    }}
    />
    </>
  )
}

export default App
