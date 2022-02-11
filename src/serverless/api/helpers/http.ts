import RegisterUser from "../../data/usecases/RegisterUser";

export interface HttpResponse {
  message?: string
  error?: string
  statusCode: number
}

export interface HttpRequest {
  body: {
    user?: RegisterUser
  }
}

export const badRequest = (error: string): HttpResponse => ({
  statusCode: 400,
  error: error,
})

export const serverError = (error?: string): HttpResponse => ({
  statusCode: 500,
  error: error,
})

export const ok = (message: string): HttpResponse => ({
  statusCode: 200,
  message: message,
})

export const created = (message: string): HttpResponse => ({
  statusCode: 201,
  message: message,
})

export const notFound = (error: string): HttpResponse => ({
  statusCode: 404,
  error: error,
});
