/**
 * Make a type easier to read by flattening the declaration
 */
export type Prettify<T> = {
	[K in keyof T]: T extends Record<string, unknown> ? Prettify<T[K]> : T[K];
} & {};

type ExampleInput = {
	color: string;
	shape: string;
} & {
	size: number;
} & Pick<
		{
			shape: "circle" | "square";
			area: number;
		},
		"shape"
	>;

type Example = Prettify<ExampleInput>;
//   ^? type Example = {
//        color: string;
//        shape: "circle" | "square";
//        size: number;
//      }
