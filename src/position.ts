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

	export function fromString(s: string): Position | undefined {
		switch (s) {
			case "副部長":
				return Position.DepMan;
			case "主任":
				return Position.Chief;
			case "常勤":
				return Position.FullTime;
			case "有期雇用":
				return Position.FixedTerm;
			case "非常勤":
				return Position.PartTime;
			default:
				return undefined;
		}
	}
}
