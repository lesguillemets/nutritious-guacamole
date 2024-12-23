import type { DayofWeek } from "./base";

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
