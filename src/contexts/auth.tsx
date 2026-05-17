import { createContext, useReducer } from "react";
import type { Auth, AuthAction } from "./auth.types";

const initialAuth: Auth = {
  token: null,
  userInfo: null,
};

export const AuthContext = createContext<Auth>(initialAuth);
export const AuthDispatchContext = createContext<
  React.ActionDispatch<[action: AuthAction]>
>(() => {});

export function AuthProvider({ children }: React.PropsWithChildren) {
  const [auth, dispatch] = useReducer(AuthReducer, initialAuth);

  return (
    <AuthContext value={auth}>
      <AuthDispatchContext value={dispatch}>{children}</AuthDispatchContext>
    </AuthContext>
  );
}

function AuthReducer(auth: Auth, action: AuthAction) {
  switch (action.type) {
    case "updateAuth":
      return { ...action.auth };
    case "updateToken":
      return { ...auth, token: action.token };
    case "updateUserInfo":
      return {... auth, userInfo: action.userInfo};
    default:
      throw new Error("[auth] Unrecognized authorization action");
  }
}
