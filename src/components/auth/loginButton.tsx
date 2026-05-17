import { useContext, useEffect, useRef } from "react";
import { useGAuthScripts } from "../../hooks/useGAuthScripts";
import { AuthDispatchContext } from "../../contexts/auth";
import { getUserInfo } from "../../services/gUserInfo";

export default function LoginButton() {
  const areScriptsReady = useGAuthScripts();
  const tokenClientRef = useRef<google.accounts.oauth2.TokenClient>(null);

  const authDispatch = useContext(AuthDispatchContext);

  useEffect(() => {
    if (!areScriptsReady) {
      return;
    }

    tokenClientRef.current = google.accounts.oauth2.initTokenClient({
      client_id: import.meta.env.VITE_GAUTH_CLIENT_ID,
      scope: [
        "openid",
        "profile",
        "email",
        "https://www.googleapis.com/auth/drive.appdata",
      ].join(" "),
      callback: async (tokenResponse) => {
        console.log("Access token:", tokenResponse.access_token);
        console.log("response", tokenResponse);
        authDispatch({
          type: "updateToken",
          token: tokenResponse.access_token,
        });

        const userInfo = await getUserInfo(tokenResponse.access_token);

        if (userInfo) {
          authDispatch({ type: "updateUserInfo", userInfo });
        }
      },
    });
  }, [areScriptsReady]);

  // useEffect(() => {
  //   if (!auth?.token) {
  //     return;
  //   }

  //   runDriveTests(auth.token);
  // }, [auth]);

  // async function runDriveTests(token: string) {
  //   const TEST_FILE = "test.json";
  //   const TEST_DATA = { hello: "world", ts: Date.now() };

  //   // Write
  //   console.log("📝 Writing file...");
  //   const fileId = await writeFile(token, TEST_FILE, TEST_DATA);
  //   console.log("✅ Written, file id:", fileId);

  //   // Find
  //   console.log("🔍 Finding file...");
  //   const foundId = await findFile(token, TEST_FILE);
  //   console.log("✅ Found file id:", foundId);

  //   // Read
  //   console.log("📖 Reading file...");
  //   const data = await readFile(token, fileId);
  //   console.log("✅ Read data:", data);
  // }

  function handleSignIn() {
    tokenClientRef.current?.requestAccessToken();
  }

  return (
    <button onClick={handleSignIn} disabled={!areScriptsReady}>
      {areScriptsReady ? "Sign in with Google" : "Loading..."}
    </button>
  );
}
