import { describe, expectTypeOf, it } from "vitest";

import { isNotNullish } from "./guards";

// This file can't be called guards.test.ts as it would then become an
// ambient type for the other test file, making typescript unhappy...

describe("isNotNullish", () => {
	it("removes null values from a type", () => {
		const maybe_null: string | null = "foo";
		if (isNotNullish(maybe_null)) {
			expectTypeOf(maybe_null).toEqualTypeOf<string>();
		}
	});

	it("removes undefined values from a type", () => {
		const maybe_null: { foo: string } | undefined = { foo: "bar" };
		if (isNotNullish(maybe_null)) {
			expectTypeOf(maybe_null).toEqualTypeOf<string>();
		}
	});

	it("removes null and undefined from array types", () => {
		const has_no_null = ([] as Array<string | null | undefined>).filter(isNotNullish);
		expectTypeOf(has_no_null).toEqualTypeOf<Array<string>>();
	});
});
