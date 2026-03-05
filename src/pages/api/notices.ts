import type { APIRoute } from "astro";
import { z } from "zod";
import { addNotice, deleteNotice, updateNotice } from "@/features/notice";
import { json } from "@/shared/lib/response";

const createSchema = z.object({
	action: z.literal("create"),
	title: z.string().min(1),
	body: z.string(),
	pinned: z.boolean().default(false),
});

const updateSchema = z.object({
	action: z.literal("update"),
	id: z.string().min(1),
	title: z.string().min(1).optional(),
	body: z.string().optional(),
	pinned: z.boolean().optional(),
});

const deleteSchema = z.object({
	action: z.literal("delete"),
	id: z.string().min(1),
});

const requestSchema = z.discriminatedUnion("action", [
	createSchema,
	updateSchema,
	deleteSchema,
]);

export const POST: APIRoute = async ({ request }) => {
	const parsed = requestSchema.safeParse(await request.json());
	if (!parsed.success) {
		return json({ error: parsed.error.flatten() }, 400);
	}

	const body = parsed.data;

	if (body.action === "create") {
		const notice = addNotice(body);
		return json(notice, 201);
	}

	if (body.action === "update") {
		const { id, action: _, ...input } = body;
		const notice = updateNotice(id, input);
		return notice ? json(notice) : json({ error: "Not found" }, 404);
	}

	const deleted = deleteNotice(body.id);
	return json({ deleted }, deleted ? 200 : 404);
};
