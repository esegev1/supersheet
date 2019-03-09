/*~~~~~~~~FUNCTIONS HERE CONTROL THE INTERACTION OF USERS WITH CELLS, BY MOUSE AND KEYBOARD~~~~~~*/

/*
Three modes exist: sheet viewed with no focus on any cell, focs on specific cell, edit mode

/**********************************************************************************
*             Global variables
*             - These exist to track different interaction modes
*                1. Focsing on a cell
*                2. Editing a cell
*                3. Editing formula bar
************************************************************************************/
/*
var editMode = false;
var prevCell;
var isIterating = false;
var colIndex = colIndex();
console.log(`colIndex is ${colIndex}`);
*/
//function below fills in the global colIndex array, this array is then used as a way to navigate between cells via arrow keys
function colIndex(){
	console.log(`colIndex script triggered`);
	var height = document.documentElement.clientHeight;
	var width = document.documentElement.clientWidth;
	var cols = Math.round(width/80) + 4;
	var rows = Math.round(height/25) + 10;
	var colArray = [];
	for (i=0; i<=cols; i++){
		colArray[i]= String.fromCharCode(64+i);
	}
	console.log(`colArray is ${colArray}`);
	return colArray;
}

//This function keeps the formula bar with the latest text in the input boc
function fbarRefresh (elem) {
	console.log(`elem.value is ${elem.alt}`)
	var formulaBar = document.getElementById("formulaInput");
	formulaBar.value = elem.alt;
	
}


/**********************************************************************************
*             Focus and Blur
*             -
*
*
************************************************************************************/

function onFocusHandler(elem){
	console.log(`onFocusHandler ${elem.alt}, prevCell ${prevCell} editMode ${editMode} and isIterating ${isIterating}`);
	//editMode = true;
	
	fbarRefresh(elem);
	
	if (prevCell && editMode == true && isIterating == false) {
		//console.log(`before focus ${prevCell.id} and elem.id is ${elem.id}`);
		isIterating = true;
		//var text = document.createTextNode(elem.id);
		//prevCell.appendChild(text);
		
		var addText = prevCell.value+elem.id;
		var valText = addText.replace("@","");
		//console.log(`addText ${addText}`);
		prevCell.value = valText;
		//console.log(`prevCell.value after setATTR ${prevCell.value}`);
		var content = prevCell.innerHTML;
		prevCell.innerHTML = content;
		//console.log(`prevCell.value ${prevCell.value}`);
		prevCell.focus();
		isIterating = false;
		//console.log('after focus ' + prevCell.id);
		
	} //else  {
		//This makes it so that when you click into a cell, if there is a formula there, it becomes visible
		//document.getElementById(elem.id).value = elem.alt;
		//}
	
}

function onBlurHandler(elem){
	console.log('onBlurHandler ' + elem.id);
	
}

/**********************************************************************************
*             Keyboard inputs and navigation (arrows)
*             -
*
*
************************************************************************************/



