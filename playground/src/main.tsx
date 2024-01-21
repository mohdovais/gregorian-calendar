import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { ErrorPage } from "./error-page";
import "./main.css";
import { Root } from "./routes/root";

const router = createBrowserRouter([
	{
		path: "/",
		element: <Root />,
		errorElement: <ErrorPage />,
		children: [
			{
				path: "datefield",
				lazy: () => import("./routes/datefield"),
			},
			{
				path: "maskedfield",
				lazy: () => import("./routes/maskedfield"),
			},
			{
				path: "listbox",
				lazy: () => import("./routes/listbox"),
			},
			{
				path: "searchable-listbox",
				lazy: () => import("./routes/searchable-listbox"),
			},
			{
				path: "menu-button",
				lazy: () => import("./routes/menu-button"),
			},
			{
				path: "combobox",
				lazy: () => import("./routes/combobox"),
			},
		],
	},
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
	<React.StrictMode>
		<RouterProvider router={router} />
	</React.StrictMode>,
);
