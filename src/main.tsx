import { InputDate } from "./input-date";
import { Month, MonthRange } from "./month";
import React from "react";
import ReactDOM from "react-dom/client";

const weekends = [0, 6];
const disabledDates = ["2023-01-26", "2023-08-15"];

import("./input-date").then(({ InputDate }) => {
	ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
		<React.StrictMode>
			<div id="lipsum">
				<p>
					Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi at sem
					scelerisque, posuere lacus id, consequat nisl. Lorem ipsum dolor sit
					amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet,
					consectetur adipiscing elit. Maecenas iaculis sit amet velit et
					molestie. Aliquam nulla metus, porta at purus sed, vestibulum commodo
					metus. Maecenas consectetur turpis fermentum orci gravida, id tempus
					lectus lacinia. Quisque pretium justo felis, a finibus ante fringilla
					finibus. Morbi quis sagittis elit, a auctor sapien. Proin nisl mi,
					fringilla sed malesuada vel, venenatis eget sem. Aliquam mollis dolor
					eros, nec imperdiet neque convallis nec. Curabitur mattis euismod
					posuere. In commodo efficitur dui nec suscipit.
				</p>
				<div style={{ display: "inline-block" }}>
					<MonthRange onChange={console.log} />
				</div>
				<p>
					Nunc mollis mauris eu risus feugiat, ut posuere sapien feugiat. Ut
					varius, diam eu facilisis accumsan, sapien libero iaculis risus, in
					pharetra urna diam ac nisl. Duis iaculis turpis lacus, at fringilla
					justo hendrerit eget. Suspendisse blandit interdum urna a viverra. Ut
					ultricies, enim ut porta rhoncus, ipsum mauris fringilla leo, quis
					viverra nisl quam id metus. Class aptent taciti sociosqu ad litora
					torquent per conubia nostra, per inceptos himenaeos. Nunc ut tellus
					nec lectus scelerisque molestie.
				</p>
				<p>
					Morbi nec malesuada urna, ut hendrerit ante. Nullam vehicula augue
					eget orci euismod rutrum. Praesent nec metus ut felis rutrum iaculis.
					Maecenas tincidunt at leo eu laoreet. Interdum et malesuada fames ac
					ante ipsum primis in faucibus. Quisque laoreet turpis eget ex
					pharetra, ac posuere leo pharetra. Interdum et malesuada fames ac ante
					ipsum primis in faucibus.
				</p>
				<p>
					Aliquam erat volutpat. Duis tincidunt rhoncus odio, in condimentum
					nisi convallis sit amet. Ut et quam at neque gravida pharetra et in
					dui. Sed id odio ut enim tincidunt gravida. Vivamus pellentesque enim
					tortor, vitae luctus ex dictum at. Fusce rhoncus metus ut mauris
					consectetur, vel placerat tellus vehicula. Sed blandit nisl vitae odio
					pellentesque, non imperdiet est maximus.
				</p>
				<p>
					Sed id turpis orci. Nulla dapibus consectetur arcu sit amet feugiat.
					Nulla hendrerit risus nisl, a condimentum quam egestas vitae.
					Vestibulum nec eros sed erat mattis fringilla. In semper sem quis
					justo rutrum mattis. Pellentesque fringilla sed felis eu tincidunt.
					Curabitur finibus vulputate urna non ornare. Aliquam nec condimentum
					neque. Vivamus a turpis ex.
				</p>
				<p>
					Curabitur in nibh sit amet erat ultricies efficitur. Phasellus
					bibendum neque id odio laoreet, ac eleifend mauris efficitur. Praesent
					dignissim, lacus vel accumsan sagittis, mi nunc ullamcorper turpis, id
					ullamcorper diam lacus a justo. Duis ac metus vel justo vehicula
					posuere sed sed nulla. Nulla egestas sapien nec quam mollis, vitae
					ullamcorper massa aliquet. Nulla placerat libero eu iaculis posuere.
					Curabitur a nulla laoreet, commodo purus id, dignissim nisl.
				</p>
				<p>
					Nam fermentum nisl justo, at venenatis metus accumsan vel. In dolor
					nisi, facilisis in bibendum in, ullamcorper at urna. Integer nisl
					ipsum, mollis ut feugiat id, molestie id mi. Donec sollicitudin dolor
					et magna suscipit, ac euismod lacus consectetur. Cras sit amet magna
					nec mauris mattis mollis a et ante. Maecenas pellentesque, eros
					venenatis cursus fermentum, libero ante viverra lorem, nec efficitur
					nunc elit ac ipsum. Praesent interdum nibh vitae mauris congue
					finibus. Suspendisse potenti. Aenean sed maximus erat.
				</p>
				<InputDate />
				<p>
					Phasellus non metus a felis ornare condimentum a sit amet orci.
					Vivamus accumsan lectus et est tincidunt, in posuere mauris blandit.
					Nulla posuere in massa vel tempus. Pellentesque tristique bibendum
					nisl, vitae feugiat tellus ultrices vulputate. Pellentesque et
					molestie nulla. In vulputate convallis quam, et porta turpis elementum
					et. Etiam arcu diam, sodales a maximus ut, blandit vitae lorem.
				</p>
				<p>
					Proin non interdum lectus. Duis luctus enim ac porta accumsan. Nulla
					facilisi. Pellentesque tempus, velit non ornare vestibulum, orci lorem
					fermentum nunc, non egestas nisi augue ut est. Integer volutpat
					euismod mollis. Sed velit ante, pulvinar et tempor quis, molestie a
					est. In hac habitasse platea dictumst. Nulla facilisi. In sit amet
					turpis turpis. In hac habitasse platea dictumst. Proin lacinia nulla
					et risus tempor, in ullamcorper nulla placerat. Nunc a urna nec metus
					consequat rutrum a vel eros. Maecenas sit amet nisl interdum, iaculis
					mi vitae, hendrerit nisl. Mauris convallis lectus non risus rhoncus,
					quis laoreet libero interdum. Donec eu hendrerit massa, eget tempus
					lacus. In pretium nunc et justo scelerisque, nec tincidunt sapien
					faucibus.
				</p>
				<p>
					Morbi ac maximus nisl. Phasellus sit amet ante sit amet sapien dictum
					venenatis. Nullam auctor neque a enim laoreet dictum. Vestibulum eget
					semper velit. Integer eleifend ligula vitae tempor semper. Ut porta
					laoreet odio, nec tempus erat commodo ut. Fusce venenatis nulla id dui
					ultrices ultricies. Curabitur eu tellus tempor, mattis est vel,
					porttitor odio. Ut ac arcu consequat, scelerisque tellus sit amet,
					dapibus neque. Nulla leo velit, venenatis tincidunt aliquam aliquet,
					iaculis at diam. Pellentesque ex turpis, cursus sit amet varius nec,
					ultrices hendrerit turpis. Nam a ultricies est, vel bibendum nisi.
					Suspendisse a nisi sem.
				</p>
			</div>
		</React.StrictMode>,
	);
});
