import React, { ReactNode } from "react";

type Props = {
  children?: ReactNode;
};
const Layout = ({ children }: Props) => {
  return (
    <div className="max-w-5xl min-w-96 mx-auto flex justify-center">
      <form className="flex flex-col space-y-5 bg-gray-100 p-6 rounded-md shadow-s w-full">
        {children}
      </form>
    </div>
  );
};

export default Layout;
