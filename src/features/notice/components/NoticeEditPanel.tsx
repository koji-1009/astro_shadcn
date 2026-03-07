import { actions } from "astro:actions";
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
import { Textarea } from "@/components/ui/textarea";
import type { Notice } from "../types";

interface Props {
	mode: "create" | "edit";
	notice?: Notice;
}

export default function NoticeEditPanel({ mode, notice }: Props) {
	const [open, setOpen] = useState(false);
	const [title, setTitle] = useState(notice?.title ?? "");
	const [body, setBody] = useState(notice?.body ?? "");
	const [pinned, setPinned] = useState(notice?.pinned ?? false);
	const [saving, setSaving] = useState(false);

	const [error, setError] = useState("");

	async function handleSave() {
		if (!title.trim()) return;
		setSaving(true);
		setError("");
		const { error: err } =
			mode === "create"
				? await actions.notices.create({ title, body, pinned })
				: await actions.notices.update({ id: notice!.id, title, body, pinned });
		setSaving(false);
		if (err) {
			setError("保存に失敗しました。もう一度お試しください。");
			return;
		}
		setOpen(false);
		window.location.reload();
	}

	async function handleDelete() {
		if (!notice?.id) return;
		setSaving(true);
		setError("");
		const { error: err } = await actions.notices.delete({ id: notice.id });
		setSaving(false);
		if (err) {
			setError("削除に失敗しました。もう一度お試しください。");
			return;
		}
		setOpen(false);
		window.location.reload();
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
						{mode === "create"
							? "お知らせを追加"
							: `「${notice?.title}」を編集`}
					</DialogTitle>
				</DialogHeader>

				{error && <p className="text-sm text-destructive">{error}</p>}

				<div className="grid gap-4 py-4">
					<div className="grid gap-2">
						<Label htmlFor="notice-title">タイトル</Label>
						<Input
							id="notice-title"
							value={title}
							onChange={(e) => setTitle(e.target.value)}
							placeholder="お知らせのタイトル"
						/>
					</div>
					<div className="grid gap-2">
						<Label htmlFor="notice-body">本文</Label>
						<Textarea
							id="notice-body"
							value={body}
							onChange={(e) => setBody(e.target.value)}
							placeholder="お知らせの本文を入力してください"
							rows={5}
						/>
					</div>
					<div className="flex items-center gap-3">
						<Checkbox
							id="notice-pinned"
							checked={pinned}
							onCheckedChange={(checked) => setPinned(checked === true)}
						/>
						<Label htmlFor="notice-pinned" className="cursor-pointer">
							固定表示にする
						</Label>
					</div>
				</div>

				<div className="flex justify-between">
					{mode === "edit" ? (
						<Button
							variant="destructive"
							onClick={handleDelete}
							disabled={saving}
							className="cursor-pointer"
						>
							削除
						</Button>
					) : (
						<div />
					)}
					<div className="flex gap-2">
						<Button
							variant="outline"
							onClick={() => setOpen(false)}
							className="cursor-pointer"
						>
							キャンセル
						</Button>
						<Button
							onClick={handleSave}
							disabled={saving || !title.trim()}
							className="cursor-pointer"
						>
							{saving ? "保存中..." : "保存"}
						</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
