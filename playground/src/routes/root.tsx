import { Link, Outlet } from "react-router-dom";
import css from "./root.module.css";

const links = [
	{
		to: "datefiled",
		label: "DateFiled",
	},
	{
		to: "maskedfield",
		label: "MaskedField",
	},
	{
		to: "listbox",
		label: "Listbox",
	},
	{
		to: "searchable-listbox",
		label: "Searchable Listbox",
	},
	{
		to: "menu-button",
		label: "MenuButton",
	},
	{
		to: "combobox",
		label: "Combobox",
	},
];

function Root() {
	return (
		<div className={css.wrapper}>
			<aside className={css.aside}>
				<h1>Some Framework</h1>
				<nav>
					<ul>
						{links.map((link) => (
							<li key={link.to}>
								<Link to={link.to}>{link.label}</Link>
							</li>
						))}
					</ul>
				</nav>
			</aside>
			<main className={css.main}>
				<Outlet />
			</main>
		</div>
	);
}

export { Root };
