import { Position, dateToTimeStampString } from "./base";
import { Department } from "./department";
import { OutPDays } from "./outpatient";
import { Person } from "./person";

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
	console.log(dep);
	const saveButton: HTMLButtonElement = document.getElementById(
		"save-button",
	)! as HTMLButtonElement;
	saveButton.addEventListener("click", (e) => {
		downloadCurrentStatus(dep);
	});
	console.log("INIT");
}

function downloadCurrentStatus(dep: Department) {
	const blob = new Blob([JSON.stringify(dep)], {
		type: "application/json;charset=utf-8",
	});
	const url = URL.createObjectURL(blob);
	const anch = document.createElement("a");
	anch.setAttribute("href", url);
	const ts: Date = new Date();
	anch.setAttribute(
		"download",
		`NutGuacamoleData-${dateToTimeStampString(ts)}`,
	);
	anch.style.display = "none";
	document.body.appendChild(anch);
	anch.click();
	URL.revokeObjectURL(url);
	document.body.removeChild(anch);
}

window.addEventListener("load", init);
