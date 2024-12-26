import { dateToTimeStampString } from "./base";
import { Department } from "./department";
import { OutPDays } from "./outpatient";
import { Person } from "./person";
import { Position } from "./position";

function init() {
	let dep = new Department();
	console.log(`type of dep is ${typeof dep}`); // この時点で Objectなのだが
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

	const debugButtonA: HTMLButtonElement = document.getElementById(
		"debug-button-a",
	)! as HTMLButtonElement;
	debugButtonA.addEventListener("click", (e) => {
		downloadCurrentMemberList(dep);
	});

	const prevDataF: HTMLInputElement = document.getElementById(
		"other-data-file",
	)! as HTMLInputElement;
	prevDataF.addEventListener("change", async (e) => {
		const parsed = await loadFile();
		if (parsed !== null) {
			dep = parsed;
			console.log("loaded something...");
			console.log(dep);
			console.log(typeof dep);
			// JSON.parse() でとった Object は add_personを呼べない!
			dep.add_person(new Person("Ibo", Position.PartTime));
			console.log(dep);
		} else {
			errWrite("Error parsing file!");
		}
	});
	console.log("INIT");
}

function downloadCurrentMemberList(dep: Department) {
	const blob = new Blob([dep.genMemberListTSV()], {
		type: "text/tab-separated-values;charset=utf-8",
	});
	const mb = document.getElementById("main-box")!;
	mb.innerHTML = `<table>\n${dep.genMemberListHTML()}\n</table>`;
	const url = URL.createObjectURL(blob);
	const anch = document.createElement("a");
	anch.setAttribute("href", url);
	const ts: Date = new Date();
	anch.setAttribute(
		"download",
		`NutGuacamoleMembersList-${dateToTimeStampString(ts)}.tsv`,
	);
	anch.style.display = "none";
	document.body.appendChild(anch);
	anch.click();
	URL.revokeObjectURL(url);
	document.body.removeChild(anch);
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
		`NutGuacamoleData-${dateToTimeStampString(ts)}.json`,
	);
	anch.style.display = "none";
	document.body.appendChild(anch);
	anch.click();
	URL.revokeObjectURL(url);
	document.body.removeChild(anch);
}

// Blob.text() が await を返すのでここが async になる．
// 前は FileReader.readAsText() を呼んでいたが，結局 listener な感じになるので変わらない．
async function loadFile(): Promise<Department | null> {
	const prevDataF: HTMLInputElement = document.getElementById(
		"prev-data-file",
	)! as HTMLInputElement;
	const fl: File = prevDataF.files![0];
	const loaded_dep: Department = await fl.text().then((txt: string) => {
		// console.log(txt);
		// FIXME
		return JSON.parse(txt);
	});
	return loaded_dep;
}

function errWrite(s: string) {
	document.getElementById("error-container")!.innerText = s;
}

window.addEventListener("load", init);
