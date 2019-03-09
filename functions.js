/**********************************************************************************
*             Code below controls the in-cell function that users can call
*             by using "=XXX()"
*
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
str.forEach(function (char, idx) {
    if(isDigit(char)) {
      result.push(new Token("Literal", char));
    } else if (isLetter(char)) {
      result.push(new Token("Variable", char));
    } else if (isOperator(char)) {
      result.push(new Token("Operator", char));
    } else if (isLeftParenthesis(char)) {
      result.push(new Token("Left Parenthesis", char));
    } else if (isRightParenthesis(char)) {
      result.push(new Token("Right Parenthesis", char));
    } else if (isComma(char)) {
      result.push(new Token("Function Argument Separator", char));
    }
  });
  return result;
}

function isComma(ch) {
 return (ch === ",");
}
function isDigit(ch) {
 return /\d/.test(ch);
}
function isLetter(ch) {
 return /[a-z]/i.test(ch);
}
function isOperator(ch) {
 return /\+|-|\*|\/|\^/.test(ch);
}
function isLeftParenthesis(ch) {
 return (ch === "(");
}
function isRightParenthesis(ch) {
 return (ch == ")");
}
