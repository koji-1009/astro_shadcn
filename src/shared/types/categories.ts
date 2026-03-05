import { z } from "zod";

export const CATEGORY_LABELS = {
	lunch: "お昼弁当",
	snack: "おやつ",
} as const;

export const menuCategorySchema = z.enum(["lunch", "snack"]);

export type MenuCategory = z.infer<typeof menuCategorySchema>;