function onInputHandler(elem){
	console.log(`onInputHandler ${elem.id}, elem.value is ${elem.value}`);
	var elemVal = elem.value;
	
	//Calls the function that uopdates the formula bar value
	elem.setAttribute("alt", elem.value);
	fbarRefresh(elem);
	
	if (elemVal == "=" && elemVal.length == 1){
		editMode = true;
		prevCell = elem;
	}
	

}
/*
function onChangeHandler(elem){
	console.log(`onChangeHandler  ${elem.id}, so the editMode is ${editMode}`);
	if (event.keyCode == 13){
		editMode = false;
		evalFormula(elem);
	}
}*/
function onKeydownHandler(event){
	console.log(`onKeydownHandler the event code is ${event.keyCode} so the editMode is ${editMode}`);
	var target = event.target;
	var inputCell = target.id;
	console.log(`inputCell is ${inputCell}`)
	//The code below reacts to the enter key being pressed and puts the cursor one cell below the current cell
	//It also kicks off the evalFormula function before it changes the focus of the cell
	var keyCode = event.keyCode;
	
	if (keyCode == 13){
		var finalValue = evalCell(inputCell);	
		document.getElementById(inputCell).value = finalValue;
		editMode = false;
		
		//console.log(`inputCell row is ${inputCell.substr(inputCell.indexOf("@")+1,inputCell.length)}`)
		var newRow = parseInt(inputCell.substr(inputCell.indexOf("@")+1,inputCell.length))+1
		var newCell = inputCell.substr(0,inputCell.indexOf("@")) + "@" + newRow;
		//console.log(`inputCell is ${inputCell}, newRow is ${newRow} and so newCell is ${newCell}`);
		document.getElementById(newCell).focus();
	} else if (keyCode == 37) {
		//What to do when a left arrow is recorded
		var currCol = inputCell.substring(0,inputCell.indexOf("@"));
		console.log(`currCol is ${currCol} and colIndex.indexOf(currCol) is ${colIndex.indexOf(currCol)}`);
		var newCol = colIndex[colIndex.indexOf(currCol)-1];
		var currRow = inputCell.substring(inputCell.indexOf("@")+1,inputCell.length);
		var newCell = newCol + "@" + currRow;
		console.log(`Detected left arrow, going to cell ${newCell}`);
		//Below checks if user moving left beyond col A and stops it
		if (colIndex.indexOf(currCol)-1 == 0) {
			console.log("left arrow");
			document.getElementById(inputCell).focus();
		} else {
			document.getElementById(newCell).focus();
		}
	} else if (keyCode == 38) {
		//What to do when an up arrow is recorded
		var newRow = parseInt(inputCell.substr(inputCell.indexOf("@")+1,inputCell.length))-1;
		var newCell = inputCell.substr(0,inputCell.indexOf("@")) + "@" + newRow;
		//console.log(`inputCell is ${inputCell}, newRow is ${newRow} and so newCell is ${newCell}`);
		//Below checks if user moving up beyond row 1 and stops it
		if (newRow == 0) {
			document.getElementById(inputCell).focus();
		} else {
			document.getElementById(newCell).focus();
		}
	} else if (keyCode == 39) {
		//What to do when a right arrow is recorded
		var currCol = inputCell.substring(0,inputCell.indexOf("@"));
		console.log(`currCol is ${currCol} and colIndex.indexOf(currCol) is ${colIndex.indexOf(currCol)}`);
		var newCol = colIndex[colIndex.indexOf(currCol)+1];
		var currRow = inputCell.substring(inputCell.indexOf("@")+1,inputCell.length);
		var newCell = newCol + "@" + currRow;
		console.log(`Detected left arrow, going to cell ${newCell}`);
		document.getElementById(newCell).focus();
		
	} else if (keyCode == 40) {
		//What to do when a down arrow is recorded
		var newRow = parseInt(inputCell.substr(inputCell.indexOf("@")+1,inputCell.length))+1
		var newCell = inputCell.substr(0,inputCell.indexOf("@")) + "@" + newRow;
		//console.log(`inputCell is ${inputCell}, newRow is ${newRow} and so newCell is ${newCell}`);
		document.getElementById(newCell).focus();

	} 
	
}

/**********************************************************************************
*             Mouse Movements across cells
*             -This will record the cell where mouse down happens and then 
*              record where mouse up happens result in a A1:A1 notation
*
************************************************************************************/

var rangeSelected = "";

function onMousedownHandler(elem){
	console.log(`onMousedownHandler elem.id is ${elem.id}`);
	rangeSelected += elem.id;
	
	
}

function onMouseupHandler(elem){
	console.log(`onMouseupHandler elem.id is ${elem.id}`);
	rangeSelected += ":" + elem.id;
	
	console.log(`rangeSelected is ${rangeSelected}`);
	
	rangeSelecte = "";
	
	
}

