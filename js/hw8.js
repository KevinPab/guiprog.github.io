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
    indexArr.push(String.fromCharCode(i))
  }
  indexArr.push("_");

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
          boardNum = boardNum.substr(boardNum.length -1); // gets last number representing the board string

          //case first block
          if(boardNum == 1){
            var nextBoard = $("#board2");
            if(nextBoard.hasClass('occupied')){
              return true;
            }
          }
          //case last block of the board
          else if(boardNum == 7){
            var prevBoard = $("#board6");
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
            //Record error message here
            return false;
          }
        }
        else{
          //else board is occupied, don't allow new tile to be placed
          //could also print error message suggesting user to place to an adjacent tile on board
          return false;
        }
      },
      classes: {
        "ui-droppable-active": "ui-state-active",
        "ui-droppable-hover": "ui-state-hover"
      },
      drop: function( event, ui ) {

        //console.log("DROP ACCEPTED\n");

        //here, 'this' refers to a droppable object (board)
        var abs_x = this.getBoundingClientRect().x;
        var abs_y = this.getBoundingClientRect().y;

        //extract data from the draggable object to change the absolute position
        // then, apply the absolute position
        var tile = ui.draggable[0];

        $("#" + tile.id).css('position', 'absolute');
        $("#" + tile.id).css('left', abs_x + 'px');
        $("#" + tile.id).css('top', abs_y + 'px');

        $(ui.draggable[0]).draggable("disable"); //disable the current tile being dragged

        var curr_board = event.target;

        $(curr_board).removeClass("vacant");
        //flag that the board is occupied
        $(curr_board).addClass("occupied");

        empty_board = false; // flag that a tile has been placed into the board

        //also update the current and total score
        //get letter
        var tile_letter = $("#"+tile.id).attr('value');
        //find out how much this tile weights
        var tile_weight = ScrabbleTiles[tile_letter]["value"];

        var score_with_bonus = 0;
        
        //update both current and total score
        curr_score += parseInt(tile_weight);

        //flag that a bonus is being used
        if(event.target.id == "board2"){
          first_bonus = true;
        }
        if(event.target.id == "board6"){
          second_bonus = true;
        }

        //update current score to user, if the bonus is hit, update double the score
        if(first_bonus && second_bonus){
          $("#actual_score").text(curr_score*4);
        }
        //if only one of the bonuses is hit, only multiply by 2
        else if(first_bonus || second_bonus){
          $("#actual_score").text(curr_score*2);
        }
        //else no bonus was hit
        else{
          $("#actual_score").text(curr_score);
        }
        $("#total_score").text(total_score);

        //update current word user has just played
        $("#" + event.target.id).attr('value', tile_letter)

        //display the concatenated word to screen
        update_word_displayer();

        //keep track and show how many tiles are left
        ScrabbleTiles[tile_letter]["number-remaining"]--;
        
        //get number of remaining tiles (not placed onto the board)
        get_num_remaining();
 
      }
    });
  
  get_num_remaining();

  //for debugging
  //console.log(remaining_tiles);

  //resets the rack
  reset_rack();
});

//displays the word currently played by the user
function update_word_displayer(){
  var i;
  var myWord = ""; 
  for (i = 1; i <=7; i++){
    if($("#board" + i).hasClass('occupied')){
      if ($("#board" +i ).attr('value') == "_"){
        myWord += "-"; // represent space with a dash
      }
      else{
        myWord += $("#board" +i ).attr('value');
    }
    }
  }
  $("#actual_word").text(myWord);
}

// generates 7 random tiles onto the rack
function reset_rack(){
  var i;
  for (i = 1; i <= 7; i++){
    var tileIndex = 65;
    //get random tile index
    var ranTile = indexArr[Math.floor(Math.random() * indexArr.length)];
    //console.log(ranTile);

    //if this tile is available, insert. Otherwise, get another character tile
    if(ScrabbleTiles[ranTile]["number-remaining"] != 0){

      //insert into page
      //var tile = document.getElementById("tile" + i).src = "images/tiles/Scrabble_Tile_" + ranTile + ".jpg";
      var t = $("#tile" + i);
      t.attr("src", "images/tiles/Scrabble_Tile_" + ranTile + ".jpg");
      t.addClass("tid" + ranTile);
      t.attr("value", ranTile); // add value

      // keep track of how many of this tile remains
      //ScrabbleTiles[ranTile]["number-remaining"]--;
    }
    else{
      i--; // don't count so the for loop and loop again
    }

    //decrease the count of the tile
  }
}

//clears and reset the class vacant in each of the board's placeholder
function reset_board(){
  var i;
  for (i = 1; i <= 7; i++){
    var board = $("#board" + i);
    board.removeClass("vacant");
    board.removeClass("occupied");
    board.addClass("vacant");
  }

  empty_board = true; //flag that the board is empty again
}

//get number of tiles remaining
function get_num_remaining(){
  var counter = 0;
  var i;
  for (i = 0; i < indexArr.length; i++){
    counter += ScrabbleTiles[indexArr[i]]["number-remaining"];
    //console.log(indexArr[i] + " has remaining" + ScrabbleTiles[indexArr[i]]["number-remaining"]);
  }
  remaining_tiles = counter;
  $("#tiles_remaining").text(remaining_tiles);
  //console.log("remaining:" + remaining_tiles);
}
