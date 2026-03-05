export interface Order {
	id: string;
	userId: string;
	userName: string;
	menuItemId: string;
	selectedOptions: string[];
	date: string;
	status: "pending" | "confirmed" | "cancelled";
}

export interface OrderSummaryItem {
	name: string;
	count: number;
	subtotal: number;
}

export interface OrderSummaryData {
	totalOrders: number;
	totalRevenue: number;
	mostPopular: string;
	byMenu: OrderSummaryItem[];
}
