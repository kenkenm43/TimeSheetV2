/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import useRefreshToken from "../../hooks/useRefreshToken";
import { useLocation, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
const Users = () => {
  const [users, setUsers] = useState([{ username: "" }]);
  const axiosPrivate = useAxiosPrivate();
  const refresh = useRefreshToken();
  const navigate = useNavigate();
  const location = useLocation();
  // const { authy, setAuth }: any = useAuthStore();
  const { auth, setAuth }: any = useAuth();

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const getUsers = async () => {
      try {
        const response = await axiosPrivate.get("/users", {
          signal: controller.signal,
        });
        isMounted && setUsers(response.data);
      } catch (error) {
        navigate("/login", { state: { from: location }, replace: true });
      }
    };

    getUsers();
    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  return (
    <div>
      <h2>Users list</h2>
      {users?.length} ?{" "}
      <ul>
        {users.map((user, i) => (
          <li key={i}>{user?.username}</li>
        ))}
      </ul>{" "}
      :{" "}
      <div>
        <p>No users to display</p>
      </div>
      {auth && <div>{auth.username}</div>}
      <button
        onClick={() => setAuth({ username: "sdawda", accessToken: "dawdad" })}
      >
        ChangeState
      </button>
      <button onClick={() => refresh()}>Refresh</button>
    </div>
  );
};

export default Users;
