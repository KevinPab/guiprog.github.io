/*
Paprawin Boonyakida
GUI Programming 1
Assignment 6: Implementing jQuery to validate errors and display errors
paprawin_boonyakida@student.uml.edu

Note: Uses event listener to validate input and generate table
*/

var tabID = "table"; // indicate table id from html here

/*Test to determine if column max > min to flag the error*/
$.validator.addMethod("colTest", function(value, param) {
	
	if (parseInt($("#colMax").val()) <= parseInt($("#colMin").val())){
		return false;
	}
	else{
		return true;
	}
});

/*Test to determine if row max > min*/
$.validator.addMethod("rowTest", function(value, param) {
	
	if (parseInt($("#rowMax").val()) <= parseInt($("#rowMin").val())){
		return false;
	}
	else{
		return true;
	}
});

/*make sure document is ready*/
$(document).ready(function() {
	
	/*Validate the form to check all field is valid*/
	$("#inputForm").validate({

	  rules: {
		colMin: {
		  required: true,
		  min: -50,
		  max: 50,
		},
		colMax: {
		  required: true,
		  min: -50,
		  max: 50,
		  colTest: true
		},
		rowMin: {
		  required: true,
		  min: -50,
		  max: 50,
		},
		rowMax: {
		  required: true,
		  min: -50,
		  max: 50,
		  rowTest: true
		}
	  },
	  messages: {
		  colMin: {
			  required: "<p>Please enter a number</p>",
			  min: "<p>Number must be greater than -50</p>",
			  max: "<p>Number must be lesser than 50</p>",
		  },
		  colMax: {
			  required: "<p>Please enter a number</p>",
			  min: "<p>Number must be greater than -50</p>",
			  max: "<p>Number must be lesser than 50</p>",
			  colTest: "<p>Must be greater than column Min"
		  },
		  rowMin: {
			  required: "<p>Please enter a number</p>",
			  min: "<p>Number must be greater than -50</p>",
			  max: "<p>Number must be lesser than 50</p>",
		  },
		  rowMax: {
			  required: "<p>Please enter a number</p>",
			  min: "<p>Number must be greater than -50</p>",
			  max: "<p>Number must be lesser than 50</p>",
			  rowTest: "<p>Must be greater than row Min"
		  },
	  },
	  // When all conditions are met, finally generate table
	  submitHandler: function(form, e){
		  e.preventDefault();
		  removeOldTab(tabID); // removes old table
		  generateTable(parseInt($("#colMin").val()),parseInt($("#colMax").val()),parseInt($("#rowMin").val()),parseInt($("#rowMax").val()),tabID);
		}
	});
});


/*Table Generator:
  Only correctly validated values are accepted,
  so this function should get called if validateInput() returns error code 0.
  Generates table according to user input
*/
function generateTable(cmin, cmax, rmin, rmax, table_id) {
  var table = document.getElementById(table_id);
  
  // Count total rows and columns, inclusive
  var totalRows = rmax - rmin + 1;
  var totalCols = cmax - cmin + 1;
  
  /* To-do:
  	1. Generate Column headers (x-axis)
    2. Generate Row headers (y-axis)
    3. Populate data inside the table using row and column headers as multipliers
  */
  
  //first row holds the column headers
  var firstRow = table.insertRow(0);
  firstRow.insertCell(0).innerHTML = "*"; // the top-left box indicate mathematic operation
  
  //Generate column headers (x-axis)
  for(var i = 0; i < totalCols; i++){
  	firstRow.insertCell(i+1).innerHTML = cmin + i;
  }
  
  // Generate Row headers(y-axis) and populate data
  for (var i = 0; i < totalRows ; i++){
    var row = table.insertRow(i+1);
    // first column cell is a header (y-axis)
    row.insertCell(0).innerHTML = rmin;
    
    // for each row, also fill in all columns
    // populate/calculate data here
    for (var j = 0; j < totalCols; j++){
    	//insert at cell j+1 because first cell is occupied by header
        row.insertCell(j+1).innerHTML = rmin * (cmin+j);
    }
    rmin++; // increment row 
  }
}

// Removes old table so the new table can be set
function removeOldTab(tabID){
	var oldTab = document.getElementById(tabID);
	while(oldTab.hasChildNodes()){
		oldTab.removeChild(oldTab.firstChild); // remove all children of old table
	}
}



