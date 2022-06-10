import React from 'react';
import loadable from '@loadable/component'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'

//page단위로 code splitting 
const LogIn = loadable(() => import('@pages/LogIn'));
const SignUp = loadable(() => import('@pages/SignUp'));
const Workspace = loadable(() => import('@layouts/Workspace'));

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Navigate replace to="/login" />} />
        <Route path="/login" element={<LogIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/workspace/:workspace/*" element={<Workspace />} />
      </Routes>
    </Router>
  )
}

export default App