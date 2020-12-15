/*
Paprawin Boonyakida
GUI Programming 1
Assignment 8: Using Draggable/Droppable to make a single-line scrabble game
paprawin_boonyakida@student.uml.edu
*/

//keeps track of current score
var curr_score = 0;

//total score from all games
var total_score = 0;

var remaining_tile = 0; 

var empty_board = true;

// most recently used board
var recent_board = "";

//flag if the user places any tile onto the bonus spots
var first_bonus = false;
var second_bonus = false;

//String:  keeps track of current word user displays
var curr_word;

//each element in this array will act as an index to the ScrabbleTiles array
var indexArr = [];

//ASCII values range from 65 to 90. 95 is an empty space
// scrabble tile array taken from https://jesseheines.com/~heines/91.461/91.461-2015-16f/461-assn/Scrabble_Pieces_AssociativeArray_Jesse.js
var ScrabbleTiles = [] ;
ScrabbleTiles["A"] = { "value" : 1,  "original-distribution" : 9,  "number-remaining" : 9  } ;
ScrabbleTiles["B"] = { "value" : 3,  "original-distribution" : 2,  "number-remaining" : 2  } ;
ScrabbleTiles["C"] = { "value" : 3,  "original-distribution" : 2,  "number-remaining" : 2  } ;
ScrabbleTiles["D"] = { "value" : 2,  "original-distribution" : 4,  "number-remaining" : 4  } ;
ScrabbleTiles["E"] = { "value" : 1,  "original-distribution" : 12, "number-remaining" : 12 } ;
ScrabbleTiles["F"] = { "value" : 4,  "original-distribution" : 2,  "number-remaining" : 2  } ;
ScrabbleTiles["G"] = { "value" : 2,  "original-distribution" : 3,  "number-remaining" : 3  } ;
ScrabbleTiles["H"] = { "value" : 4,  "original-distribution" : 2,  "number-remaining" : 2  } ;
ScrabbleTiles["I"] = { "value" : 1,  "original-distribution" : 9,  "number-remaining" : 9  } ;
ScrabbleTiles["J"] = { "value" : 8,  "original-distribution" : 1,  "number-remaining" : 1  } ;
ScrabbleTiles["K"] = { "value" : 5,  "original-distribution" : 1,  "number-remaining" : 1  } ;
ScrabbleTiles["L"] = { "value" : 1,  "original-distribution" : 4,  "number-remaining" : 4  } ;
ScrabbleTiles["M"] = { "value" : 3,  "original-distribution" : 2,  "number-remaining" : 2  } ;
ScrabbleTiles["N"] = { "value" : 1,  "original-distribution" : 6,  "number-remaining" : 6  } ;
ScrabbleTiles["O"] = { "value" : 1,  "original-distribution" : 8,  "number-remaining" : 8  } ;
ScrabbleTiles["P"] = { "value" : 3,  "original-distribution" : 2,  "number-remaining" : 2  } ;
ScrabbleTiles["Q"] = { "value" : 10, "original-distribution" : 1,  "number-remaining" : 1  } ;
ScrabbleTiles["R"] = { "value" : 1,  "original-distribution" : 6,  "number-remaining" : 6  } ;
ScrabbleTiles["S"] = { "value" : 1,  "original-distribution" : 4,  "number-remaining" : 4  } ;
ScrabbleTiles["T"] = { "value" : 1,  "original-distribution" : 6,  "number-remaining" : 6  } ;
ScrabbleTiles["U"] = { "value" : 1,  "original-distribution" : 4,  "number-remaining" : 4  } ;
ScrabbleTiles["V"] = { "value" : 4,  "original-distribution" : 2,  "number-remaining" : 2  } ;
ScrabbleTiles["W"] = { "value" : 4,  "original-distribution" : 2,  "number-remaining" : 2  } ;
ScrabbleTiles["X"] = { "value" : 8,  "original-distribution" : 1,  "number-remaining" : 1  } ;
ScrabbleTiles["Y"] = { "value" : 4,  "original-distribution" : 2,  "number-remaining" : 2  } ;
ScrabbleTiles["Z"] = { "value" : 10, "original-distribution" : 1,  "number-remaining" : 1  } ;
ScrabbleTiles["_"] = { "value" : 0,  "original-distribution" : 2,  "number-remaining" : 2  } ;



