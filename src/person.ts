import type { WeekDayDuty, WeekEndDuty } from "./duty";

// XXX: 結構例外が多くてこれだけでは何を降っていいのか決まらない XXX
export enum Position {
	DepMan = "副部長",
	Chief = "主任",
	FullTime = "常勤",
	FixedTerm = "有期雇用",
	PartTime = "非常勤",
}

/** Sun(0) - start, conforming to Date.prototype.getDay() */
export enum DayofWeek {
	Sun = 0,
	Mon = 1,
	Tue = 2,
	Wed = 3,
	Thu = 4,
	Fri = 5,
	Sat = 6,
}

// A/C を割り当てられる頻度
export enum AssignmentAC {
	None = "none",
	BiWeekly = "biweekly",
	Regular = "regular",
}

// E を割り当てられる頻度
export enum AssignmentE {
	None = "none",
	Half = "once in two cours",
	Regular = "regular",
}

export class Person {
	// お名前，かつこれで区別するので一意であってほしい
	name: string;
	position: Position; // 役職
	// FIXME: 多分 [DayofWeek, number | asterisk] みたいな感じで週を指定したらいい
	/** 外来日…なのだが隔週月曜は別に扱う */
	weeklyOutP: DayofWeek | null;
	/** 平日のシフト履歴 */
	weekDayHistory: [Date, WeekDayDuty][] = new Array();
	/** 休日のシフト履歴 */
	weekEndHistory: [Date, WeekEndDuty][] = new Array();

	// A/C を割り当てられる頻度
	assignAC: AssignmentAC;
	/** E を割り当てられる頻度 */
	assignE: AssignmentE;

	constructor(
		name: string,
		p: Position,
		w: DayofWeek | null = null,
		aac?: AssignmentAC,
		ae?: AssignmentE,
	) {
		this.name = name;
		this.position = p;
		this.weeklyOutP = w;

		// AssignmentAC が特に指定されなければ役職に従う
		if (aac === undefined) {
			if (p === Position.Chief) {
				this.assignAC = AssignmentAC.BiWeekly;
			} else if (p === Position.FullTime) {
				this.assignAC = AssignmentAC.Regular;
			} else {
				this.assignAC = AssignmentAC.None;
			}
		} else {
			this.assignAC = aac;
		}

		// AssignmentE が特に指定されなければ役職に従う
		if (ae === undefined) {
			if (p === Position.Chief) {
				this.assignE = AssignmentE.Half;
			} else if (p === Position.FullTime || p === Position.FixedTerm) {
				this.assignE = AssignmentE.Regular;
			} else {
				this.assignE = AssignmentE.None;
			}
		} else {
			this.assignE = ae;
		}
	}
}
