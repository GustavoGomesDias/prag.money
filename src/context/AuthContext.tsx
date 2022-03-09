/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  createContext, useCallback, useEffect, useMemo, useState,
} from 'react';
import { setCookie, parseCookies, destroyCookie } from 'nookies';

import LoginProps from '../serverless/data/usecases/Login';
import UserModel from '../serverless/data/models/UserModel';
import api from '../services/fetchAPI/init';

export interface AuthProviderProps {
  children: JSX.Element | JSX.Element[]
}

export interface AuthContextProps {
  user: { userInfo: Omit<UserModel, 'password'> } | null
  isAuthenticated: boolean
  signIn({ email, password }: LoginProps): Promise<boolean>
  signOut(): void
}

export const AuthContext = createContext({} as AuthContextProps);

export default function AuthProvider({ children }: AuthProviderProps): JSX.Element {
  const [user, setUser] = useState<{ userInfo: Omit<UserModel, 'password'> } | null>(null);
  const isAuthenticated = !!user;

  useEffect(() => {
    const handleRecoverUserInfo = async () => {
      const { authToken } = parseCookies();

      if (authToken) {
        const response = await api.post('/user/recover', {
          token: authToken,
        });

        const { userInfo, payload } = response.data;

        api.setAuthHeader(`Bearer ${payload}`);

        if (userInfo) setUser(userInfo);
      }
    };
    handleRecoverUserInfo();
  }, []);

  const signIn = useCallback(async ({ email, password }: LoginProps): Promise<boolean> => {
    const response = await api.post('/user/login', {
      email,
      password,
    });

    if (response.data.error) {
      return false;
    }

    setCookie(undefined, 'authToken', response.data.payload as string, {
      maxAge: (60 * 60) * 48, // 2 days
    });
    api.setAuthHeader(`Bearer ${response.data.payload}`);
    if (response.data.userInfo !== undefined) {
      setUser(response.data.userInfo);
      return true;
    }
    return false;
    // // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const signOut = useCallback((): void => {
    destroyCookie({}, 'authToken', {
      path: '/',
    });
    setUser(null);
  }, []);

  const context: AuthContextProps = useMemo(() => ({
    user,
    isAuthenticated,
    signIn,
    signOut,
  }), [user, isAuthenticated, signIn, signOut]);

  return (
    <AuthContext.Provider value={context}>
      {children}
    </AuthContext.Provider>
  );
}
