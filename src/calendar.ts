import type { AssignmentAC, AssignmentE } from "./base";

import type { WeekDayDuty, WeekEndDuty } from "./duty";

type DateDutyArray = Array<[Date, WeekDayDuty | WeekEndDuty]>;
// 個々人の予定表．
export class PersonalCalendar {
	cal: DateDutyArray;

	constructor(cal: DateDutyArray = []) {
		this.cal = cal;
	}
}
