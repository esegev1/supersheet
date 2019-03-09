
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

function tokenize(str) {
  var result=[]; //array of tokens
  
  // remove spaces; remember they don't matter?
  str.replace(/\s+/g, "");
  // convert to array of characters
  str=str.split("");
  
  var result=[];
  var stringBuffer=[];

  str.forEach(function (char, idx) {
	  console.log(`Start char is ${char} stringBuffer is ${stringBuffer}`);
	  //Step 1. Check if char is an operator
	  //This should then work well with the idea of skipping through tree nodes
	  if (/\+|-|\*|\/|\^/.test(char)) { //If operator, we need to take everything before the op and deal with it
		  emptyStringBuffer();  //here we empty the string buffer, which contains everything prior to operator
		  //Add the operator token, later also skip up tree nodes
		  result.push(new Token("Operator",char));
	  } else if (char == "(") {//Is it a left paren?
		  emptyStringBuffer(); 
		  //Add the Left Paren token, later also skip up tree nodes
		  result.push(new Token("Left Paren",char));
	  } else if (char == ")") {//Is it a right paren?
		  emptyStringBuffer(); 
		  //Add the right Paren token, later also skip up tree nodes
		  result.push(new Token("Right Paren",char));
	  } else if (char == ",") {//is it a comma?
		  emptyStringBuffer(); 
		  //Add the "unction Argument Separator token, later also skip up tree nodes
		  result.push(new Token("Arg Sep",char));
	  } else {
	  	stringBuffer.push(char);
	  }
	  
	});  
	
	emptyStringBuffer();  
	console.log(result);
	//console.log(`result is ${JSON.stringify(result)}`);
    //Function below takes the stringBuffer and figures out if it is a Ref, function or literal then adds token
	  function emptyStringBuffer() {
      	if (stringBuffer.length) {
      		var str1 = stringBuffer.join("");
			var isLet = /[a-z]/i.test(str1);
			var isDig = /\d/.test(str1);
			if (isLet && isDig){
				result.push(new Token("Ref", str1));
			} else if (isLet == true && isDig == false) {
				result.push(new Token("Function", str1));
			} else if (isLet == false && isDig == true) {
				result.push(new Token("Literal", str1));
			}
      		stringBuffer=[];
      	}
      }
	  return result;
  }
	  
/**********************************************************************************
*          This function take the result array from Tokenize
*            and then puts it into a node & tree consturcuts
*
*
************************************************************************************/
  
  //Code below takes all of the tokens and arranges them into a data tree
function Node(data) {
	 this.data = data;
	 this.parent = null;
	 this.children = [];
	 console.log(`Node created, data is: ${this.data}`);
	 return this;
}	  

function Tree(data) {
	console.log(`Tree`);
	var node = new Node(data);
	this._root = node;
	return this;
}  

Tree.prototype.traverseDF = function(callback) {
 
    // this is a recurse and immediately-invoking function 
    (function recurse(currentNode) {
        // step 2
        for (var i = 0, length = currentNode.children.length; i < length; i++) {
            // step 3
            recurse(currentNode.children[i]);
        }
 
        // step 4
        callback(currentNode);
         
        // step 1
    })(this._root);
 
};

Tree.prototype.traverseBF = function(callback) {
    var queue = new Queue();
     
    queue.enqueue(this._root);
 
    currentTree = queue.dequeue();
 
    while(currentTree){
        for (var i = 0, length = currentTree.children.length; i < length; i++) {
            queue.enqueue(currentTree.children[i]);
        }
 
        callback(currentTree);
        currentTree = queue.dequeue();
    }
};

Tree.prototype.add = function(data, toData, traversal) {
    var child = new Node(data),
        parent = null,
        callback = function(node) {
            if (node.data === toData) {
                parent = node;
            }
        };
 
    this.contains(callback, traversal);
 
    if (parent) {
        parent.children.push(child);
        child.parent = parent;
    } else {
        throw new Error('Cannot add node to a non-existent parent.');
    }
};

