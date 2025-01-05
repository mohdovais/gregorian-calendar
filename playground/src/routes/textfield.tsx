import { createRoute } from "@tanstack/react-router";
import { TextField } from "framework/textfield";
import { Toolbar } from "framework/toolbar";
import { Button } from "framework/button";
import { indexRoute } from "./index.route";

function TextFieldPage() {
	return (
		<div>
			<h2>TextField</h2>
			<TextField label="Username" />
			<h5>Readonly</h5>
			<TextField
				label="Username"
				defaultValue="read only field"
				readOnly
			/>
			<h5>Disabled</h5>
			<TextField
				label="Username"
				value="disabled field"
				disabled
			/>
			<h5>Placeholder</h5>
			<TextField
				label="Username"
				placeholder="This is a placeholder"
			/>
			<h5>Required</h5>
			<form
				onSubmit={(event) => {
					event.preventDefault();
				}}
				onInvalid={(event) => {
					event.preventDefault();
				}}
			>
				<Toolbar>
					<TextField
						label="Username"
						name="username"
						autoComplete="username"
						required
					/>
					<TextField
						label="Password"
						name="password"
						type="password"
						autoComplete="current-password"
						required
					/>
					<Button type="submit">Submit</Button>
				</Toolbar>
			</form>
			<h5>Optional</h5>
			<TextField
				label="Username"
				optional
			/>

			<h5>Full width</h5>
			<TextField label="Username" style={{ width: "100%" }} />

			<h5>Full width</h5>
			<form style={{ display: "flex", gap: 32 }}>
				<TextField
					label="Username"
					name="username"
					autoComplete="username"
					required
					style={{ flex: 1 }}
				/>
				<TextField
					type="password"
					label="Password"
					name="password"
					autoComplete="current-password"
					required
					style={{ flex: 1 }}
				/>
				<Button type="submit" style={{ flex: 1 }}>Login</Button>
			</form>
		</div>
	);
}

const textFieldRoute = createRoute({
	getParentRoute: () => indexRoute,
	path: "textfield",
	component: TextFieldPage,
});

export { textFieldRoute };
