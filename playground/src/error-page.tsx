import { useRouteError } from "react-router-dom";

function ErrorPage() {
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	const error = useRouteError() as any;
	console.error(error);

	return (
		<div id="error-page">
			<h1>Oops!</h1>
			<p>Sorry, an unexpected error has occurred.</p>
			<pre>{error.statusText || error.message}</pre>
		</div>
	);
}

export { ErrorPage };
