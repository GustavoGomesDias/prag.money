import { createContext, useEffect, useState } from 'react';
import { setCookie, parseCookies } from 'nookies';
import { useRouter } from 'next/router';

import { HttpResponse } from '../serverless/api/helpers/http';
import LoginProps from '../serverless/data/usecases/Login';
import api from '../utils/config/api';
import UserModel from '../serverless/data/models/UserModel';
import toastConfig from '../utils/config/tostConfig';
import { useToast } from '@chakra-ui/react';

export interface AuthProviderProps {
  children: JSX.Element | JSX.Element[]
}

export interface AuthContextProps {
  user: { userInfo: Omit<UserModel, 'password'> } | null
  isAuthenticated: boolean
  signIn({ email, password }: LoginProps): Promise<void>
}

export const AuthContext = createContext({} as AuthContextProps);

export default function AuthProvider({ children }: AuthProviderProps): JSX.Element {
  const [user, setUser] = useState<{ userInfo: Omit<UserModel, 'password'> } | null>(null);
  const { push } = useRouter();
  const toast = useToast();
  const isAuthenticated = !!user;

  useEffect(() => {
    const { authToken } = parseCookies();

    if (authToken) {
      
    }
  }, []);

  const signIn = async ({ email, password }: LoginProps): Promise<void> => {
    const response = await api.post<Omit<HttpResponse, 'statusCode'>>('/user/login', {
      email: email,
      password: password,
    });


    if (response.data.error) {
      console.log(response.data.error);
      toast({
        title: '😔',
        description: response.data.error,
        status: 'error',
        ...toastConfig,
      });
    } else {
      setCookie(undefined, 'authToken', response.data.payload as string, {
        maxAge: (60 * 60) * 48, // 2 days
      });
      console.log(response.data.userInfo);
      if (response.data.userInfo !== undefined) {
        setUser(response.data.userInfo);
        push('/', '/');
      }
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, signIn }}>
      {children}
    </AuthContext.Provider>
  );
}