function makeTree(result) {  
  //Below  creates a new Tree
  var tree = Tree('=');
  console.log(tree);
  var currNode = tree._root;
  var prevValue = currNode.value;
  console.log(`1. currNode: data is ${currNode.data}, parent is ${currNode.parent}`);
 
  result.forEach(function(obj){
	  var type = obj.type;
	  var value = obj.value;
	  console.log(`type is: ${type} and value is: ${value}, also currNode.data is ${currNode.data}`);
	  if (type == "Ref" || type == "Function" || type == "Literal") {
		  
		  console.log(`step 1`);
		  console.log(tree);
		  tree.add(value, prevValue, tree.traverseDF);
		  
		 /* 
		  console.log(`2. currNode: data is ${currNode.data}`);
		  //creates a node with the value of the obj, then sets the currNode as its parent
		  //currNode = {children: [Node(value)]};	  
		  //var node = Node.call(currNode, value);
		  //node.parent = currNode;
		  //var node = Node(value);
		  //FOR SOME REASON AFTER THE LINE ABOVE THE CURRNODE VARIABLE CHANGES TO THE NEW 
		  
		  console.log(`2a. currNode: data is ${currNode.data}`);
		  //node.parent = currNode;		  0
		  //currNode.children.push(Node(value));
		  console.log(currNode);
		  console.log(`3. currNode: data is ${currNode.data}`);
		  //currNode = node;
		  //console.log(`4. currNode: data is ${currNode.data}, parent is ${currNode.parent.data}`);
		  //console.log(`tree._root is: ${tree._root}`);
		  
		  //currNode = node;
		  */
		  console.log(`step 2`);
		  console.log(tree);
		  	  
	  } else if (type == "Left Paren") {
	  } else if (type == "Right Paren") {
		  currNode = currNode.parent;
	  } else if (type == "Operator") {
	  } else if (type == "Arg Sep") {
		  //currNode = currNode.parent;
	  } 
	  prevValue = value;
  });

  console.log(tree._root);
  console.log(tree._root.children[0]);
  console.log(tree._root.children[1]);

  treeIndent(treeify(shuffle(result)), {
      hasNextSibling:         '&boxvr;',
      isLastChild:            '&boxur;',
      ancestorHasNextSibling: '&boxv;',
      ancestorIsLastChild:    ' '
  }, function (element, indent) {
      //console.log(indent.join(' ') + ' ' + element.name + "\n");
	  //log.innerHTML += indent.join(' ') + ' ' + element.name + "\n";
  });
		
}	

function shuffle(array) {
    var m = array.length, t, i;

    // While there remain elements to shuffle…
    while (m) {
        // Pick a remaining element…
        i = Math.floor(Math.random() * m--);

        // And swap it with the current element.
        t = array[m];
        array[m] = array[i];
        array[i] = t;
    }

    return array;
}

function treeify(flat) {
    var map = { __root__: { children: [] }};

    flat.forEach(function (node) {
        var
            parentId = node.parent_id || '__root__',
            id = node.id;

        // init parent
        if (!map.hasOwnProperty(parentId)) {
            map[parentId] = { element: null, children: [] };
        }

        // init self
        if (!map.hasOwnProperty(id)) {
            map[id] = { element: null, children: [] };
        }

        map[id].element = node;
        map[parentId].children.push(map[id]);
    });

    return map.__root__.children;
}

function treeIndent(branch, cfg, decorator, indent)
{
    indent = indent || [];

    branch.forEach(function (node, i) {
        decorator(node.element, indent.concat(
            i === branch.length - 1 ? cfg.isLastChild : cfg.hasNextSibling
        ));

        treeIndent(node.children, cfg, decorator, indent.concat(
            i === branch.length - 1 ? cfg.ancestorIsLastChild : cfg.ancestorHasNextSibling
        ));
    });
}
