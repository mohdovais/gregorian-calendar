import {
	createRootRoute,
	Link,
	Outlet,
	useRouter,
} from "@tanstack/react-router";
import { ErrorBoundary } from "../ErrorBoundary";
import css from "./root.module.css";

function Root() {
	const router = useRouter();
	return (
		<div className={css.wrapper}>
			<aside className={css.aside}>
				<h1>Some Framework</h1>
				<nav>
					<ul>
						{router.routeTree.children?.map((route) => (
							<li key={route.path}>
								<Link to={route.fullPath}>{route.path}</Link>
							</li>
						))}
					</ul>
				</nav>
			</aside>
			<main className={css.main}>
				<ErrorBoundary>
					<Outlet />
				</ErrorBoundary>
			</main>
		</div>
	);
}

const rootRoute = createRootRoute({
	component: Root,
});

export { rootRoute };
