const fs = require("fs");

let characterCount: number = 0;
try {
	const data = fs.readFileSync("out.html", "utf-8");
	characterCount = data.length;
	console.log(characterCount);
} catch (err) {
	console.error("Failed to read out.html:", err);
}
