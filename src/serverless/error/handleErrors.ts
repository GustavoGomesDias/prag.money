import {
  badRequest, HttpResponse, notFound, unauthorized,
} from '../api/helpers/http';
import { BadRequestError, NotFoundError, UnauthorizedError } from './HttpError';

const handleErrors = (error: Error): HttpResponse | undefined => {
  if (error instanceof NotFoundError) {
    return notFound(error);
  }

  if (error instanceof BadRequestError) {
    return badRequest(error);
  }

  if (error instanceof UnauthorizedError) {
    return unauthorized(error);
  }

  return undefined;
};

export default handleErrors;
