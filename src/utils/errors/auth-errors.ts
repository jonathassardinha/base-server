import HttpStatusCodes from 'http-status-codes';

const AuthErrors = {
  MISSING_OR_INVALID_FIELDS: {
    code: HttpStatusCodes.BAD_REQUEST,
    description: 'Missing or invalid fields in request body',
  },

  // MISSING ERRORS

  MISSING_REQUEST_BODY: {
    code: HttpStatusCodes.BAD_REQUEST,
    description: 'Missing Request body',
  },
  MISSING_EMAIL: {
    code: HttpStatusCodes.BAD_REQUEST,
    description: 'Missing user email',
  },
  // MISSING_USERNAME: {
  //   code: HttpStatusCodes.BAD_REQUEST,
  //   description: 'Missing username',
  // },
  MISSING_PASSWORD: {
    code: HttpStatusCodes.BAD_REQUEST,
    description: 'Missing password',
  },
  MISSING_TOKEN: {
    code: HttpStatusCodes.BAD_REQUEST,
    description: 'Missing token',
  },
  MISSING_REFRESH_TOKEN: {
    code: HttpStatusCodes.BAD_REQUEST,
    description: 'Missing refresh token',
  },

  // INVALID ERRORS

  INVALID_EMAIL: {
    code: HttpStatusCodes.BAD_REQUEST,
    description: 'Invalid user email',
  },
  // INVALID_USERNAME: {
  //   code: HttpStatusCodes.BAD_REQUEST,
  //   description: 'Invalid username',
  // },
  INVALID_PASSWORD: {
    code: HttpStatusCodes.BAD_REQUEST,
    description: 'Invalid password',
  },
  INVALID_TOKEN: {
    code: HttpStatusCodes.BAD_REQUEST,
    description: 'Invalid token',
  },
  INVALID_REFRESH_TOKEN: {
    code: HttpStatusCodes.BAD_REQUEST,
    description: 'Invalid refresh token',
  },
};

export default AuthErrors;
