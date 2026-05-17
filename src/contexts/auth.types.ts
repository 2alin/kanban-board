/**
 * User Information that the app uses
 */
export interface UserInfo {
  givenName: string;
  email: string;
}

/**
 * Authorization data
 */
export interface Auth {
  token: string | null;
  userInfo: UserInfo | null;
}

/**
 * Updates all the authorization data
 */
interface UpdateAuthAction {
  type: "updateAuth";
  auth: Auth;
}

/**
 * Updates the authorization token
 */
interface UpdateTokenAction {
  type: "updateToken";
  token: string;
}

/**
 * Updates the user info
 */
interface UpdateUserInfoAction {
  type: "updateUserInfo";
  userInfo: UserInfo;
}

export type AuthAction =
  | UpdateAuthAction
  | UpdateTokenAction
  | UpdateUserInfoAction;
