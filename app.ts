import { App } from "astal/gtk3";
import style from "./style.scss";
import WhichKey, { BindProps } from "./widget/WhichKey";
import { exec, Variable } from "astal";

const visible = Variable(false);
const binds: Variable<BindProps[][]> = Variable([]);

App.start({
	instanceName: "hyprwhichkey",
	css: style,
	main() {
		let wk = WhichKey({ binds });
		visible.subscribe(vis => {
			wk.set_visible(vis);
			if (vis) wk.clickThrough = true;
		});
	},
	requestHandler(submap, res) {
		console.log(submap);
		if (!submap) {
			visible.set(false);
			return res("ok");
		}

		if (submap === "base") {
			if (visible.get()) {
				visible.set(false);
				return res("ok");
			}
			setBinds("", 3);
		} else {
			submap = JSON.parse(submap).submap;
			if (!submap) {
				visible.set(false);
				return res("ok");
			}

			setBinds(submap, 4);
		}

		visible.set(true);
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
