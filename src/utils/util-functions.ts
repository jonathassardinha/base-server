export interface ServerError {
  code: number;
  description: string;
}

/* eslint-disable import/prefer-default-export */
export function validateEmail(email: string) {
  // eslint-disable-next-line max-len
  const regex = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i;
  return regex.test(email);
}

export function isServerError(error: any): error is ServerError {
  return 'code' in error && 'description' in error;
}
