var multiplayer = true // Set to false to turn off
var socket = io()
var board = document.getElementById("board")
var body = document.getElementById("body")
var gameBoard = []
var mouseX = 0
var mouseY = 0
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var bp = document.getElementById("BP")
var br = document.getElementById("BR");
var bn = document.getElementById("BN")
var bb = document.getElementById("BB")
var bq = document.getElementById("BQ")
var bk = document.getElementById("BK")
var wp = document.getElementById("WP")
var wr = document.getElementById("WR");
var wn = document.getElementById("WN")
var wb = document.getElementById("WB")
var wq = document.getElementById("WQ")
var wk = document.getElementById("WK")
var mouseDown;
var inCheckBlack = false;
var inCheckWhite = false;
var checkMate = false;
var checkingPiece
var dragged
var tempBoard = null
var mate = document.getElementById("modal-btn");
blackBackRank = [br, bn, bb, bq, bk, bb, bn, br]
whiteBackRank = [wr, wn, wb, wq, wk, wb, wn, wr]

socket.emit("color")
socket.on('color', (player) => {
  color = player
  if (color == "black"){
    for (var y = 0; y < 8; y++) {
      for (var x = 0; x < 8; x++) {
        if (gameBoard[y][x] != 0){
          gameBoard[y][x].y = 9 - gameBoard[y][x].y
          gameBoard[y][x].x = 9 - gameBoard[y][x].x
        }
      }
    }
  }
})

function sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function(){
        this.sound.play();
    }
    this.stop = function(){
        this.sound.pause();
    }    
}
 drop = new sound("slap.mp3")
 pain= new sound("cry-SF.mp3")
 fool= new sound("you-fool.mp3")
 
for (var y = 0; y < 8; y++) {
  gameBoard.push([])
  for (var x = 0; x < 8; x++) {
    gameBoard[y].push(0)
  }
}

var arrangement = [new Rook(), new Knight(), new Bish(), new Queen(), new King(), new Bish(), new Knight(), new Rook()]
var arrangement2 = [new Rook(), new Knight(), new Bish(), new Queen(), new King(), new Bish(), new Knight(), new Rook()]

window.addEventListener('load', (event) => {
  ctx.drawImage(board, 0, 0)
  

  for (let x = 1; x <= 8; x++) {
    pawn = new Pawn()
    pawn.x = x
    pawn.y = 2
    pawn.piece = bp
    pawn.colourWhite = false
    pawn.num=x
    gameBoard[1][x - 1] = pawn
    gameBoard[1][x - 1].drawPiece(ctx, 488, 488)
  }

  for (let x = 1; x <= 8; x++) {
    pawn = new Pawn()
    pawn.x = x
    pawn.y = 7
    pawn.piece = wp
    pawn.colourWhite = true
    pawn.num=x+8
    gameBoard[6][x - 1] = pawn
    gameBoard[6][x - 1].drawPiece(ctx, 488, 488)

  }
  for (let x = 1; x <= 8; x++) {
    // if (!(x==1||x==5||x==8)){
    //   continue 
    // }
    arrangement[x - 1].x = x
    arrangement[x - 1].y = 1
    arrangement[x - 1].piece = blackBackRank[x - 1]
    arrangement[x - 1].colourWhite = false
    gameBoard[0][x - 1] = arrangement[x - 1]
    gameBoard[0][x - 1].drawPiece(ctx, 488, 488)
  }

  for (let x = 1; x <= 8; x++) {
    // if (!(x==1||x==5||x==8)){
    //   continue 
    // }
    arrangement2[x - 1].x = x
    arrangement2[x - 1].y = 8
    arrangement2[x - 1].piece = whiteBackRank[x - 1]
    arrangement2[x - 1].colourWhite = true
    gameBoard[7][x - 1] = arrangement2[x - 1]
    gameBoard[7][x - 1].drawPiece(ctx, 488, 488)
  } 
})

function getSquare(x, y) {
  letter = ["a", "b", "c", "d", "e", "f", "g", "h"]
  var num = [0, 8, 7, 6, 5, 4, 3, 2, 1]
  var row = letter[x - 1]
  var col = num[y]
  var res = ("." + row + col + " ")
  return res;
}

