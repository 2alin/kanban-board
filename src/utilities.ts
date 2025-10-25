/**
 * Gets the current date in ISO string format
 *
 * @returns The current date in ISO format
 */
export function getISODate(): string {
  return new Date().toISOString();
}

/**
 * Gets a random identifier
 *
 * @returns A random identifier
 */
export function getRandomId(): string {
  if (crypto) {
    return crypto.randomUUID();
  } else {
    return `${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  }
}

/**
 * Checks if an object has the given properties and their right prototype types
 *
 * @param candidate The object to check
 * @param properties The properties names and primitive types to check
 * @returns Whether the property names and their types exist in the candidate
 */
export function hasPropertyPrimitiveTypes(
  candidate: object,
  properties: Array<{ name: string; type: string }>
) {
  // we  make the assumption that the candidate object is indexed
  const indexedCandidate = candidate as unknown as Record<string, unknown>;

  for (const property of properties) {
    if (
      !(property.name in candidate) ||
      typeof indexedCandidate[property.name] !== property.type
    ) {
      return false;
    }
  }

  return true;
}
