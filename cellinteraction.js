/*~~~~~~~~FUNCTIONS HERE CONTROL THE INTERACTION OF USERS WITH CELLS, BY MOUSE AND KEYBOARD~~~~~~*/

/*
Three modes exist: sheet viewed with no focus on any cell, focus on specific cell, edit mode

/**********************************************************************************
*             Global variables
*             - These exist to track different interaction modes
*                1. fMode, true when keyCode is "="
*                
*                
************************************************************************************/

var fMode = false;
var mouseClick = false;
//This variable picks up the cell ref for where the click happened, then on 
//mouse up, if the cell ref is same it returns it if diff it returns "clickRef:" + new cell ref
var clickRef ={};

/**********************************************************************************
*       The function below takes in XY coordinates of a click and convert 
*        to obj with col/row
*                
*                
*                
************************************************************************************/

function clickToRef(event){
	console.log(`In clickToRef`);
	var obj = {};
	//Use x,y of event to locate col/row by iterating through the dataArray
	
	//get x,y of click
	var clickX = event.offsetX;
	var clickY = event.offsetY;
	
	//Find column number
	var colFound = false;
	var col = 0;
	while (colFound == false) {
		var colOffsetX = dataArray[col][0].offsetX;
		if (clickX <= colOffsetX) {
			colFound = true;
			col--;
			break;
		}
		col++;
	}
	
	//Find row number
	var rowFound = false;
	var row = 0;
	while (rowFound == false) {
		var rowOffsetY = dataArray[0][row].offsetY;
		if (clickY <= rowOffsetY) {
			rowFound = true;
			row--;
			break;
		}
		row++;
	}
	
	
	
	//Finally we add offset and Col/Row to 
	obj.col = col;
	obj.row = row;
	obj.offsetX = dataArray[col][0].offsetX;
	obj.offsetY = dataArray[0][row].offsetY;
	obj.ref = dataArray[col][row].ref
	console.log(`the obj {offsetX ${obj.offsetX}, offsetY ${obj.offsetY}, col ${obj.col}, row ${obj.row}, }`)
	
	return obj;
	
}

function formulaEval(input){
	
	//This function will take the inoput box and run it through the formula parser
	console.log(`formulaEval. input.value: ${input.value}, input.alt: ${input.alt}`);
	input.alt = input.value;
	var inputVal = input.value;
	var tokens = tokenize(inputVal);
	var rootNode = makeTree(tokens);
	var solvedVal = rootNode.traverseEQ();
	console.log(`solvedVal: ${solvedVal}`);
	input.value = solvedVal;
	//input.col = col;
	//input.row = row;
	fMode = false;
	console.log(dataArray);
	
}

/**********************************************************************************
*             Add listeners to the grid
*             
*                
*                
*                
************************************************************************************/

function addGridListeners(){
	console.log(`GridListeners{}`);
	
	var workSpace = document.getElementById('work_space');
	var input = document.getElementById('input_cell');
	var canvas = document.getElementById('grid_data');
	var context = canvas.getContext('2d');

	canvas.onmousedown = function(e) {
		console.log(`mousedown{}`);
		mouseClick = true;
		drawHlGrid(); //get rid of any hilights that exist
		if (fMode == true) {
			var input = document.getElementById('input_cell');
			clickRef = clickToRef(e);
			//Add the cell ref of the cell where the down click happened to the cell inoput val
			//clickRef = dataArray[obj.col][obj.row].ref;
			input.value += dataArray[clickRef.col][clickRef.row].ref;
		} 
	}
	
	canvas.onmousemove = function(e) {
		console.log(`mousemove{}`);
		if (mouseClick == true && fMode == true) {
			var obj = clickToRef(e);
			var canvas = document.getElementById('hl_grid');
			var context = canvas.getContext('2d');
			console.log(obj);
			console.log(clickRef);
			//Find the difference between obj (current mouse position) and clickRef (the original click)
			//This is then used below to draw the highlight
			
			var xMove = dataArray[obj.col+1][0].offsetX - dataArray[clickRef.col][0].offsetX;
			var yMove = dataArray[0][obj.row+1].offsetY - dataArray[0][clickRef.row].offsetY;

			//console.log(`dataArray[obj.col+1][0].offsetX - dataArray[clickRef.col][clickRef.row].offsetX;`)
			//console.log(`xMove is ${xMove} and yMove is ${yMove}`);
			
			//Clear the canvas every time there is a move and re-draw to current point from 
			//clickRef which is a globval object that is populated on click down.
			var width = canvas.width/dpr;
			var height = canvas.height/dpr;
			
			context.clearRect(0,0,width, height);
			context.globalAlpha = 0.6;
			context.fillStyle = "#cfe2f3";
			context.fillRect(clickRef.offsetX,clickRef.offsetY, xMove, yMove);
		}
	}
	
	canvas.onmouseup = function(e) {
		console.log(`mouseup{}`);
		mouseClick = false;
		var input = document.getElementById('input_cell');
		if (fMode == true) {
			var obj = clickToRef(e);
			
			var lastCell = dataArray[obj.col][obj.row].ref;
			if (clickRef.ref != lastCell) {
				input.value += ":"+lastCell;
			}
			input.focus();
		} else {
			if (input) {
				updateDataArray(input);
				drawData();
			}
			var obj = clickToRef(e);
			//Insert an input box
			console.log(`draw and insert`);

			inputBox(obj);
			
		}
	
	//drawData();	
	}
	
}


