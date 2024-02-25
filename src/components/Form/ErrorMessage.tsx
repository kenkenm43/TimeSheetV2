import React from "react";

type Props = {
  message: string;
};

const ErrorMessage = ({ message }: Props) => {
  return <div className="text-xs text-red-500">{message}</div>;
};

export default ErrorMessage;
