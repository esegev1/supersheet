/**********************************************************************************
*             Code below controls the in-cell function that users can call
*             by using "=XXX()"
*https://code.tutsplus.com/articles/data-structures-with-javascript-tree--cms-23393
*
************************************************************************************/


/**********************************************************************************
*          This function handles the tokenization of formulas
*             
*
*
************************************************************************************/

function Token(type, value){
	this.type = type;
	this.value = value
}
function offsetObj(input){
	
	var obj = {};
	
	var offsetonX = input.offsetLeft;
	var offsetonY = input.offsetTop;
	var excessX = (input.offsetLeft - 40) % 100;
	var excessY = (input.offsetTop - 21) % 21;

	//Now that we know how far from the closest top left corner of a cell the click was
	//we take the spot and remove that remainder from above to then create and input box
	var offsetX = input.offsetLeft - excessX+ 0.5;
	var offsetY = input.offsetTop - excessY+ 0.5;
	
	//Calculate col and row from offsetX/Y
	var col = Math.round((offsetX-40)/100);
	var row = Math.round((offsetY-21)/21);
	
	obj.col = col;
	obj.row = row;
	
	return obj;
}


function tokenize(str) {
  var tokens=[]; //array of tokens
  var stringBuffer=[];
  
  // remove spaces; remember they don't matter?
  str.replace(/\s+/g, "");
  // convert to array of characters
  str=str.split("");

  str.forEach(function (char, idx) {
	  //console.log(`Start char is ${char} stringBuffer is ${stringBuffer}`);
	  //Step 1. Check if char is an operator
	  //This should then work well with the idea of skipping through tree nodes
	  if (/\+|-|\*|\/|\^/.test(char)) { //If operator, we need to take everything before the op and deal with it
		  emptyStringBuffer();  //here we empty the string buffer, which contains everything prior to operator
		  //Add the operator token, later also skip up tree nodes
		  tokens.push(new Token("Operator",char));
	  } else if (char == "(") {//Is it a left paren?
		  emptyStringBuffer(); 
		  //Add the Left Paren token, later also skip up tree nodes
		  tokens.push(new Token("Left Paren",char));
	  } else if (char == ")") {//Is it a right paren?
		  emptyStringBuffer(); 
		  //Add the right Paren token, later also skip up tree nodes
		  tokens.push(new Token("Right Paren",char));
	  } else if (char == ",") {//is it a comma?
		  emptyStringBuffer(); 
		  //Add the "unction Argument Separator token, later also skip up tree nodes
		  tokens.push(new Token("Arg Sep",char));
	  } else if (char == "=") {//is it a comma?
		  emptyStringBuffer(); 
		  //Add the "unction Argument Separator token, later also skip up tree nodes
		  tokens.push(new Token("Operator",char));
	  } else {
	  	stringBuffer.push(char);
	  }
	  
	});  
	
	emptyStringBuffer();  
	console.log(tokens);
	//console.log(`result is ${JSON.stringify(result)}`);
    //Function below takes the stringBuffer and figures out if it is a Ref, function or literal then adds token
	  function emptyStringBuffer() {
      	if (stringBuffer.length) {
      		var str1 = stringBuffer.join("");
			console.log(`emptyStringBuffer- str1: ${str1}`);
			
			//Test whether the string has letters, digits, ":" (signfying array ref), or " (signifying string) 
			var isLet = /[a-z]/i.test(str1);
			var isDig = /\d/.test(str1);
			var isCol = /:/.test(str1);
			var isStr = /"/.test(str1);
			
			if (isStr) {
				var string = "";
				
				//Convert string to array of characters
				str1=str1.split("");
				
				//loop through each character and remove "", Later: find easier eway to do this
				str1.forEach(function(char, idx){
					
					if(/"/.test(char) == false) {
						string += char;
					}
				});
				
				tokens.push(new Token("string", string));
				
			} else if (isLet && isDig && isCol){
				//Find the starting ref and ending refrence and put all those values into an array
				var refArray = [];
				var colLtr = "";
				var row = "";
				//Loop below collects all letters and numbers in string before ":", then pushes into refArray
				//Then it resets the variables and collects the ltrs and nums after the ":" and pushes into refArray
				for (var i = 0; i<str1.length; i++) {
					if (str1[i]!=":") {
						if (/[a-z]/i.test(str1.charAt(i))) {
							colLtr += str1[i];
						}  else {
							row += str1[i];
						}	
					} else {
						var colNum = parseFloat(colLtr.charCodeAt(0)-65);
						refArray.push(colNum);
						refArray.push(parseFloat(row));
						colLtr = "";
						row = "";
					}	
				}
				
				//Run this code final time after loop because above will only run when ":" happens
				//Later: need to find more elegant way to run this one more time when loop ends
				var colNum = parseFloat(colLtr.charCodeAt(0)-65);
				refArray.push(colNum);
				refArray.push(parseFloat(row));
				colLtr = "";
				row = "";
				
				//This array should always translate to 4 items
				//0 = beg col, 1 = beg row, 2 = end col, 3 = end row
				console.log(`refArray: ${refArray}`);
				
				//go through the refArray and store items into valArray
				//The script goes by column then by row
				var valArray = [];
				for (var j=refArray[0]; j<=refArray[2]; j++) {
					for (var x=refArray[1]-1; x<=refArray[3]-1; x++) {
						var cellVal = 0;
						//This makes it so that only cells with values are pushed into the array of vlues
						//This way we can ref an array with empty cells
						if (dataArray[j][x].value != "") {
							cellVal = dataArray[j][x].value;
						}
						valArray.push(cellVal);
					}
				}

				console.log(`valArray: ${valArray}`);
				tokens.push(new Token("refArray", valArray));
			} else if (isLet && isDig && isCol == false) {
				//Split the cell refrence by letters and numbers (cols and rows)
				var colLtr = "";
				var rowNum = "";
				
				for (var i = 0; i< str1.length; i++){
					if (/[a-z]/i.test(str1.charAt(i)) == true) {
						colLtr += str1.charAt(i);
					} else if (/\d/.test(str1.charAt(i)) ==true) {
						rowNum += str1.charAt(i);
					}
				}	
				//find the character code at ltr[0], this will only work for single letter oclumns
				var col = str1.charCodeAt(0)-65;
				var row = rowNum-1;
				//Take the col sand row numbers from above and find the value in the dataArray
				var refVal = dataArray[col][row].value;
				
				tokens.push(new Token("Literal", refVal));
			} else if (isLet == true && isDig == false) {
				tokens.push(new Token("Function", str1));
			} else if (isLet == false && isDig == true) {
				//Abiove test shows the contents of the cell are a number for sure so parseFloat here
				tokens.push(new Token("Literal", parseFloat(str1)));
			}
      		stringBuffer=[];
      	}
      }
	  return tokens;
  }
