import React, { PropsWithChildren, useState, useEffect, FC } from 'react';
import { AuthContext } from './AuthContext';

export const AuthProvider: FC<PropsWithChildren<{}>> = ({ children }) => {
  const [isLoggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const sessionInfo = sessionStorage.getItem('sessionInfo');
    if (sessionInfo) {
      setLoggedIn(true);
    }
  }, []);

  return <AuthContext.Provider value={{ isLoggedIn, setLoggedIn }}>{children}</AuthContext.Provider>;
};
