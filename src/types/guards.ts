import { Falsy, StrictFalsy } from "./misc";

export function isString(val: unknown): val is string {
	return typeof val === "string";
}

/**
 * Test if a value is an object
 *
 * **Note:** Returns true even if the object has number or symbol keys (despite the type).
 * This is because number keys get converted to string and symbol keys aren't enumerable, making
 * it both difficult to check and not that importent to include them in the type signature.
 */
export function isRecord<T extends Record<string, unknown>>(val: unknown): val is T {
	return isObject(val);
}

export function isBoolean(val: unknown): val is boolean {
	return typeof val === "boolean";
}

export function isUndefined(val: unknown): val is undefined {
	return val === undefined;
}

export function isValidNumber(val: unknown): val is number {
	return typeof val === "number" && !Number.isNaN(val);
}

export function isInteger(val: unknown): val is number {
	return isValidNumber(val) && val % 1 === 0;
}
/**
 * Test if a value is an error, optionally of a specific type.
 * @param type class that extends Error
 */
export function isError<E extends Error>(
	error: unknown,
	type: new (...args: any[]) => E
): error is E;
export function isError(error: unknown): error is Error;
export function isError<E extends Error>(
	error: unknown,
	type?: new (...args: any[]) => E
): error is E {
	if (!(error instanceof Error)) {
		return false;
	}

	return type === undefined || error instanceof type;
}

/**
 * Test if a value is an array, optionally with a specific item type.
 * @param val
 * @param item_predicate - a type guard to test each item in the array
 */
export function isArray<T>(
	val: unknown,
	item_predicate: (item: unknown) => item is T
): val is Array<T>;
export function isArray(val: unknown): val is Array<unknown>;
export function isArray(val: unknown, item_predicate?: (item: unknown) => boolean) {
	if (!Array.isArray(val)) {
		return false;
	}

	if (item_predicate === undefined) {
		return true;
	}

	return val.every(item_predicate);
}

/**
 * Tests if a value is falsy.
 *
 * i.e. it's false, null, undefined, 0, or "".
 */
export function isFalsy(val: unknown): val is Falsy {
	return !val;
}

/**
 * Tests if a value is false, null or undefined
 */
export function isStrictFalsy(val: unknown): val is StrictFalsy {
	return val === false || val === null || val === undefined;
}

export function isFunction<E extends (...args: any[]) => any>(val: E | unknown): val is E {
	return typeof val === "function";
}

/**
 * Check if a value is an POJO (Plain Old JavaScript Object)
 */
export function isObject(val: unknown): val is object {
	return typeof val === "object" && val !== null && !Array.isArray(val);
}

/**
 * Check if a value is an object with the given keys
 * @param keys - the keys that the object must have
 */
export function isObjectWithKeys<K extends string>(
	keys: K[],
	val: unknown
): val is Record<K, unknown> {
	if (!isObject(val)) {
		return false;
	}

	return keys.every((key) => key in val);
}
