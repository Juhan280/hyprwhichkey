import { Gtk, astalify, type ConstructProps } from "astal/gtk3";
import { GObject } from "astal";

class Grid extends astalify(Gtk.Grid) {
	static {
		GObject.registerClass(this);
	}

	constructor(props: ConstructProps<Grid, Gtk.Grid.ConstructorProps>) {
		super(props as any);
	}
}

export default Grid;
