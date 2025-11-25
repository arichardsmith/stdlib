import { describe, expect, expectTypeOf, test } from "vitest";

import { allKeyed, allSettledKeyed } from "./all";

describe("allKeyed", () => {
	test("maintains the object shape", async () => {
		const res = await allKeyed({
			foo: Promise.resolve("foo"),
			bar: Promise.resolve("bar")
		});

		expect(res).toEqual({ foo: "foo", bar: "bar" });
	});

	test("handles mixed types", async () => {
		const res = await allKeyed({
			foo: Promise.resolve("foo"),
			bar: Promise.resolve(2)
		});

		expect(res).toEqual({ foo: "foo", bar: 2 });
	});

	test("maintains the individual key types", async () => {
		const res = await allKeyed({
			foo: Promise.resolve("foo"),
			bar: Promise.resolve(42),
			complex: Promise.resolve({ object: { with: Symbol("symbol") } })
		});

		expectTypeOf(res).toEqualTypeOf<{
			foo: string;
			bar: number;
			complex: { object: { with: symbol } };
		}>();
	});

	test("rejects if any of the promises reject", () => {
		const fails_first = new Promise<any>((_, reject) =>
			setTimeout(() => reject(new Error("first")), 10)
		);
		const fails_second = new Promise<any>((_, reject) =>
			setTimeout(() => reject(new Error("second")), 20)
		);

		return expect(
			allKeyed({ foo: fails_first, bar: fails_second, baz: Promise.resolve("baz") })
		).rejects.toThrow("first");
	});

	test("handles non-promise objects", async () => {
		const date = new Date();

		const res = await allKeyed({
			foo: Promise.resolve("foo"),
			bar: 2,
			complex: Promise.resolve({ object: { with: date } })
		});

		expect(res).toEqual({ foo: "foo", bar: 2, complex: { object: { with: date } } });
	});

	test("it doesn't resolve nested promises", async () => {
		const nested_bar = Promise.resolve("bar");
		const nested_baz = Promise.resolve("baz");

		const res = await allKeyed({
			foo: Promise.resolve("foo"),
			bar: { value: nested_bar },
			complex: Promise.resolve({ object: nested_baz })
		});

		expect(res.foo).toBe("foo");
		expect(res.bar.value).toBeInstanceOf(Promise);
		expect(res.complex.object).toBeInstanceOf(Promise);
		expect(await res.bar.value).toBe("bar");
		expect(await res.complex.object).toBe("baz");
	});
});

describe("allSettledKeyed", () => {
	test("maintains the object shape", async () => {
		const res = await allSettledKeyed({
			foo: Promise.resolve("foo"),
			bar: Promise.resolve("bar")
		});

		expect(res).toEqual({
			foo: { status: "fulfilled", value: "foo" },
			bar: { status: "fulfilled", value: "bar" }
		});
	});

	test("handles mixed types", async () => {
		const res = await allSettledKeyed({
			foo: Promise.resolve("foo"),
			bar: Promise.resolve(2)
		});

		expect(res).toEqual({
			foo: { status: "fulfilled", value: "foo" },
			bar: { status: "fulfilled", value: 2 }
		});
	});

	test("maintains the individual key types", async () => {
		const res = await allSettledKeyed({
			foo: Promise.resolve("foo"),
			bar: Promise.resolve(42),
			complex: Promise.resolve({ object: { with: Symbol("symbol") } })
		});

		expectTypeOf(res).toEqualTypeOf<{
			foo: PromiseSettledResult<string>;
			bar: PromiseSettledResult<number>;
			complex: PromiseSettledResult<{ object: { with: symbol } }>;
		}>();
	});

	test("marks rejected promises as rejected while keeping others fulfilled", async () => {
		const fails_first = new Promise<any>((_, reject) =>
			setTimeout(() => reject(new Error("first")), 10)
		);
		const fails_second = new Promise<any>((_, reject) =>
			setTimeout(() => reject(new Error("second")), 20)
		);

		const res = await allSettledKeyed({
			foo: fails_first,
			bar: fails_second,
			baz: Promise.resolve("baz")
		});

		expect(res.foo.status).toBe("rejected");
		expect(res.bar.status).toBe("rejected");
		expect(res.baz.status).toBe("fulfilled");

		if (res.foo.status === "rejected") {
			expect(res.foo.reason).toEqual(new Error("first"));
		}
		if (res.bar.status === "rejected") {
			expect(res.bar.reason).toEqual(new Error("second"));
		}
		if (res.baz.status === "fulfilled") {
			expect(res.baz.value).toBe("baz");
		}
	});

	test("handles non-promise objects", async () => {
		const date = new Date();

		const res = await allSettledKeyed({
			foo: Promise.resolve("foo"),
			bar: 2,
			complex: Promise.resolve({ object: { with: date } })
		});

		expect(res).toEqual({
			foo: { status: "fulfilled", value: "foo" },
			bar: { status: "fulfilled", value: 2 },
			complex: { status: "fulfilled", value: { object: { with: date } } }
		});
	});

	test("it doesn't resolve nested promises", async () => {
		const nested_bar = Promise.resolve("bar");
		const nested_baz = Promise.resolve("baz");

		const res = await allSettledKeyed({
			foo: Promise.resolve("foo"),
			bar: { value: nested_bar },
			complex: Promise.resolve({ object: nested_baz })
		});

		expect(res.foo.status).toBe("fulfilled");
		if (res.foo.status === "fulfilled") {
			expect(res.foo.value).toBe("foo");
		}

		expect(res.bar.status).toBe("fulfilled");
		if (res.bar.status === "fulfilled") {
			expect(res.bar.value.value).toBeInstanceOf(Promise);
			expect(await res.bar.value.value).toBe("bar");
		}

		expect(res.complex.status).toBe("fulfilled");
		if (res.complex.status === "fulfilled") {
			expect(res.complex.value.object).toBeInstanceOf(Promise);
			expect(await res.complex.value.object).toBe("baz");
		}
	});
});
