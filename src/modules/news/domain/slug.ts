const SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const MAX_SLUG_LENGTH = 200;

/** Same rule as the database CHECK constraints: lowercase letters, digits and single hyphens. */
export function isValidSlug(value: string): boolean {
  return value.length <= MAX_SLUG_LENGTH && SLUG.test(value);
}
