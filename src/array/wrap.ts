/**
 * Wrap a given value in an array if it isn't already.
 *
 * Useful if you want to accept either an array or a single value
 */
export function wrapAsArray<T>(value: MaybeArray<T>): Array<T> {
	return Array.isArray(value) ? value : [value];
}

export type MaybeArray<T> = T | T[];
