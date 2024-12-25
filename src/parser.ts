import type { AssignmentAC, AssignmentE, Position, TableLike } from "./base";
import { PersonalCalendar } from "./calendar";
import { Department } from "./department";
import { Duty, WeekDayDuty, WeekEndDuty, dutyToShortString } from "./duty";
import type { OutPDays } from "./outpatient";
import type { Name, Person } from "./person";

/** genMemberListTSV() の双対．型通りのリストを返す．あとは proposed と history があれば Person になる */
function parseMemberListTsv(
	s: string,
): [Name, Position, Ward, OutPDays, AssignmentAC, AssinmentE] {
	return undefined;
}
