import { Awaitable } from "./misc";

export type ResultSuccess<T> = {
	success: true;
	value: T;
};

export type ResultError<E> = {
	success: false;
	error: E;
};

export type Result<T, E> = ResultSuccess<T> | ResultError<E>;
export const Result = {
	ok<T, E extends Error>(value: T): Result<T, E> {
		return {
			success: true,
			value
		};
	},
	err<T, E extends Error>(error: E): Result<T, E> {
		return {
			success: false,
			error
		};
	}
};

export function isOk<T, E>(res: Result<T, E>): res is ResultSuccess<T> {
	return res.success;
}

export function resultMap<T, E, U>(res: Result<T, E>, fn: (value: T) => U): Result<U, E> {
	if (isOk(res)) {
		return {
			success: true,
			value: fn(res.value)
		};
	}

	return res;
}

/**
 * Map a result's error to a default fault value
 */
export function resultOrElse<T, E, U>(res: Result<T, E>, fn: (error: E) => U): T | U {
	if (isOk(res)) {
		return res.value;
	}

	return fn(res.error);
}

/**
 * Map a result's error into a new result
 *
 * Unlike resultOrElse, this allows for providing a new error or value
 */
export function resultMapErr<T, E, U, UE>(
	res: Result<T, E>,
	fn: (error: E) => Result<U, UE>
): ResultSuccess<T> | Result<U, UE> {
	if (isOk(res)) {
		return res;
	}

	return fn(res.error);
}

/**
 * Run a function that might throw and wrap the result
 */
export function resultTry<T>(fn: () => T): Result<T, unknown> {
	try {
		return {
			success: true,
			value: fn()
		};
	} catch (error) {
		return {
			success: false,
			error
		};
	}
}

export async function resultTryAsync<T>(fn: () => Awaitable<T>): Promise<Result<T, unknown>> {
	try {
		return {
			success: true,
			value: await fn()
		};
	} catch (error) {
		return {
			success: false,
			error
		};
	}
}
