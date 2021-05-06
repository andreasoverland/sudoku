const fs = require( 'fs' )

const buff = fs.readFileSync( "digitmaps.txt" ).toString( "utf-8" )
const digitMaps = buff.split( "\n" )

/*for(let i=0;i<digitMaps.length;i++){
	console.log( pad( BigInt(digitMaps[i]).toString(2) ) )
}
return;
*/

// todo: read that big 1 million file, and check that all configurations of every digit exists in the digitMaps
// result: it is all there.

/*let compares = 0
const boardFile = fs.openSync("./100000.txt","r")
let buffer = Buffer.alloc(81,0)
for( let l=0;l<1000;l++) {
	fs.readSync( boardFile, buffer, 0, 81, 82 * l )
	const line = buffer.toString( "utf-8" ).split( "" ).map( c => parseInt( c ) )
	let digitMapsForBoard = [BigInt( 0 ), BigInt( 0 ), BigInt( 0 ), BigInt( 0 ), BigInt( 0 ), BigInt( 0 ), BigInt( 0 ), BigInt( 0 ), BigInt( 0 )]
	
	line.map( ( digit, index ) => {
		digitMapsForBoard[digit - 1] |= BigInt( 1n ) << BigInt( 80 - index )
	} )
	// console.log( digitMapsForBoard.map( n => pad( n.toString( 2 ) ) ).join( "\n" ) )
	
	// loop through digitMaps to ensure that this digit orientation exists
	const digitMapExists = [0, 0, 0, 0, 0, 0, 0, 0, 0]
	
	for (let i = 0; i < digitMaps.length; i++) {
		for (let d = 0; d < 9; d++) {
			compares++
			if (BigInt( digitMaps[i] ) === digitMapsForBoard[d]) {
				digitMapExists[d]++
			}
		}
	}
	
	if (digitMapExists.join( "" ) !== "111111111") {
		console.log( digitMapExists.join( "," ) )
	}

}

console.log( compares )
return;*/

// 46656 possible digit position maps

let numCombosFound = 0
/*
for( let r=0;r<100;r++) {
	
	const matchingMaps = []
	const matchingIndexes = []
	const firstMap = BigInt( digitMaps[r] )
	matchingIndexes.push(r)
	matchingMaps.push( firstMap )
	
	for (let i = 0; i < digitMaps.length; i++) {
		if( i === r ){
			continue
		}
		const map = BigInt( digitMaps[i] )
		let matches = true
		for (let n = 0; n < matchingMaps.length; n++) {
			matches &= (matchingMaps[n] & map) === BigInt( 0 )
		}
		if (matches) {
			matchingMaps.push( map )
			matchingIndexes.push(i)
			// console.log( pad( map.toString( 2 ) ) )
		}
		
	}
	//console.log( matchingMaps.join(",") )
	if( matchingIndexes.length === 9 ) {
		numCombosFound++
		console.log( matchingIndexes.join( " " ) )
	}
}
*/

// todo: reduce the digit maps by rotating them and excluding duplicates

const uniqueBitmaps = []
let compares = 0

for (let i = 0; i < 1000; i++) {
	const originalDigitMap = BigInt( digitMaps[i] )
	const bitmap = pad( originalDigitMap.toString( 2 ) )
	const rotatedBitmap = BigInt( "0b" + bitmap.split( "" ).reverse().join( "" ) )
	let found = false
	for (let c = i; c < digitMaps.length; c++) {
		const testBigInt = BigInt( digitMaps[c] )
		compares++
		if (testBigInt === rotatedBitmap) {
			found = true
			break;
		}
	}
	if (!found) {
		uniqueBitmaps.push( originalDigitMap )
	}
}
console.log( compares )
console.log( digitMaps.length )
console.log( uniqueBitmaps.length )

function pad( s ) {
	while (s.length < 81) s = "0" + s;
	return s;
}
