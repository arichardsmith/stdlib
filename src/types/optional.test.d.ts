import { describe, expectTypeOf, test } from "vitest";

import { Optional, OptionalValuesKeyOptional, ValueOptional } from "./optional";

// Define some test types
interface TestType {
	required: string;
	optional: number;
	nested: {
		field: boolean;
	};
}

interface TestTypeWithUndefined {
	required: string;
	optional?: number;
	nullableValue: string | null;
	undefinableValue: string | undefined;
	nullOrUndefined: string | null | undefined;
}

describe("Optional type", () => {
	test("makes specified keys optional", () => {
		// Test with a single optional key
		type TestOptional = Optional<TestType, "optional">;

		// Should allow omitting the 'optional' property
		expectTypeOf<TestOptional>().toMatchTypeOf<{
			required: string;
			nested: {
				field: boolean;
			};
			optional?: number;
		}>();

		// Make multiple keys optional
		type TestMultipleOptional = Optional<TestType, "optional" | "nested">;

		expectTypeOf<TestMultipleOptional>().toMatchTypeOf<{
			required: string;
			optional?: number;
			nested?: {
				field: boolean;
			};
		}>();

		// Test that required properties remain required
		expectTypeOf<TestOptional>().toHaveProperty("required").toBeString();
		expectTypeOf<TestOptional>().toHaveProperty("required").not.toBeUndefined();
		expectTypeOf<TestOptional>().toHaveProperty("optional").toBeNullable();
	});
});

describe("ValueOptional type", () => {
	test("allows specified keys to be undefined but not omitted", () => {
		// Test with a single key
		type TestValueOptional = ValueOptional<TestType, "optional">;

		// Should require the 'optional' property but allow it to be undefined
		expectTypeOf<TestValueOptional>().toMatchTypeOf<{
			required: string;
			optional: number | undefined;
			nested: {
				field: boolean;
			};
		}>();

		// Test with multiple keys
		type TestMultipleValueOptional = ValueOptional<TestType, "optional" | "nested">;

		expectTypeOf<TestMultipleValueOptional>().toMatchTypeOf<{
			required: string;
			optional: number | undefined;
			nested: { field: boolean } | undefined;
		}>();

		// Ensure keys are not omittable
		expectTypeOf<TestValueOptional>().toHaveProperty("optional");

		// But they can be undefined
		const valid: TestValueOptional = {
			required: "string",
			nested: { field: true },
			optional: undefined
		};
		expectTypeOf(valid).toMatchTypeOf<TestValueOptional>();
	});
});

describe("OptionalValuesKeyOptional type", () => {
	test("allows omitting keys that can be undefined", () => {
		type Test = OptionalValuesKeyOptional<TestTypeWithUndefined>;

		// Keys that can be undefined should be optional
		expectTypeOf<Test>().toMatchTypeOf<{
			required: string;
			optional?: number;
			nullableValue: string | null;
			undefinableValue?: string | undefined;
			nullOrUndefined?: string | null | undefined;
		}>();

		// Should allow omitting the undefined keys
		const validWithoutUndefined: Test = {
			required: "string",
			nullableValue: null
		};
		expectTypeOf(validWithoutUndefined).toMatchTypeOf<Test>();

		// Should still allow including those keys
		const validWithUndefined: Test = {
			required: "string",
			nullableValue: "value",
			undefinableValue: "value",
			nullOrUndefined: null,
			optional: 42
		};
		expectTypeOf(validWithUndefined).toMatchTypeOf<Test>();

		// Required keys remain required
		expectTypeOf<Test>().toHaveProperty("required").not.toBeUndefined();
		expectTypeOf<Test>().toHaveProperty("nullableValue").not.toBeUndefined();

		// But can still be nullable if originally defined that way
		expectTypeOf<Test["nullableValue"]>().toEqualTypeOf<string | null>();
	});

	test("handles complex nested types", () => {
		// Test with a more complex type
		interface ComplexType {
			id: number;
			name: string;
			metadata?: {
				createdAt: Date;
				tags?: string[];
			};
			status: "active" | "inactive" | undefined;
		}

		type OptionalComplex = OptionalValuesKeyOptional<ComplexType>;

		// Fields that can be undefined should be optional
		expectTypeOf<OptionalComplex>().toMatchTypeOf<{
			id: number;
			name: string;
			metadata?: {
				createdAt: Date;
				tags?: string[];
			};
			status?: "active" | "inactive" | undefined;
		}>();

		// Valid without optional fields
		const minimal: OptionalComplex = {
			id: 1,
			name: "test"
		};
		expectTypeOf(minimal).toMatchTypeOf<OptionalComplex>();

		// Valid with all fields
		const complete: OptionalComplex = {
			id: 1,
			name: "test",
			metadata: {
				createdAt: new Date(),
				tags: ["tag1", "tag2"]
			},
			status: "active"
		};
		expectTypeOf(complete).toMatchTypeOf<OptionalComplex>();
	});
});
