import HttpStatusCodes from 'http-status-codes';

const BaseErrors = {
  MISSING_OR_INVALID_FIELDS: {
    code: HttpStatusCodes.BAD_REQUEST,
    description: 'Missing or invalid fields in request body',
  },

  // MISSING ERRORS

  MISSING_REQUEST_BODY: {
    code: HttpStatusCodes.BAD_REQUEST,
    description: 'Missing Request body',
  },
  MISSING_REQUIRED_INTEGER_FIELD: {
    code: HttpStatusCodes.BAD_REQUEST,
    description: 'Missing required integer field',
  },

  // INVALID ERRORS

  INVALID_INTEGER_FIELD: {
    code: HttpStatusCodes.BAD_REQUEST,
    description: 'Invalid integer field',
  },
};

export default BaseErrors;
