var playerLoc;
var difficulty;
var repearLocation;
var hellhoundLocation;
var sanity;
var keyLocation;
var keyHeld;
var lastKnownR;
var eventPost;
var floor1Stairs;
var floor2upStairs;
var floor3downStairs;
var floor2downStairs;
var playerIMG = "pdown"
var rIMG = "rdown"
var hIMG = "hdown"
var deathCount = 0;
var escapeCount = 0;
var movesTaken = 0;
var pointsCount = 0;
var pointsTotal = 0;
var fireLoc;
var fire2Loc;
var reaperLoop;
var hellLoop;
var treasureBoxL;
var audioElement = document.createElement('audio');

var dungeon = {

  dice: function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },
  generateKey: function() {
    keyLocation = this.dice(1, 30);
    return keyLocation;
  },
  generateTreasure: function() {
    gameGraphics.clearTreasure();
    treasureBoxL = this.dice(21, 30);
    eventPost = "Treasure has appeared in dungeon";
    gameGraphics.information();
    gameGraphics.treasureBox();
    return treasureBoxL;
  },
  treasureEvent: function() {
    if (playerLoc === treasureBoxL) {
      eventRoll = this.dice(1, 100);
      var odds = difficulty * 2
      if (eventRoll < 25 - odds) {
        this.teleport();
      } else if (eventRoll < 30 - odds) {
        this.gainSanityS();
      } else if (eventRoll < 60 - odds) {
        this.reaperReloc();
      } else {
        eventPost: "Treasure Box was empty. Too Bad."
        gameGraphics.information();
      }
    gameGraphics.clearTreasure(); 
    treasureBoxL = null; 
    }
  },
  generateReaper: function() {
    reaperLocation = this.dice(11, 30);
    return reaperLocation;
  },
  generateHellHound: function() {
    hellhoundLocation = this.dice(11, 30);
    return hellhoundLocation;
  },
  playerDead: function() {
    gameGraphics.clearPlayer();
    if (playerLoc === reaperLocation || sanity <= 0) {
      alert("You Are Dead");
      deathCount += 1;
      pointsCount -= Math.ceil(20 / difficulty);
      dead();
    } else if (playerLoc === hellhoundLocation) {
      eventPost = ("HellHound has entered the room, Health has reduced to " + sanity);
      sanity -= 2;
      gameGraphics.information();
    }
  },
  testWin: function() {
    if (playerLoc === 1 && keyHeld === difficulty) {
      alert("Congratulations, you escaped!");
      newD = difficulty + 1
      if (newD > 5) {
        $('#difficulty').attr("max", newD);
      }
      $('#difficulty').val(newD);
      escapeCount += 1;
      pointsCount += Math.ceil(difficulty * 20);
      dead();
    }
  },
  generateStairs: function() {
    floor1Stairs = this.dice(1, 10);
    floor2downStairs = floor1Stairs + 10;
    floor2upStairs = this.dice(11, 20);
    floor3downStairs = floor2upStairs + 10;
  },
  generateFire: function() {
    fireLoc = this.dice(21, 30)
  },
  generateFire2: function() {
    fire2Loc = this.dice(11, 20)
  },
  collectKey: function() {
    if (playerLoc === keyLocation) {
      if (keyHeld < difficulty) {
        keyHeld += 1
        gameGraphics.findKey();
        if (keyHeld == difficulty) {
          eventPost = "You have collected all the keys required. Head to the exit"
          keyLocation = null;
          gameGraphics.toExit();
        } else {
          this.generateKey();
        }

      }
    }
  },
  moveLimit: function() {
    movesTaken += 1
    gameGraphics.clearPlayer();
    this.testWin();
    this.collectKey();
    this.treasureEvent();
    roll = this.dice(1, 100);
    gameGraphics.player();
    if (playerLoc === fireLoc || playerLoc === fire2Loc) {
      eventPost = "You got hurt by the fire"
      sanity -= 1
      gameGraphics.information();
    }
    if (playerLoc > 30 || playerLoc < 1) {
      playerLoc = from
      eventPost = "Cannot Move beyond Map"
      gameGraphics.information();
      gameGraphics.player();
    } else if (roll <= difficulty) {
      gameGraphics.clearPlayer();
      playerLoc = from
      eventPost = "Door is stuck, try again!"
      gameGraphics.information();
      gameGraphics.player();
    } else {
      this.generateEvent();
      this.collectKey();
      gameGraphics.information();

    }
  },
  playerMoveUp: function() {
    if (playerLoc === floor1Stairs || playerLoc === floor2upStairs) {
      from = playerLoc;
      playerLoc += 10;
      this.playerDead();
      playerIMG = "pup"
      this.moveLimit();
    } else {
      eventPost = "No Stairs Here"
      gameGraphics.player();
      gameGraphics.information();
    }
  },
  playerMoveDown: function() {
    if (playerLoc === floor2downStairs || playerLoc === floor3downStairs) {
      from = playerLoc;
      playerLoc -= 10;
      this.playerDead();
      playerIMG = "pdown"
      this.moveLimit();
    } else {
      eventPost = "No Stairs Here"
      gameGraphics.player();

      gameGraphics.information();
    }
  },
  playerMoveRight: function() {
    from = playerLoc;
    playerLoc += 1;
    this.playerDead();
    playerIMG = "pright"
    this.moveLimit();
  },
  playerMoveLeft: function() {
    from = playerLoc;
    playerLoc -= 1;
    this.playerDead();
    playerIMG = "pleft"
    this.moveLimit();
  },
  reaperMove: function() {
    gameGraphics.clearReaper();
    moveSpeed = 1;
    if (reaperLocation === playerLoc) {
      gameGraphics.reaperEvent();
      dungeon.playerDead();
      gameGraphics.information();
    } else if ((playerLoc - reaperLocation <= moveSpeed && playerLoc - reaperLocation > 0) || (reaperLocation - playerLoc <= moveSpeed && reaperLocation - playerLoc > 0)) {
      reaperLocation = playerLoc;
      sanity -= 1;
      eventPost = ("Reaper has entered the room, Health has reduced to " + sanity);
      gameGraphics.reaperEvent();
      gameGraphics.information();
    } else if (Math.ceil(playerLoc / 10) > Math.ceil(reaperLocation / 10) && (reaperLocation === floor1Stairs || reaperLocation === floor2upStairs)) {
      reaperLocation += 10
      rIMG = "rup"
      gameGraphics.reaper();
    } else if (Math.ceil(playerLoc / 10) > Math.ceil(reaperLocation / 10) && (reaperLocation !== floor1Stairs || reaperLocation !== floor2upStairs)) {
      if (Math.ceil(reaperLocation / 10) === 1) {
        if (floor1Stairs > reaperLocation) {
          reaperLocation += 1
          rIMG = "rright"
          gameGraphics.reaper();
        } else {
          reaperLocation -= 1
          rIMG = "rleft"
          gameGraphics.reaper();
        }
      }
      if (Math.ceil(reaperLocation / 10) === 2) {
        if (floor2upStairs > reaperLocation) {
          reaperLocation += 1
          rIMG = "rright"
          gameGraphics.reaper();
        } else {
          reaperLocation -= 1
          rIMG = "rleft"
          gameGraphics.reaper();
        }
      }
    } else if (Math.ceil(playerLoc / 10) < Math.ceil(reaperLocation / 10) && (reaperLocation === floor3downStairs || reaperLocation === floor2downStairs)) {
      reaperLocation -= 10
      rIMG = "rdown"
      gameGraphics.reaper();
    } else if (Math.ceil(playerLoc / 10) < Math.ceil(reaperLocation / 10) && (reaperLocation !== floor3downStairs || reaperLocation !== floor2downStairs)) {
      if (Math.ceil(reaperLocation / 10) === 2) {
        if (floor2downStairs > reaperLocation) {
          reaperLocation += 1
          rIMG = "rright"
          gameGraphics.reaper();
        } else {
          reaperLocation -= 1
          rIMG = "rleft"
          gameGraphics.reaper();
        }
      }
      if (Math.ceil(reaperLocation / 10) === 3) {
        if (floor3downStairs > reaperLocation) {
          rIMG = "rright"
          reaperLocation += 1
          gameGraphics.reaper();
        } else {
          rIMG = "rleft"
          reaperLocation -= 1
          gameGraphics.reaper();
        }
      }
    } else if (playerLoc > reaperLocation) {
      rIMG = "rright"
      reaperLocation += 1
      gameGraphics.reaper();
    } else {
      reaperLocation -= 1
      rIMG = "rleft"
      gameGraphics.reaper();
    }
  },
  hellhoundMove: function() {
    gameGraphics.clearHellhound();
    moveSpeed = 1;
    if (hellhoundLocation === playerLoc) {
      gameGraphics.hellEvent();
      sanity -= 2
      eventPost = ("Hell Hound has entered the room, Health has reduced to " + sanity);
      gameGraphics.hellEvent();
      gameGraphics.information();
    } else if ((playerLoc - hellhoundLocation <= moveSpeed && playerLoc - hellhoundLocation > 0) || (hellhoundLocation - playerLoc <= moveSpeed && hellhoundLocation - playerLoc > 0)) {
      hellhoundLocation = playerLoc;
      sanity -= 1
      eventPost = ("Hell Hound has entered the room, Health has reduced to " + sanity);
      gameGraphics.hellEvent();
      gameGraphics.information();
    } else if (Math.ceil(playerLoc / 10) > Math.ceil(hellhoundLocation / 10) && (hellhoundLocation === floor1Stairs || hellhoundLocation === floor2upStairs)) {
      hellhoundLocation += 10
      hIMG = "hup"
      gameGraphics.hellhound();
    } else if (Math.ceil(playerLoc / 10) > Math.ceil(hellhoundLocation / 10) && (hellhoundLocation !== floor1Stairs || hellhoundLocation !== floor2upStairs)) {
      if (Math.ceil(hellhoundLocation / 10) === 1) {
        if (floor1Stairs > hellhoundLocation) {
          hellhoundLocation += 1
          hIMG = "hright"
          gameGraphics.hellhound();
        } else {
          hellhoundLocation -= 1
          hIMG = "hleft"
          gameGraphics.hellhound();
        }
      }
      if (Math.ceil(hellhoundLocation / 10) === 2) {
        if (floor2upStairs > hellhoundLocation) {
          hellhoundLocation += 1
          hIMG = "hright"
          gameGraphics.hellhound();
        } else {
          hellhoundLocation -= 1
          hIMG = "hleft"
          gameGraphics.hellhound();
        }
      }
    } else if (Math.ceil(playerLoc / 10) < Math.ceil(hellhoundLocation / 10) && (hellhoundLocation === floor3downStairs || hellhoundLocation === floor2downStairs)) {
      hellhoundLocation -= 10
      hIMG = "hdown"
      gameGraphics.hellhound();
    } else if (Math.ceil(playerLoc / 10) < Math.ceil(hellhoundLocation / 10) && (hellhoundLocation !== floor3downStairs || hellhoundLocation !== floor2downStairs)) {
      if (Math.ceil(hellhoundLocation / 10) === 2) {
        if (floor2downStairs > hellhoundLocation) {
          hellhoundLocation += 1
          hIMG = "hright"
          gameGraphics.hellhound();
        } else {
          hellhoundLocation -= 1
          hIMG = "hleft"
          gameGraphics.hellhound();
        }
      }
      if (Math.ceil(hellhoundLocation / 10) === 3) {
        if (floor3downStairs > hellhoundLocation) {
          hIMG = "hright"
          hellhoundLocation += 1
          gameGraphics.hellhound();
        } else {
          hIMG = "hleft"
          hellhoundLocation -= 1
          gameGraphics.hellhound();
        }
      }
    } else if (playerLoc > hellhoundLocation) {
      hIMG = "hright"
      hellhoundLocation += 1
      gameGraphics.hellhound();
    } else {
      hellhoundLocation -= 1
      hIMG = "hleft"
      gameGraphics.hellhound();
    }
  },
  generateEvent: function() {
    eventRoll = this.dice(1, 100);
    var odds = difficulty
    if (eventRoll < 5 - odds) {
      this.teleport();
    } else if (eventRoll < 15 - odds) {
      this.gainSanity();
    } else if (eventRoll < 40 - odds) {
      this.keyReveal();
    } else if (eventRoll < 41 + odds) {
        if (!treasureBoxL) {
      this.generateTreasure();
    }
  }
  },
  teleport: function() {
    var teleportLoc = parseInt(prompt("Which room would you like to go to?"))
    gameGraphics.clearPlayer();
    if (teleportLoc < 31 && teleportLoc > 0) {
      playerLoc = teleportLoc;
    }
    else {
      playerLoc = this.dice(1,30);
    }
    dungeon.testWin();
    eventPost = "Player has now moved to room " + playerLoc
    gameGraphics.information();
    gameGraphics.player();
  },
  reaperReloc: function() {
    gameGraphics.clearReaper();
    var reaperTP = parseInt(prompt("You can teleport the reaper to another room"))
    if (reaperTP > 30 && reaperTP < 0) {
      this.generateReaper();
      eventPost = "Repear has moved to a random room"
    } else {
      reaperLocation = reaperTP;
      eventPost = "Reaper has been move to room " + reaperLocation
    }
    gameGraphics.information();
    gameGraphics.reaper();
  },
  keyReveal: function() {
    if (keyHeld === difficulty) {
      eventPost = "Head to room 1 to escape!"
      gameGraphics.information();
    } else {
      eventPost = "The key is in room " + keyLocation
      gameGraphics.key();
      gameGraphics.information();
    }
  },
  reveal: function() {
    eventPost = "Reaper is in room " + reaperLocation
    lastKnownR = reaperLocation;
    gameGraphics.reaper();
    gameGraphics.information();
  },
  gainSanity: function() {
    sanity += 1
    eventPost = "1 Health Gained"
    gameGraphics.information();
  },
  gainSanityS: function() {
    sanity += 5
    eventPost = "5 Health Gained"
    gameGraphics.information();
  }

}



