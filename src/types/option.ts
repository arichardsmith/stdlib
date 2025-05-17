/**
 * A value that may or may not exist
 */
export type Option<T> = T | null;
export const Option = {
	/**
	 * Create an Option with a value
	 */
	some: <T>(value: T): Option<T> => value,
	/**
	 * Create an Option with a value
	 */
	none: <T>() => null as T extends Option<infer U> ? Option<U> : Option<T>
};

/**
 * Wrap a value as an option
 *
 * Coerces undefined to null if needed
 * @example
 * ```ts
 * const opt_value = optionWrap(deeply?.nested?.key);
 * ```
 */
export function optionWrap<T>(value: T | null | undefined): Option<T> {
	return value ?? null;
}

/**
 * Modify the value of an option if it exists
 * @returns a new Option with the mapped value
 *
 * @example
 * ```ts
 * const result = optionMap(opt_value, (v) => v * 5);
 * const optional_result = optionMap(
 * 	opt_value,
 * 	v => v > 0 ? option.Some(v) : option.None()
 * )
 * ```
 */
export function optionMap<I, O>(value: Option<I>, mapper: (input: I) => O | Option<O>): Option<O> {
	if (value === null) return null;
	return mapper(value);
}

/**
 * Check if an Option value exists
 *
 * This also narrows the type to remove null
 */
export function optionIsSome<T>(value: Option<T>): value is T {
	return value !== null;
}

/**
 * Check if an Option value is null
 *
 * This also narrows the type
 */
export function optionIsNone<T>(value: Option<T>): value is null {
	return value === null;
}

/**
 * Unwrap an option by providing a default value
 * @returns the value in the Option, or the default value if the option was null
 */
export function optionOrElse<T>(value: Option<T>, dflt: T): T;
export function optionOrElse<T, D>(value: Option<T>, dflt: D): T | D;
export function optionOrElse<T, D>(value: Option<T>, dflt: D): T | D {
	return value ?? dflt;
}

/**
 * Throw an error if the option was null
 * @param err optionally specific the error
 * @throws {OptionUnwrapError | Error}
 */
export function optionOrThrow<T>(value: Option<T>, err: Error | string): T {
	if (value === null) {
		if (err instanceof Error) throw err;
		throw new OptionUnwrapError(err);
	}

	return value;
}

export class OptionUnwrapError extends Error {
	constructor(message?: string) {
		super(message ?? "Option contained a null value");
		this.name = "OptionUnwrapError";
	}
}
