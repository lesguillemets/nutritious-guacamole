import { Position } from "./base";
import { OutPDays } from "./outpatient";
import { Department, Person } from "./person";

function init() {
	const dep = new Department();
	const wd = new OutPDays([
		[3, null],
		[1, [1, 3]],
	]);
	dep.add_person(new Person("Kamo", Position.FullTime, wd));
	dep.add_person(new Person("John Yudkin", Position.Chief));
	dep.add_person(new Person("Yura", Position.FullTime, undefined, "N100"));
	dep.add_person(new Person("Yodo", Position.FullTime));
	dep.add_person(new Person("Maruyama", Position.FixedTerm));
	dep.add_person(new Person("Takano", Position.PartTime));
	console.log("INIT");
	console.log(dep);
}

window.addEventListener("load", init);
