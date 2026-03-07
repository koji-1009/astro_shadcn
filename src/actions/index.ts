import { ActionError, defineAction } from "astro:actions";
import { z } from "astro:schema";
import { addMenu, deleteMenu, updateMenu } from "@/features/menu";
import { baseTypeSchema } from "@/features/menu/types";
import { addNotice, deleteNotice, updateNotice } from "@/features/notice";
import { menuCategorySchema } from "@/shared/types/categories";
import { ROLE_COOKIE_NAME, type Role } from "@/shared/types";

export const server = {
	menus: {
		create: defineAction({
			accept: "json",
			input: z.object({
				category: menuCategorySchema,
				name: z.string().min(1),
				baseType: baseTypeSchema,
				price: z.number().positive(),
				optionIds: z.array(z.string()).default([]),
			}),
			handler: (input) => addMenu(input),
		}),
		update: defineAction({
			accept: "json",
			input: z.object({
				id: z.string().min(1),
				name: z.string().min(1).optional(),
				baseType: baseTypeSchema.optional(),
				price: z.number().positive().optional(),
				optionIds: z.array(z.string()).optional(),
				available: z.boolean().optional(),
			}),
			handler: ({ id, ...input }) => {
				const menu = updateMenu(id, input);
				if (!menu)
					throw new ActionError({
						code: "NOT_FOUND",
						message: "Menu not found",
					});
				return menu;
			},
		}),
		delete: defineAction({
			accept: "json",
			input: z.object({ id: z.string().min(1) }),
			handler: ({ id }) => {
				const deleted = deleteMenu(id);
				if (!deleted)
					throw new ActionError({
						code: "NOT_FOUND",
						message: "Menu not found",
					});
				return { deleted };
			},
		}),
	},
	notices: {
		create: defineAction({
			accept: "json",
			input: z.object({
				title: z.string().min(1),
				body: z.string(),
				pinned: z.boolean().default(false),
			}),
			handler: (input) => addNotice(input),
		}),
		update: defineAction({
			accept: "json",
			input: z.object({
				id: z.string().min(1),
				title: z.string().min(1).optional(),
				body: z.string().optional(),
				pinned: z.boolean().optional(),
			}),
			handler: ({ id, ...input }) => {
				const notice = updateNotice(id, input);
				if (!notice)
					throw new ActionError({
						code: "NOT_FOUND",
						message: "Notice not found",
					});
				return notice;
			},
		}),
		delete: defineAction({
			accept: "json",
			input: z.object({ id: z.string().min(1) }),
			handler: ({ id }) => {
				const deleted = deleteNotice(id);
				if (!deleted)
					throw new ActionError({
						code: "NOT_FOUND",
						message: "Notice not found",
					});
				return { deleted };
			},
		}),
	},
	switchRole: defineAction({
		accept: "json",
		handler: (_input, context) => {
			const current = context.cookies.get(ROLE_COOKIE_NAME)?.value;
			const newRole: Role = current === "admin" ? "user" : "admin";
			context.cookies.set(ROLE_COOKIE_NAME, newRole, {
				path: "/",
				httpOnly: true,
				maxAge: 60 * 60 * 24 * 365,
				sameSite: "lax",
			});
			return {
				role: newRole,
				redirectTo: newRole === "admin" ? "/admin/" : "/",
			};
		},
	}),
};
