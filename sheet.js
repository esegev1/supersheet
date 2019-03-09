/**********************************************************************************
*          This function initiates a new canvas
*             
*
*
************************************************************************************/
function sheetData(){
	//bring in obj with how many cols/rows and the height/width of cols and rows
	var obj = gridSize();
	var cols = obj.cols;
	var rows = obj.rows;
	var rowHeight = obj.rowHeight;
	var colWidth = obj.colWidth;
	var height = rowHeight * rows+41;
	var width = colWidth * cols+41;
	
	var array = 
}




function gridSize(){
	//eventaully this function will adjust has row and col numbers need to be more dynamic
	var obj = {};

	obj.cols = 10;
	obj.rows = 60;
	obj.rowHeight = 21;
	obj.colWidth = 100;
	
	return obj;
}


function createSheet(){
	
	//bring in obj with how many cols/rows and the height/width of cols and rows
	var obj = gridSize();
	var cols = obj.cols;
	var rows = obj.rows;
	var rowHeight = obj.rowHeight;
	var colWidth = obj.colWidth;
	var height = rowHeight * rows+41;
	var width = colWidth * cols+41;
	
	//Create pointers to the work space, and canvas
	var workSpace = document.getElementById('work_space');
	var canvas = document.getElementById('work_book');
	var context = canvas.getContext('2d');
	
	//Check for screen pixel ratio to make sure it works on other devices
	var dpr = window.devicePixelRatio || 1;
	workSpace.style.width = canvas.style.width+2;
	workSpace.style.height = canvas.style.height+2;
	
	canvas.width = width*dpr;
	canvas.height = height*dpr;
	
	// now let's draw stuff
	context.clearRect(0, 0, width, height);
	context.save();

	// an actual 1px hairline
	context.lineWidth = 1;

	//create the grid first
	//Make horizontal lines, the plus 1 is because we need a line at the bottom
	for (var i = 0; i<rows+1; i++) {
		context.lineWidth = 1;
		context.strokeStyle = "#d9d9d9";
		context.beginPath();
		context.moveTo(0.5,rowHeight*i+ 0.5);
		context.lineTo(cols*colWidth + 40.5, rowHeight*i+ 0.5);
		context.closePath();
		context.stroke();
	}
	
	//Make the first column
	context.lineWidth = 1;
	context.strokeStyle = "#d9d9d9";
	context.beginPath();
	context.moveTo(0.5,0.5);
	context.lineTo(0.5,rows*rowHeight + 0.5);
	context.closePath();
	context.stroke();
	context.restore();
	context.strokeStyle = "#d9d9d9";
	context.beginPath();
	context.moveTo(40.5,0.5);
	context.lineTo(40.5,rows*rowHeight + 0.5);
	context.closePath();
	context.stroke();
	context.restore();
	
	
	//Make vertical lines, starting at 1 because it is the second column we draw
	for (var j = 1; j<=cols+1; j++) {
		context.lineWidth = 1;
		context.strokeStyle = "#d9d9d9";
		context.beginPath();
		context.moveTo(colWidth*j + 40.5,0.5);
		context.lineTo(colWidth*j + 40.5,rows*rowHeight + 0.5);	
		context.closePath();
		context.stroke();
		context.restore();
	}
	
	//make the top line col headers
	for (var i = 0; i<=obj.cols; i++) {

		context.beginPath();
		context.moveTo(obj.colWidth*i+40.5,0.5); //go to first point
		context.lineTo(obj.colWidth*(i+1)+40.5,0.5); //draw to second point
		context.lineTo(obj.colWidth*(i+1)+40.5,21.5); //draw to third point
		context.lineTo(obj.colWidth*i+40.5,21.5); //draw to last point
		context.closePath();  //draw to first point
		context.fillStyle = "#F8F9FA";
		context.fill(); //fill the area
		
		//to draw a border
		context.lineWidth = 1;     
		context.strokeStyle = "#d9d9d9";
		context.stroke();
		
		//Draw the column Letter
		context.font = "10px Arial";
		context.fillStyle = "#666666";
		var colRef = String.fromCharCode(65+i); 
		context.fillText(colRef,obj.colWidth*i+40.5+49,15);
		
		//context.rect(obj.colWidth*i+25.5,0.5,obj.colWidth,21);
		//context.stroke();
	}
	
	//make first column row numbers
	for (var j = 0; j<obj.rows-1; j++) {

		context.beginPath();
		context.moveTo(0,21 + obj.rowHeight*j+0.5); //go to first point
		context.lineTo(40.5,21 + obj.rowHeight*j+0.5); //draw to second point
		context.lineTo(40.5,21 + obj.rowHeight*(j+1)+ 0.5); //draw to third point
		context.lineTo(0.5,21 + obj.rowHeight*(j+1)+ 0.5); //draw to last point
		context.closePath();  //draw to first point
		context.fillStyle = "#F8F9FA";
		context.fill(); //fill the area
		
		//to draw a border
		context.lineWidth = 1;     
		context.strokeStyle = "#d9d9d9";
		context.stroke();
		
		//Draw the column Letter
		context.font = "10px Arial";
		context.fillStyle = "#666666";
		context.textAlign = "center";
		context.fillText(j+1,20,21.5 + j*obj.rowHeight+15.5);
		
		//context.rect(obj.colWidth*i+25.5,0.5,obj.colWidth,21);
		//context.stroke();
	}
	//Add event listener
	canvas.onmousedown = function (e) {

		
		//Find the top left corner of the cell where someone clicked
		var excessX = (e.pageX - 40) % 100;
		var excessY = (e.pageY - 21) % 21;
		
		//Now that we know how far from the closest top left corner of a cell the click was
		//we take the spot and remove that remainder from above to then create and input box
		var offsetX = e.pageX - excessX+ 1.5;
		var offsetY = e.pageY - excessY+ 0.5;
		console.log(`x axis: ${offsetX} and y axis: ${offsetY}`);
		
		//Create the input box
		var inputBox = document.createElement("INPUT");
		workSpace.appendChild(inputBox);
		inputBox.setAttribute("id","input_cell");
		inputBox.setAttribute("style",'position: absolute; top: '+ offsetY + 'px; left: '+offsetX+'px; height: 20px; width: 98px;');		
		inputBox.setAttribute("onBlur","document.getElementById('input_cell').remove();");
		
		//Timer set to make sure focus happens after everything above
		window.setTimeout(function () { 
		    document.getElementById('input_cell').focus(); 
		}, 0); 
		
	};	
	
}

function initWB(){
	
	//Create a div to encase the editable area of the sheet (sheet and tabs)
	var workSpace = document.createElement("DIV");
	document.body.appendChild(workSpace);
	workSpace.setAttribute("id","work_space");
	workSpace.setAttribute("style","position: absolute;");
	
	//Create a canvas to hold the header rows/cols
	var workBook = document.createElement("CANVAS");
	workSpace.appendChild(workBook);
	workBook.setAttribute("id","work_book");
	
	
	createSheet();
}
