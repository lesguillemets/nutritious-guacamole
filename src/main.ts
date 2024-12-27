import { dateToTimeStampString } from "./base";
import { Department } from "./department";
import { OutPDays } from "./outpatient";
import { parseMemberListTsv } from "./parser";
import { Person } from "./person";
import { Position } from "./position";

function init() {
	let dep = new Department();
	const wd = new OutPDays([
		[3, null],
		[1, [1, 3]],
	]);
	dep.add_person(new Person("Kamo", Position.FullTime, undefined, wd));
	dep.add_person(new Person("John Yudkin", Position.Chief));
	dep.add_person(new Person("Yura", Position.FullTime, "N100"));
	dep.add_person(new Person("Yodo", Position.FullTime));
	dep.add_person(new Person("Maruyama", Position.FixedTerm));
	dep.add_person(new Person("Takano", Position.PartTime));
	console.log(dep);

	const saveButton: HTMLButtonElement = document.getElementById(
		"save-button",
	)! as HTMLButtonElement;
	saveButton.addEventListener("click", (e) => {
		downloadAll(dep);
	});

	const debugButtonA: HTMLButtonElement = document.getElementById(
		"debug-button-a",
	)! as HTMLButtonElement;
	debugButtonA.addEventListener("click", (e) => {
		downloadCurrentMemberList(dep);
	});

	const execButton: HTMLButtonElement = document.getElementById(
		"exec-button",
	)! as HTMLButtonElement;
	execButton.addEventListener("click", async (e) => {
		const parsed = await loadFiles();
		if (parsed !== null) {
			dep = parsed;
			console.log("loaded something...");
			console.log(dep);
		} else {
			errWrite("Error parsing file!");
		}
	});

	console.log("INIT");
}

/**
 * 文字列で与えられたデータをダウンロードします．
 * @param mimeType: string mimeType として指定する文字列
 * @param fName: string ファイル名
 * @param s: string ダウンロードする内容
 */
function doDownload(mimeType: string, fName: string, s: string) {
	const blob = new Blob([s], { type: mimeType });
	const url = URL.createObjectURL(blob);
	const anch = document.createElement("a");
	anch.setAttribute("href", url);
	const ts: Date = new Date();
	anch.setAttribute("download", fName);
	anch.style.display = "none";
	document.body.appendChild(anch);
	anch.click();
	URL.revokeObjectURL(url);
	document.body.removeChild(anch);
}

/** 文字列で与えられたデータを tsv としてダウンロード
 * @param fNameBase: string これに接頭辞とタイムスタンプをつけてファイル名にします
 * @param s: string ダウンロードする内容
 */
function doDownloadAsTsv(fNameBase: string, timeStamp: Date, s: string) {
	doDownload(
		"text/tab-separated-values;charset=utf-8",
		`NutGuacamole-${fNameBase}-${dateToTimeStampString(timeStamp)}.tsv`,
		s,
	);
}

function setMainHTML(s: string) {
	const mb = document.getElementById("main-box")!;
	console.log({ innerHTML: mb.innerHTML });
	mb.innerHTML = s;
}

function downloadAll(dep: Department) {
	const timeStamp: Date = new Date();
	const [ml, prev, otherData] = dep.toStrings();
	doDownloadAsTsv("MembersList", timeStamp, ml);
	doDownloadAsTsv("CurrentShift", timeStamp, prev);
	doDownload(
		"application/json;charset=utf-8",
		`NutGuacamole-OtherData-${dateToTimeStampString(timeStamp)}.json`,
		otherData,
	);
}

function downloadCurrentMemberList(dep: Department) {
	const timeStamp: Date = new Date();
	doDownloadAsTsv("MembersList", timeStamp, dep.genMemberListTSV());
}

function downloadCurrentAsJson(dep: Department) {
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
async function loadFiles(): Promise<Department | null> {
	// スタッフ一覧
	const memberListF: HTMLInputElement = document.getElementById(
		"member-list-file",
	)! as HTMLInputElement;
	const mlf: File = memberListF.files![0];

	// 直近データ
	const prevShiftF: HTMLInputElement = document.getElementById(
		"prev-shift-file",
	)! as HTMLInputElement;
	const psf: File = prevShiftF.files![0];

	// その他の分
	const otherDataF: HTMLInputElement = document.getElementById(
		"other-data-file",
	)! as HTMLInputElement;
	const odf: File = otherDataF.files![0];

	const loaded_dep: Department | undefined = await Promise.all([
		mlf.text(),
		psf.text(),
		odf.text(),
	]).then((txts: Array<string>) => {
		console.log("HI! tried parsingthe member list;");
		console.log(parseMemberListTsv(txts[0]));
		return Department.fromStrings(txts[0], txts[1], txts[2]);
	});
	console.log(loaded_dep);
	return loaded_dep || null;
}

function errWrite(s: string) {
	document.getElementById("error-container")!.innerText = s;
}

window.addEventListener("load", init);
