import type { MenuCategory } from "@/shared/types/categories";
import type { BaseType, MenuItem } from "../types";
import { optionsByBaseType } from "./options";

let menus: MenuItem[] = [
	// お昼弁当
	{
		id: "l1",
		category: "lunch",
		name: "幕の内弁当",
		baseType: "rice",
		options: optionsByBaseType.rice,
		price: 550,
		available: true,
	},
	{
		id: "l2",
		category: "lunch",
		name: "から揚げ弁当",
		baseType: "meat",
		options: optionsByBaseType.meat,
		price: 500,
		available: true,
	},
	{
		id: "l3",
		category: "lunch",
		name: "鮭弁当",
		baseType: "fish",
		options: optionsByBaseType.fish,
		price: 520,
		available: true,
	},
	{
		id: "l4",
		category: "lunch",
		name: "カツカレー",
		baseType: "rice",
		options: optionsByBaseType.rice,
		price: 600,
		available: true,
	},
	{
		id: "l5",
		category: "lunch",
		name: "焼肉弁当",
		baseType: "meat",
		options: optionsByBaseType.meat,
		price: 650,
		available: false,
	},
	{
		id: "l6",
		category: "lunch",
		name: "天ぷら弁当",
		baseType: "fish",
		options: optionsByBaseType.fish,
		price: 580,
		available: true,
	},

	// おやつ
	{
		id: "s1",
		category: "snack",
		name: "クリームパン",
		baseType: "bread",
		options: optionsByBaseType.bread,
		price: 180,
		available: true,
	},
	{
		id: "s2",
		category: "snack",
		name: "メロンパン",
		baseType: "bread",
		options: optionsByBaseType.bread,
		price: 200,
		available: true,
	},
	{
		id: "s3",
		category: "snack",
		name: "あんぱん",
		baseType: "bread",
		options: optionsByBaseType.bread,
		price: 160,
		available: true,
	},
	{
		id: "s4",
		category: "snack",
		name: "フルーツゼリー",
		baseType: "other",
		options: [],
		price: 250,
		available: true,
	},
	{
		id: "s5",
		category: "snack",
		name: "プリン",
		baseType: "other",
		options: [],
		price: 220,
		available: false,
	},
];

let nextId = 1;

export function getMenus(): MenuItem[] {
	return menus;
}

export function getMenusByCategory(category: MenuCategory): MenuItem[] {
	return menus.filter((m) => m.category === category);
}

export function getMenuById(id: string): MenuItem | undefined {
	return menus.find((m) => m.id === id);
}

export function addMenu(input: {
	category: MenuCategory;
	name: string;
	baseType: BaseType;
	price: number;
	optionIds: string[];
}): MenuItem {
	const options = optionsByBaseType[input.baseType].filter((o) =>
		input.optionIds.includes(o.id),
	);
	const menu: MenuItem = {
		id: `new${nextId++}`,
		category: input.category,
		name: input.name,
		baseType: input.baseType,
		options,
		price: input.price,
		available: true,
	};
	menus = [...menus, menu];
	return menu;
}

export function updateMenu(
	id: string,
	input: {
		name?: string;
		baseType?: BaseType;
		price?: number;
		optionIds?: string[];
		available?: boolean;
	},
): MenuItem | null {
	const index = menus.findIndex((m) => m.id === id);
	if (index === -1) return null;
	const current = menus[index];
	const baseType = input.baseType ?? current.baseType;
	const { optionIds } = input;
	const options = optionIds
		? optionsByBaseType[baseType].filter((o) => optionIds.includes(o.id))
		: current.options;
	menus[index] = {
		...current,
		name: input.name ?? current.name,
		baseType,
		price: input.price ?? current.price,
		available: input.available ?? current.available,
		options,
	};
	return menus[index];
}

export function deleteMenu(id: string): boolean {
	const len = menus.length;
	menus = menus.filter((m) => m.id !== id);
	return menus.length < len;
}
