/**
 * Authorization data
 */
export interface Auth {
  token: string | null;
  email: string | null;
  name: string | null;
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

export type AuthAction = UpdateAuthAction | UpdateTokenAction;
