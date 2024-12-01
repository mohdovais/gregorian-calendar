import { Link, Outlet, createRootRoute } from "@tanstack/react-router";
import { ErrorBoundary } from "../components/ErrorBoundary";
import css from "./root.module.css";

function Root() {
	return (
		<div className={css.wrapper}>
			<aside className={css.aside}>
				<h1>Some Framework</h1>
				<nav>
					<ul>
						{rootRoute.children?.map((route) => (
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
