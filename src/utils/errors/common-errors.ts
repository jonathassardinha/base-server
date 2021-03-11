import HttpStatusCodes from 'http-status-codes';

const CommonErrors = {
  INTERNAL_SERVER_ERROR: {
    code: HttpStatusCodes.INTERNAL_SERVER_ERROR,
    description: 'Internal Server Error',
  },
  DATABASE_ERROR: {
    code: HttpStatusCodes.INTERNAL_SERVER_ERROR,
    description: 'Database Error',
  },
  UNAUTHORIZED: {
    code: HttpStatusCodes.UNAUTHORIZED,
    description: 'Unauthorized',
  },
  FORBIDDEN: {
    code: HttpStatusCodes.FORBIDDEN,
    description: 'Forbidden',
  },
  NOT_FOUND: {
    code: HttpStatusCodes.NOT_FOUND,
    description: 'Not Found',
  },
};

export default CommonErrors;
