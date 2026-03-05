import { z } from "zod";
import type { MenuCategory } from "@/shared/types/categories";

export const BASE_TYPES = ["rice", "meat", "fish", "bread", "other"] as const;

export type BaseType = (typeof BASE_TYPES)[number];

export const baseTypeSchema = z.enum(BASE_TYPES);

export interface Option {
	id: string;
	label: string;
	priceDelta: number;
}

export interface MenuItem {
	id: string;
	category: MenuCategory;
	name: string;
	baseType: BaseType;
	options: Option[];
	price: number;
	available: boolean;
	imageUrl?: string;
}