/**********************************************************************************
*          This function take the result array from Tokenize
*            and then puts it into a node & tree consturcuts
*
*
************************************************************************************/
 //=sum(8,9)
 /*
     sum
       sum
         7
         8
       9
  u =  node{data: sum , parent: null , children: [v,w]}
  v =  node{data: 8, parent: u , children: [] }
  w =  node{data: 9, parent: u , children: [] }
 
 traversal approach
 collection[root.data, _children[0].data ... _children[n].data, _children[0]._children[0].data ... _children[0]._children[n].data
 
 
 */

class Node{
	  //The node class is allocating new memory to hold the data we need it to hold
	  _children = [];
	  constructor(data) {
	  	  this.data = data;
		  this.solved = false;
		  this.ready = false;
	  }
	  addChild(node){
	  	this._children.push(node);
		node.parent = this;
	  }
	  traverseEQ() {		  
		  
		  //is every child solved == true? if not, traverese children
		  
		  while (this.solved == false) {
			  
			  function checkSolved(child) {
			  	  return child.solved == true;
			  }
			  function checkReady(child) {
			  	  return child.ready == true;
			  }
			  var len = this._children.length;
			  
			  //If no children, check if all siblings are resolved, if so, solve parent, otherwise exit
			  if (len == 0) {
				  if (this.parent._children.every(checkReady) == true) {
					  formulas(this.parent);
				  } else {
					  return;
				  }
			  //If node has children, check if its root node, if so check if all children are resolved, if so solve
			  //the parent node. otherwie tracerse the children.
			  // If it is not the root node (this.parent != null) then check the parents children solved status
			  // if solved then solve parent, otherwise traverse children 
			  } else {
				  if (this.parent == null) {
					  if (this._children.every(checkReady)==true) {
					  	formulas(this);
					  } else {
						  for (var i=0; i<len; i++) {
							  this._children[i].traverseEQ();
						  } 
					  }
				  } else {
					  //If the node has a parent, first check if the parents children are all ready
					  //This checks if all siblings of the current this are ready, if so sends it to formulas
					  if (this.parent._children.every(checkReady) == true) {
						  formulas(this.parent);
					  
					  //Below we then check if all the children of this are ready, if so send to formulas
					  } else if (this._children.every(checkReady) == true){
					  	  formulas(this);
					  } else {
						  for (var i=0; i<len; i++) {
							  this._children[i].traverseEQ();
						  }
					  }   	
				  }
			  }
	  	  }
	  return this.solvedVal;
	  }
} 



