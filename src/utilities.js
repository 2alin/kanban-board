/**
 * Gets the current date in ISO string format
 *
 * @returns {string} the current date in ISO format
 */
export function getISODate() {
  return new Date().toISOString();
}

/**
 * Gets a random identifier
 *
 * @returns {string} a random identifier
 */
export function getRandomId() {
  if (crypto) {
    return crypto.randomUUID();
  } else {
    return `${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  }
}
