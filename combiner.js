const fs = require('fs')

const buff = fs.readFileSync("digitmaps.txt").toString("utf-8")
const digitMaps = buff.split("\n")

for( let r=0;r<10000;r++) {
	const matchingMaps = []
	const matchingIndexes = []
	const firstMap = BigInt( digitMaps[r] )
	matchingIndexes.push(r)
	matchingMaps.push( firstMap )
	
	//console.log( pad( firstMap.toString( 2 ) ) )
	
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
		console.log( matchingIndexes.join( "," ) )
	}
}

function pad( s ){
	while( s.length < 81 ) s = "0" + s;
	return s;
}