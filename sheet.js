/**********************************************************************************
*          This function
*             
*
*
************************************************************************************/
var dataArray = [];
var dpr = window.devicePixelRatio || 1;

/**********************************************************************************
*          This function creates the obj with grid sizer info. later potentially
*            drive this from array of row and col sizes attached to those
*           canvases
*
************************************************************************************/

function gridSize(){
	//eventaully this function will adjust has row and col numbers need to be more dynamic
	var obj = {};
    
	obj.cols = 15;
	obj.rows = 30;
	obj.rowHeight = 21;
	obj.colWidth = 100;
	
	return obj;
}

/**********************************************************************************
*          This function creates the canvas with the data in the dataArray
*            
*
*
************************************************************************************/

function initDataArray(){
	console.log(`init dataArray`);
	var obj = gridSize();
	
	//This is when the sheet is first loading it just fills the global dataArray with empty strings 
	//for all columns and rows. dataArray[0][0] should be A1 ref dataArray[0][1] should be B2 ref
	for (var i = 0; i<obj.cols; i++) {
		dataArray[i] = [];
		for (var j = 0; j<obj.rows; j++) {
			//An instance of the object below is stored in each item in this array
			// The object includes identifying information about the cell
			var cellObj = {};
			cellObj.value = "";
			cellObj.ref = String.fromCharCode(65+i) + (j+1);
			cellObj.formula = "";
			if (i>=0 && j==0) {cellObj.offsetX = obj.colWidth*i;}
			if (j>=0 && i==0) {cellObj.offsetY = obj.rowHeight*j;}
			dataArray[i][j] = cellObj; 
		}
	}
	

	
	console.log(dataArray);
}

/**********************************************************************************
*          This function creates the obj with grid sizer info. later potentially
*            drive this from array of row and col sizes attached to those
*           canvases
*
************************************************************************************/

function inputBox(obj){
	console.log(`inputBox{offsetX: ${obj.offsetX}, offsetY: ${obj.offsetY}}`);
	var topGap = obj.offsetY+2;
	var leftGap = obj.offsetX+4;
	//Check if the offset is outside of the grid dimensions and if so do nothing
	var canvas = document.getElementById('grid_data');
	var prevInput = document.getElementById('input_cell');
	if (topGap <= 0 || topGap > canvas.height/dpr || leftGap < 0 || leftGap > canvas.width/dpr) {
		//console.log(`inputBox{obj.offsetX: ${obj.offsetX}, obj.offsetY: ${obj.offsetY}, canvas.height ${canvas.height/dpr}, canvas.width: ${canvas.width/dpr}}`)
		return true;
	} else if (prevInput) {
		prevInput.remove();
	}
	//This removes the data from the data grid where you put an input box
	//It fixes the issue where input boxes had the data grid behind them and overlapping text
	var context = canvas.getContext('2d');
	context.clearRect(leftGap,topGap, 98,16);
	
	//Later: Create blue box around selected cell
	
	//Create the input box
	var gridCont = document.getElementById('grid_cont');
	var inputBox = document.createElement("INPUT");
	gridCont.appendChild(inputBox);
	inputBox.setAttribute("id","input_cell");
	inputBox.setAttribute("style",'position: absolute; top: '+topGap+'px; left: '+leftGap+'px; height: 15px; width: 94px; z-index: 4; font: arial; font-size: 12px;');		
	//inputBox.setAttribute("onBlur","onBlurHandler();");
	inputBox.setAttribute("onkeyup","onKeyUpHandler();");
	inputBox.setAttribute("onkeydown","onKeyDownHandler(event);");
	inputBox.setAttribute("data-col",obj.col);
	inputBox.setAttribute("data-row", obj.row);

	//console.log(`dataArray[col][row].formula: ${dataArray[obj.col][obj.row].formula}`);
	//Will return the formula if the cell object has a formula property, if not it returns the value prop
	if (dataArray[obj.col][obj.row].formula) {
		inputBox.setAttribute("value",dataArray[obj.col][obj.row].formula);
		//Activcate formula mode so that when enter is clicked formula evaluates
		fMode = true;
	} else {
		inputBox.setAttribute("value",dataArray[obj.col][obj.row].value);
	}
		
	//inputBox.setAttribute("onkeyup","onKeyUpHandler(event);");
	
	//Timer set to make sure focus happens after everything above
	window.setTimeout(function () { 
		document.getElementById('input_cell').focus(); 
	}, 0); 
	
	//Returning false to where this was called means its save 
	return false;
}

