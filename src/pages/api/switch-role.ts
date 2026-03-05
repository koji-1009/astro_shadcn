import type { APIRoute } from "astro";
import { json } from "@/shared/lib/response";
import { ROLE_COOKIE_NAME, type Role } from "@/shared/types";

export const POST: APIRoute = ({ cookies }) => {
	const current = cookies.get(ROLE_COOKIE_NAME)?.value;
	const newRole: Role = current === "admin" ? "user" : "admin";

	cookies.set(ROLE_COOKIE_NAME, newRole, {
		path: "/",
		httpOnly: true,
		maxAge: 60 * 60 * 24 * 365,
		sameSite: "lax",
	});

	const redirectTo = newRole === "admin" ? "/admin/" : "/";

	return json({ role: newRole, redirectTo });
};
