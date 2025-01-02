import { AssignmentAC, AssignmentE } from "./assignment";
import { type Name, TableLike, type Ward } from "./base";
import { PersonalCalendar } from "./calendar";
import { Department } from "./department";
import {
	type Duty,
	type WeekDayDuty,
	type WeekEndDuty,
	dutyToShortString,
	shortStringToDuty,
} from "./duty";
import { OutPDays } from "./outpatient";
import { Person } from "./person";
import { Position } from "./position";

import { parse as parseDate } from "date-fns";

const DEBUG = true;

/** genMemberListTSV() の双対．型通りのリストを返す．
 * proposed と history は面倒を見ておらず，後から設定してください．
 * @param s: TSV 形式，ヘッダ含む*/
export function parseMemberListTsv(s: string): Array<Person> | undefined {
	// Array<[Name, Position, Ward, OutPDays, AssignmentAC, AssignmentE]> を返していたが
	const lines: Array<string> = s.split(/\r?\n/);
	if (DEBUG) {
		console.log("LINES ARE!", lines);
	}
	const ppl: Array<Person> = [];
	// i=0 は header なので飛ばす
	for (let i = 1; i < lines.length; i++) {
		// FIXME
		if (lines[i] === "") {
			// ファイル末尾の \n で切るとここで空の文字列が最後に残る
			continue;
		}
		const dats: Array<string> = lines[i].split("\t");
		// console.log(`calling parser::parseMemberListTsv::fori(${dats})`);
		const name: Name = dats[0];
		const position: Position = Position.fromString(dats[1])!;
		const ward: Ward = dats[2] || null;
		const outp: OutPDays = OutPDays.fromString(dats[3])!;
		const ac: AssignmentAC | undefined = AssignmentAC.fromString(dats[4]);
		const ae: AssignmentE | undefined = AssignmentE.fromString(dats[5]);
		ppl.push(new Person(name, position, ward, outp, ac, ae));
	}
	return ppl;
}

export function parseDepartmentCalendar(
	s: string,
): Array<[Name, PersonalCalendar]> | undefined {
	const lines: Array<string> = s.split(/\r?\n/);
	if (lines.length === 0) {
		console.log("parseDepartmentCalendar::lines empty");
		return undefined;
	}
	const header = lines[0].split("\t");
	// 先頭は name の入る列なので skip
	const dates: Array<Date> = header
		.slice(1)
		.map((d) => parseDate(d, "yyyy-MM-dd", new Date()));
	const cals: Array<[Name, PersonalCalendar]> = [];
	for (const row of lines.slice(1).filter((v) => {
		return v !== "";
	})) {
		if (DEBUG) {
			console.log("parseDepartmentCalendar::", row);
		}
		const dat = row.split("\t");
		if (dat.length !== dates.length + 1) {
			console.log("ERROR on parseDepartmentCalendar");
			return undefined;
		}
		// １つ目の column は name
		const name = dat[0];
		// TODO: undefined のキャッチ
		const duties = dat.slice(1).map((dut) => shortStringToDuty(dut)!);
		if (DEBUG) {
			console.log("duties are:", duties);
		}
		// Array<[Date, Duty]> にしてあげる
		const zipped: Array<[Date, WeekDayDuty | WeekEndDuty]> = dates.map(
			(d, i) => {
				return [d, duties[i]];
			},
		);
		cals.push([name, new PersonalCalendar(zipped)]);
	}
	return cals;
}
