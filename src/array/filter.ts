/**
 * Map and filter an array in one pass.
 */
export function filterMap<I, O>(arr: I[], map: (item: I) => O | null | undefined): O[] {
	return arr.flatMap((item) => {
		const res = map(item);
		if (res === null || res === undefined) {
			return [];
		}

		return [res];
	});
}
