import { Component, ErrorInfo } from "react";

type ErrorBoundaryProps = {
	fallback?: React.ReactElement;
	children: React.ReactElement;
};

type ErrorBoundaryState = {
	hasError: boolean;
	message?: string;
	stack?: string;
};

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
	constructor(props: ErrorBoundaryProps) {
		super(props);
		this.state = { hasError: false };
	}

	/*
	static defaultProps = {
		fallback: <h1>An error occurred!</h1>,
	};
	*/

	static getDerivedStateFromError(error: unknown) {
		return { hasError: true };
	}

	componentDidCatch(error: Error, errorInfo: ErrorInfo) {
		this.setState((state) => {
			return Object.assign({}, state, {
				message: typeof error === "string" ? error : error.message,
				stack: errorInfo.componentStack,
			});
		});
	}

	render() {
		if (this.state.hasError) {
			return (
				this.props.fallback || (
					<div>
						<h4>{this.state.message}</h4>
						<pre>{this.state.stack}</pre>
					</div>
				)
			);
		}

		return this.props.children;
	}
}

export { ErrorBoundary };
