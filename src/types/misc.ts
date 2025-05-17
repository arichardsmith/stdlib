/**
 * A value that can be awaited, but may not neccesarily be a promise
 *
 * Get the value with Awaited<T>
 */
export type Awaitable<T> = T | PromiseLike<T>;

/**
 * Any values that match a falsy check
 */
export type Falsy = false | 0 | "" | null | undefined;

/**
 * Falsy values, without the ones that cause footguns, such as 0
 */
export type StrictFalsy = Exclude<Falsy, 0 | "">;

/**
 * Convert a readonly object to a mutable one. The opposite of Readonly<T>.
 */
export type Mutable<T> = {
	-readonly [K in keyof T]: T[K];
};
