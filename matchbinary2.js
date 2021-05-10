String.prototype.replaceAll = function ( search, replacement ) {
	let target = this;
	return target.replace( new RegExp( search, 'g' ), replacement );
};

// ****************************************************************
// ** setup *********
// ****************************************************************

// 9*6*3 *6*4*2 *3*2*1
// 46656 unique one digit maps
// how many legal combinations exist?

// medium
//let originalBoard =   "789534261216789453354162879162847395897351624543926187475218936638495712921673548"
// let originalBoard = "987641532362795184154283976835126749271934658496857321749318265618572493523469817".split("").map( n => parseInt(n))
let originalBoard = "326795418978641253145283697469857132853126974217934865532469781681572349794318526".split("").map( n => parseInt(n))
let targetBoard =   "284673195573891462619542873938156247756284319421739658892467531167325984345918726".split("").map( n => parseInt(n))

/*** engine **/

let boardDigitMaps = []
let targetBoardDigitMaps = []
let maximumMapMatches = 0
let numShuffles = 0
let keepShuffling = true
let numSuperShuffles = 0
let board = [...originalBoard]

makeTargetDigitMaps()
makeAndCompareDigitMaps()


function drawTarget() {
	let toPrint = ""
	for (let i = 0; i < 81; i++) {
		let digit = findDigitAt( targetBoardDigitMaps, i )
		toPrint += digit.toString()
	}
	console.log( "Target  :", toPrint )
}

function drawArranged() {
	let toPrint = ""
	for (let i = 0; i < 81; i++) {
		let digit = findDigitAt( boardDigitMaps, i )
		toPrint += digit.toString()
	}
	console.log( "Arranged:", toPrint )
}

function findDigitAt( boardMaps, i ) {
	let mask = BigInt( 1 ) << BigInt( 80 - i )
	for (let d = 0; d < 9; d++) {
		if ((boardMaps[d] & mask) === mask) {
			return (d + 1)
		}
	}
	return 0
}

//********************************* rearranging *************************/

function switchVerticalGroups( g1, g2 ) {
	let result = [...board]
	for (let x = 0; x < 3; x++) {
		for (let y = 0; y < 9; y++) {
			result[g1 * 3 + x + y * 9] = board[g2 * 3 + x + y * 9];
			result[g2 * 3 + x + y * 9] = board[g1 * 3 + x + y * 9];
		}
	}
	board = [...result]
}

function switchHorizontalGroups( g1, g2 ) {
	let result = [...board]
	for (let y = 0; y < 3; y++) {
		for (let x = 0; x < 9; x++) {
			result[g1 * 27 + x + y * 9] = board[g2 * 27 + x + y * 9];
			result[g2 * 27 + x + y * 9] = board[g1 * 27 + x + y * 9];
		}
	}
	
	board = [...result]
}

function rotateRight() {
	let result = [...board]
	
	for (let y = 0; y < 9; y++) {
		for (let x = 0; x < 9; x++) {
			result[8 - y + x * 9] = board[x + y * 9];
		}
	}
	board = [...result]
}

function mirrorHorizontally() {
	let result = [...board]
	for (let y = 0; y < 9; y++) {
		for (let x = 0; x < 9; x++) {
			result[8 - x + y * 9] = board[x + y * 9];
		}
	}
	board = [...result]
}

function mirrorVertically() {
	let result = [...board]
	for (let y = 0; y < 9; y++) {
		for (let x = 0; x < 9; x++) {
			result[x + 8 * 9 - y * 9] = board[x + y * 9];
		}
	}
	board = [...result]
}

function flipOverTopRightBottomLeftDiagonal() {
	mirrorHorizontally();
	flipOverTopLeftBottomRightDiagonal();
	mirrorHorizontally();
}

function flipOverTopLeftBottomRightDiagonal() {
	let result = [...board]
	for (let y = 0; y < 9; y++) {
		for (let x = 0; x < 9; x++) {
			result[x * 9 + y] = board[x + y * 9];
		}
	}
	board = [...result]
}

function switchRows( r1, r2 ) {
	
	let result = [...board]
	
	for (let x = 0; x < 9; x++) {
		result[x + r1 * 9] = board[x + r2 * 9];
		result[x + r2 * 9] = board[x + r1 * 9];
	}
	board = [...result]
}

function switchCols( c1, c2 ) {
	let result = [...board]
	
	for (let y = 0; y < 9; y++) {
		result[c1 + y * 9] = board[c2 + y * 9];
		result[c2 + y * 9] = board[c1 + y * 9];
	}
	board = [...result]
}


