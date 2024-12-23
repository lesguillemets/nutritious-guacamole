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
}
