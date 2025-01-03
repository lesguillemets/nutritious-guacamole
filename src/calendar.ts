import type { AssignmentAC, AssignmentE } from "./assignment";

import type { WeekDayDuty, WeekEndDuty } from "./duty";

import { differenceInDays } from "date-fns";

/** [日，その日の業務] の Array. */
type DateDutyArray = Array<[Date, WeekDayDuty | WeekEndDuty]>;

/** 個々人の予定表．*/
export class PersonalCalendar {
	/** @type {Array<[Date, WeekDayDuty|WeekEndDuty]>} */
	cal: DateDutyArray;

	constructor(cal: DateDutyArray = []) {
		this.cal = cal;
	}

	/** このカレンダーの開始日・終了日を返す．
	 * カレンダーの連続性（欠損がないこと）は仮定する．
	 * this.cal が空なら undefined 返す */
	getRange(): [Date, Date] | undefined {
		if (this.cal.length === 0) {
			return undefined;
		}
		const firstDay: Date = this.cal.at(0)![0];
		const lastDay: Date = this.cal.at(-1)![0];
		if (differenceInDays(lastDay, firstDay) + 1 !== this.cal.length) {
			console.log("PersonalCalendar.getRange::differenceError ");
		}
		return [firstDay, lastDay];
	}

	/** カレンダーに含まれる Date のリスト */
	getDays(): Array<Date> {
		return this.cal.map((dd) => dd[0]);
	}
	/** カレンダーに含まれる Duties だけ のリスト */
	getDuties(): Array<WeekDayDuty | WeekEndDuty> {
		return this.cal.map((dd) => dd[1]);
	}
}