/*make sure document is ready*/
$(document).ready(function() {

  var i
  //populate index array to be used in picking and modifying actual tile datas
  for (i = 65; i <= 90; i++){
    //push letters from A through Z to an index array
    indexArr.push(String.fromCharCode(i))
  }
  indexArr.push("_");
  
  //activates the drag/drop functionality of the jQuery UI
  activateDragDrop();

  //display the number of remaining tiles to the webpage for the user to see
  get_num_remaining();

  //resets the rack
  reset_rack();
});

function activateDragDrop(){
    //activate draggable/droppable items
  // this part of code was partially taken from https://jqueryui.com/droppable/#revert
  $(".draggable").draggable({
    revert:"invalid",
  });
  $(".droppable").droppable({
      accept: function() {
        //if board is empty, user can put a tile anywhere freely
        if(empty_board){
          return true;
        }
        //if the board space is not occupied
        else if (!$(this).hasClass('occupied')) {
          // only allow user to place into adjacent board
          var boardNum = $(this)[0].id;

          // gets last char in the string which represents the board spot's number
          boardNum = boardNum.substr(boardNum.length -1); 

          //case: first block
          if(boardNum == 1){
            //check if the next block has a tile, if it has then allow tile to be placed on the first board spot
            var nextBoard = $("#board2");
            if(nextBoard.hasClass('occupied')){
              return true;
            }
          }
          //case: last block of the board
          else if(boardNum == 7){
            var prevBoard = $("#board6");
            //check if the previous board spot has a tile, if it has then allow tile to be placed on the last board spot
            if(prevBoard.hasClass('occupied')){
              return true;
            }
          }
          // below will check and only allow tiles to be placed if adjacent tile exists
          else if($("#board" + (parseInt(boardNum[0]) +1)).hasClass('occupied')){
            return true;
          }
          else if($("#board" + (parseInt(boardNum[0]) -1)).hasClass('occupied')){
            return true;
          }
          else{
            //else do not allow the tile to be placed
            return false;
          }
        }
        else{
          //else board is occupied, don't allow new tile to be placed
          return false;
        }
      },
      classes: {
        "ui-droppable-active": "ui-state-active",
        "ui-droppable-hover": "ui-state-hover"
      },
      drop: function( event, ui ) {

        //get the absolute position of the current board spot
        var abs_x = this.getBoundingClientRect().x;
        var abs_y = this.getBoundingClientRect().y;

        //extract data from the draggable object to change the absolute position
        // then, apply the absolute position
        var tile = ui.draggable[0];


        //set the tile's position to 'this' board's absolute position so the tile is neatly placed onto the board
        $("#" + tile.id).css('position', 'absolute');
        $("#" + tile.id).css('left', abs_x + 'px');
        $("#" + tile.id).css('top', abs_y + 'px');
        
        //flag that this tile is currently being placed on the board
        $("#" + tile.id).addClass('onboard');
        
        //prevent this letter tile from being moved after it has been placed
        $(ui.draggable[0]).draggable("disable"); //disable the current tile being dragged

        var curr_board = event.target;


        //remove the class tag 'vacant'. this signifies that this board spot is not free anymore
        $(curr_board).removeClass("vacant");

        //flag that the board is occupied
        $(curr_board).addClass("occupied");

        //set the global flag to know that an initial letter tile has been placed
        empty_board = false;

        //get this letter tile's character
        var tile_letter = $("#"+tile.id).attr('value');

        //find out how much this tile weights
        var tile_weight = ScrabbleTiles[tile_letter]["value"];
        
        //raw score in this round
        curr_score += parseInt(tile_weight);

        //flag that the first double-word bonus is being used
        if(event.target.id == "board2"){
          first_bonus = true;
        }
        //flag that the second double-word bonus is being used
        if(event.target.id == "board6"){
          second_bonus = true;
        }

        //update current score to user 
        // if 2 bonuses are hit, make the score x4
        if(first_bonus && second_bonus){
          $("#actual_score").text(curr_score*4);
        }
        //if only one of the bonuses is hit, only x2 the raw score
        else if(first_bonus || second_bonus){
          $("#actual_score").text(curr_score*2);
        }
        //else no bonus was hit, so just use the raw score as the score
        else{
          $("#actual_score").text(curr_score);
        }

        //update current word user has just played
        $("#" + event.target.id).attr('value', tile_letter)

        //display the concatenated word to screen
        update_word_displayer();

        //keep track and show how many tiles are left
        //ScrabbleTiles[tile_letter]["number-remaining"]--;
        
        //count and display number of tiles remaining to the webpage
        get_num_remaining();
      }
    });
}