function makeTree(tokens) {  
	var currNode;
	var rootNode;	
	//var nodes = []
  
	for (var i = 0; i < tokens.length; i++) {
  	  var type = tokens[i].type;
  	  var data = tokens[i].value;
	  //console.log(`type is: ${type} and value is: ${data}`);  
	  if (type == "Function") {
  		  data = data.toUpperCase();
		  var n = new Node(data);
		  //nodes.push(n);
  		  currNode.addChild(n);
	      currNode = n; 
  	  } else if (type == "refArray") {
  		  var n = new Node(data);
		  n.ready = true;
		  n.solvedVal = data;
		  //nodes.push(n);
		  currNode.addChild(n);
		  currNode = n;
  	  } else if (type == "Literal") {
  		  var n = new Node(data);
		  n.ready = true;
		  n.solvedVal = parseFloat(data);
		  //nodes.push(n);
		  currNode.addChild(n);
		  currNode = n;
  	  } else if (type == "string") {
  	  	  var n = new Node(data);
		  n.ready = true;
		  n.solvedVal = data;
  		  currNode.addChild(n);
	      currNode = n; 
  	  } else if (type == "Left Paren") {
  		  //currNode = nodes[i-1];
  	  } else if (type == "Right Paren") {
  		  currNode = currNode.parent;
  	  } else if (type == "Operator") {
		  if (data == "=") {
	  		  var n = new Node(data);
			  //nodes.push(n);
	  		 rootNode = n;
			 currNode = n;
			 
		 } else {
		 	currNode = currNode.parent;
		 }
  	  } else if (type == "Arg Sep") { 	
         currNode = currNode.parent;
	  }
		
	}

  console.log(rootNode);
  return rootNode;
}

