import { createRoute } from "@tanstack/react-router";
import { Tabs } from "framework/step-tabs";
import { useEffect, useId, useState } from "react";
import { indexRoute } from "./index.route";

const tabs = [
	{ label: "Step 1", value: "step-1" },
	{ label: "Step 2", value: "step-2" },
	{ label: "Step 3", value: "step-3" },
	{ label: "Step 4", value: "step-4" },
	{ label: "Step 5", value: "step-5" },
	{ label: "Step 6", value: "step-6" },
	{ label: "Step 7", value: "step-7" },
];

type SectionProps = {
	id: string;
	title: string;
};

function Section(props: SectionProps) {
	const { id, title } = props;

	return (
		<div id={id} style={{ scrollMargin: 50 }}>
			<h1>{title}</h1>
			<p>
				Lorem ipsum dolor sit amet, consectetur adipiscing elit.
				Pellentesque eu lacus eu quam vulputate mollis eu quis dui.
				Pellentesque massa ex, malesuada a dolor vitae, convallis
				efficitur lacus. Donec vel sapien consequat, euismod metus sit
				amet, elementum massa. Aliquam volutpat aliquet pharetra.
				Vestibulum ante ipsum primis in faucibus orci luctus et ultrices
				posuere cubilia curae; Cras sed lectus nunc. Nunc iaculis
				molestie nulla et interdum. Nullam pulvinar purus a euismod
				semper. Mauris rutrum justo eu mauris bibendum tempor.
				Vestibulum vitae condimentum orci, et posuere augue. Nam euismod
				sed neque eget consequat.
			</p>
			<p>
				Mauris at quam ut libero luctus euismod nec nec metus. Donec
				eget lacus in mi semper euismod. Donec semper, est in pretium
				euismod, leo mi posuere leo, quis finibus quam ante eu est.
				Donec est quam, feugiat sed mattis eu, elementum id neque.
				Maecenas ut enim efficitur, pretium neque nec, tincidunt turpis.
				Nunc rhoncus arcu nec purus maximus mollis. Proin quis
				scelerisque nunc. Curabitur dui tellus, aliquam rhoncus sagittis
				a, pharetra nec dui. Proin ac pellentesque mauris. Nullam tortor
				justo, molestie sodales viverra et, volutpat volutpat tortor.
				Donec placerat dignissim velit eget sodales.
			</p>
			<p>
				Mauris fringilla diam sed ex suscipit efficitur. Fusce sed
				tellus vitae dolor placerat volutpat. Vestibulum sit amet tellus
				aliquet, pellentesque odio sit amet, tristique sem. Cras euismod
				sem a lacus pulvinar, ut luctus tortor pretium. Donec ut lacus
				condimentum, lacinia sem non, scelerisque risus. Cras ac
				sagittis lectus. Ut malesuada eu leo quis luctus. Maecenas
				elementum mauris ut nulla vestibulum, at luctus erat faucibus.
			</p>
			<p>
				Donec nec sollicitudin nisi. Sed ligula nunc, auctor quis risus
				eget, vestibulum vestibulum justo. In porta odio mi, id congue
				justo porttitor eu. Morbi laoreet et dolor eu ultrices. Sed
				risus lacus, rhoncus at elementum non, ornare in lorem. Cras
				suscipit eget ipsum pulvinar congue. Nullam non magna et arcu
				commodo scelerisque eget vestibulum ligula. Quisque nibh mi,
				convallis ut ornare dignissim, condimentum nec nibh. Fusce
				ornare, mauris tincidunt fringilla ultricies, dolor sapien
				porttitor risus, in aliquam enim mi in diam. Nullam quis
				imperdiet tortor, vitae consequat nulla. Lorem ipsum dolor sit
				amet, consectetur adipiscing elit. Phasellus commodo ex eget
				lacus molestie, et pulvinar turpis lobortis. Aliquam tempus nisl
				vitae justo euismod placerat. Suspendisse potenti. Phasellus
				quis sem eget leo aliquet luctus ac et felis. Mauris lobortis
				ultrices ex, eget sodales sapien euismod nec.
			</p>
			<p>
				Curabitur in elit erat. Etiam vel orci nec sapien dignissim
				laoreet ut ut elit. Sed iaculis pellentesque turpis. Duis porta
				neque mattis ipsum blandit gravida. Sed felis nulla, vestibulum
				suscipit justo a, congue semper magna. Cras pharetra odio justo,
				vel semper ipsum interdum eget. Ut lacus purus, consectetur eget
				libero eu, pulvinar scelerisque ligula. Integer tristique, diam
				ac mattis molestie, neque ante dignissim diam, nec consectetur
				arcu purus eget erat. Vestibulum hendrerit vel ipsum vel
				molestie. Aliquam imperdiet, orci a mollis eleifend, enim ante
				dignissim augue, id auctor ex ligula a dui. Integer cursus
				blandit imperdiet. Vestibulum nunc nisl, imperdiet ut ligula at,
				dapibus auctor nisi. Aenean in dolor vel massa scelerisque
				bibendum eu et ante. Curabitur id finibus mauris. Integer ornare
				semper ligula, eu tristique urna rutrum sit amet.
			</p>
		</div>
	);
}

const tabsRoute = createRoute({
	getParentRoute: () => indexRoute,
	path: "tabs",
	component: () => {
		const [active, setActive] = useState("step-1");

		// can ref in React 19 wuth cleanup
		useEffect(() => {
			const options: IntersectionObserverInit = {
				root: null,
				threshold: 0.5,
			};
			const callback: IntersectionObserverCallback = (entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) {
						setActive(entry.target.id);
						return;
					}
				}
			};
			const observer = new IntersectionObserver(callback, options);

			tabs.forEach((tab) => {
				const el = document.getElementById(tab.value);
				if (el != null) {
					observer.observe(el);
				}
			});

			return () => {
				observer.disconnect();
			};
		}, []);

		return (
			<div>
				<h2>a</h2>
				<Tabs
					items={tabs}
					active={"step-3"}
					disabled={["step-4", "step-5", "step-6", "step-7"]}
				/>
				<h2>Clickable</h2>
				<Tabs
					style={{ position: "sticky", top: 0 }}
					items={tabs}
					active={active}
					disabled={["step-3"]}
					onChange={(id) => {
						document.getElementById(id)?.scrollIntoView({
							behavior: "smooth",
						});
						setActive(active);
					}}
				/>
				{tabs.map((tab) => (
					<Section key={tab.value} id={tab.value} title={tab.label} />
				))}
			</div>
		);
	},
});

export { tabsRoute };