// generates 7 random tiles onto the rack
function reset_rack(){
  var i;
  for (i = 1; i <= 7; i++){
    //get random tile index
    var ranTile = indexArr[Math.floor(Math.random() * indexArr.length)];
    //console.log(ranTile);

    //if this tile is available, insert. Otherwise, get another character tile
    if(ScrabbleTiles[ranTile]["number-remaining"] != 0){

      //insert image of the letter tile into page on the rack
      var t = $("#tile" + i);
      t.attr("src", "images/tiles/Scrabble_Tile_" + ranTile + ".jpg");

      //keep track of how many tile remains in the tile bag
      ScrabbleTiles[ranTile]["number-remaining"]--;

      //record the value of that tile
      t.attr("value", ranTile);
    }
    else{
      i--; // don't count so the for loop and loop again
    }
  }
  get_num_remaining();
}

//displays the word currently played by the user
function update_word_displayer(){
  var i;
  var myWord = ""; 

  //read the board and only read the spots containing a letter tile
  for (i = 1; i <=7; i++){
    if($("#board" + i).hasClass('occupied')){

      //special exception for the underscore
      if ($("#board" +i ).attr('value') == "_"){
        myWord += "-"; // represent space with a dash
      }
      else{
        //add each letter to a placeholder
        myWord += $("#board" +i ).attr('value');
    }
    }
  }
  //display the string onto the webpage
  $("#actual_word").text(myWord);
}

//change the tiles currently being played on the board
//this only gets called when the user press submit
function change_tiles(){
  var i;
  for (i = 1; i <= 7; i++){
    //get random tile index
    var ranTile = indexArr[Math.floor(Math.random() * indexArr.length)];

    //only applied to the tile being played on the board
    if($("#tile"+i).hasClass('onboard')){
      //if this tile is available, insert. Otherwise, get another character tile
      if(ScrabbleTiles[ranTile]["number-remaining"] != 0){

        //add image of the letter tile
        var t = $("#tile" + i);
        t.attr("src", "images/tiles/Scrabble_Tile_" + ranTile + ".jpg");

        //record the value of the tile
        t.attr("value", ranTile); // add value

        // reduce the count of that specific tile
        ScrabbleTiles[ranTile]["number-remaining"]--; 
        // remove the flag that the tile is onboard
        t.removeClass('onboard'); 
      }
      else{
        i--; // don't count so the for loop will loop again
      }
    }
  }
}

//clears and reset the class vacant in each of the board's placeholder
function reset_board(){
  var i;

  //for each spot of the board
  for (i = 1; i <= 7; i++){
    var board = $("#board" + i);

    //do a clean reset of the vacant/occupied class tag
    board.removeClass("vacant");
    board.removeClass("occupied");
    board.addClass("vacant");
  }
  //flag that the board is empty. This will allow the first tile to be placed anywhere
  empty_board = true; //flag that the board is empty again
}

//get number of tiles remaining and display it on screen
function get_num_remaining(){
  var counter = 0;
  var i;
  //count all the tiles remaining
  for (i = 0; i < indexArr.length; i++){
    counter += ScrabbleTiles[indexArr[i]]["number-remaining"];
  }
  remaining_tiles = counter;
  //display onto the website
  $("#tiles_remaining").text(remaining_tiles);
}

//refill the missing tiles on the rack when the submit button is pressed
$("#submit_btn").on("click", function() {

  //grab existing total score
  var tot = parseInt($("#total_score").text());

  //add the current round's score to it
  tot += parseInt($("#actual_score").text());

  //update/display total score to the webpage
  $("#total_score").text(tot);

  //reset current score
  $("#actual_score").text("0");
  
  //reset word displayer
  $("#actual_word").text("");

  //reset the value placeholder on each board space
  var i;
  for(i = 1; i <= 7; i++){
    var boardSpace = $("#board" + i);
    boardSpace.attr('value', "0");
    boardSpace.removeClass('occupied');
    boardSpace.addClass('vacant');
  }
  $(".draggable").attr( "style", "position: relative" );
  $(".draggable").removeClass("ui-draggable-disabled");

  //reset the bonus flag and score at the end of each round
  first_bonus = false;
  second_bonus = false;
  empty_board = true;
  curr_score = 0;

  //replace the tiles played while still keeping the ones that user didn't play
  change_tiles();

  //destroy the draggable tiles
  $(".draggable").draggable("destroy");

  //re-activate the draggable elements
  activateDragDrop();

  //count remaining tiles
  get_num_remaining();

});

//restart the game, so reset everything
$("#restart_btn").on("click", function() {
  //refresh the page
  location.reload();
});