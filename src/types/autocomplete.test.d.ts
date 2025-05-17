import { describe, expectTypeOf, test } from "vitest";

import { AutocompleteSuggestion } from "./autocomplete";

describe("AutocompleteSuggestion type", () => {
	test("still allows arbitrary strings", () => {
		expectTypeOf<AutocompleteSuggestion<"foo" | "bar">>().toBeString();
	});
});
