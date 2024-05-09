import { createContext, useEffect, useReducer } from "react";

const INITIAL_STATE = {
  user: JSON.parse(localStorage.getItem("user")) || null,
  loading: false,
  error: null,
};

export const AuthContext = createContext(INITIAL_STATE);

const AuthReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN_START":
      return {
        user: null,
        loading: true,
        error: null,
      };
    // Khi đăng nhập thành công, lưu thời gian đăng nhập vào localStorage
    case "LOGIN_SUCCESS":
      localStorage.setItem("loginTime", Date.now());
      return {
        user: action.payload,
        loading: false,
        error: null,
      };
    case "LOGIN_FAILURE":
      return {
        user: null,
        loading: false,
        error: action.payload,
      };
    case "LOGOUT":
      return {
        user: null,
        loading: false,
        error: null,
      };
    default:
      return state;
  }
};

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE);

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(state.user));
  }, [state.user]);

  useEffect(() => {
    const checkLoginTime = () => {
      const loginTime = localStorage.getItem("loginTime");
      if (loginTime && Date.now() - loginTime > 3600000) {
        // 3600000 ms = 1 hour
        dispatch({ type: "LOGOUT" });
      }
    };

    checkLoginTime();
    const intervalId = setInterval(checkLoginTime, 60000); // Kiểm tra mỗi phút

    // Dọn dẹp khi unmount
    return () => clearInterval(intervalId);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        loading: state.loading,
        error: state.error,
        dispatch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
