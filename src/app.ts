import { App } from "astal/gtk3";
import style from "./style.scss";
import WhichKey, { BindProps } from "./WhichKey";
import { exec, Variable } from "astal";
import Hyprland from "gi://AstalHyprland";

const binds: Variable<BindProps[][]> = Variable([]);
let toggleBaseLayer = () => {};

App.start({
	instanceName: "hyprwhichkey",
	css: style,
	main() {
		let wk = WhichKey({ binds });
		const hyprland = Hyprland.get_default();

		hyprland.connect("submap", (_, submap) => {
			console.log(`"${submap}"`);
			if (!submap) return wk.set_visible(false);

			setBinds(submap, 4);
			wk.set_visible(true);
		});

		toggleBaseLayer = () => {
			console.log("base");
			if (wk.visible) return wk.set_visible(false);
			setBinds("", 3);
			wk.set_visible(true);
		};
	},
	requestHandler(_request, res) {
		toggleBaseLayer();
		res("ok");
	},
});

// I am adding these here because i don't want them to be shown as 20 separate keybinds in which key
const extra = [
	{
		key: "[1-9,0]",
		modmask: 64,
		submap: "",
		has_description: true,
		description: "Switch to workspace [1-10]",
	},
	{
		key: "[1-9,0]",
		modmask: 65,
		submap: "",
		has_description: true,
		description: "Move to workspace [1-10]",
	},
] as BindProps[];

function setBinds(submap: string, columns: number) {
	let b: BindProps[] = JSON.parse(exec(["hyprctl", "binds", "-j"]));
	b.unshift(...extra);
	b = b
		.filter(bind => bind.submap === submap && bind.has_description)
		.sort(bind => +(bind.dispatcher === "submap") - 0.5);
	const rows = Math.max(Math.ceil(b.length / columns), 4);

	let r: BindProps[][] = [];
	for (let i = 0; i < columns; i++) r.push(b.splice(0, rows));
	binds.set(r);
}