var startGame = function() {
  $('#startGame').fadeOut();
  audioElement.setAttribute('src', 'img/DungeonM.mp3');
  dungeon.generateStairs();
  dungeon.generateKey();
  dungeon.generateReaper();
  playerLoc = parseInt($('#startLoc').val());
  if (playerLoc > 30 || playerLoc < 1) {
    playerLoc = dungeon.dice(1, 30)
  }
  difficulty = parseInt($('#difficulty').val());
  sanity = 5 + difficulty;
  keyHeld = 0;
  movesTaken = 0;
  pointsCount = 0;
  treasureBoxL = null;
  gameGraphics.clearTreasure();
  gameGraphics.clearPlayer();
  gameGraphics.clearReaper();
  gameGraphics.clearHellhound();
  gameGraphics.player();
  gameGraphics.reaper();
  gameGraphics.information();
  gameGraphics.ladder();
  audioElement.play();
  gameGraphics.toStart();
  reaperLoop = window.setInterval(dungeon.reaperMove, (5000 / difficulty))
  if (difficulty >= 3) {
    dungeon.generateHellHound();
    hellLoop = window.setInterval(dungeon.hellhoundMove, (3000 / difficulty))
    gameGraphics.hellhound();
  }
  if (difficulty > 5) {
    dungeon.generateFire();
    gameGraphics.fire();
  }
  if (difficulty > 7) {
    dungeon.generateFire2();
    gameGraphics.fire();
  }
}