/**********************************************************************************
*          This function creates the canvas with the row headings
*            
*
*
************************************************************************************/

function updateDataArray(input){
	console.log(`updateDataArray{}`);
	//Find row and col from the input data-col/row attributes
	var col = parseInt(input.getAttribute('data-col'));
	var row = parseInt(input.getAttribute('data-row'));
	
	//update dataArray with value and alt (formula)
	dataArray[col][row].value = input.value;
	dataArray[col][row].formula = input.alt;
	console.log(dataArray);
	
}

/**********************************************************************************
*          This function creates the canvas formula bar
*            
*
*
************************************************************************************/

function drawFBar(){
	var obj = gridSize();
	
	var canvas = document.getElementById('formula_bar');
	var context = canvas.getContext('2d');
	context.scale(dpr,dpr);
	//Set the canvas size
	canvas.width = (40.5+(obj.cols*obj.colWidth))*dpr;
	canvas.height = 21.5*dpr;
	
	canvas.style.width = `${(40.5+(obj.cols*obj.colWidth))}px`;
	canvas.style.height = `${21.5}px`;
	context.scale(dpr,dpr);
	
	context.strokeStyle = "#d9d9d9";
	
	//created these variables because canvas.height/width in the context.() lines did not work
	var width = canvas.width/dpr;
	var height = canvas.height/dpr;
	
	//draw Fx and line seprator
	context.font = "17px Times New Roman";
	context.fillStyle = "#666666";
	context.fillText("\u0192x",18,15);
	
	context.font = "14px Arial";
	context.fillStyle = "#000000";
	context.beginPath();
	context.moveTo(40,3); //go to first point
	context.lineTo(40,height-3); //draw to end of canvas
	context.closePath(); 
	context.stroke();
	
	//Draw fBar outline
	context.strokeRect(0,0,width,height);
	
	//If there is input cell draw the input.alt text
	var input = document.getElementById('input_cell');
	if (input){
		context.fillText(input.value,42,15);
	}
	
	//Add listener that creates an input box if the formula bar is click 
	//Will need to then draw formula in the input box that was in focus before it was clicked
	
	
}

/**********************************************************************************
*          This function creates the canvas with the row headings
*            
*
*
************************************************************************************/

function drawRowHdrs(){
	console.log(`draw row headers`);
	
	var obj = gridSize();
	var indent = 40; //this is the width of the row headers column
	
	var canvas = document.getElementById('row_hdrs');
	
	var context = canvas.getContext('2d');
	context.scale(dpr,dpr);
	//Set the canvas size
	canvas.width = 40.5*dpr;
	canvas.height = (obj.rowHeight*obj.rows+0.5)*dpr;
	
	canvas.style.width = `${40.5}px`;
	canvas.style.height = `${obj.rowHeight*obj.rows+0.5}px`;
	context.scale(dpr,dpr);

	context.lineWidth = 0.5;
	context.fillStyle = "#F8F9FA";
	context.fillRect(0.5,0.5,canvas.width,canvas.height);
	context.strokeStyle = "#cccccc";
	
	for (var i = 0; i<=obj.rows; i++) {
		
		context.strokeRect(0.5,obj.rowHeight*i+0.5,canvas.width,obj.rowHeight);
		
		//Draw the column Letter
		context.font = "10px Arial";
		context.fillStyle = "#666666";
		context.textAlign = "center";
		context.fillText(i+1,indent/2,i*obj.rowHeight+15);
	}

}

/**********************************************************************************
*          This function creates the canvas with the column headings
*            
*
*
************************************************************************************/

