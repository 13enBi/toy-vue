namespace JSX {
	interface ElementClass {
		render: any;
	}

	type Element = any;

	interface IntrinsicElements {
		[elemName: string]: any;
	}
}
