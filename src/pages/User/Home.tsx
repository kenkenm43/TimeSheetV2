import React from "react";
import useRefreshToken from "../../hooks/useRefreshToken";
import TimeSheet from "../../components/Timesheet/timeSheet";
const Home = () => {
  const refresh = useRefreshToken();
  return (
    <div className="w-full flex justify-center">
      <TimeSheet />
      {/* <button onClick={refresh}>Refresh</button> */}
    </div>
  );
};

export default Home;
