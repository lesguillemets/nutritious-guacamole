import { hi } from "./person.js"; // needs to be js

function init() {
	hi();
	console.log("INIT");
}

window.addEventListener("load", init);
