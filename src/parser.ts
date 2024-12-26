import {
	type AssignmentAC,
	type AssignmentE,
	type Name,
	Position,
	TableLike,
	type Ward,
} from "./base";
import { PersonalCalendar } from "./calendar";
import { Department } from "./department";
import { type Duty, WeekDayDuty, WeekEndDuty, dutyToShortString } from "./duty";
import { OutPDays } from "./outpatient";
import type { Person } from "./person";

/** genMemberListTSV() の双対．型通りのリストを返す．あとは proposed と history があれば Person になる
 * @param s: TSV 形式，ヘッダ含む*/
function parseMemberListTsv(
	s: string,
): [Name, Position, Ward, OutPDays, AssignmentAC, AssignmentE] | undefined {
	const lines: Array<string> = s.split("\n");
	// i=0 は header なので飛ばす
	for (let i = 1; i < lines.length; i++) {
		const dats: Array<string> = lines[i].split("\t");
		const name: Name = dats[0];
		const position: Position = Position.fromString(dats[1])!;
		const ward: Ward = dats[2] || null;
		const outp: OutPDays = OutPDays.fromString(dats[3])!;
	}
	return undefined;
}
