/* eslint-disable @typescript-eslint/no-explicit-any */
import { ReactNode, useEffect } from "react";
import useRefreshToken from "../../hooks/useRefreshToken";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

type Props = {
  children?: ReactNode;
  onSubmit?: any;
  defaultValues?: any;
};
const Layout = ({ children, onSubmit }: Props) => {
  const navigate = useNavigate();
  const { auth } = useAuth();

  useEffect(() => {
    if (auth.id) {
      navigate("/");
    }
  }, [auth.id, navigate]);
  return (
    <div className="max-w-lg mx-auto flex items-center rounded-sm shadow-sm my-8">
      <div className="transition-all duration-1000 flex justify-center w-full bg-gray-100 rounded-lg shadow-sm h-full">
        <form className="flex flex-col space-y-5 p-6 w-4/6" onSubmit={onSubmit}>
          {children}
        </form>
      </div>
    </div>
  );
};

export default Layout;
