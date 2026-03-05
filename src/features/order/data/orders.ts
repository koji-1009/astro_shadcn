import { getMenus } from "@/features/menu";
import type { Order, OrderSummaryData, OrderSummaryItem } from "../types";

const TODAY = "2026-03-05";
const YESTERDAY = "2026-03-04";

const orders: Order[] = [
	{
		id: "o1",
		userId: "u1",
		userName: "佐藤花子",
		menuItemId: "l1",
		selectedOptions: ["r1", "r5"],
		date: TODAY,
		status: "confirmed",
	},
	{
		id: "o2",
		userId: "u2",
		userName: "鈴木一郎",
		menuItemId: "l2",
		selectedOptions: ["m1"],
		date: TODAY,
		status: "confirmed",
	},
	{
		id: "o3",
		userId: "u3",
		userName: "高橋美咲",
		menuItemId: "l3",
		selectedOptions: ["f1"],
		date: TODAY,
		status: "pending",
	},
	{
		id: "o4",
		userId: "u4",
		userName: "田中健太",
		menuItemId: "l4",
		selectedOptions: ["r2", "r4"],
		date: TODAY,
		status: "confirmed",
	},
	{
		id: "o5",
		userId: "u5",
		userName: "伊藤洋子",
		menuItemId: "l1",
		selectedOptions: ["r1"],
		date: TODAY,
		status: "confirmed",
	},
	{
		id: "o6",
		userId: "u6",
		userName: "渡辺大輔",
		menuItemId: "l2",
		selectedOptions: ["m2"],
		date: TODAY,
		status: "pending",
	},
	{
		id: "o7",
		userId: "u7",
		userName: "山本由美",
		menuItemId: "l6",
		selectedOptions: ["f3"],
		date: TODAY,
		status: "confirmed",
	},
	{
		id: "o8",
		userId: "u8",
		userName: "中村翔太",
		menuItemId: "l2",
		selectedOptions: ["m3"],
		date: TODAY,
		status: "confirmed",
	},
	{
		id: "o9",
		userId: "u9",
		userName: "小林さくら",
		menuItemId: "s1",
		selectedOptions: ["b1"],
		date: TODAY,
		status: "confirmed",
	},
	{
		id: "o10",
		userId: "u10",
		userName: "加藤隆",
		menuItemId: "l3",
		selectedOptions: ["f2"],
		date: TODAY,
		status: "pending",
	},
	{
		id: "o11",
		userId: "u1",
		userName: "佐藤花子",
		menuItemId: "l6",
		selectedOptions: ["f3"],
		date: TODAY,
		status: "confirmed",
	},
	{
		id: "o12",
		userId: "u11",
		userName: "吉田恵",
		menuItemId: "l1",
		selectedOptions: ["r3"],
		date: TODAY,
		status: "confirmed",
	},
	{
		id: "o13",
		userId: "u12",
		userName: "松本勇気",
		menuItemId: "s2",
		selectedOptions: [],
		date: TODAY,
		status: "confirmed",
	},
	{
		id: "o14",
		userId: "u13",
		userName: "井上真理",
		menuItemId: "s1",
		selectedOptions: ["b1"],
		date: TODAY,
		status: "confirmed",
	},
	{
		id: "o15",
		userId: "u14",
		userName: "木村太一",
		menuItemId: "l4",
		selectedOptions: ["r1", "r2"],
		date: TODAY,
		status: "cancelled",
	},
	{
		id: "o16",
		userId: "u15",
		userName: "林美穂",
		menuItemId: "s3",
		selectedOptions: ["b1"],
		date: YESTERDAY,
		status: "confirmed",
	},
	{
		id: "o17",
		userId: "u16",
		userName: "清水光",
		menuItemId: "l1",
		selectedOptions: ["r5"],
		date: YESTERDAY,
		status: "confirmed",
	},
	{
		id: "o18",
		userId: "u17",
		userName: "山田結衣",
		menuItemId: "l4",
		selectedOptions: ["r1"],
		date: YESTERDAY,
		status: "confirmed",
	},
	{
		id: "o19",
		userId: "u18",
		userName: "森本翼",
		menuItemId: "l3",
		selectedOptions: ["f3"],
		date: YESTERDAY,
		status: "confirmed",
	},
	{
		id: "o20",
		userId: "u19",
		userName: "岡田悠",
		menuItemId: "l2",
		selectedOptions: ["m2"],
		date: YESTERDAY,
		status: "confirmed",
	},
];

export function getOrders(): Order[] {
	return orders;
}

export function getOrderSummary(date?: string): OrderSummaryData {
	const targetDate = date ?? TODAY;
	const todayOrders = orders.filter(
		(o) => o.date === targetDate && o.status !== "cancelled",
	);

	const countByMenu = new Map<
		string,
		{ count: number; price: number; name: string }
	>();
	for (const order of todayOrders) {
		const menu = getMenus().find((m) => m.id === order.menuItemId);
		if (!menu) continue;
		const existing = countByMenu.get(menu.id) ?? {
			count: 0,
			price: menu.price,
			name: menu.name,
		};
		existing.count++;
		countByMenu.set(menu.id, existing);
	}

	const byMenu: OrderSummaryItem[] = Array.from(countByMenu.values())
		.map(({ name, count, price }) => ({ name, count, subtotal: count * price }))
		.sort((a, b) => b.count - a.count);

	const totalOrders = todayOrders.length;
	const totalRevenue = byMenu.reduce((sum, item) => sum + item.subtotal, 0);
	const mostPopular = byMenu[0]?.name ?? "-";

	return { totalOrders, totalRevenue, mostPopular, byMenu };
}

export function getOrdersByDate(date?: string): Order[] {
	const targetDate = date ?? TODAY;
	return orders.filter((o) => o.date === targetDate);
}
