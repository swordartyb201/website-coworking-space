import React, { createContext, useEffect, useReducer } from "react";

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
    case "LOGIN_SUCCESS":
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
    case "REGISTER_START":
      return {
        user: null,
        loading: true,
        error: null,
      };
    case "REGISTER_SUCCESS":
      return {
        user: action.payload,
        loading: false,
        error: null,
      };
    case "REGISTER_FAILURE":
      return {
        user: null,
        loading: false,
        error: action.payload,
      };
    case "UPDATE_USER":
      return {
        ...state,
        user: action.payload,
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

  const logout = () => {
    dispatch({ type: "LOGOUT" });
  };

  const updateUserInContext = (newUserInfo) => {
    dispatch({
      type: "UPDATE_USER",
      payload: {
        ...state.user,
        ...newUserInfo,
      },
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        loading: state.loading,
        error: state.error,
        dispatch,
        logout,
        updateUser: updateUserInContext,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
