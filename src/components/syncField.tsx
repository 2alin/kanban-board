import { useContext } from "react";
import LoginButton from "./auth/loginButton";
import { AuthContext } from "../contexts/auth";

export default function SyncField() {
  const auth = useContext(AuthContext);

  if (!import.meta.env.VITE_GAUTH_CLIENT_ID || !auth) {
    return;
  }

  return (
    <article>
      <span className="field-name">Google Sync: </span>
      {!auth.token ? 
      <LoginButton />
      :
      <span>
        {auth.userInfo?.givenName}
        {/* add logout button */}
      </span> 
      }
    </article>
  );
}