var moves = 0 //Number of moves 
var picked = 0
var preX = 0 //Initial coordinates 
var preY = 0
var lastID= "null"

setInterval(function() {
  if (moves % 2 == 0) {//If move is even white moves 
    var whiteMoves = true
  }
  else {// Otherwise black 
    var whiteMoves = false
  }

  ctx.drawImage(board, 0, 0)

  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      if (gameBoard[y][x] == 0) {
        continue
      }
      gameBoard[y][x].drawPiece(ctx, 488, 488)

      if (gameBoard[y][x].checkMouse(mouseX, mouseY, 488, 512)) {
        //Selecting the piece to move 
        if (mouseDown && whiteMoves == gameBoard[y][x].colourWhite && picked == 0) {
          if (moves % 2 == 1 && color == "black") {
            picked += 1
            gameBoard[y][x].selected = true
          } else if (moves % 2 == 0 && color == "white") {
            picked += 1
            gameBoard[y][x].selected = true
          }
        }
      }

      //While selected this allows the piece to be dragged 
      if (gameBoard[y][x].selected) {
        gameBoard[y][x].x = ((mouseX - 58) / 60) + 1
        gameBoard[y][x].y = ((mouseY - 47) / 60) + 1
        dragged = gameBoard[y][x]
      }

      //Dropping the piece to the destination
      if (!mouseDown && gameBoard[y][x].selected) {
        console.log(color)
        var pieces= document.getElementsByName("pieceType")
        for (var i = 0, length = pieces.length; i < length; i++) {
          if (pieces[i].checked) {
            pieceType= pieces[i].id
            //console.log( pieceType)
            gameBoard[y][x].p= pieceType
            break
          }
        }
        var newX = Math.floor(gameBoard[y][x].x + 0.4) - 1
        var newY = Math.floor(gameBoard[y][x].y + 0.4) - 1

        if (color == "black"){
          newX = 7 - newX
          newY = 7 - newY
        }
        if (newX >= 8 || newY >= 8 || newX < 0 || newY < 0) {
          gameBoard[y][x].x = x + 1
          gameBoard[y][x].y = y + 1
          gameBoard[y][x].selected = false
          picked = 0
          break
        }

        var diffX = newX - x
        var diffY = newY - y
        gameBoard[y][x].captures = 0
        //Checks if you're capturing own piece
        if (gameBoard[newY][newX] != 0) {
          if (gameBoard[newY][newX].colourWhite == whiteMoves) {
            gameBoard[y][x].legal = false
          } else {
            gameBoard[y][x].captures = 2
            pain.play()
          }
        }

        //Checking if it is even allowed
        var allowed = gameBoard[y][x].allow(diffX, diffY, gameBoard, lastID)
        if (!gameBoard[y][x].enP){
          var blocked = gameBoard[y][x].wallBlocking(x, y, diffX, diffY, gameBoard) 
        }
        else{
          var blocked= false 
        }
        var start = gameBoard[y][x]
        var end = gameBoard[newY][newX]

        gameBoard[newY][newX] = gameBoard[y][x]
        gameBoard[y][x] = 0

        if (whiteMoves) {
          inCheckWhite = false
        } else {
          inCheckBlack = false
        }

        for (let i = 0; i < 8; i++) {
          for (let j = 0; j < 8; j++) {
            if (gameBoard[i][j] == 0) {
              continue
            }

            if (!gameBoard[i][j].colourWhite) {
              inCheckWhite = gameBoard[i][j].killKing(j, i, gameBoard)
            } else {
              inCheckBlack = gameBoard[i][j].killKing(j, i, gameBoard)
            }

            if (inCheckBlack || inCheckWhite) {
              checkingPiece = [gameBoard[i][j], j, i]
              break
            }
          }
          if (inCheckBlack || inCheckWhite) {
            break
          }
        }

        if (inCheckBlack || inCheckWhite) {
          checkMate = true;
          for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
              if (gameBoard[i][j] == 0) {
                continue
              }
              if (gameBoard[i][j].piece.id == "BK" || gameBoard[i][j].piece.id == "WK") {
                if (gameBoard[i][j].colourWhite != whiteMoves) {
                  checkingPiece.push(j - checkingPiece[1], i - checkingPiece[2])
                }
                for (let k = -1; k < 2; k++) {
                  for (let l = -1; l < 2; l++) {
                    var moveX = j + l
                    var moveY = i + k

                    if (moveX > 7 || moveX < 0 || moveY > 7 || moveY < 0) {
                      continue
                    }

                    if (gameBoard[moveY][moveX] != 0 && (l != 0 || k != 0)) {
                      if (gameBoard[moveY][moveX].colourWhite == gameBoard[i][j].colourWhite) {
                        continue
                      }
                    }

                    var kStart = gameBoard[i][j]
                    var kEnd = gameBoard[moveY][moveX]

                    if (moveY == i && moveX == j) {
                      continue
                    }
                    gameBoard[moveY][moveX] = kStart
                    gameBoard[i][j] = 0

                    var inCheck = false

                    for (var a = 0; a < 8; a++) {
                      for (var b = 0; b < 8; b++) {
                        if (gameBoard[a][b] == 0) {
                          continue
                        }

                        inCheck = gameBoard[a][b].killKing(b, a, gameBoard)

                        if (inCheck) {
                          break
                        }
                      }
                      if (inCheck) {
                        break
                      }
                    }

                    gameBoard[i][j] = kStart
                    gameBoard[moveY][moveX] = kEnd

                    if (inCheck) {
                      continue
                    }

                    checkMate = false
                    break
                  }
                }
              }

              if (!checkMate) {
                break
              }
            }
          }
          if (checkMate) {
            var path = checkingPiece[0].wallBlocking(checkingPiece[1], checkingPiece[2], checkingPiece[3], checkingPiece[4], gameBoard, true)
            for (let i = 0; i < 8; i++) {
              for (let j = 0; j < 8; j++) {
                if (gameBoard[i][j] == 0) {
                  continue
                }

                if (gameBoard[i][j].colourWhite != whiteMoves && gameBoard[i][j].piece.id[1] != "K") {
                  for (let p = 0; p < path.length; p++) {
                    if (gameBoard[i][j].canGetTo(j, i, path[p][0], path[p][1], gameBoard)) {
                      
                      var s = gameBoard[i][j]
                      var e = gameBoard[path[p][1]][path[p][0]]

                      gameBoard[path[p][1]][path[p][0]] = s
                      gameBoard[i][j] = 0

                      var inCheck = false
                    
                      for (var a = 0; a < 8; a++) {
                        for (var b = 0; b < 8; b++) {
                          if (gameBoard[a][b] == 0) {
                            continue
                          }

                          inCheck = gameBoard[a][b].killKing(b, a, gameBoard)
                          
                          if (inCheck) {
                            break
                          }
                        }
                        if (inCheck) {
                          break
                        }
                      }

                      if (!inCheck) {
                        checkMate = false
                      }
                      gameBoard[path[p][1]][path[p][0]] = e
                      gameBoard[i][j] = s
                    }
                  }
                }
              }
            }
          }
        }

        if (checkMate) {
          mate.checked = "true"
          socket.emit("mate", () => {
            
          })
        }
        checkingPiece = []
        gameBoard[y][x] = start
        gameBoard[newY][newX] = end

        if (inCheckBlack && !whiteMoves) {
          gameBoard[y][x].legal = false
        } else if (inCheckWhite && whiteMoves) {
          gameBoard[y][x].legal = false
        }


        //If the move is not legal it throws the piece back to x and y
        if (blocked || !allowed || !gameBoard[y][x].legal) {
          gameBoard[y][x].legal = true
          if (gameBoard[y][x].movesMade > 0) {
            gameBoard[y][x].movesMade -= 1
          }
          gameBoard[y][x].x = x + 1
          gameBoard[y][x].y = y + 1
          if (color == "black") {
            gameBoard[y][x].x = 9 - gameBoard[y][x].x
            gameBoard[y][x].y = 9 - gameBoard[y][x].y
          }
          gameBoard[y][x].selected = false
          pain.stop()
          fool.play()
        } else {//Otherwise the move is executed 
          drop.play()
          socket.emit("ID", gameBoard[y][x].piece.id[1]+ (9 - Math.floor(gameBoard[y][x].x+0.4)), color)

          gameBoard[y][x].x = newX + 1
          gameBoard[y][x].y = newY + 1
          if (color == "black"){
            gameBoard[y][x].x = 9 - gameBoard[y][x].x
            gameBoard[y][x].y = 9 - gameBoard[y][x].y
          }
          gameBoard[y][x].selected = false

          socket.emit("Game Board", gameBoard, moves + 1, color)
          gameBoard[newY][newX] = gameBoard[y][x]
          gameBoard[y][x] = 0
          if (newX != x || newY != y) {
            moves += 1
            for (let i = 0; i < 8; i++) {
              for (let j = 0; j < 8; j++) {
                if (gameBoard[i][j] == 0) {
                  continue
                }
                inCheck = gameBoard[i][j].killKing(j, i, gameBoard)
                if (inCheck) {
                  break
                }
              }
              if (inCheck) {
                break
              }
            }
          }
        }
        picked -= 1//Dropping the piece
      }
    }
  }

  if (dragged) {
    dragged.drawPiece(ctx, 488, 488)
  }
}, 100 / 60);