function drawColHdrs(){
	console.log(`draw col headers`);
	
	var obj = gridSize();
	var canvas = document.getElementById('col_hdrs');
	
	
	//Adjust the workspace so that both canvases can fit into it
	var body = document.getElementById('body');
	var workSpace = document.getElementById('work_space');
	workSpace.style.width = "100vw";//`${obj.colWidth * obj.cols+40}px`;
	workSpace.style.height = "100vh";//`${obj.rowHeight * obj.rows+42}px`;
	
	var context = canvas.getContext('2d');
	context.scale(dpr,dpr);
	//Set the canvas size
	canvas.width = obj.colWidth * obj.cols*dpr;
	canvas.height = obj.rowHeight*dpr;
	
	canvas.style.width = obj.colWidth * obj.cols+"px";
	canvas.style.height = obj.rowHeight+"px";
	context.scale(dpr,dpr);

	context.lineWidth = 0.5;
	context.fillStyle = "#F8F9FA";
	context.fillRect(0.5,0.5,canvas.width,canvas.height);
	context.strokeStyle = "#cccccc";
	
	for (var i = 0; i<obj.cols; i++) {
		//Draws the lines of the top row of col headers
		context.strokeRect(obj.colWidth*i+0.5,0.5,obj.colWidth*i,obj.rowHeight);
		//Draw the column Letter
		context.font = "10px Arial";
		context.fillStyle = "#666666";
		context.textAlign = "center";
		var colRef = String.fromCharCode(65+i);
		//Takes the colWidth and splits in two to achieve center align
		var indent =  obj.colWidth/2;
		context.fillText(colRef,obj.colWidth*i+indent,15);
	}
	
	addColListeners();
}
/**********************************************************************************
*          This function creates the canvas where cell highlights are drawn
*            
*
*
************************************************************************************/

function drawHlGrid(){
	var obj = gridSize();
	var canvas = document.getElementById('hl_grid');
	
	var context = canvas.getContext('2d');
	context.scale(dpr,dpr);
	
	//Set the canvas size
	canvas.width = (obj.colWidth * obj.cols+0.5)*dpr;
	canvas.height = (obj.rowHeight*obj.rows+0.5)*dpr;
	
	canvas.style.width = `${obj.colWidth * obj.cols+0.5}px`;
	canvas.style.height = `${obj.rowHeight*obj.rows+0.5}px`;
	context.scale(dpr,dpr);

}
/**********************************************************************************
*          This function creates the canvas where cell selection shows up
*            
*
*
************************************************************************************/

function drawSelGrid(){
	var obj = gridSize();
	var canvas = document.getElementById('sel_grid');
	
	var context = canvas.getContext('2d');
	context.scale(dpr,dpr);
	
	//Set the canvas size
	canvas.width = (obj.colWidth * obj.cols+0.5)*dpr;
	canvas.height = (obj.rowHeight*obj.rows+0.5)*dpr;
	
	canvas.style.width = `${obj.colWidth * obj.cols+0.5}px`;
	canvas.style.height = `${obj.rowHeight*obj.rows+0.5}px`;
	context.scale(dpr,dpr);

}
/**********************************************************************************
*          This function creates the canvas with grid of cells
*            
*
*
************************************************************************************/

function drawGrid(){
	var obj = gridSize();
	var canvas = document.getElementById('grid');
	
	//Adjust the workspace so that both canvases can fit into it
	var gridCont = document.getElementById('grid_cont');
	gridCont.style.width = `${obj.colWidth * obj.cols+0.5}px`;
	gridCont.style.height = `${obj.rowHeight * obj.rows+0.5}px`;
	
	var context = canvas.getContext('2d');
	context.scale(dpr,dpr);
	
	//Set the canvas size
	canvas.width = (obj.colWidth * obj.cols+0.5)*dpr;
	canvas.height = (obj.rowHeight*obj.rows+0.5)*dpr;
	
	canvas.style.width = `${obj.colWidth * obj.cols+0.5}px`;
	canvas.style.height = `${obj.rowHeight*obj.rows+0.5}px`;
	context.scale(dpr,dpr);

	context.lineWidth = 0.5;
	
	context.strokeStyle = "#cccccc";

	//Draw the vertical grid lines5
	for (var i = 0; i<=obj.cols; i+=2) {
		context.strokeRect(obj.colWidth*i+0.5,0.5,obj.colWidth,canvas.height);

	}
	//draw horizontal lines
	for (var j = 0; j<=obj.rows; j+=2){
		context.strokeRect(0.5,obj.rowHeight*j+0.5,canvas.width,obj.rowHeight);

	}
	

}

