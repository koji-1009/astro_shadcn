import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import type { MenuCategory } from "@/shared/types/categories";
import { optionsByBaseType } from "../data/options";
import { BASE_TYPES, type BaseType, type MenuItem } from "../types";

interface Props {
	mode: "create" | "edit";
	menuItem?: MenuItem;
	category?: MenuCategory;
}

export default function MenuEditPanel({ mode, menuItem, category }: Props) {
	const [open, setOpen] = useState(false);
	const [name, setName] = useState(menuItem?.name ?? "");
	const [priceStr, setPriceStr] = useState(String(menuItem?.price ?? 500));
	const [baseType, setBaseType] = useState<BaseType>(
		menuItem?.baseType ?? "rice",
	);
	const [selectedOptions, setSelectedOptions] = useState<string[]>(
		menuItem?.options.map((o) => o.id) ?? [],
	);
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState("");

	const availableOptions = optionsByBaseType[baseType];

	async function handleSave() {
		const price = Number(priceStr);
		if (!name.trim() || !price || price <= 0) return;
		setSaving(true);
		setError("");
		try {
			const res = await fetch("/api/menus", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(
					mode === "create"
						? {
								action: "create",
								category,
								name,
								baseType,
								price,
								optionIds: selectedOptions,
							}
						: {
								action: "update",
								id: menuItem?.id,
								name,
								baseType,
								price,
								optionIds: selectedOptions,
							},
				),
			});
			if (!res.ok) throw new Error("保存に失敗しました");
			setOpen(false);
			window.location.reload();
		} catch {
			setError("保存に失敗しました。もう一度お試しください。");
		} finally {
			setSaving(false);
		}
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button
					variant={mode === "create" ? "default" : "outline"}
					size={mode === "create" ? "default" : "sm"}
					className="cursor-pointer"
				>
					{mode === "create" ? "+ 新規追加" : "編集"}
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[500px]">
				<DialogHeader>
					<DialogTitle>
						{mode === "create" ? "メニューを追加" : `${menuItem?.name} を編集`}
					</DialogTitle>
				</DialogHeader>

				{error && <p className="text-sm text-destructive">{error}</p>}

				<div className="grid gap-4 py-4">
					<div className="grid gap-2">
						<Label htmlFor="name">メニュー名</Label>
						<Input
							id="name"
							value={name}
							onChange={(e) => setName(e.target.value)}
							placeholder="例: 幕の内弁当"
						/>
					</div>
					<div className="grid gap-2">
						<Label htmlFor="price">価格</Label>
						<Input
							id="price"
							type="number"
							value={priceStr}
							onChange={(e) => setPriceStr(e.target.value)}
							placeholder="500"
						/>
					</div>

					<div className="grid gap-2">
						<Label>ベースタイプ</Label>
						<Select
							value={baseType}
							onValueChange={(v) => {
								if (BASE_TYPES.includes(v as BaseType))
									setBaseType(v as BaseType);
								setSelectedOptions([]);
							}}
						>
							<SelectTrigger>
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="rice">ご飯もの</SelectItem>
								<SelectItem value="meat">肉メイン</SelectItem>
								<SelectItem value="fish">魚メイン</SelectItem>
								<SelectItem value="bread">パン</SelectItem>
								<SelectItem value="other">その他</SelectItem>
							</SelectContent>
						</Select>
					</div>

					{availableOptions.length > 0 && (
						<div className="grid gap-3">
							<Label>オプション</Label>
							<div className="grid gap-2 rounded-md border p-4">
								{availableOptions.map((opt) => (
									<div key={opt.id} className="flex items-center gap-3">
										<Checkbox
											id={opt.id}
											checked={selectedOptions.includes(opt.id)}
											onCheckedChange={(checked) => {
												setSelectedOptions((prev) =>
													checked
														? [...prev, opt.id]
														: prev.filter((id) => id !== opt.id),
												);
											}}
										/>
										<Label htmlFor={opt.id} className="flex-1 cursor-pointer">
											{opt.label}
										</Label>
										{opt.priceDelta > 0 && (
											<span className="text-sm text-muted-foreground">
												+&yen;{opt.priceDelta}
											</span>
										)}
									</div>
								))}
							</div>
						</div>
					)}
				</div>

				<div className="flex justify-end gap-2">
					<Button
						variant="outline"
						onClick={() => setOpen(false)}
						className="cursor-pointer"
					>
						キャンセル
					</Button>
					<Button
						onClick={handleSave}
						disabled={saving || !name.trim() || !Number(priceStr)}
						className="cursor-pointer"
					>
						{saving ? "保存中..." : "保存"}
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
