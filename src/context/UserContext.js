import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { loadUser } from "../actions/auth";

const UserContext = createContext({});

const UserContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState({});
  const config = { currentUser, setCurrentUser };

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_BASE_URL}/auth`)
      .then((res) => setCurrentUser(res.data.user))
      .catch((err) => console.log("new error"));
  }, []);

  return <UserContext.Provider value={config}>{children}</UserContext.Provider>;
};

const useUserContext = () => {
  return useContext(UserContext);
};

export default UserContextProvider;
export { useUserContext };