/**********************************************************************************
*          This function creates the canvas with the data in the dataArray
*            
*
*
************************************************************************************/

function drawData(){
	var obj = gridSize();
	var canvas = document.getElementById('grid_data');
	var context = canvas.getContext('2d');
	context.scale(dpr,dpr);
	
	//Set the canvas size
	canvas.width = obj.colWidth * obj.cols*dpr;
	canvas.height = obj.rowHeight*(obj.rows)*dpr;
	
	canvas.style.width = `${obj.colWidth*obj.cols}px`;
	canvas.style.height = `${obj.rowHeight*obj.rows}px`;
	context.scale(dpr,dpr);

	context.lineWidth = 1;
	
	
	//Print out cell values to the grid
	for (var i = 0; i<obj.cols; i++) {
		for (var j = 0; j<obj.rows; j++) {
			//Draw the cell value. 
			var x = obj.colWidth*i; 
			var y = obj.rowHeight*j; 
			context.font = "12px Arial";
			context.fillStyle = "#000000";
			context.textAlign = "left";
			context.fillText(dataArray[i][j].value,x+5,y+15);
			
		}
	}
addGridListeners();

}
/**********************************************************************************
*          This function creates the div and canvas we will use in createSheet
*           this is the entry point from the html.index file
*
*
************************************************************************************/
function initWB(){
	
	//Create a div to encase the editable area of the sheet (sheet and tabs)
	var workSpace = document.createElement("DIV");
	document.body.appendChild(workSpace);
	workSpace.setAttribute("id","work_space");
	workSpace.setAttribute("style","position: relative; overflow: hidden;");
	
	
	//Create a canvas to hold the formula bar
	var fBar = document.createElement("CANVAS");
	workSpace.appendChild(fBar);
	fBar.setAttribute("id","formula_bar");
	fBar.setAttribute("style","position: absolute;");
	
	drawFBar();
	
	//Create a canvas to hold the column headers
	var colHdrs = document.createElement("CANVAS");
	workSpace.appendChild(colHdrs);
	colHdrs.setAttribute("id","col_hdrs");
	colHdrs.setAttribute("style","position: absolute; top: 21px; left: 40px;");
	
	drawColHdrs();
	
	//Create a canvas to hold the row headers
	var rowHdrs = document.createElement("CANVAS");
	workSpace.appendChild(rowHdrs);
	rowHdrs.setAttribute("id","row_hdrs");
	rowHdrs.setAttribute("style","position: absolute;  left: 0px; top: 42px;");
	
	drawRowHdrs();

	
	//Create a div to encase all the grids
	var gridContainer = document.createElement("DIV");
	workSpace.appendChild(gridContainer);
	gridContainer.setAttribute("id","grid_cont");
	gridContainer.setAttribute("style","position: absolute; overflow: scroll; left: 40px; top: 42px; z-index: 0;");
	
	//Create a canvas to hold the sheet grid
	var grid = document.createElement("CANVAS");
	workSpace.appendChild(grid);
	grid.setAttribute("id","grid");
	grid.setAttribute("style","position: absolute; left: 40px; top: 42px; z-index: 1;");
	
	//create canvas where cell highlights will live
	var hlGrid = document.createElement("CANVAS");
	workSpace.appendChild(hlGrid);
	hlGrid.setAttribute("id","hl_grid");
	hlGrid.setAttribute("style","position: absolute; left : 40px; top: 42px; z-index: 1");
	
	//create canvas where cell selections will live
	var selGrid = document.createElement("CANVAS");
	workSpace.appendChild(selGrid);
	selGrid.setAttribute("id","sel_grid");
	selGrid.setAttribute("style","position: absolute; left : 40px; top: 42px; z-index: 2;");
	
	drawGrid();
	drawHlGrid();
	drawSelGrid();
	
	//Initiate "Empty" cell dataArray
	initDataArray();
	
	//create canvas where data will be drawn
	var sheetData = document.createElement("CANVAS");
	workSpace.appendChild(sheetData);
	sheetData.setAttribute("id","grid_data");
	sheetData.setAttribute("style","position: absolute; left : 40px; top: 42px; z-index: 3");
	
	drawData();
	
	


	
}
