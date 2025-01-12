import { App, Astal, Widget } from "astal/gtk3";
import { Binding } from "astal";
import Grid from "./Grid";
import AstalHyprland from "gi://AstalHyprland";

// See https://github.com/hyprwm/Hyprland/blob/1989b0049f7fb714a2417dfb14d6b4f3d2a079d3/src/devices/IKeyboard.hpp#L12-L21
const modkeys = ["shift", "caps", "ctrl", "alt", "mod2", "mod3", "super", "mod5"] as const;
function modmaskToKeys(modmask: number): string {
	return modkeys
		.filter((_, i) => (modmask >> i) & 1)
		.map(key => `<${key}>`)
		.reverse()
		.join(" ");
}

function key(entry: AstalHyprland.Bind, padding = 0) {
	return `${modmaskToKeys(entry.modmask)} ${entry.key}`.padStart(padding);
}

function Keybind({ entry, padding }: { entry: AstalHyprland.Bind; padding: number }) {
	return (
		<box className="keybind">
			<label className="key">{key(entry, padding)}</label>
			<label className="arrow">  </label>
			<label className={entry.dispatcher === "submap" ? "submap" : entry.description ? "desc" : ""}>
				{entry.description || entry.dispatcher + (entry.arg && ": " + entry.arg)}
			</label>
		</box>
	);
}

export default function WhichKey({ binds }: { binds: Binding<AstalHyprland.Bind[][]> }) {
	const { BOTTOM, LEFT, RIGHT } = Astal.WindowAnchor;

	return (
		<window
			name="WhichKey"
			className="whichkey"
			namespace="hyprwhichkey"
			layer={Astal.Layer.OVERLAY}
			visible={false}
			monitor={0}
			anchor={BOTTOM | LEFT | RIGHT}
			onNotifyVisible={self => self.visible && self.set_click_through(true)}
			application={App}
		>
			{binds.as(binds => (
				<Grid
					className="container"
					column-homogeneous
					rowSpacing={2}
					setup={self => {
						for (let i = 0; i < binds.length; i++) {
							let padding = 0;
							for (let j = 0; j < binds[i].length; j++)
								padding = Math.max(padding, key(binds[i][j]).length);

							for (let j = 0; j < binds[i].length; j++)
								self.attach(<Keybind entry={binds[i][j]} padding={padding} />, i, j, 1, 1);
						}
					}}
				/>
			))}
		</window>
	) as Widget.Window;
}