/**********************************************************************************
*             Add listeners to the column header section
*             
*                
*                
*                
************************************************************************************/

function addColListeners(){
	
	var canvas = document.getElementById('col_hdrs');
	var context = canvas.getContext('2d');
	
	//mousedown eventlistener
	canvas.onmousedown = function(e) {
		console.log(`colHdrs mousedown{}`);
	}
	
	//mousemove eventlistener
	canvas.onmousemove = function(e) {
		console.log(`colHdrs mouseover{}`);
		
	}
	
}

/**********************************************************************************
*             Key down handler
*             
*                
*                
*                
************************************************************************************/
function onKeyDownHandler(e){
	console.log(`onKeyDown keyCode is ${event.keyCode}`);
	
	var keyCode = event.keyCode;
	//var target = event.target;
	
	var input = document.getElementById('input_cell');
	var canvas = document.getElementById('grid');
	//find the col and row of the next cell
	
	
	var col = parseInt(input.getAttribute('data-col'));
	var row = parseInt(input.getAttribute('data-row'));
	var offsetX = dataArray[col][0].offsetX; 
	var offsetY = dataArray[0][row].offsetY;
	//var obj = clickToRef(target);
	var obj = {offsetX: offsetX, offsetY: offsetY, col: col, row: row};
	console.log(obj);
	
	var move = false;
	
	//check if the target has "=" in it and if so put it into formula mode

	
	switch (keyCode) {
	case 13: //Enter key
		if (fMode == true) {
			drawHlGrid(); //get rid of any hilights that exist
			formulaEval(input);
		}
		obj.offsetY += 21;
		obj.row +=1; 
		
		//var obj = {offsetX: offsetX, offsetY: offsetY+21, col: col, row: row+1};
		move = true;
		break;
	case 37: //Left arrow
		if (fMode == true) {return;}
		var obj = {offsetX: offsetX-100, offsetY: offsetY, col: col-1, row: row};
		move = true;
		break;
	case 38: //Up arrow
		if (fMode == true) {return;}
		var obj = {offsetX: offsetX, offsetY: offsetY-21, col: col, row: row-1};
		move = true;
		break;
	case 39: //Right arrow
		if (fMode == true) {return;}
		var obj = {offsetX: offsetX+100, offsetY: offsetY, col: col+1, row: row};
		move = true;
		break;
	case 40: //Down arrow
		if (fMode == true) {return;}
		var obj = {offsetX: offsetX, offsetY: offsetY+21, col: col, row: row+1};
		move = true;
		break;
	}
	
	if (move == true){
		updateDataArray(input);
		drawGrid();
		drawData();
		inputBox(obj);
	}
		
}


/**********************************************************************************
*             Key up handler
*             
*                
*                
*                
************************************************************************************/
function onKeyUpHandler(e) {
	
	//Check if the cell contains an "=" to figure out if formula mode should be engaged if it not already
	//I do this in keyUp because in KeyDown the inoput box did not have enough time to be populated 
	//before the handlers was fired off
	var input = document.getElementById('input_cell');
	var inputVal = input.value;
	console.log(`inputVal: ${inputVal}`);
	if (/=/.test(inputVal)) {
		fMode = true;
		console.log(`Engage formula mode!`);
	} else {
		fMode = false;
	}
	
	//Refresh the formula bar every time a key goes up
	drawFBar();
	
}

function onBlurHandler(){
	drawSelGrid();
}



