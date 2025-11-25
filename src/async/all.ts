/**
 * Promise.all, but it takes an object of promises and resolves them concurrently
 *
 * This may eventually be built in to JS: https://github.com/tc39/proposal-await-dictionary
 * @param promises - an object where each key is a promise
 * @returns the same shape object, but all keys are the resolved values
 */
export async function allKeyed<T extends PromiseRecord>(
	promises: T
): Promise<ResolvedPromiseRecord<T>> {
	const entries = Object.entries(promises);

	const settled = await Promise.all(entries.map((entry) => entry[1]));

	const settled_entries = entries.map(([key], i) => [key, settled[i]]);

	return Object.fromEntries(settled_entries);
}

/**
 * Promise.allSettled, but it takes an object of promises and resolves them concurrently
 *
 * This may eventually be built in to JS: https://github.com/tc39/proposal-await-dictionary
 * @param promises - an object where each key is a promise
 * @returns the same shape object, but all keys are the resolved values
 */
export async function allSettledKeyed<T extends PromiseRecord>(
	promises: T
): Promise<SettledRecord<T>> {
	const entries = Object.entries(promises);

	const settled = await Promise.allSettled(entries.map((entry) => entry[1]));

	const settled_entries = entries.map(([key], i) => [key, settled[i]]);

	return Object.fromEntries(settled_entries);
}

type PromiseRecord = {
	[key: string]: any | PromiseLike<any>;
};

type ResolvedPromiseRecord<T extends PromiseRecord> = {
	[K in keyof T]: Awaited<T[K]>;
};

type SettledRecord<T extends PromiseRecord> = {
	[K in keyof T]: PromiseSettledResult<Awaited<T[K]>>;
};
