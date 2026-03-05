import type { APIRoute } from "astro";
import { z } from "zod";
import { addMenu, deleteMenu, updateMenu } from "@/features/menu";
import { baseTypeSchema } from "@/features/menu/types";
import { json } from "@/shared/lib/response";
import { menuCategorySchema } from "@/shared/types/categories";

const createSchema = z.object({
	action: z.literal("create"),
	category: menuCategorySchema,
	name: z.string().min(1),
	baseType: baseTypeSchema,
	price: z.number().positive(),
	optionIds: z.array(z.string()).default([]),
});

const updateSchema = z.object({
	action: z.literal("update"),
	id: z.string().min(1),
	name: z.string().min(1).optional(),
	baseType: baseTypeSchema.optional(),
	price: z.number().positive().optional(),
	optionIds: z.array(z.string()).optional(),
	available: z.boolean().optional(),
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
		const menu = addMenu(body);
		return json(menu, 201);
	}

	if (body.action === "update") {
		const { id, action: _, ...input } = body;
		const menu = updateMenu(id, input);
		return menu ? json(menu) : json({ error: "Not found" }, 404);
	}

	const deleted = deleteMenu(body.id);
	return json({ deleted }, deleted ? 200 : 404);
};
