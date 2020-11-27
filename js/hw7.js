/*
Paprawin Boonyakida
GUI Programming 1
Assignment 7: Implementing multiplication using jQuery's Tab and Slider library
paprawin_boonyakida@student.uml.edu
*/

// indicate table id from html here
var tabID = "table"; 
var tabsNum = 0;
var table;

//if tabs already exist, add a new tab after the last tab. If not, create a new tab
function addTab(table){
  tabsNum++;
  // If tab already exists, add a new tab after a last tab
  if($("div#tabs ul li").length != 0){
  // obtain the last tab to get info about its number
  var last_child = $("div#tabs ul li:last-child");

  //get the number of the last tab
  var last_tab_no = last_child.attr("aria-controls").replace("tab", "");

  last_tab_no++;

  $("div#tabs ul").append("<li><a href='#tab" + last_tab_no + "'>" + "Table" + last_tab_no + "</a></li>");
  // append table to the tab
  var last_div = $("div#tabs:last-child");
  $("div#tabs").append("<div id='tab" + last_tab_no + "'>" + table.outerHTML + "</div>");
  $("div#tabs").tabs("refresh");
  // Make the newly created table active
  $("div#tabs").tabs( "option", "active", last_tab_no );
  }
  //otherwise, create the first tab
  else{
    $("div#tabs ul").append("<li><a href='#tab" + 1 + "'>" + "Table" + 1 + "</a></li>");
    $("div#tabs").append("<div id='tab" + 1 + "'>" + table.outerHTML + "</div>");
    $("div#tabs").tabs("refresh");
    $("div#tabs").tabs( "option", "active", 0 );
  }
}

//Deletes current tab
function delCurrTab(){
  //Only delete tabs if there is at least 1 tab remaining
  if($("div#tabs ul").length > 0){

    //get the tab number to be deleted
    var active_tab = $("div#tabs ul li[class~='ui-state-active']").attr("aria-controls").replace("tab","");
    // get the index
    var active_tab_index = $("div#tabs ul li[class~='ui-state-active']").index();

    //get its sibling so that the tab on the left could be opened
    var prev_tab = $("div#tabs ul li[class~='ui-state-active']").prev();

    //remove the div element belonging to the tab
    $("#tabs #tab" + active_tab).remove();

    //remove the li element belonging to the tab
    $("a[href$=tab" + active_tab + "]").parent().remove();

    // refresh
    $("div#tabs").tabs("refresh");
    
    //tab removed wasn't the first tab, so activate a tab to the left
    if(active_tab_index != 0){
      $( "#tabs" ).tabs( "option", "active", prev_tab.index());
    }
    //else the first tab was removed, so open the tab immediately next to it(right)
    else{
      $( "#tabs" ).tabs( "option", "active", 0);
    }
  }
}


/*Test to determine if column max > min to flag the error*/
$.validator.addMethod("colTest", function(value, param) {
  
  /* notifies the validator that an error exists */
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
  var tabs = $( "#tabs" ).tabs();
  table = generateTable(1, 5, 1, 5, tabID);
  addTab(table);

  /*Validate the form to check all field is valid*/
  $("#inputForm").validate({
    /*Define rules to validate the input before data are submitted*/
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
	/*Define error messages to tell user where errors occurred*/
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
        colTest: "<p>Must be greater than column Min</p>"
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
        rowTest: "<p>Must be greater than row Min</p>"
      },
    },
    /* When all conditions are met, finally generate table*/
    submitHandler: function(form, e){
      /*prevent page from refreshing when the user submits*/
      e.preventDefault();
	  
	  /* removes old table*/
      removeOldTab(tabID); 
	  
	  /*Call the function to generate table using the validated input from user
	    Also parse the input values into integers*/
      generateTable(parseInt($("#colMin").val()),parseInt($("#colMax").val()),parseInt($("#rowMin").val()),parseInt($("#rowMax").val()),tabID);
    }
  });
});


/*Table Generator:
  Only correctly validated values are accepted,
  so this function should get called if validateInput() returns error code 0.
  Returns a table object to be placed inside a tab
*/
function generateTable(cmin, cmax, rmin, rmax, table_id) {
  var table = document.createElement(table_id);
  
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
  return table;
}

// Removes old table so the new table can be set
function removeOldTab(tabID){
  var oldTab = document.getElementById(tabID);
  while(oldTab.hasChildNodes()){
    oldTab.removeChild(oldTab.firstChild); // remove all children of old table
  }
}

// Allows user to add more tabs when the add-tab button is clicked
$("#addTabs").on("click", function() {
  addTab(table, tabsNum);
});

//Allows user to delete tabs when del-tab button is clicked
$("#delTabs").on("click", function() {
  delCurrTab();
});



//initialize tabs
//$("#tabs").tabs();
//table = generateTable(1, 5, 1, 5, tabID);
//addTab(table, tabsNum);
