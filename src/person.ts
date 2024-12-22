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

export class Person {
	// お名前，かつこれで区別するので一意であってほしい
	name: string;
	position: Position; // 役職
	// FIXME
	/** 外来日…なのだが隔週月曜は別に扱う */
	weeklyOutP: DayofWeek | null;
	/** 平日のシフト履歴 */
	weekDayHistory: [Date, WeekDayDuty][] = new Array();
	/** 休日のシフト履歴 */
	weekEndHistory: [Date, WeekEndDuty][] = new Array();
	constructor(name: string, p: Position, w: DayofWeek | null = null) {
		this.name = name;
		this.position = p;
		this.weeklyOutP = w;
	}
}
