import { useState } from "react";
import type { Option } from "@/features/menu";

interface Props {
	menuName: string;
	basePrice: number;
	options: Option[];
}

export function OrderForm({ menuName, basePrice, options }: Props) {
	const [selected, setSelected] = useState<string[]>([]);
	const [ordered, setOrdered] = useState(false);

	const total =
		basePrice +
		options
			.filter((o) => selected.includes(o.id))
			.reduce((sum, o) => sum + o.priceDelta, 0);

	function toggleOption(id: string) {
		setSelected((prev) =>
			prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id],
		);
	}

	function handleOrder() {
		setOrdered(true);
		setSelected([]);
	}

	return (
		<div className="space-y-6">
			{ordered && (
				<div className="rounded-md border border-green-200 bg-green-50 p-4 text-green-800 text-sm">
					{menuName} を注文しました！ 合計: &yen;{total.toLocaleString()}
					（デモのため実際には注文されません）
				</div>
			)}

			{options.length > 0 && (
				<div>
					<h3 className="font-semibold mb-3">オプション</h3>
					<div className="space-y-2">
						{options.map((opt) => (
							<label
								key={opt.id}
								className="flex items-center gap-3 p-3 rounded-lg border cursor-pointer hover:bg-accent transition-colors"
							>
								<input
									type="checkbox"
									checked={selected.includes(opt.id)}
									onChange={() => toggleOption(opt.id)}
									className="rounded"
								/>
								<span className="flex-1">{opt.label}</span>
								{opt.priceDelta !== 0 && (
									<span className="text-sm text-muted-foreground">
										+&yen;{opt.priceDelta.toLocaleString()}
									</span>
								)}
							</label>
						))}
					</div>
				</div>
			)}

			<div className="flex items-center justify-between border-t pt-4">
				<div>
					<p className="text-sm text-muted-foreground">合計金額</p>
					<p className="text-2xl font-bold">&yen;{total.toLocaleString()}</p>
				</div>
				<button
					type="button"
					onClick={handleOrder}
					className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity cursor-pointer"
				>
					注文する
				</button>
			</div>
		</div>
	);
}
