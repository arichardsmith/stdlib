import { describe, expect, it } from "vitest";

import * as g from "./guards.js";

// Only test important edge cases here! There's no point wasting time testing things like isString("foo") works!

describe("isString", () => {
	it("returns true for an empty string", async () => {
		expect(g.isString("")).toBe(true);
	});
});

describe("isRecord", () => {
	it("returns true for an empty object", async () => {
		expect(g.isRecord({})).toBe(true);
	});

	it("returns false for null", async () => {
		// This is neccessary because typeof null === "object"
		expect(g.isRecord(null)).toBe(false);
	});

	it.fails("returns false if an object has numeric keys", async () => {
		const test: any = {};
		test[1] = [1];
		expect(g.isRecord(test)).toBe(false);
	});

	it.fails("returns false if an object has symbol keys", async () => {
		const sym = Symbol("foo");
		const test: any = {};
		test[sym] = "foo";

		expect(g.isRecord(test)).toBe(false);
	});

	it("returns false for arrays", async () => {
		expect(g.isRecord([1, 2, 3])).toBe(false);
	});
});

describe("isValidNumber", () => {
	it("returns false for NaN values", async () => {
		expect(g.isValidNumber(NaN)).toBe(false);
	});
});

describe("isArray", () => {
	it("applies predicate to all items", async () => {
		expect(g.isArray([1, 2, 3], (item) => typeof item === "number")).toBe(true);
		expect(g.isArray([1, "2", 3], (item) => typeof item === "number")).toBe(false);
	});

	it("returns true for an empty array even if predicate is provided", async () => {
		expect(g.isArray([], (item) => typeof item === "number")).toBe(true);
	});
});

class TestError extends Error {}

describe("isError", () => {
	it("matches against the given error class", () => {
		const err = new TestError("test");

		expect(g.isError(err, TestError)).toBe(true);
		expect(g.isError(err, Error)).toBe(true);
		expect(g.isError(err, TypeError)).toBe(false);
	});
});

describe("isInteger", () => {
	it("fails against floats", () => {
		expect(g.isInteger(2.5)).toBe(false);
	});

	it("returns true for BigInts", () => {
		expect(g.isInteger(BigInt(1_000_000_000_000)));
	});
});

describe("isObject", () => {
	it("returns true for an empty object", async () => {
		expect(g.isObject({})).toBe(true);
	});

	it("returns false for null", async () => {
		expect(g.isObject(null)).toBe(false);
	});

	it("returns false for arrays", async () => {
		expect(g.isObject([1, 2, 3])).toBe(false);
	});
});
