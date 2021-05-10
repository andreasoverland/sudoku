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

let boards = [
	"159824673426753891837169542948617325513982467762435918391576284685241739274398156",
	"497526318186349572235781469541697283879253641623418795358974126964132857712865934",
	"918573426425619837736284159842756391397421685561938274674892513253167948189345762",
	"326795418978641253145283697469857132853126974217934865532469781681572349794318526",
	"284673195573891462619542873938156247756284319421739658892467531167325984345918726",
]

// first we test one map, to see if all rotations are generated
let originalBoard = boards[0].split("").map(n => parseInt(n) )

/*** engine **/

let boardDigitMaps = []
let maximumMapMatches = 0
let numShuffles = 0
let keepShuffling = true
let numSuperShuffles = 0
let board = [...originalBoard]

let allRotatedDigitMaps = new Set()

function findDigitAt( boardMaps, i ) {
	let mask = BigInt( 1 ) << BigInt( 80 - i )
	for (let d = 0; d < 9; d++) {
		if ((boardMaps[d] & mask) === mask) {
			return (d + 1)
		}
	}
	return 0
}


function makeDigitMaps() {
	boardDigitMaps = [0n, 0n, 0n, 0n, 0n, 0n, 0n, 0n, 0n]
	
	for (let i = 0; i < 81; i++) {
		if( board[i] !== 0){
			boardDigitMaps[ board[i] - 1] |= BigInt( 1 ) << BigInt( 80 - i )
		}
	}
	
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

function rotateLeft() {
	rotateRight();
	rotateRight();
	rotateRight();
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


let functions = [
	() => {switchCols( 0, 1 )}, // 1
	() => {switchCols( 0, 2 )}, // 2
    () => {switchCols( 1, 2 )}, // 3
	() => {switchCols( 3, 4 )}, // 4
	() => {switchCols( 3, 5 )}, // 5
	() => {switchCols( 4, 5 )}, // 6
	() => {switchCols( 6, 7 )}, // 8
	() => {switchCols( 6, 8 )}, // 9
	() => {switchCols( 7, 8 )}, // 10
	() => {switchRows( 0, 1 )}, // 11
	() => {switchRows( 0, 2 )}, // 12
	() => {switchRows( 1, 2 )}, // 13
	() => {switchRows( 3, 4 )}, // 14
	() => {switchRows( 3, 5 )}, // 15
	() => {switchRows( 4, 5 )}, // 16
	() => {switchRows( 6, 7 )}, // 17
	() => {switchRows( 6, 8 )}, // 18
	() => {switchRows( 7, 8 )}, // 19
//	() => {switchVerticalGroups( 0, 1 )}, // 20
//	() => {switchVerticalGroups( 0, 2 )}, // 21
//	() => {switchVerticalGroups( 1, 2 )}, // 22
//	() => {switchHorizontalGroups( 0, 1 )}, // 23
//	() => {switchHorizontalGroups( 0, 2 )}, // 24
//	() => {switchHorizontalGroups( 1, 2 )}, // 25
//	() => {rotateRight()}, // 26
//	() => {rotateLeft()}, // 28
//	() => {mirrorHorizontally()}, // 29
//	() => {mirrorVertically()}, // 30
//	() => {flipOverTopLeftBottomRightDiagonal()}, // 31
//	() => {flipOverTopLeftBottomRightDiagonal()}, // 32
];

const NUM_COMBOS = Math.pow( 2, functions.length )
console.log( "Num Rotation Combos: ", NUM_COMBOS )

function shuffle() {
	
	let superSufflesDiff = 0
	
	while ((numShuffles < NUM_COMBOS) && keepShuffling) {
		
		//for( let b=0;b<boards.length;b++) {
		let b = 0;
		board = boards[b].split( "" ).map( n => parseInt( n ) )
		
		for (let i = 0; i < functions.length; i++) {
			if ((numShuffles & (1 << i)) === (1 << i)) {
				numSuperShuffles++
				functions[i]()
			}
		}
		makeDigitMaps()
		// boardDigitMaps.map( n => allRotatedDigitMaps.add( n ) )
		allRotatedDigitMaps.add( boardDigitMaps[0] )
		
		 //}
		
		numShuffles++
		
		if (numShuffles % 1000 === 0 ) {
			console.log( "shuffle map", pad( numShuffles.toString( 2 ), functions.length + 1 ) )
			superSufflesDiff = allRotatedDigitMaps.size - superSufflesDiff
			console.log( pad( numShuffles.toString( 2 ), 30 ) + " Num shuffles : " + numShuffles + " " + ((numShuffles / NUM_COMBOS) * 100).toFixed( 3 ) + " " + allRotatedDigitMaps.size + " diff:" + superSufflesDiff )
			superSufflesDiff = allRotatedDigitMaps.size
		}
		
		keepShuffling = allRotatedDigitMaps.size < 46656
		
		
		board = [...originalBoard]
		
	}
	
	console.log( "shuffle map", pad( numShuffles.toString(2), functions.length+1) )
	superSufflesDiff = allRotatedDigitMaps.size-superSufflesDiff
	console.log( pad( numShuffles.toString(2), 30 ) + " Num shuffles : " + numShuffles + " " + ((numShuffles / NUM_COMBOS) * 100).toFixed( 3 ) + " " + allRotatedDigitMaps.size + " diff:" + superSufflesDiff )
}


function pad( s , length = 81) {
	while (s.length < length) s = "0" + s;
	return s;
}

makeDigitMaps()
shuffle()
