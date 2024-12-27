import { DayofWeek } from "./base";

const DEBUG = true;

/** 外来業務 */
export class OutPDays {
	// [曜日, [第n週]] (1-indexed) という形式にした．
	// FIXME: 0-indexed のほうが統一性がある？
	// 例えば毎週月曜・1・3週木曜なら
	// [[DayofWeek.Mon, null], [DayofWeek.Thu, [1,3]]
	slots: Array<[DayofWeek, number[] | null]>;

	constructor(d: Array<[DayofWeek, number[] | null]> = []) {
		this.slots = d;
	}

	/** 見やすいstring に；
	 * Mon・Thu(1,3週)  みたいな*/
	toString(): string {
		const result: Array<string> = [];
		for (const sl of this.slots) {
			const dayName = DayofWeek[sl[0]];
			if (sl[1] === null) {
				result.push(dayName);
			} else {
				const weeks = sl[1].join(",");
				result.push(`${dayName}(${weeks}週)`);
			}
		}
		return result.join("・");
	}

	static fromString(s: string): OutPDays | undefined {
		if (s === "") {
			return new OutPDays([]);
		}
		const slots: Array<[DayofWeek, number[] | null]> = [];
		for (const sl of s.split("・")) {
			const d0 = DayofWeek.fromString(sl);
			if (d0 !== undefined) {
				// Sun(1,3週) とかじゃなくて Sun のとき
				slots.push([d0!, null]);
			} else {
				const day = DayofWeek.fromString(sl.slice(0, 3))!; // Mon とか
				const weeks: Array<number> = sl
					.slice(4)
					.slice(0, -2)
					.split(",")
					.map((n) => Number.parseInt(n, 10));
				slots.push([day, weeks]);
			}
		}
		return new OutPDays(slots);
	}

	/** その日が外来日かどうか */
	isOPDay(d: Date): boolean {
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
