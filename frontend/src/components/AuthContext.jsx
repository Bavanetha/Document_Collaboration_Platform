import { createContext, useEffect, useReducer, useState } from "react";

export const AuthContext = createContext();
const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      return { user: action.payload };
    case "LOGOUT":
      return { user: null };
    default:
      return state;
  }
};
const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, { user: null });
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let user = localStorage.getItem("token");
    if (user != null) {
      dispatch({ type: "LOGIN", payload: user });
    }
    setLoading(false);
  }, []);
  if(!loading)
  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};
export default AuthContextProvider;