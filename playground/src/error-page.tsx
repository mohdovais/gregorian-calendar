import { useRouteError } from "react-router-dom";

function ErrorPage() {
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	const error = useRouteError() as any;
	console.error(error.error);

	return (
		<div id="error-page">
			<h1>Oops! {error.statusText || error.message}</h1>
			<p>Sorry, an unexpected error has occurred.</p>
			<pre>{error.error.stack}</pre>
		</div>
	);
}

export { ErrorPage };
