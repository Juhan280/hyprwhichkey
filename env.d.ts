/// <reference path="node_modules/astal/gtk3/jsx-runtime.ts" />
/// <reference path="@girs/astal-3.0.d.ts" />
/// <reference path="@girs/astalhyprland-0.1.d.ts" />

declare const SRC: string;

declare module "inline:*" {
	const content: string;
	export default content;
}

declare module "*.scss" {
	const content: string;
	export default content;
}

declare module "*.blp" {
	const content: string;
	export default content;
}

declare module "*.css" {
	const content: string;
	export default content;
}
