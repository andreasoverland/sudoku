
function $$(selector){
	return Array.from( document.querySelectorAll(selector) )
}

function $(id){
	return document.getElementById(id)
}


function pad( s ) {
	while (s.length < 81) s = "0" + s;
	return s;
}

