import type { BaseType, Option } from "../types";

export const optionsByBaseType: Record<BaseType, Option[]> = {
	rice: [
		{ id: "r1", label: "白米（そのまま）", priceDelta: 0 },
		{ id: "r2", label: "のり", priceDelta: 20 },
		{ id: "r3", label: "ごま塩", priceDelta: 20 },
		{ id: "r4", label: "ふりかけ", priceDelta: 30 },
		{ id: "r5", label: "梅干し", priceDelta: 30 },
	],
	meat: [
		{ id: "m1", label: "炭火焼き", priceDelta: 0 },
		{ id: "m2", label: "照り焼き", priceDelta: 0 },
		{ id: "m3", label: "唐揚げ", priceDelta: 0 },
		{ id: "m4", label: "生姜焼き", priceDelta: 0 },
	],
	fish: [
		{ id: "f1", label: "塩焼き", priceDelta: 0 },
		{ id: "f2", label: "煮付け", priceDelta: 0 },
		{ id: "f3", label: "フライ", priceDelta: 50 },
	],
	bread: [
		{ id: "b1", label: "トースト", priceDelta: 0 },
		{ id: "b2", label: "サンドイッチ", priceDelta: 100 },
	],
	other: [],
};
