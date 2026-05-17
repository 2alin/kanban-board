import type { UserInfo } from "../contexts/auth.types";

const USER_INFO_API = "https://www.googleapis.com/oauth2/v3/userinfo";

interface GUserInfo {
  name: string; // full name
  given_name: string; // first name
  family_name: string; // last name
  picture: string; // avatar URL
  email: string; // email address
  [key: string]: unknown;
}

function authHeader(token: string): HeadersInit {
  return { Authorization: `Bearer ${token}` };
}

/**
 * Gets the GUser info
 *
 * @param token - The auth token
 * @returns - The GUser info if found or null otherwise
 */
export async function getUserInfo(token: string): Promise<UserInfo | null> {
  try {
    const res = await fetch(`${USER_INFO_API}`, {
      headers: authHeader(token),
    });

    const user: GUserInfo = await res.json();

    const userInfo: UserInfo = {
      givenName: user.given_name,
      email: user.email,
    };

    return userInfo;
  } catch (err) {
    console.log(`[GUserInfo.get] Error retrieving user info`, err);
    return null;
  }
}
