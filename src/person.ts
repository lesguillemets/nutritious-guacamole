import {
	type AssignmentAC,
	type AssignmentE,
	type Position,
	posToAssignmentAC,
	posToAssignmentE,
} from "./base";
import type { WeekDayDuty, WeekEndDuty } from "./duty";
import { OutPDays } from "./outpatient";

// 個々人の予定表．
type PersonalCalendar = [Date, WeekDayDuty | WeekEndDuty][];

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
