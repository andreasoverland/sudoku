const fs = require( 'fs' )
// This tool looks through the collection for maps that match all the given maps

let partialBoardMaps = [
	295147993140283047952n,
	75557863725914323419136n,
	288234774198223104n,
	72057594042122240n,
	4722366482886825082880n,
	1208925819615728687382528n,
	274877923329n,
	73791479963201830912n,
	1152921504875286528n,
]

const buff = fs.readFileSync( `digitmaps.txt` ).toString( "utf-8" )
const digitMaps = buff.split( "\n" ).map( n => BigInt( n ) )

// 46656 possible digit position maps
let matches = []
for (let digit = 0; digit < 9; digit++) {
	matches[digit] = []
	for (let r = 0; r < digitMaps.length; r++) {
		if ((digitMaps[r] & partialBoardMaps[digit]) === partialBoardMaps[digit]) {
			matches[digit].push( digitMaps[r] )
		}
	}
}

//matches = matches.sort( ( a, b ) => a.length - b.length )
console.log( matches.map( ( a, index ) => (index + 1) + ":" + a.length ).join( ", " ) )

let numBoards = 0
let lastNumBoards = matches.reduce( ( acc, curr ) => acc += curr.length, 0 )

console.log("Pruning until no change i num maps")
while (numBoards !== lastNumBoards) {
	numBoards = lastNumBoards
	prune()
	lastNumBoards = matches.reduce( ( acc, curr ) => acc += curr.length, 0 )
}
console.log( "Done pruning. Finding possible matches to fill holes")

// make a missing pieces map, and find possible matches
let count = 0
let l = []

rfor( 0 )

function rfor( level ) {
	if (level < 9) {
		// test heller for hvert level, om num & nextNum === 0, hvis ikke, continue
		for (l[level] = 0; l[level] < matches[level].length; l[level]++) {
			rfor( level + 1 )
		}
	}
	else {
		count++
		let combined = 0n;
		
		for (let lvl = 0; lvl < 9; lvl++) {
			combined |= matches[lvl][l[lvl]]
		}
		
		if (combined === 0b111111111111111111111111111111111111111111111111111111111111111111111111111111111n) {
			console.log( count, l.join( "," ) )
			
			let map = []
			for (let lvl = 0; lvl < 9; lvl++) {
				map[lvl] = matches[lvl][l[lvl]]
			}
			
			printBoard( map )
			
			// l0 = l1 =l2 = l3 = l4 = l5 = l6 = l7 = l8 = 1000
			
		}
		
		if( count % 100000 === 0){
			console.log( count + "\t" + l.join(","))
		}
	}
	
	
}

function prune() {
	let validMaps = [[], [], [], [], [], [], [], [], []]
	
	for (let digit = 0; digit < 9; digit++) {
		
		for (let n = 0; n < matches[digit].length; n++) {
			
			let checkMap = matches[digit][n]
			let okForLevel = [true, true, true, true, true, true, true, true, true]
			
			for (let compareDigit = 0; compareDigit < matches.length; compareDigit++) {
				if (compareDigit === digit) continue
				
				let otherLevelMatches = 0
				
				// loop through all the maps for this compareDigit and add all valid matches to otherLevelMatches
				matches[compareDigit].map( cd => {
					if (BigInt( cd & checkMap ) === 0n) {
						otherLevelMatches++
					}
				} )
				okForLevel[compareDigit] = otherLevelMatches !== 0
			}
			
			let res = okForLevel.reduce( ( acc, curr ) => acc &= curr, true )
			//console.log(digit, n, okForLevel.join(" "), res == 1  )
			if (res) {
				validMaps[digit].push( checkMap )
			}
		}
		
	}
	
	// validMaps = validMaps.sort( ( a, b ) => a.length - b.length )
	console.log( validMaps.map( ( a, index ) => (index + 1) + ":" + a.length ).join( ", " ) )
	
	matches = [...validMaps]
}


function printBoard( maps ) {
	let board = "000000000000000000000000000000000000000000000000000000000000000000000000000000000".split( "" )
	
	for (let i = 0; i < 9; i++) {
		let digitMap = maps[i]
		for (let n = 0; n < 81; n++) {
			let mask = (BigInt( 1 ) << BigInt( 80 - n ))
			if ((digitMap & mask) === mask) {
				board[n] = (i + 1).toString()
			}
		}
	}
	
	console.log( board.join( "" ) )
	
}


function pad( s ) {
	while (s.length < 81) s = "0" + s;
	return s;
}
