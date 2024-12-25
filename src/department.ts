import type { Person } from "./person";
import {TableLike} from "./base";

export class Department {
	ppl: Array<Person>;

	constructor(ppl: Array<Person> = []) {
		this.ppl = ppl;
	}

	add_person(p: Person) {
		this.ppl.push(p);
		this.ppl.sort((a, b) => a.cmp(b));
	}

	/** 人のリストを tsv 形式で返す．
	 * 名前，形態，病棟，外来，A/C，E */
	genMemberListTSV(): string {
		const header: Array<string> = ["名前", "形態", "病棟", "外来", "A/C", "E"];
		const dat = this.ppl.map( (p) => p.toMemberListTSVLine() );
		const tb = new TableLike(dat, header);
		return tb.to_tsv();
	}
	// TODO: ここ共通化したいよね
	genMemberListHTML(): string {
		const header: Array<string> = ["名前", "形態", "病棟", "外来", "A/C", "E"];
		const dat = this.ppl.map( (p) => p.toMemberListTSVLine() );
		const tb = new TableLike(dat, header);
		return tb.to_html_table();
	}
}
