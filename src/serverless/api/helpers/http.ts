import UserModel from '../../data/models/UserModel';
import RegisterUser from '../../data/usecases/RegisterUser';
import {
  BadRequestError, ForbiddenError, InternalServerError, NotFoundError,
} from '../../error/HttpError';

export interface HttpResponse {
  message?: string
  error?: string
  payload?: string
  userInfo?: {
    userInfo: Omit<UserModel, 'password'>
  }
  statusCode: number
  content?: unknown
}

export interface HttpRequest {
  body: {
    user?: RegisterUser
  }
}

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

export const okWithContent = (infos: unknown): HttpResponse => ({
  statusCode: 200,
  content: infos,
});

export const created = (message: string): HttpResponse => ({
  statusCode: 201,
  message,
});

export const badRequest = (error: BadRequestError): HttpResponse => ({
  statusCode: 400,
  error: error.message,
});

export const forbidden = (error: ForbiddenError): HttpResponse => ({
  statusCode: 403,
  error: error.message,
});

export const notFound = (error: NotFoundError): HttpResponse => ({
  statusCode: 404,
  error: error.message,
});

export const serverError = (error: InternalServerError): HttpResponse => ({
  statusCode: 500,
  error: error.message,
});
