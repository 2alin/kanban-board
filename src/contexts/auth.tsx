import { createContext, useReducer } from "react";
import type { Auth, AuthAction } from "./auth.types";

export const AuthContext = createContext<Auth | null>(null);
export const AuthDispatchContext = createContext<
  React.ActionDispatch<[action: AuthAction]>
>(() => {});

export function AuthProvider({ children }: React.PropsWithChildren) {
  const initialAuth = {
    token: null,
    email: null,
    name: null,
  };

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
    default:
      throw new Error("[auth] Unrecognized authorization action");
  }
}
