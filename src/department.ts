import { TableLike } from "./base";
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
	 * みんな揃った日付のカレンダーを持ってることを仮定してしまう */
	_genProposedTable(): TableLike<string, string> {
		// TODO
		return new TableLike([]);
	}
}
