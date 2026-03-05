import { useState } from "react";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import type { MenuItem } from "../types";
import MenuEditPanel from "./MenuEditPanel";

export default function MenuActions({ menuItem }: { menuItem: MenuItem }) {
	const [error, setError] = useState("");

	async function handleDelete() {
		setError("");
		try {
			const res = await fetch("/api/menus", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ action: "delete", id: menuItem.id }),
			});
			if (!res.ok) throw new Error("削除に失敗しました");
			window.location.reload();
		} catch {
			setError("削除に失敗しました");
		}
	}

	return (
		<div className="flex items-center gap-2">
			<MenuEditPanel mode="edit" menuItem={menuItem} />

			<AlertDialog>
				<AlertDialogTrigger asChild>
					<Button
						variant="outline"
						size="sm"
						className="text-destructive cursor-pointer"
					>
						削除
					</Button>
				</AlertDialogTrigger>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>本当に削除しますか？</AlertDialogTitle>
						<AlertDialogDescription>
							「{menuItem.name}」を削除します。この操作は取り消せません。
						</AlertDialogDescription>
					</AlertDialogHeader>
					{error && <p className="text-sm text-destructive">{error}</p>}
					<AlertDialogFooter>
						<AlertDialogCancel className="cursor-pointer">
							キャンセル
						</AlertDialogCancel>
						<AlertDialogAction
							className="bg-destructive text-destructive-foreground hover:bg-destructive/90 cursor-pointer"
							onClick={handleDelete}
						>
							削除する
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
}
