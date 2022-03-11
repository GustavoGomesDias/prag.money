import UserModel from '../../data/models/UserModel';
import RegisterUser from '../../data/usecases/RegisterUser';

export interface HttpResponse {
  message?: string
  error?: string
  payload?: string
  userInfo?: {
    userInfo: Omit<UserModel, 'password'>
  }
  statusCode: number
}

export interface HttpRequest {
  body: {
    user?: RegisterUser
  }
}

export const badRequest = (error: string): HttpResponse => ({
  statusCode: 400,
  error,
});

export const serverError = (error?: string): HttpResponse => ({
  statusCode: 500,
  error,
});

export const ok = (message: string): HttpResponse => ({
  statusCode: 200,
  message,
});

export const okWithPayload = (payload: string, userInfos: Omit<UserModel, 'password'>): HttpResponse => ({
  statusCode: 200,
  payload,
  userInfo: {
    userInfo: userInfos,
  },
});

export const created = (message: string): HttpResponse => ({
  statusCode: 201,
  message,
});

export const notFound = (error: string): HttpResponse => ({
  statusCode: 404,
  error,
});
