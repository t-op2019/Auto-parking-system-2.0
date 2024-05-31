export class AppError extends Error {
    statusCode;
    status;
    isOperational;
  
    constructor(message, statusCode) {
      super(message);
      this.statusCode = statusCode;
      this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
      this.isOperational = true;
      Object.setPrototypeOf(this, AppError.prototype);
  
      Error.captureStackTrace(this, this.constructor);
    }
  }
  