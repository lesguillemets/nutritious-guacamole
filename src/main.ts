import { Position } from "./base";
import { Person } from "./person";

function init() {
	const a = new Person("John Yudkin", Position.Chief);
	console.log("INIT");
	console.log(a);
}

window.addEventListener("load", init);
