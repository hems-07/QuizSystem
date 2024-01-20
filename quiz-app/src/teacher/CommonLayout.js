// CommonLayout.js
import React, { createContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const UserContext = createContext();

const CommonLayout = ({ children }) => {
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [userId, setUserId] = useState('');
  
  useEffect(() => {
    if (location.state?.email) {
      setEmail(location.state.email);
      setUsername(location.state.userName);
    }
    if (location.state?.userId) {
      setUserId(location.state.userId);
    }
  }, [location.state]);

  return (
    <UserContext.Provider value={{ email, userId, username }}>
      {children}
    </UserContext.Provider>
  );
};

export default CommonLayout;
