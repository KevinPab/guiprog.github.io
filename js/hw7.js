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

//Default min and max values for column and row
var def_rmin = 1;
var def_rmax = 5;
var def_cmin = 1;
var def_cmax = 5;

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
  //initialize tabs feature
  var tabs = $( "#tabs" ).tabs();

  //create default table
  var default_table = generateTable(def_cmin, def_cmax, def_rmin, def_rmax, tabID);

  //create a first default tab with 5x5 multiplication table
  addTab(default_table);

  //put default values into the slider
  $("#colMin").val( def_cmin );
  $("#colMax").val( def_cmax );
  $("#rowMin").val( def_rmin );
  $("#rowMax").val( def_rmax );

  /*Validate the form to check all field is valid*/
  var my_input = $("#inputForm");
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
	    console.log("document validated!");
      bind_slider();
    }
  });


  // Initialize sliders to a specific default value
  // Note that the numbers on the slide are error-free,
  // so the slider will also update the values in the input field without requiring validation
  //Min Column
  $("#slider1").slider({
      range: "min",
      value: 1,
      min: -50,
      max: 50,
      slide: function( event, ui ) {
      $("#colMin").val( ui.value );
      }
  });
  //Max Column
  $("#slider2").slider({
      range: "min",
      value: 5,
      min: -50,
      max: 50,
      slide: function( event, ui ) {
      $("#colMax").val( ui.value );
      }
  });
  //Min Row
  $("#slider3").slider({
      range: "min",
      value: 1,
      min: -50,
      max: 50,
      slide: function( event, ui ) {
      $("#rowMin").val( ui.value );
      }
  });
  //Max Row
  $("#slider4").slider({
      range: "min",
      value: 5,
      min: -50,
      max: 50,
      slide: function( event, ui ) {
      $("#rowMax").val( ui.value );
      }
  });

  //TODO:
  //     update table when a slider is moved and data is valid
  //     when any of the slider is triggered, run validation
  $(".myslide").on("slidechange", function(){
    //runs the validation rules created earlier
    if(my_input.valid()){
      console.log("valid value:" + $("#rowMin").val());
      update_table();
    }
  });
});

//ALL functions below are created just for homework7

//Update the table to display dynamically
//Note: this function also updates the panel name associated with the table
function update_table(){
  var colMin = parseInt($("#colMin").val());
  var colMax = parseInt($("#colMax").val());
  var rowMin = parseInt($("#rowMin").val());
  var rowMax = parseInt($("#rowMax").val());

  //get tab number where table should be removed
  var currently_active_tab_id = $("div#tabs ul li[class~='ui-state-active']").attr("aria-controls");

  //get div where table is stored
  var currently_active_tab_div = $("#" + currently_active_tab_id);

  //Remove the current table within the currently active tab
  currently_active_tab_div.empty();
  
  //create a table using the values obtained from the input text field
  var tmp_table = generateTable(colMin, colMax, rowMin, rowMax, tabID);

  //add the table to the current tab
  currently_active_tab_div.append(tmp_table.outerHTML);

  //Also update the panel name to display the min and max row/column values used
  var curently_active_tab_panel = $("div#tabs ul li[class~='ui-state-active']");
  curently_active_tab_panel.find("a").text("Col(" + colMin + " to " + colMax + ") Row(" + rowMin + " to " + rowMax + ")");

  //do a tab refresh 
  $("div#tabs").tabs("refresh");
}

//allows the slider to change according to the user's input number
function bind_slider(){  
  $( "#slider1" ).slider( "value", $("#colMin").val() );
  $( "#slider2" ).slider( "value", $("#colMax").val() );
  $( "#slider3" ).slider( "value", $("#rowMin").val() );
  $( "#slider4" ).slider( "value", $("#rowMax").val() );
}

//Deletes multiple(selected) tabs when after user press this button
$("#delSelectedTabs").on("click", function() {
  $("input:checkbox").each(function() {
        if ($(this).is(":checked")) {
          var tab_num = $(this).attr("val").replace("tabcheck", "");
          $("div#tab" + tab_num).remove();
          $(this).parent().remove();
        }
    });
  $("div#tabs").tabs("refresh");
});

//Allows user to add new tab. If tab already exists, add a new tab next to existing tab
function addTab(input_table){
  tabsNum++;
  // If tab already exists, add a new tab after a last tab
  if($("div#tabs ul li").length != 0){
  // obtain the last tab to get info about its number
  var last_child = $("div#tabs ul li:last-child");

  //get the number of the last tab
  var last_tab_no = last_child.attr("aria-controls").replace("tab", "");
  
  //increment this so we can create a new tab next to the current tab
  last_tab_no++;
  
  //Append table to tab
  $("div#tabs ul").append("<li><a href='#tab" + last_tab_no + "'>" + "New Tab" + "</a>" + "<input type='checkbox' id='cbox' val='tabcheck"+ last_tab_no +"'>" + "</li>");
  var last_div = $("div#tabs:last-child");
  $("div#tabs").append("<div id='tab" + last_tab_no + "'>" + input_table.outerHTML + "</div>");
  $("div#tabs").tabs("refresh");
  // Make the newly created table active
  $("div#tabs").tabs( "option", "active", last_tab_no );
  }
  //otherwise, create the first tab no no tab exists
  else{
    $("div#tabs ul").append("<li><a href='#tab" + 1 + "'>" + "New Tab" + "</a>" + "<input type='checkbox' id='cbox' val='tabcheck"+ 1 +"'>" +"</li>");
    $("div#tabs").append("<div id='tab" + 1 + "'>" + input_table.outerHTML + "</div>");
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
  var new_table = generateTable(def_cmin, def_rmax, def_rmin, def_rmax, tabID);
  addTab(new_table);
});

//Allows user to delete tabs when del-tab button is clicked
$("#delTabs").on("click", function() {
  delCurrTab();
});

//Perform slider binding when the submit button is pressed
//The actual name of this button is now "Update Table"
$("#generate_btn").on("click", function(){
  //if the input from user is valid, update the slider and the table
  if($("#inputForm").valid()){
    update_table();
    update_slider();
  }

});

