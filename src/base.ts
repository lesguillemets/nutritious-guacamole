import { Position } from "./position";
export type Name = string;
export type Ward = string | null;

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
export namespace DayofWeek {
	export function fromString(s: string): DayofWeek | undefined {
		switch (s) {
			case "Sun":
			case "日":
				return DayofWeek.Sun;
			case "Mon":
			case "月":
				return DayofWeek.Mon;
			case "Tue":
			case "火":
				return DayofWeek.Tue;
			case "Wed":
			case "水":
				return DayofWeek.Wed;
			case "Thu":
			case "木":
				return DayofWeek.Thu;
			case "Fri":
			case "金":
				return DayofWeek.Fri;
			case "Sat":
			case "土":
				return DayofWeek.Sat;
			default:
				console.log(
					`debug: DayofWeek::fromString(${s}) is returning undefined`,
				);
				return undefined;
		}
		// return(DayofWeek[s as keyof typeof DayofWeek]);
	}

	export function toJapanese(d: DayofWeek): string {
		return {
			Sun: "日",
			Mon: "月",
			Tue: "火",
			Wed: "水",
			Thu: "木",
			Fri: "金",
			Sat: "土",
		}[DayofWeek[d]]!;
	}
}

/** 日付を yyyymmdd-hhMMss の形式で返す
 * @param {Date} ts 対象の日付 */
export function dateToTimeStampString(ts: Date): string {
	const yyyy = ts.getFullYear();
	const mm = (ts.getMonth() + 1).toString().padStart(2, "0");
	const dd = ts.getDate().toString().padStart(2, "0");
	const hh = ts.getHours().toString().padStart(2, "0");
	const MM = ts.getMinutes().toString().padStart(2, "0");
	const ss = ts.getSeconds();
	return `${yyyy}${mm}${dd}-${hh}${MM}${ss}`;
}
