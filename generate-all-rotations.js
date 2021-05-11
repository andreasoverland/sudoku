
// ****************************************************************
// ** setup *********
// ****************************************************************

// 9*6*3 *6*4*2 *3*2*1
// 46656 unique one digit maps
// how many legal combinations exist?


let originalBoard = "159824673426753891837169542948617325513982467762435918391576284685241739274398156".split("").map(n => parseInt(n) )

/*** engine **/

let boardDigitMaps = []
let numShuffles = 0
let board = [...originalBoard]
let allRotatedDigitMaps = new Set()

makeDigitMaps()
console.log( "Generating all possible maps shuffling")
shuffle2(0,0)
console.log( "Num shuffles : " + numShuffles + " " + allRotatedDigitMaps.size )


// functions
function makeDigitMaps() {
	boardDigitMaps = [0n, 0n, 0n, 0n, 0n, 0n, 0n, 0n, 0n]
	for (let i = 0; i < 81; i++) {
		if( board[i] !== 0){
			boardDigitMaps[ board[i] - 1] |= BigInt( 1 ) << BigInt( 80 - i )
		}
	}
}

//********************************* rearranging *************************/


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

function shuffle2(level, num ){
	
	let functions = [
		
		() => {switchCols( 0, 1 )}, // 1
		() => {switchCols( 0, 2 )}, // 2
		() => {switchCols( 1, 2 )}, // 3
		
		() => {switchCols( 3, 4 )}, // 4
		() => {switchCols( 3, 5 )}, // 5
		() => {switchCols( 4, 5 )}, // 6
		
		() => {switchCols( 6, 7 )}, // 7
		() => {switchCols( 6, 8 )}, // 8
		() => {switchCols( 7, 8 )}, // 9
		
		() => {switchRows( 0, 1 )}, // 10
		() => {switchRows( 0, 2 )}, // 11
		() => {switchRows( 1, 2 )}, // 12
		
		() => {switchRows( 3, 4 )}, // 13
		() => {switchRows( 3, 5 )}, // 14
		() => {switchRows( 4, 5 )}, // 15
		
		() => {switchRows( 6, 7 )}, // 16
		() => {switchRows( 6, 8 )}, // 17
		() => {switchRows( 7, 8 )}, // 18
	
	];

	if( level < 6 ){
		for( let n = 0;n<6;n++) {
			shuffle2( level+1,num|n<<level*3)
			if( allRotatedDigitMaps.size === 46656 ){
				return;
			}
		}
	}
	else {
		board = [...originalBoard]
		for (let i = 0; i < functions.length; i++) {
			if ((num & (1 << i)) === (1 << i)) {
				functions[i]()
			}
		}
		makeDigitMaps()
		// boardDigitMaps.map( n => allRotatedDigitMaps.add( n ) )
		boardDigitMaps.map( m => allRotatedDigitMaps.add( m ) )
		// allRotatedDigitMaps.add( boardDigitMaps[0] )
		numShuffles++
	}
}