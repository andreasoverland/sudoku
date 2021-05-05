const fs = require("fs");

String.prototype.replaceAll = function (search, replacement) {
	var target = this;
	return target.replace(new RegExp(search, 'g'), replacement);
};

let functions = [];

initFunctions();

//let board = "381 625 974  496 187 352  527 943 861  238 796 415  614 352 798  759 814 236  943 568 127  162 479 583  875 231 649".split(" ").join("");
let board = "987641523362795148154283967618572439523469871749318256496857312271934685835126794";
console.log(board);
runRandomRearrangement();

function runRandomRearrangement() {
	for (let i = 0; i < 10000000; i++) {
		const functionNum = Math.floor(Math.random() * functions.length);
		functions[functionNum]();
		console.log(board);
	}
}

// 
// Teori : ett brett kan shuffles til             3.359.232 unike, gyldige brett
// Resultat : 100.000.000 shuflings gir til slutt 3.359.232 unike, gyldige brett

function switchVerticalGroups(g1, g2) {
	let orig = board.split("");
	let result = board.split("");
	for (let x = 0; x < 3; x++) {
		for (let y = 0; y < 9; y++) {
			result[g1 * 3 + x + y * 9] = orig[g2 * 3 + x + y * 9];
			result[g2 * 3 + x + y * 9] = orig[g1 * 3 + x + y * 9];
		}
	}
	board = result.join("");
}

function switchHorizontalGroups(g1, g2) {
	let orig = board.split("");
	let result = board.split("");
	for (let y = 0; y < 3; y++) {
		for (let x = 0; x < 9; x++) {
			result[g1 * 27 + x + y * 9] = orig[g2 * 27 + x + y * 9];
			result[g2 * 27 + x + y * 9] = orig[g1 * 27 + x + y * 9];
		}
	}

	board = result.join("");
}

function rotateRight() {
	let orig = board.split("");
	let result = board.split("");

	for (let y = 0; y < 9; y++) {
		for (let x = 0; x < 9; x++) {
			result[8 - y + x * 9] = orig[x + y * 9];
		}
	}
	board = result.join("");
}

function mirrorHorizontally() {
	let orig = board.split("");
	let result = board.split("");
	for (let y = 0; y < 9; y++) {
		for (let x = 0; x < 9; x++) {
			result[8 - x + y * 9] = orig[x + y * 9];
		}
	}
	board = result.join("");

}

function mirrorVertically() {
	let orig = board.split("");
	let result = board.split("");
	for (let y = 0; y < 9; y++) {
		for (let x = 0; x < 9; x++) {
			result[x + 8 * 9 - y * 9] = orig[x + y * 9];
		}
	}
	board = result.join("");

}


function flipOverTopRightBottomLeftDiagonal() {
	mirrorHorizontally();
	flipOverTopLeftBottomRightDiagonal();
	mirrorHorizontally();
}

function flipOverTopLeftBottomRightDiagonal() {
	let orig = board.split("");
	let result = board.split("");
	for (let y = 0; y < 9; y++) {
		for (let x = 0; x < 9; x++) {
			result[x * 9 + y] = orig[x + y * 9];
		}
	}
	board = result.join("");
}

function switchRows(r1, r2) {

	let orig = board.split("");
	let result = board.split("");

	for (let x = 0; x < 9; x++) {
		result[x + r1 * 9] = orig[x + r2 * 9];
		result[x + r2 * 9] = orig[x + r1 * 9];
	}

	board = result.join("");
}

function switchCols(c1, c2) {

	let orig = board.split("");
	let result = board.split("");

	for (let y = 0; y < 9; y++) {
		result[c1 + y * 9] = orig[c2 + y * 9];
		result[c2 + y * 9] = orig[c1 + y * 9];
	}

	board = result.join("");
}


function initFunctions() {
	functions = [
		() => { switchVerticalGroups(0, 1) },
		() => { switchVerticalGroups(0, 2) },
		() => { switchVerticalGroups(1, 2) },
		() => { switchHorizontalGroups(0, 1) },
		() => { switchHorizontalGroups(0, 2) },
		() => { switchHorizontalGroups(1, 2) },
		() => { rotateRight() },
		() => { switchCols(0, 1) },
		() => { switchCols(0, 2) },
		() => { switchCols(1, 2) },
		() => { switchCols(3, 4) },
		() => { switchCols(3, 5) },
		() => { switchCols(4, 5) },
		() => { switchCols(6, 7) },
		() => { switchCols(6, 8) },
		() => { switchCols(7, 8) },
		() => { switchRows(0, 1) },
		() => { switchRows(0, 2) },
		() => { switchRows(1, 2) },
		() => { switchRows(3, 4) },
		() => { switchRows(3, 5) },
		() => { switchRows(4, 5) },
		() => { switchRows(6, 7) },
		() => { switchRows(6, 8) },
		() => { switchRows(7, 8) },
	];
}
