const fs = require("fs");

String.prototype.replaceAll = function (search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

console.log( "sudoku-stuff");

const buff = fs.readFileSync("boards.txt").toString("utf-8");

const boards = buff.trim().split("\n");

boards.forEach( b => {
	let str = b;//.split(" ").join("");
	let rep = "ABCDEFGHI";
	for( let i=0;i<9;i++){
		let c = b.charAt(i%3 + Math.floor(i/3)*10).toString();
		str = str.replaceAll( c, rep.charAt(i).toString() );
	}

	console.log( str.replaceAll(" ","\n") + "\n" );
})