var movementIdentity = function(e) {
  if (e.which === 119 || e.which === 38) {
    dungeon.playerMoveUp();
  }
  if (e.which === 115 || e.which === 40) {
    dungeon.playerMoveDown();
  }
  if (e.which === 97 || e.which === 37) {
    dungeon.playerMoveLeft();
  }
  if (e.which === 100 || e.which === 39) {
    dungeon.playerMoveRight();
  }
}

var dead = function() {
  $('#startGame').fadeIn();
  clearInterval(reaperLoop);
  clearInterval(hellLoop);
  audioElement.pause();
  $('#startGame').css("padding-top", "100px");
  $('#death').html("Died " + deathCount + " times.");
  $('#escapes').html("Escaped " + escapeCount + " times.");
  $('#moves').html("Escaped in " + movesTaken + " moves.");
  pointsTotal = (pointsCount / (movesTaken / difficulty)).toFixed(2);
  $('#points').html("Points: " + pointsTotal);
}


var help = function() {
  $("#help").animate({
    top: 50,
    left: 100,
    opacity: 1,
    width: 700,
    height: 35
  })
  var tip = dungeon.dice(1,5)
  if (tip === 1) {
  $('#help').html("<p>You can walk through Reapers if you time your movements.</p>")
  }
  else if (tip === 2) {
  $('#help').html("<p>Hellhounds are less fatal. You could survive a few bites.</p>")
  }
  else if (tip === 3) {
  $('#help').html("<p>Walking through a fire reduces your health by 1, plan carefully.</p>")
  }
  else if (tip === 4) {
  $('#help').html("<p>Hellhounds/Reapers will take the ladder if you are not next to the stairs</p>")
  }
  else if (tip === 5) {
  $('#help').html("<p>The odds for events and treasures decreases as difficulty increases.</p>")
  }
}