function redraw() {
	drawArranged();
	drawTarget();
}

let functions = [
	() => {switchCols( 0, 1 )},
	() => {switchCols( 0, 2 )},
	() => {switchCols( 1, 2 )},
	() => {switchCols( 3, 4 )},
	() => {switchCols( 3, 5 )},
	() => {switchCols( 4, 5 )},
	() => {switchCols( 6, 7 )},
	() => {switchCols( 6, 8 )},
	() => {switchCols( 7, 8 )},
	() => {switchRows( 0, 1 )},
	() => {switchRows( 0, 2 )},
	() => {switchRows( 1, 2 )},
	() => {switchRows( 3, 4 )},
	() => {switchRows( 3, 5 )},
	() => {switchRows( 4, 5 )},
	() => {switchRows( 6, 7 )},
	() => {switchRows( 6, 8 )},
	() => {switchRows( 7, 8 )},
	() => {switchVerticalGroups( 0, 1 )},
	() => {switchVerticalGroups( 0, 2 )},
	() => {switchVerticalGroups( 1, 2 )},
	() => {switchHorizontalGroups( 0, 1 )},
	() => {switchHorizontalGroups( 0, 2 )},
	() => {switchHorizontalGroups( 1, 2 )},
	() => {rotateRight()},
	() => {mirrorHorizontally()},
	() => {mirrorVertically()},
];

function makeTargetDigitMaps() {
	targetBoardDigitMaps = [0n, 0n, 0n, 0n, 0n, 0n, 0n, 0n, 0n]
	for (let i = 0; i < 81; i++) {
		targetBoardDigitMaps[targetBoard[i] - 1] |= BigInt( 1 ) << BigInt( 80 - i )
	}
	targetBoardDigitMaps = targetBoardDigitMaps.sort( ( a, b ) => {
		return b > a ? 1 : b === a ? 0 : -1
	} )
}
const NUM_COMBOS = 134217728

function makeAndCompareDigitMaps() {
	boardDigitMaps = [0n, 0n, 0n, 0n, 0n, 0n, 0n, 0n, 0n]
	
	for (let i = 0; i < 81; i++) {
		boardDigitMaps[ board[i] - 1] |= BigInt( 1 ) << BigInt( 80 - i )
	}
	
	boardDigitMaps = boardDigitMaps.sort( ( a, b ) => {
		return b > a ? 1 : b === a ? 0 : -1
	} )

	let numMatches = 0
	for (let i = 0; i < 9; i++) {
		if (boardDigitMaps[i] === targetBoardDigitMaps[i]) {
			numMatches++
		}
	}
	if (numMatches > maximumMapMatches) {
		maximumMapMatches = numMatches
		redraw()
		console.log( "Num shuffles : " + numShuffles + " " + numSuperShuffles + " Max num map matches " + maximumMapMatches )
		for (let i = 0; i < 9; i++) {
			if (boardDigitMaps[i] === targetBoardDigitMaps[i]) {
				console.log( "Match", pad( boardDigitMaps[i].toString(2) ) )
			}
		}
		console.log( "Shuffle Map", numShuffles.toString(2) )
	}
	
}

function displayDigitMaps() {
	makeAndCompareDigitMaps()
}

displayDigitMaps()

function shuffle() {
	let superSufflesDiff = 0
	while ((numShuffles < NUM_COMBOS) && keepShuffling) {
		
		for (let i = 0; i < functions.length; i++) {
			if ((numShuffles & (1 << i)) === (1 << i)) {
				numSuperShuffles++
				functions[i]()
			}
		}
		
		makeAndCompareDigitMaps()
		
		if (numShuffles % 10000 === 0) {
			superSufflesDiff = numSuperShuffles-superSufflesDiff
			console.log( pad( numShuffles.toString(2), 30 ) + " Num shuffles : " + numShuffles + " " + ((numShuffles / NUM_COMBOS) * 100).toFixed( 3 ) + " " + superSufflesDiff + " " + numSuperShuffles + " Max num map matches " + maximumMapMatches )
			superSufflesDiff = numSuperShuffles
		}
		numShuffles++
		
		if( maximumMapMatches >= 5 ){
			keepShuffling = false
		}
		
	/*	if( numShuffles > 1000000 ){
			keepShuffling = false
		} */
		board = [...originalBoard]
		
	}
}




function pad( s , length = 81) {
	while (s.length < length) s = "0" + s;
	return s;
}

shuffle()