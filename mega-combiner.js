const fs = require( 'fs' )
// This tool looks through the collection for maps that match all the given matches

let partialBoardMaps = [
	1208999606591198890827776n,
	151115727451828646838336n,
	75557863725914390544386n,
	9444737469888690391056n,
	9223372039002259456n,
	2306968909121060864n,
	70368748503040n,
	8796369846272n,
	262144n,
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
matches = matches.sort( ( a, b ) => a.length - b.length )
console.log( matches.map( ( a, index ) => (index + 1) + ":" + a.length ).join( ", " ) )
// gå igjennom hver siffermap fra start, lag en countarray for hvert nivå. hvis tallet gir en count på 0, så er det mismatch
//
function prune() {
	for (let digit = 0; digit < 8; digit++) {
		for (let n = 0; n < matches[digit].length; n++) {
			for (let compareDigit = digit + 1; compareDigit < 9; compareDigit++) {
				let goodMatchesForLevel = []
				for (let cn = 0; cn < matches[compareDigit].length; cn++) {
					if (BigInt( matches[compareDigit][cn] & matches[digit][n] ) === 0n) {
						goodMatchesForLevel.push( matches[compareDigit][cn] )
					}
				}
				if (goodMatchesForLevel.length > 0) {
					matches[compareDigit] = [...goodMatchesForLevel]
				}
			}
		}
	}
}


function pad( s ) {
	while (s.length < 81) s = "0" + s;
	return s;
}
