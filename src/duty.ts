export type Duty = WeekDayDuty | WeekEndDuty;

/** 平日のお仕事の区分 */
export enum WeekDayDuty {
	A = "A",
	C = "C",
	G = "外来", // TODO: 外来ここに含めるのは変？
	W = "病棟専従",
	Leave = "休", // 休暇の設定は別枠で必要な気がする
	Other = "Other", // 現実的には B か F
}

/** 休日のduty. Eかなし (X) か */
export enum WeekEndDuty {
	X = 0,
	E = 1,
}

// TODO: Object にしたほうが良い？

/** 実は Duty と string で形を区別した対応ができない
 * (see: 055a0e56f9dea04fc63c854848b10e3702271516 の子の
 * department::_genProposedCalendarFormatted();)．
 * 一報，Duty | string が流れてきてしまうのは今のところ
 * TableLike の設計が微妙に変だから．
 * ので，ここでまとめてやるのが一周回ってシンプルかもしれん． */
export function dutyOrStrToShortString(d: Duty | string): string {
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
			return "X";
		case WeekEndDuty.E:
			return "E";
		default:
			return d;
	}
}

/** 表で使う用の一文字表現 */
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
			return "X";
		case WeekEndDuty.E:
			return "E";
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
		case "X":
			return WeekEndDuty.X;
		case "E":
			return WeekEndDuty.E;
		default:
			console.log(`parsing ${s} as Duty and returning undefined `);
			return undefined;
	}
}
