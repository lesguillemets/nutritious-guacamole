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

export namespace AssignmentAC {
	export function fromString(s: string): AssignmentAC | undefined {
		switch (s) {
			case "none":
				return AssignmentAC.None;
			case "biweekly":
				return AssignmentAC.BiWeekly;
			case "regular":
				return AssignmentAC.Regular;
			default:
				return undefined;
		}
	}
}

export namespace AssignmentE {
	export function fromString(s: string): AssignmentE | undefined {
		switch (s) {
			case "none":
				return AssignmentE.None;
			case "once in two cours":
				return AssignmentE.Half;
			case "regular":
				return AssignmentE.Regular;
			default:
				return undefined;
		}
	}
}
