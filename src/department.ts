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

	/** 人のリストを tsv 形式で返す．
	 * 名前，形態，病棟，外来，A/C，E */
	genMemberListTSV(): string {
		const result: Array<string> = [
			["名前", "形態", "病棟", "外来", "A/C", "E"].join("\t"),
		];
		for (const p of this.ppl) {
			result.push(p.toMemberListTSVLine());
		}
		return result.join("\n");
	}
}
