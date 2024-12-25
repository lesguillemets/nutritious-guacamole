/** 平日のお仕事の区分 */
export enum WeekDayDuty {
	A = "A",
	C = "C",
	G = "外来", // TODO: 外来ここに含めるのは変？
	W = "病棟専従",
	Leave = "Leave", // 休暇の設定は別枠で必要な気がする
	Other = "Other", // 現実的には B か F
}

// 休日のduty. Eかなし (X) か
export enum WeekEndDuty {
	X = 0,
	E = 1,
}
