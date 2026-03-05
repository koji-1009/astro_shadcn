import type { Notice } from "../types";

let notices: Notice[] = [
	{
		id: "n1",
		title: "3月の新メニューのお知らせ",
		body: "3月より春の限定メニューとして「桜えびのかき揚げ弁当」を追加いたします。ぜひお試しください。",
		publishedAt: "2026-03-01",
		pinned: true,
	},
	{
		id: "n2",
		title: "注文締め切り時間の変更",
		body: "3月10日より、お昼弁当の注文締め切りを10:00から9:30に変更いたします。ご注意ください。",
		publishedAt: "2026-03-03",
		pinned: true,
	},
	{
		id: "n3",
		title: "アレルギー表示について",
		body: "全メニューにアレルギー表示を追加しました。詳細は各メニューの詳細画面をご確認ください。",
		publishedAt: "2026-02-28",
		pinned: false,
	},
	{
		id: "n4",
		title: "年末年始の営業について",
		body: "12月28日〜1月3日はお弁当の注文受付を停止いたします。1月4日より通常営業です。",
		publishedAt: "2025-12-20",
		pinned: false,
	},
	{
		id: "n5",
		title: "容器返却のお願い",
		body: "リユース容器の返却率が低下しています。使用後は各フロアの返却ボックスにお戻しください。",
		publishedAt: "2026-02-15",
		pinned: false,
	},
];

let nextId = 6;

export function getNotices(): Notice[] {
	return notices;
}

export function addNotice(input: {
	title: string;
	body: string;
	pinned: boolean;
}): Notice {
	const notice: Notice = {
		...input,
		id: `n${nextId++}`,
		publishedAt: new Date().toISOString().slice(0, 10),
	};
	notices = [notice, ...notices];
	return notice;
}

export function updateNotice(
	id: string,
	input: { title?: string; body?: string; pinned?: boolean },
): Notice | null {
	const index = notices.findIndex((n) => n.id === id);
	if (index === -1) return null;
	notices[index] = { ...notices[index], ...input };
	return notices[index];
}

export function deleteNotice(id: string): boolean {
	const len = notices.length;
	notices = notices.filter((n) => n.id !== id);
	return notices.length < len;
}
