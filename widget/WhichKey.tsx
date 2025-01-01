import { App, Astal } from "astal/gtk3";
import { Variable } from "astal";
import Grid from "../Grid";

// typesctipt complains about not being able to find 'React' when using jsx
declare const React: any;

export interface BindProps {
	locked: boolean;
	mouse: boolean;
	release: boolean;
	repeat: boolean;
	longPress: boolean;
	non_consuming: boolean;
	has_description: boolean;
	modmask: number;
	submap: string;
	key: string;
	keycode: number;
	catch_all: boolean;
	description: string;
	dispatcher: string;
	arg: string;
}

// See https://github.com/hyprwm/Hyprland/blob/1989b0049f7fb714a2417dfb14d6b4f3d2a079d3/src/devices/IKeyboard.hpp#L12-L21
const modkeys = [
	"shift",
	"caps",
	"ctrl",
	"alt",
	"mod2",
	"mod3",
	"super",
	"mod5",
];
function modmaskToKeys(modmask: number): string {
	return modkeys
		.filter((_, i) => (modmask >> i) & 1)
		.map(key => `<${key}>`)
		.reverse()
		.join(" ");
}

function key(entry: BindProps, padding = 0) {
	return `${modmaskToKeys(entry.modmask)} ${entry.key}`.padStart(padding);
}

function Keybind({ entry, padding }: { entry: BindProps; padding: number }) {
	return (
		<box className="keybind">
			<label className="key">{key(entry, padding)}</label>
			<label className="arrow">  </label>
			<label
				className={
					entry.dispatcher === "submap"
						? "submap"
						: entry.description
							? "desc"
							: ""
				}
			>
				{entry.description ||
					entry.dispatcher + (entry.arg && ": " + entry.arg)}
			</label>
		</box>
	);
}

export default function WhichKey({
	binds,
}: {
	binds: Variable<BindProps[][]>;
}) {
	const { BOTTOM, LEFT, RIGHT } = Astal.WindowAnchor;

	return (
		<window
			name="WhichKey"
			className="whichkey"
			namespace="hyprland_which_key"
			layer={Astal.Layer.OVERLAY}
			visible={false}
			monitor={0}
			anchor={BOTTOM | LEFT | RIGHT}
			application={App}
		>
			{binds(binds => (
				<Grid
					className="container"
					column-homogeneous
					rowSpacing={2}
					setup={self => {
						for (let i = 0; i < binds.length; i++) {
							let padding = 0;
							for (let j = 0; j < binds[i].length; j++)
								if (padding < key(binds[i][j]).length)
									padding = key(binds[i][j]).length;

							for (let j = 0; j < binds[i].length; j++)
								self.attach(
									<Keybind entry={binds[i][j]} padding={padding} />,
									i,
									j,
									1,
									1,
								);
						}
					}}
				/>
			))}
		</window>
	);
}
