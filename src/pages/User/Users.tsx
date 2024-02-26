import React, { useEffect, useState } from "react";
import axios from "../../services/httpClient";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import useRefreshToken from "../../hooks/useRefreshToken";
import { useLocation, useNavigate } from "react-router-dom";
const Users = () => {
  const [users, setUsers] = useState([{ username: "" }]);
  const axiosPrivate = useAxiosPrivate();
  const refresh = useRefreshToken();
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const getUsers = async () => {
      try {
        const response = await axiosPrivate.get("/users", {
          signal: controller.signal,
        });
        console.log(response.data);
        isMounted && setUsers(response.data);
      } catch (error) {
        console.error(error);
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
      <button onClick={() => refresh()}>Refresh</button>
    </div>
  );
};

export default Users;
