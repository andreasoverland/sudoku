const fs = require( 'fs' )

let num = BigInt("5312950594540183617568")
let level = 8

const buff = fs.readFileSync( `out/level${level}/${num.toString()}.txt` ).toString( "utf-8" )
//const buff = fs.readFileSync( `digitmaps.txt` ).toString( "utf-8" )
const digitMaps = buff.split( "\n" ).map( n => BigInt( n ) )

// 46656 possible digit position maps

let r = 0
//for (let r = 0; r < 1; r++) {
	let numMatches = 0
	let maps = ""
	for (let n = 0; n < digitMaps.length; n++) {
		if (n === r) continue
		if ((digitMaps[r] & digitMaps[n]) === BigInt( 0 ) && digitMaps[n] !== BigInt(0) ) {
			maps += digitMaps[n].toString() + "\n"
			numMatches++
		}
	}
	fs.writeFileSync(`./out/level${level+1}/${digitMaps[r].toString()}.txt`, Buffer.from( maps ) )
	console.log( digitMaps[r].toString()  )
	console.log( numMatches )
	console.log( `./out/level${level+1}/${digitMaps[r].toString()}.txt` )
//}

// todo: reduce the digit maps by rotating them and excluding duplicates
/*
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
*/

function pad( s ) {
	while (s.length < 81) s = "0" + s;
	return s;
}
