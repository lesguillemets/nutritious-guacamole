/** 平日のお仕事の区分 */

export type Duty = WeekDayDuty | WeekEndDuty;

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

// TODO: Object にしたほうが良い？

export function dutyToShortString(d: Duty): string {
	switch (d) {
		case WeekDayDuty.A:
			return "A";
		case WeekDayDuty.C:
			return "C";
		case WeekDayDuty.G:
			return "外";
		case WeekDayDuty.W:
			return "棟";
		case WeekDayDuty.Leave:
			return "休";
		case WeekDayDuty.Other:
			return "・";
		case WeekEndDuty.X:
			return " ";
		case WeekEndDuty.E:
			return "E";
		default:
			console.log("dutyToShortString::unreachable");
			return "!!!!!!!";
	}
}

export function shortStringToDuty(s: string): Duty | undefined {
	switch (s) {
		case "A":
			return WeekDayDuty.A;
		case "C":
			return WeekDayDuty.C;
		case "外":
			return WeekDayDuty.G;
		case "棟":
			return WeekDayDuty.W;
		case "休":
			return WeekDayDuty.Leave;
		case "・":
			return WeekDayDuty.Other;
		case " ":
			return WeekEndDuty.X;
		case "E":
			return WeekEndDuty.E;
		default:
			return undefined;
	}
}
