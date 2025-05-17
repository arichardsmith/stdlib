/**
 * Like Omit, but makes the keys optional instead of removing them from the type
 */
export type Optional<T, K extends keyof T> = {
	[U in Exclude<keyof T, K>]: T[U];
} & {
	[U in K]?: T[U];
};

/**
 * Like Omit, but allows the value to be undefined instead of removing them from the type
 *
 * This differs to Optional by preventing the user from completely omitting the value
 */
export type ValueOptional<T, K extends keyof T> = {
	[U in keyof T]: U extends K ? T[U] | undefined : T[U];
};

/**
 * Allow the user to completely omit any keys that can be undefined
 */
export type OptionalValuesKeyOptional<T> = {
	[K in keyof T as undefined extends T[K] ? never : K]: T[K];
} & {
	[K in keyof T as undefined extends T[K] ? K : never]: T[K];
};
