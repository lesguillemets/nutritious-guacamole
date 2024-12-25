import { format as dateFormat } from "date-fns";
import { type Name, TableLike } from "./base";
import { type Duty, dutyToShortString } from "./duty";
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
		// FIXME: not yet confirmed
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
		const fmtBody = (d: Duty | Name) => {
			if (typeof d === "string") {
				return d;
			}
			return dutyToShortString(d);
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
}