var gameGraphics = {
  clearPlayer: function() {
    $('#reaper').remove();
    $('#player').remove();
    $('#hellhound').remove();
    this.reaper();
    this.hellhound();
    this.ladder();
  },
  clearReaper: function() {
    $('#reaper').remove();
    this.ladder();
  },
  clearHellhound: function() {
    $('#hellhound').remove();
    this.ladder();
  },
  player: function() {
    var findID = "#r" + playerLoc;
    $(findID).append("<img id='player' src='img/" + playerIMG + ".gif'>")
  },
  reaper: function() {
    var findID = "#r" + reaperLocation;
    $(findID).append("<img id='reaper' src='img/" + rIMG + ".gif'>")
  },
  hellhound: function() {
    var findID = "#r" + hellhoundLocation;
    $(findID).append("<img id='hellhound' src='img/" + hIMG + ".gif'>")
  },
  key: function() {
    $('#keyL').remove()
    var findID = "#r" + keyLocation;
    $(findID).append("<img id='keyL' src='img/key.gif'>")
  },
  findKey: function() {
    $('#keyL').remove()
  },
  information: function() {
    $('#key').html('Key Held: ' + keyHeld)
    $('#diff').html('Current Difficulty: ' + difficulty)
    $('#Sanity').html('Health: ' + sanity)
    $('#keyLoc').html('Current Key Location: ' + keyLocation)
    $('#eventInfo').html(eventPost)
    this.healthWatch();
  },
  reaperEvent: function() {
    this.clearPlayer();
    this.clearReaper();
    var findID = "#r" + playerLoc;
    $(findID).append("<img id='reaper' src='img/reaperEvent.gif'>")
  },
  hellEvent: function() {
    this.clearPlayer();
    this.clearHellhound();
    var findID = "#r" + playerLoc;
    $(findID).append("<img id='hellhound' src='img/hevent.gif'>")
  },
  ladder: function() {
    $('#L1').remove()
    $('#L2').remove()
    var findID = "#r" + floor1Stairs
    var findID2 = "#r" + floor2upStairs
    $(findID).append("<img id='L1' src='img/ladder.gif'>")
    $(findID2).append("<img id='L2' src='img/ladder.gif'>")
  },
  fire: function() {
    $('#fire1').remove();
    $('#fire2').remove();
    var findID = "#r" + fireLoc
    $(findID).append("<img id='fire1' src='img/fire.gif'>")
    if (fire2Loc) {
      var findID2 = "#r" + fire2Loc
      $(findID2).append("<img id='fire2' src='img/fire.gif'>")
    }
  },
  clearTreasure: function() {
    $('#treasure').remove()
  },
  treasureBox: function() {
    var findID = '#r' + treasureBoxL
    $(findID).append("<img id='treasure' src='img/treasure.gif'>")
  },
  toExit: function() {
    $('.event').css({
      'background-color': 'darkgreen'
    })
    $('#door').attr("src", "img/dooropen.gif")

  },
  toStart: function() {
    $('.event').css({
      "background-color": "#73191C"
    })
    $('#door').attr("src", "img/door.gif")
    $('#rules').remove();
  },
  healthWatch: function() {
    if (sanity > 6) {
      $('#Sanity').css({
        "background-color": "#008000",
        "width": "100%"
      })
    } else if (sanity > 3) {
      $('#Sanity').css({
        "background-color": "#808000",
        "width": "60%"
      })
    } else {
      $('#Sanity').css({
        "background-color": "#800000",
        "width": "30%"
      })
    }
  }
}





$('#start').on("click", startGame)
$(document).keypress(movementIdentity)
$("#help").hover(help)
