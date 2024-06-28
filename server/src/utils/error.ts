/* eslint-disable @typescript-eslint/no-explicit-any */
class ErrorHandler extends Error {
  statusCode: any;
  constructor(statusCode: any, message: any) {
    super();
    this.statusCode = statusCode;
    this.message = message;
  }
}

const handleError = (err: any, res: any) => {
  const { statusCode, message } = err;
  console.log(statusCode, message);

  return res.status(statusCode).json({
    success: false,
    status: "error",
    statusCode,
    message,
  });
};

export { handleError, ErrorHandler };
