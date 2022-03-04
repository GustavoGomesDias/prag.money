import { createContext, useEffect, useState } from 'react';
import { setCookie, parseCookies, destroyCookie } from 'nookies';
import { useRouter } from 'next/router';
import { useToast } from '@chakra-ui/react';

import { HttpResponse } from '../serverless/api/helpers/http';
import LoginProps from '../serverless/data/usecases/Login';
import api from '../services/api';
import UserModel from '../serverless/data/models/UserModel';
import toastConfig from '../utils/config/tostConfig';

export interface AuthProviderProps {
  children: JSX.Element | JSX.Element[]
}

export interface AuthContextProps {
  user: { userInfo: Omit<UserModel, 'password'> } | null
  isAuthenticated: boolean
  signIn({ email, password }: LoginProps): Promise<void>
  signOut(): void
}

export const AuthContext = createContext({} as AuthContextProps);

export default function AuthProvider({ children }: AuthProviderProps): JSX.Element {
  const [user, setUser] = useState<{ userInfo: Omit<UserModel, 'password'> } | null>(null);
  const { push } = useRouter();
  const toast = useToast();
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
    }
    handleRecoverUserInfo();
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

      api.defaults.headers.common['Authorization'] = `Bearer ${response.data.payload}`
      if (response.data.userInfo !== undefined) {
        setUser(response.data.userInfo);
        push('/dashboard', '/dashboard');
        return;
      }
    }

  };
  
  const signOut = (): void => {
    destroyCookie({}, 'authToken', {
      path: '/',
    });
    setUser(null);
    return;
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
