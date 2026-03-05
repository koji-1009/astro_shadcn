export const DEPARTMENTS = [
	"sales",
	"engineering",
	"hr",
	"operations",
	"executive",
] as const;
export type Department = (typeof DEPARTMENTS)[number];

export const USER_ROLES = ["admin", "user", "manager"] as const;
export type UserRole = (typeof USER_ROLES)[number];

export type DietaryRestriction =
	| "vegetarian"
	| "halal"
	| "allergy"
	| "low-salt";

export interface UserProfile {
	id: string;
	name: string;
	email: string;
	department: Department;
	role: UserRole;
	floor: string;
	dietaryRestrictions: DietaryRestriction[];
	allergyDetail?: string;
	notifyEmail: boolean;
	notifySlack: boolean;
	avatarUrl?: string;
}

interface DepartmentConfig {
	label: string;
	roles: UserRole[];
	floors: string[];
}

export const DEPARTMENT_CONFIG: Record<Department, DepartmentConfig> = {
	sales: {
		label: "営業部",
		roles: ["user", "manager"],
		floors: ["3F", "4F"],
	},
	engineering: {
		label: "開発部",
		roles: ["user", "manager", "admin"],
		floors: ["5F", "6F"],
	},
	hr: {
		label: "人事部",
		roles: ["user", "manager", "admin"],
		floors: ["2F"],
	},
	operations: {
		label: "総務部",
		roles: ["user", "manager"],
		floors: ["2F", "3F"],
	},
	executive: {
		label: "役員室",
		roles: ["manager", "admin"],
		floors: ["7F"],
	},
} as const;

export const ROLE_LABELS: Record<UserRole, string> = {
	admin: "管理者",
	user: "一般",
	manager: "マネージャー",
};

export const DIETARY_LABELS: Record<DietaryRestriction, string> = {
	vegetarian: "ベジタリアン",
	halal: "ハラール",
	allergy: "アレルギー",
	"low-salt": "減塩",
};
