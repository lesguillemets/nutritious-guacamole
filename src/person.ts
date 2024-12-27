import {
	type AssignmentAC,
	type AssignmentE,
	posToAssignmentAC,
	posToAssignmentE,
} from "./assignment";
import type { Name, Ward } from "./base";
import { PersonalCalendar } from "./calendar";
import { type Duty, WeekDayDuty, WeekEndDuty } from "./duty";
import { OutPDays } from "./outpatient";
import { Position } from "./position";

import { addDays, differenceInDays, isWeekend } from "date-fns";

export class Person {
	// お名前，かつこれで区別するので一意であってほしい
	name: Name;
	position: Position; // 役職
	/** 専従 */
	ward: Ward;

	/** 外来日 */
	outPDays: OutPDays;

	/** 今回のクールの割り当て．後から変更がありうるので別枠で覚えておく */
	proposed: PersonalCalendar = new PersonalCalendar();

	/** シフト履歴，とりあえずクールごとにまとめた配列にしてみますか */
	history: Array<PersonalCalendar> = new Array();
	// 平日・休日のシフト履歴別に持ってもいいかも…と思ったが
	// set に紐づけた自動更新だと extend とかに追従しない？
	// private _weekDayHistory: [Date, WeekDayDuty][] = new Array();
	// private _weekEndHistory: [Date, WeekEndDuty][] = new Array();

	// A/C を割り当てられる頻度
	assignAC: AssignmentAC;
	/** E を割り当てられる頻度 */
	assignE: AssignmentE;

	constructor(
		name: Name,
		p: Position,
		ward: Ward = null,
		w: OutPDays = new OutPDays(),
		aac?: AssignmentAC,
		ae?: AssignmentE,
	) {
		this.name = name;
		this.position = p;
		this.ward = ward;
		this.outPDays = w;

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

	cmp(other: Person): number {
		const thisP = Position.toInt(this.position);
		const otherP = Position.toInt(other.position);
		if (thisP === otherP) {
			// TODO: とりあえず役職だけで並び変える．
			// stable なので悪くないはず
			return 0;
		}
		// 役職は上が先に来るようにしておく
		return thisP - otherP;
	}

	/** Department.genMemberListTSV での使用を想定して，
	 * tsv ファイルの一行の形になる */
	toMemberListLine(): Array<string> {
		// あとは this.proposed と this.history があればOK!!!
		return [
			`${this.name}`,
			`${this.position}`,
			`${this.ward === null ? "" : this.ward}`,
			`${this.outPDays.toString()}`,
			`${this.assignAC}`,
			`${this.assignE}`,
		];
	}

	defaultCalendar(from: Date, to: Date): PersonalCalendar {
		const dates: Array<[Date, Duty]> = [];
		for (let d = from; d <= to; d = addDays(d, 1)) {
			let duty: Duty;
			// 週末のデフォルトは X
			if (isWeekend(d)) {
				duty = WeekEndDuty.X;
			} else {
				// 平日のデフォルトは，
				if (this.outPDays.isOPDay(d)) {
					// 外来があれば外来
					duty = WeekDayDuty.G;
				} else if (this.ward !== null) {
					// 病棟専従があればそっち
					duty = WeekDayDuty.W;
				} else {
					// 外来も病棟もなければデフォルトはBかFかその辺
					duty = WeekDayDuty.Other;
				}
			}
			dates.push([d, duty]);
		}
		return new PersonalCalendar(dates);
	}
}
