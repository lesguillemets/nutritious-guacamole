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

// 個々人の予定表．
type PersonalCalendar = [Date, WeekDayDuty | WeekEndDuty][];

// A/C を割り当てられる頻度
export enum AssignmentAC {
	None = "none",
	BiWeekly = "biweekly",
	Regular = "regular",
}

function posToAssignmentAC(pos: Position): AssignmentAC {
	if (pos === Position.Chief) {
		return AssignmentAC.BiWeekly;
	}
	if (pos === Position.FullTime) {
		return AssignmentAC.Regular;
	}
	return AssignmentAC.None;
}

// E を割り当てられる頻度
export enum AssignmentE {
	None = "none",
	Half = "once in two cours",
	Regular = "regular",
}

function posToAssignmentE(pos: Position): AssignmentE {
	if (p === Position.Chief) {
		return AssignmentE.Half;
	}
	if (p === Position.FullTime || p === Position.FixedTerm) {
		return AssignmentE.Regular;
	}
	return AssignmentE.None;
}

export class Person {
	// お名前，かつこれで区別するので一意であってほしい
	name: string;
	position: Position; // 役職
	// FIXME: 多分 [DayofWeek, number | asterisk] みたいな感じで週を指定したらいい
	/** 外来日…なのだが隔週月曜は別に扱う */
	weeklyOutP: DayofWeek | null;

	/** シフト履歴，とりあえずクールごとにまとめたりはしない方針で */
	history: PersonalCalendar[] = new Array();
	// 平日・休日のシフト履歴別に持ってもいいかも…と思ったが
	// set に紐づけた自動更新だと extend とかに追従しない？
	// private _weekDayHistory: [Date, WeekDayDuty][] = new Array();
	// private _weekEndHistory: [Date, WeekEndDuty][] = new Array();

	// A/C を割り当てられる頻度
	assignAC: AssignmentAC;
	/** E を割り当てられる頻度 */
	assignE: AssignmentE;

	// 専従
	ward: string | null;

	constructor(
		name: string,
		p: Position,
		w: DayofWeek | null = null,
		ward: string | null = null,
		aac?: AssignmentAC,
		ae?: AssignmentE,
	) {
		this.name = name;
		this.position = p;
		this.weeklyOutP = w;
		this.ward = ward;

		// AssignmentAC が特に指定されなければ役職に従う
		if (aac === undefined) {
			this.assignAC = posToAssignmentAC(p);
		} else {
			this.assignAC = aac;
		}

		// AssignmentE が特に指定されなければ役職に従う
		if (ae === undefined) {
			this.assignE = posToAssignmentE(p);
		} else {
			this.assignE = ae;
		}
	}
}
