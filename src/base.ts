// XXX: 結構例外が多くてこれだけでは何を降っていいのか決まらない XXX
export enum Position {
	DepMan = "副部長",
	Chief = "主任",
	FullTime = "常勤",
	FixedTerm = "有期雇用",
	PartTime = "非常勤",
}

export type Name = string;
export type Ward = string | null;

export namespace Position {
	export function toInt(p: Position): number {
		switch (p) {
			case Position.DepMan:
				return 0;
			case Position.Chief:
				return 1;
			case Position.FullTime:
				return 2;
			case Position.FixedTerm:
				return 3;
			case Position.PartTime:
				return 3;
			default:
				return Number.NaN;
		}
	}

	export function fromInt(n: number): Position | undefined {
		switch (n) {
			case 0:
				return Position.DepMan;
			case 1:
				return Position.Chief;
			case 2:
				return Position.FullTime;
			case 3:
				return Position.FixedTerm;
			case 4:
				return Position.PartTime;
			default:
				return undefined;
		}
	}

	export function fromString(s: string): Position | undefined {
		switch (s) {
			case "副部長":
				return Position.DepMan;
			case "主任":
				return Position.Chief;
			case "常勤":
				return Position.FullTime;
			case "有期雇用":
				return Position.FixedTerm;
			case "非常勤":
				return Position.PartTime;
			default:
				return undefined;
		}
	}
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
export namespace DayofWeek {
	export function fromString(s: string): DayofWeek | undefined {
		return undefined;
		// return(DayofWeek[s as keyof typeof DayofWeek]);
	}
}

// A/C を割り当てられる頻度
export enum AssignmentAC {
	None = "none",
	BiWeekly = "biweekly",
	Regular = "regular",
}

export function posToAssignmentAC(pos: Position): AssignmentAC {
	if (pos === Position.Chief) {
		return AssignmentAC.BiWeekly;
	}
	if (pos === Position.FullTime) {
		return AssignmentAC.Regular;
	}
	return AssignmentAC.None;
}

// E を割り当てられる頻度
export enum AssignmentE {
	None = "none",
	Half = "once in two cours",
	Regular = "regular",
}

export function posToAssignmentE(pos: Position): AssignmentE {
	if (pos === Position.Chief) {
		return AssignmentE.Half;
	}
	if (pos === Position.FullTime || pos === Position.FixedTerm) {
		return AssignmentE.Regular;
	}
	return AssignmentE.None;
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

/** 要素の2次元配列を，基本的には Array.join() を使って
 * 表示しやすい表形式にするクラス
 * 実際の representation は Array<Array<T>> 側が
 * 面倒を見る構造の，ごく薄い層
 * @type TableLike<T,U> T:データの型 U: ヘッダの型*/
export class TableLike<T, U> {
	dat: Array<Array<T>>;
	header: Array<U> | null;

	constructor(dat: Array<Array<T>>, header: Array<U> | null = null) {
		this.dat = dat;
		this.header = header;
	}

	formatDat(fmt: (d: T) => string): TableLike<string, U> {
		const d: Array<Array<string>> = [];
		for (const row of this.dat) {
			d.push(row.map(fmt));
		}
		return new TableLike(d, this.header);
	}

	formatHead(fmt: (d: U) => string): TableLike<T, string> {
		const newHeader = this.header === null ? null : this.header.map(fmt);
		return new TableLike(this.dat, newHeader);
	}

	toTsv(): string {
		const rows = [];
		if (this.header !== null) {
			rows.push(this.header.join("\t"));
		}
		for (const r of this.dat) {
			// if (isTableRowLike(r)) {
			// 	// それ用のメソッドがあるときは使う
			// 	rows.push(r.toTableRow().join('\t'));
			// } else {
			rows.push(r.join("\t"));
			// }
		}
		return rows.join("\n");
	}

	/** 仮．
	 * table の方には class とかつけたくなる気がするので内側だけ．
	 * これも単に string で作る形になってる */
	toHtmlTable(): string {
		const rows = [];
		if (this.header !== null) {
			rows.push("<thead><tr>");
			rows.push(
				this.header.map((headerItem) => `\t<th>${headerItem}</th>`).join("\n"),
			);
			rows.push("</tr></thead>");
		}
		rows.push("<tbody>");
		for (const r of this.dat) {
			rows.push("<tr>");
			rows.push(r.map((i) => `\t<td>${i}</td>`).join("\n"));
			rows.push("</tr>");
		}
		rows.push("</tbody>");
		return rows.join("\n");
	}
}

/** Table として扱う時に，その行になりうるもの．
 * toTableRow が，各アイテムを含む配列を返す
 * …と思ったけど，複数の表現の仕方が文脈依存で存在するので，
 * あんまりデータ側にこういうメソッドを生やす意味は薄いかも
 * */
export interface TableRowLike {
	toTableRow(): Array<string>;
}

export function isTableRowLike(obj: any): obj is TableRowLike {
	return "toTableRow" in obj;
}
