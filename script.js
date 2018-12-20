function runFormula(cellVal) {
	var origVal = cellVal.value; 
	var cVal = origVal.toUpperCase();
	var incFormula = cVal.indexOf("=");
	if (incFormula >= 0) {
		//Loops below take the table and feed it into an Array
		var myTable = document.getElementById('sheet');
		var current, cell;
		var tblArray = [];
		//This loop goers through each row
		for (var i=1; (current = myTable.rows[i]); i++) {
			//create new array within tblArray
			tblArray[i] = [];
			//this loop goes through each cell in current row
			for (var j = 1; (cell = current.cells[j]); j++) {
				elmName = "input" + i + j;
				var valToEnter = document.getElementById(elmName).value;
				 if (valToEnter > 0) {
					 tblArray[i][j] = valToEnter;
				 } else {
					 tblArray[i][j] = 0;
				 }
			}
		}
		console.log(tblArray);
		//Loop below checks the string that was just changed and replaces any A1 notation
		//With the value from the cell the notation points to
		var newFormula = "";
		for (var c = 1; c < cVal.length; c++) {
			//console.log("cVal[c] is: "+ cVal[c] +" and c is: " + c);
			var chrCode = cVal.charCodeAt(c);
			if (chrCode >= 65 && chrCode <= 90) {
				var col = cVal.charCodeAt(c) - 64;
				var row = cVal.charAt(c+1);
				//console.log("col is: " + col + " row is: " + row);
				newFormula += tblArray[row][col];
				c+=1;
			} else {
				newFormula +=cVal[c];
			}
		}
		//document.getElementById('myTable').innerHTML
		console.log(eval(newFormula));
		var inputNum = cellVal.id;
		console.log("inputNum is: " + inputNum);
		document.getElementById(inputNum).value = eval(newFormula);
	} else {
		//console.log("not a formula")
	}
	//alert("content " + cellVal.value);
}

function sheetBuilder(){
	
	var myTable = '<table id = "sheet">';
	
	for (i=0; i<7; i++) {
		myTable += '<tr>';
	 	for (j=0; j<7; j++){
			if (i == 0 & j==0) {
				myTable += '<th></th>';
			} else if (i == 0 & j > 0) {
				var chr = String.fromCharCode(65+j-1);
				myTable +='<th>' + chr + '</th>';
			} else if (i > 0 & j == 0) {
				myTable += '<th id="tdcol1">' + i + '</th>';
			} else if (i> 0 & j > 0) {
				myTable+= '<td><input id="input' + i + j+ '" type="text" onchange="runFormula(this)"></td>';
			}
		}
		myTable += '</tr>';
	}
	//console.log(myTable);
	document.getElementById('myTable').innerHTML = myTable;
	
}