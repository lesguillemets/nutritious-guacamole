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

/** 外来業務 */
export class OutPDays {
	// [曜日, [第n週]] (1-indexed) という形式にした．
	// FIXME: 0-indexed のほうが統一性がある？
	// 例えば毎週月曜・1・3週木曜なら
	// [[DayofWeek.Mon, null], [DayofWeek.Thu, [1,3]]
	slots: [DayofWeek, number[] | null][];

	constructor(d: [DayofWeek, number[] | null][] = []) {
		this.slots = d;
	}

	/** その日が外来日かどうか */
	is(d: Date): boolean {
		for (const wd of this.slots) {
			// 曜日として記録があって…
			if (d.getDay() === wd[0]) {
				// 週の限定がなくてその曜日が入ってたら true
				if (wd[1] === null) {
					return true;
				}
				// 第何週目のその曜日か
				const day = d.getDate();
				const nth = Math.floor(day / 7) + (day % 7 === 0 ? 0 : 1);
				// 週の限定がある場合はそっちを見る，
				return wd[1].includes(nth);
			}
		}
		// 該当の曜日がない
		return false;
	}
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
	if (pos === Position.Chief) {
		return AssignmentE.Half;
	}
	if (pos === Position.FullTime || pos === Position.FixedTerm) {
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
	outPDays: OutPDays;

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
		w: OutPDays = new OutPDays(),
		ward: string | null = null,
		aac?: AssignmentAC,
		ae?: AssignmentE,
	) {
		this.name = name;
		this.position = p;
		this.outPDays = w;
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
