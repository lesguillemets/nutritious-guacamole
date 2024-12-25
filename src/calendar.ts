import type { AssignmentAC, AssignmentE } from "./base";

import type { WeekDayDuty, WeekEndDuty } from "./duty";

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
		return [this.cal[0][0], this.cal[this.cal.length - 1][0]];
	}
}
