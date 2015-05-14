var playerMoves = []
var playerLoc;
var computerMoves = []
var a1 = ""; // value within each cell
var a2 = "";
var a3 = "";
var b1 = "";
var b2 = "";
var b3 = "";
var c1 = "";
var c2 = "";
var c3 = "";
var slot;

var dice = function(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

var computerMove = function() {
  slot = dice(1, 9)
  if (playerMoves.indexOf(slot) > -1 || computerMoves.indexOf(slot) > -1)
    computerMove();
  else {
    computerMoves.push(slot)
    computerFace = "#t" + slot
    $(computerFace).append("<img src='img/computer.jpeg'>")
    addingToSecondAI(slot, "o")
  }

}

var addingToSecondAI = function(num, str) {
  if (num === 1) {
    a1 = str
  } else if (num === 2) {
    a2 = str
  } else if (num === 3) {
    a3 = str
  } else if (num === 4) {
    b1 = str
  } else if (num === 5) {
    b2 = str
  } else if (num === 6) {
    b3 = str
  } else if (num === 7) {
    c1 = str
  } else if (num === 8) {
    c2 = str
  } else if (num === 9) {
    c3 = str
  }
}

var playerMove = function() {
  $(this).append("<img src='img/troll.png'>")
  playerLoc = parseInt($(this).attr("id").split('')[1])
  playerMoves.push(playerLoc);
  addingToSecondAI(playerLoc, "x");
  realisticComputer();
  winCondition();
  if ((a1 + a2 + a3 + b1 + b2 + b3 + c1 + c2 + c3).length === 9)
    alert("draw")
}

var winCondition = function() {
  if (playerMoves.indexOf(1) > -1 && playerMoves.indexOf(2) > -1 && playerMoves.indexOf(3) > -1 ||
    playerMoves.indexOf(4) > -1 && playerMoves.indexOf(5) > -1 && playerMoves.indexOf(6) > -1 ||
    playerMoves.indexOf(7) > -1 && playerMoves.indexOf(8) > -1 && playerMoves.indexOf(9) > -1 ||
    playerMoves.indexOf(1) > -1 && playerMoves.indexOf(4) > -1 && playerMoves.indexOf(7) > -1 ||
    playerMoves.indexOf(2) > -1 && playerMoves.indexOf(5) > -1 && playerMoves.indexOf(8) > -1 ||
    playerMoves.indexOf(3) > -1 && playerMoves.indexOf(6) > -1 && playerMoves.indexOf(9) > -1 ||
    playerMoves.indexOf(1) > -1 && playerMoves.indexOf(5) > -1 && playerMoves.indexOf(9) > -1 ||
    playerMoves.indexOf(7) > -1 && playerMoves.indexOf(5) > -1 && playerMoves.indexOf(3) > -1
  ) {
    alert("you win");
    location.reload();
  } else if ((a1 == a2 && a1 == a3 && (a1 == "o")) ||
    (b1 == b2 && b1 == b3 && (b1 == "o")) ||
    (c1 == c2 && c1 == c3 && (c1 == "o")) ||
    (a1 == b1 && a1 == c1 && (a1 == "o")) ||
    (a2 == b2 && a2 == c2 && (a2 == "o")) ||
    (a3 == b3 && a3 == c3 && (a3 == "o")) ||
    (a1 == b2 && a1 == c3 && (a1 == "o")) ||
    (a3 == b2 && a3 == c1 && (a3 == "o"))
  ) {
    alert("Boohoo")
    location.reload();
  }
}



var realisticComputer = function() {
  aiRandomize = dice(1, 10)
  if (aiRandomize <= parseInt($('#dif').val())) {
    compMove();
  } else {
    computerMove();
  }
}

$('.ticbox').on('click', playerMove)
$('#reload').on('click', function() { location.reload()})

// COMP MOVE AI DETECTS IF THERE ARE TWO IN A ROW NEXT TO AN EMPTY CELL AND PLACES MOVE THERE
var compMove = function() {
  if (a1 == "" && ((a3 == "x" && a2 == "x") || (c3 == "x" && b2 == "x") || (c1 == "x" && b1 == "x"))) {
    a1 = 'o';
    $("#t1").append("<img src='img/computer.jpeg'>")
  } else {
    if (a2 == "" && ((a1 == "x" && a3 == "x") || (c2 == "x" && b2 == "x"))) {
      a2 = 'o';
      $("#t2").append("<img src='img/computer.jpeg'>")
    } else {
      if (a3 == "" && ((a1 == "x" && a2 == "x") || (c1 == "x" && b2 == "x") || (c3 == "x" && b3 == "x"))) {
        a3 = 'o';
        $("#t3").append("<img src='img/computer.jpeg'>")
      } else {
        if (c3 == "" && ((c1 == "x" && c2 == "x") || (a1 == "x" && b2 == "x") || (a3 == "x" && b3 == "x"))) {
          c3 = 'o';
          $("#t9").append("<img src='img/computer.jpeg'>")
        } else {
          if (c1 == "" && ((c3 == "x" && c2 == "x") || (a3 == "x" && b2 == "x") || (a1 == "x" && b1 == "x"))) {
            c1 = 'o';
            $("#t7").append("<img src='img/computer.jpeg'>")
          } else {
            if (c2 == "" && ((c3 == "x" && c1 == "x") || (a2 == "x" && b2 == "x"))) {
              c2 = 'o';
              $("#t8").append("<img src='img/computer.jpeg'>")
            } else {
              if (b1 == "" && ((b3 == "x" && b2 == "x") || (a1 == "x" && c1 == "x"))) {
                b1 = 'o';
                $("#t4").append("<img src='img/computer.jpeg'>")
              } else {
                if (b3 == "" && ((a3 == "x" && c3 == "x") || (b2 == "x" && b1 == "x"))) {
                  b3 = 'o';
                  $("#t6").append("<img src='img/computer.jpeg'>")
                } else {
                  if (b2 == "" && ((a3 == "x" && c1 == "x") || (c3 == "x" && a1 == "x") || (b3 == "x" && b1 == "x") || (c2 == "x" && a2 == "x"))) {
                    b2 = 'o';
                    $("#t5").append("<img src='img/computer.jpeg'>")
                  } else { // IF NO OPP TO BLOCK A WIN, THEN PLAY IN ONE OF THESE SQUARES
                    if (b2 == "") {
                      b2 = 'o';
                      $("#t5").append("<img src='img/computer.jpeg'>")

                    } else {
                      if (a1 == "") {
                        a1 = 'o';
                        $("#t1").append("<img src='img/computer.jpeg'>")

                      } else {
                        if (c3 == "") {
                          c3 = 'o';
                          $("#t9").append("<img src='img/computer.jpeg'>")

                        } else {
                          if (c2 == "") {
                            c2 = 'o';
                            $("#t8").append("<img src='img/computer.jpeg'>")

                          } else {
                            if (b1 == "") {
                              b1 = 'o';
                              $("#t4").append("<img src='img/computer.jpeg'>")

                            }
                          }
                        }
                      }


                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
};

//THANKS NISHA