import { Position } from "./position";

/** A/C を割り当てられる頻度 */
export enum AssignmentAC {
	None = "none",
	BiWeekly = "biweekly",
	Regular = "regular",
}

/** E を割り当てられる頻度 */
export enum AssignmentE {
	None = "none",
	Half = "once in two cours",
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

export function posToAssignmentE(pos: Position): AssignmentE {
	if (pos === Position.Chief) {
		return AssignmentE.Half;
	}
	if (pos === Position.FullTime || pos === Position.FixedTerm) {
		return AssignmentE.Regular;
	}
	return AssignmentE.None;
}
