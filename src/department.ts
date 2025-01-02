import { format as dateFormat } from "date-fns";
import { type Name } from "./base";
import { TableLike } from "./TableLike";
import type { PersonalCalendar } from "./calendar";
import { type Duty, dutyOrStrToShortString } from "./duty";
import { parseDepartmentCalendar, parseMemberListTsv } from "./parser";
import type { Person } from "./person";

export class Department {
	ppl: Array<Person>;

	constructor(ppl: Array<Person> = []) {
		this.ppl = ppl;
	}

	add_person(p: Person) {
		this.ppl.push(p);
		this.ppl.sort((a, b) => a.cmp(b));
	}

	/** memberList, prevHist, otherdata の3つの string から Department を返す */
	static fromStrings(
		memberList: string,
		prevShift: string,
		otherDataJ: string,
	): Department | undefined {
		const members: Array<Person> = parseMemberListTsv(memberList)!;
		const prevCal: Array<[Name, PersonalCalendar]> =
			parseDepartmentCalendar(prevShift)!;
		const otherData: { depHistory: string } = JSON.parse(otherDataJ);
		const depHistory = parseDepartmentCalendar(otherData.depHistory)!;
		for (const m of members) {
			const name: Name = m.name;
			// 何故かこっちは通らない: at が | string を返すことになってる?
			// const thisCal: PersonalCalendar | undefined = prevCal.find( (c) => {c[0] === name} )?.at(1);
			const thisCal: [Name, PersonalCalendar] | undefined = prevCal.find(
				(c) => {
					return c[0] === name;
				},
			);
			if (thisCal !== undefined) {
				m.proposed = thisCal[1];
			}
			const history: [Name, PersonalCalendar] | undefined = depHistory.find(
				(c) => {
					return c[0] === name;
				},
			);
			if (history !== undefined) {
				m.history.push(history[1]);
			}
		}
		return new Department(members);
	}

	/** 外部への出力用．メンバのリスト，前回分，その他のデータ，をこの順で返す．
	 * @returns: [メンバリスト(tsv), 前回分(tsv), その他(json)]
	 * その他，は { depHistory: history(tsv):string } の形式 */
	toStrings(): [string, string, string] {
		const ml = this.genMemberListTSV();
		const prev = this.genProposedCalendarTSV();
		const hist = this.genHistoryCalendarTSV();
		return [ml, prev, JSON.stringify({ depHistory: hist })];
	}

	/** 人のリストを表的な形式で返す
	 * 名前，形態，病棟，外来，A/C，E
	 * @returns {TableLike<string,string>} ヘッダを含めた表
	 * */
	_genMemberList(): TableLike<string, string> {
		const header: Array<string> = ["名前", "形態", "病棟", "外来", "A/C", "E"];
		const dat = this.ppl.map((p) => p.toMemberListLine());
		return new TableLike(dat, header);
	}
	genMemberListTSV(): string {
		return this._genMemberList().toTsv();
	}
	// TODO: もうちょっとまとめられる？
	genMemberListHTML(): string {
		return this._genMemberList().toHtmlTable();
	}

	/** current proposed を表形式で返す．
	 * 個々人がデータを持ってるのに変な話だが，
	 * みんな揃った日付のカレンダーを持ってることを仮定してしまう
	 * 最初の行が [null, Date, Date, 本体は [Name, Duty, Duty...]
	 * */
	_genProposedCalendar(): TableLike<Duty | Name, Date | null> {
		if (this.ppl.length === 0) {
			// if noone is here, return none
			return new TableLike([]);
		}
		const dates: Array<Date> = this.ppl[0].proposed.getDays();
		const header = [null, ...dates];
		const body = [];
		for (const p of this.ppl) {
			const duties = p.proposed.getDuties();
			body.push([p.name, ...duties]);
		}
		return new TableLike(body, header);
	}

	_genProposedCalendarFormatted(): TableLike<string, string> {
		const fmtHead = (d: Date | null) => {
			if (d === null) {
				return "";
			}
			return dateFormat(d, "yyyy-MM-dd");
		};
		const fmtBody = (d: Duty | Name): string => {
			// あるいは，@ ts-ignore
			return dutyOrStrToShortString(d);
			// return (dutyToShortString(d) || d as string);
			// FIXME: String enum と string の型レベルの区別ができてない？
			// ここが other を返してる気配がある
			// if (typeof d === "string") {
			// 	return d;
			// }
			// return dutyToShortString(d);
		};
		return this._genProposedCalendar().formatHead(fmtHead).formatDat(fmtBody);
	}

	genProposedCalendarTSV(): string {
		return this._genProposedCalendarFormatted().toTsv();
	}
	// TODO: もうちょっとまとめられる？
	genProposedCalenderHTML(): string {
		return this._genProposedCalendarFormatted().toHtmlTable();
	}

	/** history を表形式で返す．
	 * 実質 _genProposedCalendar() と共通なのだが，パッといい抽象化が浮かばなくて
	 * 重複したコードを許すことにする．
	 * Person.history は今 Calendar の Array だけど，それは単に横に並べてしまう．
	 * */
	_genHistoryCalendar(): TableLike<Duty | Name, Date | null> {
		// FIXME: not yet confirmed
		if (this.ppl.length === 0) {
			// if noone is here, return none
			return new TableLike([]);
		}
		const dates: Array<Date> = this.ppl[0].history.flatMap((c) => c.getDays());
		const header = [null, ...dates];
		const body = [];
		for (const p of this.ppl) {
			const duties = p.history.flatMap((c) => c.getDuties());
			body.push([p.name, ...duties]);
		}
		return new TableLike(body, header);
	}

	_genHistoryCalendarFormatted(): TableLike<string, string> {
		const fmtHead = (d: Date | null) => {
			if (d === null) {
				return "";
			}
			return dateFormat(d, "yyyy-MM-dd");
		};
		// ここで d が string になるなら，duty::shortStringToDuty で
		// 区分けができる．
		const fmtBody = (d: Duty | Name): string => {
			return dutyOrStrToShortString(d);
		};
		return this._genProposedCalendar().formatHead(fmtHead).formatDat(fmtBody);
	}

	genHistoryCalendarTSV(): string {
		return this._genProposedCalendarFormatted().toTsv();
	}
	genHistoryCalenderHTML(): string {
		return this._genProposedCalendarFormatted().toHtmlTable();
	}
}
