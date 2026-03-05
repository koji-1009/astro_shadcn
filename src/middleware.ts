import { defineMiddleware } from "astro:middleware";
import type { Role } from "./shared/types";
import { DEFAULT_ROLE, ROLE_COOKIE_NAME } from "./shared/types";

export const onRequest = defineMiddleware((context, next) => {
	// Skip API routes
	if (context.url.pathname.startsWith("/api/")) {
		return next();
	}

	const cookieValue = context.cookies.get(ROLE_COOKIE_NAME)?.value;
	const role: Role =
		cookieValue === "admin" || cookieValue === "user"
			? cookieValue
			: DEFAULT_ROLE;
	context.locals.role = role;

	const path = context.url.pathname;

	// admin accessing / → redirect to /admin/
	if (path === "/" && role === "admin") {
		return context.redirect("/admin/");
	}

	// user accessing /admin/* → redirect to /
	if (path.startsWith("/admin") && role === "user") {
		return context.redirect("/");
	}

	return next();
});
