import React, { ReactNode } from "react";

type Props = {
  children?: ReactNode;
};
const Layout = ({ children }: Props) => {
  return (
    <form className="flex items-center flex-col space-y-5 bg-white p-6">
      {children}
    </form>
  );
};

export default Layout;