function formulas(currNode){
  
	switch (currNode.data) {
	  case "SUM":
		  var result = 0;
		  var arrayResult=0;
		  var childCount = currNode._children.length;
		  
		  //Loop through children and add each child to previous children
		  for (var i=0; i<childCount; i++) {
			  var currChild = currNode._children[i];
			
			//If the child is an array then add all the elements of the array together
			var reduce = Array.isArray(currChild.data);
			if (reduce) {
				//Reduce function below sums all numbers in an array
				currChild.solvedVal = currChild.data.reduce(function(a,b) {return parseFloat(a)+parseFloat(b);},0);
				currChild.solved = true;
			}
			
			//if the child.solved is is not true, meaning its a literal then add that to the result
			if (currChild.solved != true) {
		    	result += currChild.solvedVal;
			//If the child.solved is true, meaning it was a function that was solved, then take the solvedVal
			//Because the child.data is going to be the function name
		    } else if (currChild.solved == true) {
		    	result += currChild.solvedVal;
		    }
			currChild.solved = true;
		  }
		  currNode.solved = true;
		  currNode.ready = true;
		  currNode.solvedVal = result;
		  break;
	  case "=":
		  var result = 0;
		  var childCount = currNode._children.length;
		  for (var i=0; i<childCount; i++) {
		  	result += currNode._children[i].solvedVal;
		  }
		  
		  currNode.solved = true;
		  currNode.ready = true;
		  currNode.solvedVal = result;
		  
		  break;
	  case "SUMIF":
	  case "SUMIFS":
		  //arguments: [sum range],[criteria_range1], criteria1
		  var result = 0;
		  //create array that will combine all arrays from formula
		  var comArray = [];
		  var criArray = [];
		  //Later: insert validation checks here that all ref arrays are same length, 
		  //and that sum array is all values
		  
		  //combine all arrays into 1 array
		  var childCount = currNode._children.length;
		  for (var i=0; i<childCount; i++) {
			  //check if each child is an Array, if it is store in comArray if not store in criteria rray
			  var isArray = Array.isArray(currNode._children[i].data);
			  if (isArray) {
				  comArray.push(currNode._children[i].data);
				  currNode._children[i].solved = true
			  } else {
				  criArray.push(currNode._children[i].data);
				  currNode._children[i].solved = true
			  }
			  
		  }
		  //find the length of the first column of comArray to understand how many rows are highlighted
		  var comArrayLen = comArray[0].length;
		  //check length of criteria array to see how many criteria there are
		  var criArrayLen = criArray.length;
		  //go through the comArray column 1 (criteriaRange_1) and check if it matches criteriaArray[0]
		  //Which is criteria_1
		  for (var j=0; j<=comArrayLen; j++) {
			  var rowCheck = true;
			  for (var c=1;c<=criArrayLen;c++) {
				  if (comArray[c][j] != criArray[c-1]) {
					  rowCheck = false
				  } 
				  console.log(`rowCheck: ${rowCheck}`);
			  }
			  if (rowCheck == true) {
				  result += parseFloat(comArray[0][j]);
			  }
		  }
		  
		  //console.log(comArray);
		  currNode.solved = true;
		  currNode.ready = true;
		  currNode.solvedVal = result;
		  
		  break;
	  case "COUNTIF":
	  case "COUNTIFS":
		  //arguments: [sum range],[criteria_range1], criteria1
		  var result = 0;
		  //create array that will combine all arrays from formula
		  var comArray = [];
		  var criArray = [];
		  //Later: insert validation checks here that all ref arrays are same length, 
		  //and that there is criteria for each criteria array
		  
		  //combine all arrays into 1 array
		  var childCount = currNode._children.length;
		  for (var i=0; i<childCount; i++) {
			  //check if each child is an Array, if it is store in comArray if not store in criteria rray
			  var isArray = Array.isArray(currNode._children[i].data);
			  if (isArray) {
				  comArray.push(currNode._children[i].data);
				  currNode._children[i].solved = true
			  } else {
				  criArray.push(currNode._children[i].data);
				  currNode._children[i].solved = true
			  }
			  
		  }
		  //find the length of the first column of comArray to understand how many rows are highlighted
		  var comArrayLen = comArray[0].length;
		  //check length of criteria array to see how many criteria there are
		  var criArrayLen = criArray.length;
		  //go through the comArray column 1 (criteriaRange_1) and check if it matches criteriaArray[0]
		  //Which is criteria_1
		  for (var j=0; j<=comArrayLen; j++) {
			  var rowCheck = true;
			  for (var c=0;c<criArrayLen;c++) {
				  console.log(`rowCheck{value: ${comArray[c][j]}, criteria: ${criArray[c]}`);
				  if (comArray[c][j] != criArray[c]) {
					  rowCheck = false
				  } 
				  
			  }
			  if (rowCheck == true) {
				  result++;
			  }
		  }
		  
		  //console.log(comArray);
		  currNode.solved = true;
		  currNode.ready = true;
		  currNode.solvedVal = result;
		  
		  break;
		  
		  	
	}		
}
function fEval(fInput){
	console.log(`fEval fired`);
	var tokens = tokenize(fInput);
	var rootNode = makeTree(tokens);
	var solvedVal = rootNode.traverseEQ();
	return solvedVal;
	console.log(solvedVal);
}
