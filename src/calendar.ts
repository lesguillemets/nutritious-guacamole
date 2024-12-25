import type { AssignmentAC, AssignmentE } from "./base";

import type { WeekDayDuty, WeekEndDuty } from "./duty";

import { differenceInDays } from "date-fns";

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
		if (differenceInDays(lastDay, firstDay) +1 !== this.cal.length){
			console.log("PersonalCalendar.getRange::differenceError ");
		}
		return [firstDay, lastDay];
	}

	getDays(): Array<Date> {
		return this.cal.map( (dd) => dd[0] );
	}
	getDuties(): Array<WeekDayDuty | WeekEndDuty> {
		return this.cal.map( (dd) => dd[1] );
	}
}
