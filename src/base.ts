// XXX: 結構例外が多くてこれだけでは何を降っていいのか決まらない XXX
export enum Position {
	DepMan = "副部長",
	Chief = "主任",
	FullTime = "常勤",
	FixedTerm = "有期雇用",
	PartTime = "非常勤",
}

export namespace Position {
	export function toInt(p: Position): number {
		switch (p) {
			case Position.DepMan:
				return 0;
			case Position.Chief:
				return 1;
			case Position.FullTime:
				return 2;
			case Position.FixedTerm:
				return 3;
			case Position.PartTime:
				return 3;
			default:
				return Number.NaN;
		}
	}

	export function fromInt(n: number): Position | undefined {
		switch (n) {
			case 0:
				return Position.DepMan;
			case 1:
				return Position.Chief;
			case 2:
				return Position.FullTime;
			case 3:
				return Position.FixedTerm;
			case 4:
				return Position.PartTime;
			default:
				return undefined;
		}
	}
}

/** Sun(0) - start, conforming to Date.prototype.getDay() */
export enum DayofWeek {
	Sun = 0,
	Mon = 1,
	Tue = 2,
	Wed = 3,
	Thu = 4,
	Fri = 5,
	Sat = 6,
}

// A/C を割り当てられる頻度
export enum AssignmentAC {
	None = "none",
	BiWeekly = "biweekly",
	Regular = "regular",
}

export function posToAssignmentAC(pos: Position): AssignmentAC {
	if (pos === Position.Chief) {
		return AssignmentAC.BiWeekly;
	}
	if (pos === Position.FullTime) {
		return AssignmentAC.Regular;
	}
	return AssignmentAC.None;
}

// E を割り当てられる頻度
export enum AssignmentE {
	None = "none",
	Half = "once in two cours",
	Regular = "regular",
}

export function posToAssignmentE(pos: Position): AssignmentE {
	if (pos === Position.Chief) {
		return AssignmentE.Half;
	}
	if (pos === Position.FullTime || pos === Position.FixedTerm) {
		return AssignmentE.Regular;
	}
	return AssignmentE.None;
}

export function dateToTimeStampString(ts: Date): string {
	const yyyy = ts.getFullYear();
	const mm = (ts.getMonth() + 1).toString().padStart(2, "0");
	const dd = ts.getDate().toString().padStart(2, "0");
	const hh = ts.getHours().toString().padStart(2, "0");
	const MM = ts.getMinutes().toString().padStart(2, "0");
	const ss = ts.getSeconds();
	return `${yyyy}${mm}${dd}-${hh}${MM}${ss}`;
}
