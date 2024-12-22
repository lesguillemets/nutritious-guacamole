import { hi } from "./person"; // needs to be js

function init() {
	hi();
	console.log("INIT");
}

window.addEventListener("load", init);
