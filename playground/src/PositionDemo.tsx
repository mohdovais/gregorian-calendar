import { Button } from "../../framework/src/button";
import {
	UsePositionConfig,
	usePosition,
} from "../../framework/src/hooks/usePosition";
import { useCallback, useState } from "react";

const style1: React.CSSProperties = {
	width: 600,
	height: 400,
	margin: "0 auto",
	overflow: "auto",
};

type State = Omit<Required<UsePositionConfig>, "flip">;

function PositionDemo() {
	const [state, setState] = useState<State>({
		position: "bottom",
		align: "start",
		alignItem: "start",
		gap: 0,
		show: false,
	});
	const onChange = useCallback(
		(event: React.ChangeEvent<HTMLFieldSetElement>) => {
			const input = event.target as unknown as HTMLInputElement;

			setState((state) =>
				Object.assign({}, state, {
					[input.name]:
						input.name === "gap" ? parseInt(input.value, 10) : input.value,
				}),
			);
		},
		[],
	);
	const { style, refs } = usePosition(state);

	return (
		<div>
			<p>
				Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi porta sem
				a justo faucibus auctor et sit amet nisl. Cras nibh sapien, commodo
				vitae nunc faucibus, maximus aliquet ante. Maecenas vulputate aliquam
				tellus ut lacinia. Fusce vel nisl id urna mollis pulvinar sed vehicula
				lorem. Maecenas feugiat facilisis tristique. Nulla consequat aliquet
				eleifend. Duis facilisis odio eget sem porta finibus.
			</p>
			<p>
				In eget fermentum dui, ut mattis elit. Sed non nunc pretium, suscipit
				quam in, pellentesque ipsum. Nunc at hendrerit augue, at tempus sem. In
				ut enim neque. Vestibulum in suscipit leo. Cras id ex ac tortor mattis
				vestibulum non vel mi. Aliquam est tellus, feugiat dapibus dolor vel,
				lobortis scelerisque nibh. Mauris ut hendrerit lorem. Maecenas dolor
				turpis, iaculis consectetur mauris ullamcorper, maximus mollis felis.
				Etiam eu sodales augue. Morbi feugiat justo a nisl malesuada, a tempor
				ipsum porta. Proin hendrerit purus a accumsan commodo.
			</p>
			<p>
				Fusce non pharetra risus. Aenean ac metus ipsum. Fusce ultricies
				consequat eros at sollicitudin. Mauris maximus nec nisl in ultricies. In
				vitae mauris lectus. Nullam non molestie lacus. Donec magna augue,
				lacinia eu tellus quis, cursus vulputate velit. Pellentesque commodo dui
				eu quam convallis, sed luctus risus lobortis. Sed feugiat massa lorem,
				id finibus nunc condimentum nec. Nulla facilisi. Sed feugiat vehicula
				odio id pretium. Phasellus enim enim, consequat eu cursus eu, venenatis
				at augue. Nullam eget augue a ligula laoreet feugiat.
			</p>
			<p>
				Nulla justo mi, molestie quis suscipit id, rutrum sit amet elit. Morbi
				varius, justo nec fringilla semper, velit sem condimentum justo, sed
				semper est lorem et ante. Ut pharetra, erat vitae luctus rutrum, urna
				ipsum fringilla enim, in feugiat est ipsum vel lectus. Quisque ut
				feugiat risus. Integer consequat at nibh vel imperdiet. Sed in mi
				tortor. Mauris ac risus arcu. Maecenas sodales risus nec odio sagittis
				interdum. Aliquam aliquam sagittis nisi, sit amet condimentum odio
				feugiat eu. Pellentesque sit amet dolor diam.
			</p>
			<p>
				Quisque interdum porta condimentum. Aliquam lorem eros, mollis sit amet
				egestas ac, pulvinar vel felis. Maecenas molestie felis vitae risus
				maximus, maximus mollis elit euismod. Nam vitae ex non lorem posuere
				molestie vel id metus. Nam mi orci, ornare eget placerat sed, elementum
				sed nunc. Morbi efficitur pretium tincidunt. Phasellus euismod semper
				turpis eget aliquet. In sodales, nulla at dapibus aliquam, mi velit
				suscipit ante, in finibus quam est ut eros. Etiam tincidunt, ex eget
				pretium feugiat, arcu lacus mattis nulla, ut lacinia lectus tellus nec
				lectus. Quisque ultrices tellus a diam congue, in aliquam enim ornare.
				Cras non nisl id tortor dapibus porta. Nunc risus tortor, fermentum ut
				dignissim vel, aliquet id neque. Pellentesque in convallis tellus.
				Praesent sapien purus, consequat in eleifend aliquam, tempor sed nulla.
			</p>
			<p>
				Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi porta sem
				a justo faucibus auctor et sit amet nisl. Cras nibh sapien, commodo
				vitae nunc faucibus, maximus aliquet ante. Maecenas vulputate aliquam
				tellus ut lacinia. Fusce vel nisl id urna mollis pulvinar sed vehicula
				lorem. Maecenas feugiat facilisis tristique. Nulla consequat aliquet
				eleifend. Duis facilisis odio eget sem porta finibus.
			</p>
			<p>
				In eget fermentum dui, ut mattis elit. Sed non nunc pretium, suscipit
				quam in, pellentesque ipsum. Nunc at hendrerit augue, at tempus sem. In
				ut enim neque. Vestibulum in suscipit leo. Cras id ex ac tortor mattis
				vestibulum non vel mi. Aliquam est tellus, feugiat dapibus dolor vel,
				lobortis scelerisque nibh. Mauris ut hendrerit lorem. Maecenas dolor
				turpis, iaculis consectetur mauris ullamcorper, maximus mollis felis.
				Etiam eu sodales augue. Morbi feugiat justo a nisl malesuada, a tempor
				ipsum porta. Proin hendrerit purus a accumsan commodo.
			</p>
			<p>
				Fusce non pharetra risus. Aenean ac metus ipsum. Fusce ultricies
				consequat eros at sollicitudin. Mauris maximus nec nisl in ultricies. In
				vitae mauris lectus. Nullam non molestie lacus. Donec magna augue,
				lacinia eu tellus quis, cursus vulputate velit. Pellentesque commodo dui
				eu quam convallis, sed luctus risus lobortis. Sed feugiat massa lorem,
				id finibus nunc condimentum nec. Nulla facilisi. Sed feugiat vehicula
				odio id pretium. Phasellus enim enim, consequat eu cursus eu, venenatis
				at augue. Nullam eget augue a ligula laoreet feugiat.
			</p>
			<p>
				Nulla justo mi, molestie quis suscipit id, rutrum sit amet elit. Morbi
				varius, justo nec fringilla semper, velit sem condimentum justo, sed
				semper est lorem et ante. Ut pharetra, erat vitae luctus rutrum, urna
				ipsum fringilla enim, in feugiat est ipsum vel lectus. Quisque ut
				feugiat risus. Integer consequat at nibh vel imperdiet. Sed in mi
				tortor. Mauris ac risus arcu. Maecenas sodales risus nec odio sagittis
				interdum. Aliquam aliquam sagittis nisi, sit amet condimentum odio
				feugiat eu. Pellentesque sit amet dolor diam.
			</p>
			<p>
				Quisque interdum porta condimentum. Aliquam lorem eros, mollis sit amet
				egestas ac, pulvinar vel felis. Maecenas molestie felis vitae risus
				maximus, maximus mollis elit euismod. Nam vitae ex non lorem posuere
				molestie vel id metus. Nam mi orci, ornare eget placerat sed, elementum
				sed nunc. Morbi efficitur pretium tincidunt. Phasellus euismod semper
				turpis eget aliquet. In sodales, nulla at dapibus aliquam, mi velit
				suscipit ante, in finibus quam est ut eros. Etiam tincidunt, ex eget
				pretium feugiat, arcu lacus mattis nulla, ut lacinia lectus tellus nec
				lectus. Quisque ultrices tellus a diam congue, in aliquam enim ornare.
				Cras non nisl id tortor dapibus porta. Nunc risus tortor, fermentum ut
				dignissim vel, aliquet id neque. Pellentesque in convallis tellus.
				Praesent sapien purus, consequat in eleifend aliquam, tempor sed nulla.
			</p>
			<form>
				<fieldset onChange={onChange}>
					<legend>Position</legend>
					<label>
						<input type="radio" name="position" value="top" /> top
					</label>
					<label>
						<input type="radio" name="position" value="right" /> right
					</label>
					<label>
						<input type="radio" name="position" value="bottom" defaultChecked />{" "}
						bottom
					</label>
					<label>
						<input type="radio" name="position" value="left" /> left
					</label>
				</fieldset>
				<fieldset onChange={onChange}>
					<legend>Align</legend>
					<label>
						<input type="radio" name="align" value="start" defaultChecked />{" "}
						start
					</label>
					<label>
						<input type="radio" name="align" value="middle" /> middle
					</label>
					<label>
						<input type="radio" name="align" value="end" /> end
					</label>
				</fieldset>
				<fieldset onChange={onChange}>
					<legend>AlignItem</legend>
					<label>
						<input type="radio" name="alignItem" value="start" defaultChecked />{" "}
						start
					</label>
					<label>
						<input type="radio" name="alignItem" value="middle" /> middle
					</label>
					<label>
						<input type="radio" name="alignItem" value="end" /> end
					</label>
				</fieldset>
				<fieldset onChange={onChange}>
					<legend>Gap</legend>
					<input type="range" name="gap" min={0} max={20} defaultValue={0} />
				</fieldset>
			</form>
			<div style={style1}>
				<p>
					Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi porta
					sem a justo faucibus auctor et sit amet nisl. Cras nibh sapien,
					commodo vitae nunc faucibus, maximus aliquet ante. Maecenas vulputate
					aliquam tellus ut lacinia. Fusce vel nisl id urna mollis pulvinar sed
					vehicula lorem. Maecenas feugiat facilisis tristique. Nulla consequat
					aliquet eleifend. Duis facilisis odio eget sem porta finibus.
				</p>
				<p>
					In eget fermentum dui, ut mattis elit. Sed non nunc pretium, suscipit
					quam in, pellentesque ipsum. Nunc at hendrerit augue, at tempus sem.
					In ut enim neque. Vestibulum in suscipit leo. Cras id ex ac tortor
					mattis vestibulum non vel mi. Aliquam est tellus, feugiat dapibus
					dolor vel, lobortis scelerisque nibh. Mauris ut hendrerit lorem.
					Maecenas dolor turpis, iaculis consectetur mauris ullamcorper, maximus
					mollis felis. Etiam eu sodales augue. Morbi feugiat justo a nisl
					malesuada, a tempor ipsum porta. Proin hendrerit purus a accumsan
					commodo.
				</p>
				<p>
					Fusce non pharetra risus. Aenean ac metus ipsum. Fusce ultricies
					consequat eros at sollicitudin. Mauris maximus nec nisl in ultricies.
					In vitae mauris lectus. Nullam non molestie lacus. Donec magna augue,
					lacinia eu tellus quis, cursus vulputate velit. Pellentesque commodo
					dui eu quam convallis, sed luctus risus lobortis. Sed feugiat massa
					lorem, id finibus nunc condimentum nec. Nulla facilisi. Sed feugiat
					vehicula odio id pretium. Phasellus enim enim, consequat eu cursus eu,
					venenatis at augue. Nullam eget augue a ligula laoreet feugiat.
				</p>
				<Button ref={refs.setReference}>Hello, world!</Button>
				<div
					ref={refs.setFloating}
					style={{
						position: style.position,
						visibility: style.visibility,
						top: style.top,
						right: style.right,
						bottom: style.bottom,
						left: style.left,
						willChange: "visibility",
						width: "max-content",
						maxWidth: 200,
						border: "1px solid red",
						backgroundColor: "yellow",
						padding: 10,
					}}
					hidden={!state.show}
				>
					Nulla justo mi, molestie quis suscipit id, rutrum sit amet elit. Morbi
					varius, justo nec fringilla semper, velit sem condimentum justo, sed
					semper est lorem et ante. Ut pharetra, erat vitae luctus rutrum, urna
					ipsum fringilla enim, in feugiat est ipsum vel lectus. Quisque ut
					feugiat risus. Integer consequat at nibh vel imperdiet. Sed in mi
					tortor. Mauris ac risus arcu. Maecenas sodales risus nec odio sagittis
					interdum. Aliquam aliquam sagittis nisi, sit amet condimentum odio
					feugiat eu. Pellentesque sit amet dolor diam.
				</div>
				<p>
					Nulla justo mi, molestie quis suscipit id, rutrum sit amet elit. Morbi
					varius, justo nec fringilla semper, velit sem condimentum justo, sed
					semper est lorem et ante. Ut pharetra, erat vitae luctus rutrum, urna
					ipsum fringilla enim, in feugiat est ipsum vel lectus. Quisque ut
					feugiat risus. Integer consequat at nibh vel imperdiet. Sed in mi
					tortor. Mauris ac risus arcu. Maecenas sodales risus nec odio sagittis
					interdum. Aliquam aliquam sagittis nisi, sit amet condimentum odio
					feugiat eu. Pellentesque sit amet dolor diam.
				</p>
				<p>
					Quisque interdum porta condimentum. Aliquam lorem eros, mollis sit
					amet egestas ac, pulvinar vel felis. Maecenas molestie felis vitae
					risus maximus, maximus mollis elit euismod. Nam vitae ex non lorem
					posuere molestie vel id metus. Nam mi orci, ornare eget placerat sed,
					elementum sed nunc. Morbi efficitur pretium tincidunt. Phasellus
					euismod semper turpis eget aliquet. In sodales, nulla at dapibus
					aliquam, mi velit suscipit ante, in finibus quam est ut eros. Etiam
					tincidunt, ex eget pretium feugiat, arcu lacus mattis nulla, ut
					lacinia lectus tellus nec lectus. Quisque ultrices tellus a diam
					congue, in aliquam enim ornare. Cras non nisl id tortor dapibus porta.
					Nunc risus tortor, fermentum ut dignissim vel, aliquet id neque.
					Pellentesque in convallis tellus. Praesent sapien purus, consequat in
					eleifend aliquam, tempor sed nulla.
				</p>
			</div>
			<p>
				Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi porta sem
				a justo faucibus auctor et sit amet nisl. Cras nibh sapien, commodo
				vitae nunc faucibus, maximus aliquet ante. Maecenas vulputate aliquam
				tellus ut lacinia. Fusce vel nisl id urna mollis pulvinar sed vehicula
				lorem. Maecenas feugiat facilisis tristique. Nulla consequat aliquet
				eleifend. Duis facilisis odio eget sem porta finibus.
			</p>
			<p>
				In eget fermentum dui, ut mattis elit. Sed non nunc pretium, suscipit
				quam in, pellentesque ipsum. Nunc at hendrerit augue, at tempus sem. In
				ut enim neque. Vestibulum in suscipit leo. Cras id ex ac tortor mattis
				vestibulum non vel mi. Aliquam est tellus, feugiat dapibus dolor vel,
				lobortis scelerisque nibh. Mauris ut hendrerit lorem. Maecenas dolor
				turpis, iaculis consectetur mauris ullamcorper, maximus mollis felis.
				Etiam eu sodales augue. Morbi feugiat justo a nisl malesuada, a tempor
				ipsum porta. Proin hendrerit purus a accumsan commodo.
			</p>
			<p>
				Fusce non pharetra risus. Aenean ac metus ipsum. Fusce ultricies
				consequat eros at sollicitudin. Mauris maximus nec nisl in ultricies. In
				vitae mauris lectus. Nullam non molestie lacus. Donec magna augue,
				lacinia eu tellus quis, cursus vulputate velit. Pellentesque commodo dui
				eu quam convallis, sed luctus risus lobortis. Sed feugiat massa lorem,
				id finibus nunc condimentum nec. Nulla facilisi. Sed feugiat vehicula
				odio id pretium. Phasellus enim enim, consequat eu cursus eu, venenatis
				at augue. Nullam eget augue a ligula laoreet feugiat.
			</p>
			<p>
				Nulla justo mi, molestie quis suscipit id, rutrum sit amet elit. Morbi
				varius, justo nec fringilla semper, velit sem condimentum justo, sed
				semper est lorem et ante. Ut pharetra, erat vitae luctus rutrum, urna
				ipsum fringilla enim, in feugiat est ipsum vel lectus. Quisque ut
				feugiat risus. Integer consequat at nibh vel imperdiet. Sed in mi
				tortor. Mauris ac risus arcu. Maecenas sodales risus nec odio sagittis
				interdum. Aliquam aliquam sagittis nisi, sit amet condimentum odio
				feugiat eu. Pellentesque sit amet dolor diam.
			</p>
			<p>
				Quisque interdum porta condimentum. Aliquam lorem eros, mollis sit amet
				egestas ac, pulvinar vel felis. Maecenas molestie felis vitae risus
				maximus, maximus mollis elit euismod. Nam vitae ex non lorem posuere
				molestie vel id metus. Nam mi orci, ornare eget placerat sed, elementum
				sed nunc. Morbi efficitur pretium tincidunt. Phasellus euismod semper
				turpis eget aliquet. In sodales, nulla at dapibus aliquam, mi velit
				suscipit ante, in finibus quam est ut eros. Etiam tincidunt, ex eget
				pretium feugiat, arcu lacus mattis nulla, ut lacinia lectus tellus nec
				lectus. Quisque ultrices tellus a diam congue, in aliquam enim ornare.
				Cras non nisl id tortor dapibus porta. Nunc risus tortor, fermentum ut
				dignissim vel, aliquet id neque. Pellentesque in convallis tellus.
				Praesent sapien purus, consequat in eleifend aliquam, tempor sed nulla.
			</p>
			<p>
				Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi porta sem
				a justo faucibus auctor et sit amet nisl. Cras nibh sapien, commodo
				vitae nunc faucibus, maximus aliquet ante. Maecenas vulputate aliquam
				tellus ut lacinia. Fusce vel nisl id urna mollis pulvinar sed vehicula
				lorem. Maecenas feugiat facilisis tristique. Nulla consequat aliquet
				eleifend. Duis facilisis odio eget sem porta finibus.
			</p>
			<p>
				In eget fermentum dui, ut mattis elit. Sed non nunc pretium, suscipit
				quam in, pellentesque ipsum. Nunc at hendrerit augue, at tempus sem. In
				ut enim neque. Vestibulum in suscipit leo. Cras id ex ac tortor mattis
				vestibulum non vel mi. Aliquam est tellus, feugiat dapibus dolor vel,
				lobortis scelerisque nibh. Mauris ut hendrerit lorem. Maecenas dolor
				turpis, iaculis consectetur mauris ullamcorper, maximus mollis felis.
				Etiam eu sodales augue. Morbi feugiat justo a nisl malesuada, a tempor
				ipsum porta. Proin hendrerit purus a accumsan commodo.
			</p>
			<p>
				Fusce non pharetra risus. Aenean ac metus ipsum. Fusce ultricies
				consequat eros at sollicitudin. Mauris maximus nec nisl in ultricies. In
				vitae mauris lectus. Nullam non molestie lacus. Donec magna augue,
				lacinia eu tellus quis, cursus vulputate velit. Pellentesque commodo dui
				eu quam convallis, sed luctus risus lobortis. Sed feugiat massa lorem,
				id finibus nunc condimentum nec. Nulla facilisi. Sed feugiat vehicula
				odio id pretium. Phasellus enim enim, consequat eu cursus eu, venenatis
				at augue. Nullam eget augue a ligula laoreet feugiat.
			</p>
			<p>
				Nulla justo mi, molestie quis suscipit id, rutrum sit amet elit. Morbi
				varius, justo nec fringilla semper, velit sem condimentum justo, sed
				semper est lorem et ante. Ut pharetra, erat vitae luctus rutrum, urna
				ipsum fringilla enim, in feugiat est ipsum vel lectus. Quisque ut
				feugiat risus. Integer consequat at nibh vel imperdiet. Sed in mi
				tortor. Mauris ac risus arcu. Maecenas sodales risus nec odio sagittis
				interdum. Aliquam aliquam sagittis nisi, sit amet condimentum odio
				feugiat eu. Pellentesque sit amet dolor diam.
			</p>
			<p>
				Quisque interdum porta condimentum. Aliquam lorem eros, mollis sit amet
				egestas ac, pulvinar vel felis. Maecenas molestie felis vitae risus
				maximus, maximus mollis elit euismod. Nam vitae ex non lorem posuere
				molestie vel id metus. Nam mi orci, ornare eget placerat sed, elementum
				sed nunc. Morbi efficitur pretium tincidunt. Phasellus euismod semper
				turpis eget aliquet. In sodales, nulla at dapibus aliquam, mi velit
				suscipit ante, in finibus quam est ut eros. Etiam tincidunt, ex eget
				pretium feugiat, arcu lacus mattis nulla, ut lacinia lectus tellus nec
				lectus. Quisque ultrices tellus a diam congue, in aliquam enim ornare.
				Cras non nisl id tortor dapibus porta. Nunc risus tortor, fermentum ut
				dignissim vel, aliquet id neque. Pellentesque in convallis tellus.
				Praesent sapien purus, consequat in eleifend aliquam, tempor sed nulla.
			</p>
		</div>
	);
}

export { PositionDemo };
