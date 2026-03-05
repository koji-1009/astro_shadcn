import { type ChangeEvent, type FormEvent, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	DEPARTMENT_CONFIG,
	DEPARTMENTS,
	type Department,
	DIETARY_LABELS,
	type DietaryRestriction,
	ROLE_LABELS,
	USER_ROLES,
	type UserRole,
} from "../types";

interface FormErrors {
	name?: string;
	email?: string;
	department?: string;
}

export function UserRegistrationForm() {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [department, setDepartment] = useState<Department | "">("");
	const [role, setRole] = useState<UserRole | "">("");
	const [floor, setFloor] = useState("");
	const [dietary, setDietary] = useState<DietaryRestriction[]>([]);
	const [allergyDetail, setAllergyDetail] = useState("");
	const [notifyEmail, setNotifyEmail] = useState(true);
	const [notifySlack, setNotifySlack] = useState(false);
	const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
	const [errors, setErrors] = useState<FormErrors>({});
	const [submitted, setSubmitted] = useState(false);

	useEffect(() => {
		return () => {
			if (avatarPreview) URL.revokeObjectURL(avatarPreview);
		};
	}, [avatarPreview]);

	const deptConfig = department ? DEPARTMENT_CONFIG[department] : null;

	function handleDepartmentChange(value: string) {
		const dept = value as Department;
		if (!DEPARTMENTS.includes(dept)) return;
		setDepartment(dept);
		setRole("");
		setFloor("");
	}

	function toggleDietary(restriction: DietaryRestriction) {
		setDietary((prev) =>
			prev.includes(restriction)
				? prev.filter((r) => r !== restriction)
				: [...prev, restriction],
		);
		if (restriction === "allergy" && dietary.includes("allergy")) {
			setAllergyDetail("");
		}
	}

	function handleImageChange(e: ChangeEvent<HTMLInputElement>) {
		const file = e.target.files?.[0];
		if (file) {
			const url = URL.createObjectURL(file);
			setAvatarPreview(url);
		}
	}

	function validate(): FormErrors {
		const newErrors: FormErrors = {};
		if (!name.trim()) newErrors.name = "名前は必須です";
		if (!email.trim()) {
			newErrors.email = "メールアドレスは必須です";
		} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
			newErrors.email = "メールアドレスの形式が正しくありません";
		}
		if (!department) newErrors.department = "部署を選択してください";
		return newErrors;
	}

	function handleSubmit(e: FormEvent) {
		e.preventDefault();
		const newErrors = validate();
		setErrors(newErrors);
		if (Object.keys(newErrors).length > 0) return;

		setName("");
		setEmail("");
		setDepartment("");
		setRole("");
		setFloor("");
		setDietary([]);
		setAllergyDetail("");
		setNotifyEmail(true);
		setNotifySlack(false);
		setAvatarPreview(null);
		setErrors({});
		setSubmitted(true);
	}

	return (
		<form onSubmit={handleSubmit} className="space-y-8 max-w-2xl">
			{submitted && (
				<div className="rounded-md border border-green-200 bg-green-50 p-4 text-green-800 text-sm">
					登録が完了しました（デモ）。続けて別のユーザーを登録できます。
				</div>
			)}

			{/* 基本情報 */}
			<fieldset className="space-y-4">
				<legend className="text-lg font-semibold">基本情報</legend>

				<div className="space-y-2">
					<Label htmlFor="name">
						名前 <span className="text-destructive">*</span>
					</Label>
					<Input
						id="name"
						value={name}
						onChange={(e) => setName(e.target.value)}
						placeholder="山田太郎"
						aria-invalid={!!errors.name}
					/>
					{errors.name && (
						<p className="text-sm text-destructive">{errors.name}</p>
					)}
				</div>

				<div className="space-y-2">
					<Label htmlFor="email">
						メールアドレス <span className="text-destructive">*</span>
					</Label>
					<Input
						id="email"
						type="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						placeholder="yamada@example.com"
						aria-invalid={!!errors.email}
					/>
					{errors.email && (
						<p className="text-sm text-destructive">{errors.email}</p>
					)}
				</div>
			</fieldset>

			{/* 部署・ロール・フロア */}
			<fieldset className="space-y-4">
				<legend className="text-lg font-semibold">所属情報</legend>

				<div className="space-y-2">
					<Label>
						部署 <span className="text-destructive">*</span>
					</Label>
					<Select value={department} onValueChange={handleDepartmentChange}>
						<SelectTrigger
							className="w-full"
							aria-invalid={!!errors.department}
						>
							<SelectValue placeholder="部署を選択" />
						</SelectTrigger>
						<SelectContent>
							{(
								Object.entries(DEPARTMENT_CONFIG) as [
									Department,
									(typeof DEPARTMENT_CONFIG)[Department],
								][]
							).map(([key, config]) => (
								<SelectItem key={key} value={key}>
									{config.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					{errors.department && (
						<p className="text-sm text-destructive">{errors.department}</p>
					)}
				</div>

				{deptConfig && (
					<>
						<div className="space-y-2">
							<Label>ロール</Label>
							<Select
								value={role}
								onValueChange={(v) => {
									if (USER_ROLES.includes(v as UserRole))
										setRole(v as UserRole);
								}}
							>
								<SelectTrigger className="w-full">
									<SelectValue placeholder="ロールを選択" />
								</SelectTrigger>
								<SelectContent>
									{deptConfig.roles.map((r) => (
										<SelectItem key={r} value={r}>
											{ROLE_LABELS[r]}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							<p className="text-xs text-muted-foreground">
								{deptConfig.label}で利用可能:{" "}
								{deptConfig.roles.map((r) => ROLE_LABELS[r]).join("、")}
							</p>
						</div>

						<div className="space-y-2">
							<Label>配送フロア</Label>
							<Select value={floor} onValueChange={setFloor}>
								<SelectTrigger className="w-full">
									<SelectValue placeholder="フロアを選択" />
								</SelectTrigger>
								<SelectContent>
									{deptConfig.floors.map((f) => (
										<SelectItem key={f} value={f}>
											{f}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					</>
				)}
			</fieldset>

			{/* 食事制限 */}
			<fieldset className="space-y-4">
				<legend className="text-lg font-semibold">食事制限</legend>
				<div className="grid grid-cols-2 gap-3">
					{(
						Object.entries(DIETARY_LABELS) as [DietaryRestriction, string][]
					).map(([key, label]) => (
						<div key={key} className="flex items-center gap-2">
							<Checkbox
								id={`dietary-${key}`}
								checked={dietary.includes(key)}
								onCheckedChange={() => toggleDietary(key)}
							/>
							<Label htmlFor={`dietary-${key}`} className="font-normal">
								{label}
							</Label>
						</div>
					))}
				</div>

				{dietary.includes("allergy") && (
					<div className="space-y-2">
						<Label htmlFor="allergy-detail">アレルギー詳細</Label>
						<Input
							id="allergy-detail"
							value={allergyDetail}
							onChange={(e) => setAllergyDetail(e.target.value)}
							placeholder="例: 卵、乳製品、甲殻類"
						/>
					</div>
				)}
			</fieldset>

			{/* 通知設定 */}
			<fieldset className="space-y-4">
				<legend className="text-lg font-semibold">通知設定</legend>
				<div className="flex flex-col gap-3">
					<div className="flex items-center gap-2">
						<Checkbox
							id="notify-email"
							checked={notifyEmail}
							onCheckedChange={(checked) => setNotifyEmail(checked === true)}
						/>
						<Label htmlFor="notify-email" className="font-normal">
							メール通知
						</Label>
					</div>
					<div className="flex items-center gap-2">
						<Checkbox
							id="notify-slack"
							checked={notifySlack}
							onCheckedChange={(checked) => setNotifySlack(checked === true)}
						/>
						<Label htmlFor="notify-slack" className="font-normal">
							Slack 通知
						</Label>
					</div>
				</div>
			</fieldset>

			{/* プロフィール画像 */}
			<fieldset className="space-y-4">
				<legend className="text-lg font-semibold">プロフィール画像</legend>
				<div className="flex items-start gap-4">
					{avatarPreview ? (
						<img
							src={avatarPreview}
							alt="プレビュー"
							className="size-20 rounded-full object-cover border"
						/>
					) : (
						<div className="size-20 rounded-full bg-muted flex items-center justify-center text-muted-foreground text-2xl">
							?
						</div>
					)}
					<div className="space-y-2">
						<Input
							type="file"
							accept="image/*"
							onChange={handleImageChange}
							className="max-w-xs"
						/>
						<p className="text-xs text-muted-foreground">
							プレビューのみ（実際のアップロードは行いません）
						</p>
					</div>
				</div>
			</fieldset>

			<Button type="submit" className="w-full sm:w-auto cursor-pointer">
				登録する
			</Button>
		</form>
	);
}