socket.on('ID', (id, gColor) => {
  lastID = id
  drop.play()
})

socket.on('castle', (board, gColor) => {
    if (gColor != color){
      tempBoard = board
    }
})

socket.on("promotion", (x, y, piece) => {
  if (piece == "q") {
    if (color == "black") {
      gameBoard[y][x] = new Queen(8 - x, 8 - y, wq, true)
    } else {
      gameBoard[y][x] = new Queen(x + 1, y + 1, bq, false)
    }
  }
})

socket.on("mate", () => {
  mate.checked = true
})

socket.on('Game Board', (sentBoard, gmoves, gcolor) => {
  if (tempBoard != null){
    sentBoard = tempBoard
    tempBoard = null
  }
  
  for (var y = 0; y < 8; y++) {
    for (var x = 0; x < 8; x++) {
      if (sentBoard[y][x] != 0){
        sentBoard[y][x].y = 9 - sentBoard[y][x].y
        sentBoard[y][x].x = 9 - sentBoard[y][x].x
      }
    }
  }
  
  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      if (sentBoard[y][x] == 0){
          gameBoard[y][x] = 0
      }

      if (gameBoard[y][x].x != sentBoard[y][x].x || gameBoard[y][x].y != sentBoard[y][x].y) { 
        gameBoard[y][x].x = sentBoard[y][x].x
        gameBoard[y][x].y = sentBoard[y][x].y
        gameBoard[y][x].movesMade = sentBoard[y][x].movesMade
      }
    }
  }

  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      if (gameBoard[y][x] == 0){
        continue
      }
      if (color == "white") {
        if (gameBoard[y][x].x - 1 != x || gameBoard[y][x].y - 1 != y) {
          var tempX = Math.round(gameBoard[y][x].x - 1)
          var tempY = Math.round(gameBoard[y][x].y - 1)
          gameBoard[tempY][tempX] = gameBoard[y][x]
          gameBoard[y][x] = 0
        }
      } else {
        if (8 - gameBoard[y][x].x != x || 8 - gameBoard[y][x].y != y) {
          var tempX = Math.round(8 - gameBoard[y][x].x)
          var tempY = Math.round(8 - gameBoard[y][x].y)
          gameBoard[tempY][tempX] = gameBoard[y][x]
          gameBoard[y][x] = 0
        }
      }
    }
  }

  moves = gmoves
  dragged = null
  
});

canvas.addEventListener("click", () => {
  mouseX = event.clientX
  mouseY = event.clientY
  mouseClick = true
})

canvas.addEventListener("mousemove", () => {
  mouseX = event.clientX
  mouseY = event.clientY
})

canvas.addEventListener("mousedown", () => {
  mouseDown = true
})
canvas.addEventListener("mouseup", () => {
  mouseDown = false
})
