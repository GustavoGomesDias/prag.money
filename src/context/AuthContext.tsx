import React, {
  createContext, useCallback, useEffect, useMemo, useState,
} from 'react';
import { setCookie, parseCookies, destroyCookie } from 'nookies';

import { HttpResponse } from '../serverless/api/helpers/http';
import LoginProps from '../serverless/data/usecases/Login';
import api from '../services/api';
import UserModel from '../serverless/data/models/UserModel';
import FetchAPI from '../services/fetchAPI/FetchAPI';

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
        const response = await api.post<Omit<HttpResponse, 'statusCode'>>('/user/recover', {
          token: authToken,
        });

        const { userInfo } = response.data;

        if (userInfo) setUser(userInfo);
      }
    };
    handleRecoverUserInfo();
  }, []);

  const signIn = useCallback(async ({ email, password }: LoginProps): Promise<boolean> => {
    const fetchAPI = new FetchAPI('http://localhost:3000/api/user/login');

    const response = await fetchAPI.post({
      email,
      password,
    });

    if (response.data.error) {
      return false;
    }

    setCookie(undefined, 'authToken', response.data.payload as string, {
      maxAge: (60 * 60) * 48, // 2 days
    });

    fetchAPI.setHeader({
      headerName: 'Authorization',
      content: `Bearer ${response.data.payload}`,
    });
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
