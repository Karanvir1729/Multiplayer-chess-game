class Piece {
  constructor(x, y, piece, colourWhite, ind) {
    this.x = x
    this.y = y
    this.selected = false
    this.piece = piece
    this.colourWhite = colourWhite
    this.whiteMoves = true
    this.legal = true
    this.movesMade = 0
    this.captures = 0
    this.p="q"
    this.enP=false    
  }

  drawPiece(ctx, width, height) {
    ctx.drawImage(this.piece, (this.x - 1) * width / 8 + 18, (this.y - 1) * height / 8 + 7)
  }

  checkMouse(mouseX, mouseY, width, height) {
    var left = (this.x - 1) * 61 + 18
    var right = this.x * 61 + 18
    var top = (this.y - 1) * 60.5 + 7
    var bottom = this.y * 60.5 + 7

    if (mouseX > right || mouseX < left || mouseY > bottom || mouseY < top) {
      return false
    } else {
      return true
    }
  }

  killKing(pieceX, pieceY, gameBoard) {
    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 8; x++) {
        if (gameBoard[y][x] == 0){
          continue
        }

        if (gameBoard[y][x].piece.id == "BK" && this.colourWhite){
          var kingX = x - pieceX
          var kingY = y - pieceY

          if (kingX == 0 && kingY == 0){
            break
          }

          gameBoard[pieceY][pieceX].captures = 2
          var allowed = gameBoard[pieceY][pieceX].allow(kingX, kingY, gameBoard)
          if (!allowed){
            return false
          }
          var blocked = gameBoard[pieceY][pieceX].wallBlocking(pieceX, pieceY, kingX, kingY, gameBoard)
          gameBoard[pieceY][pieceX].captures = 0
          return (allowed && !blocked)

        } else if (gameBoard[y][x].piece.id == "WK" && !this.colourWhite){
          var kingX = x - pieceX
          var kingY = y - pieceY

          if (kingX == 0 && kingY == 0){
            break
          }

          gameBoard[pieceY][pieceX].captures = 2
          var allowed = gameBoard[pieceY][pieceX].allow(kingX, kingY, gameBoard)
          if (!allowed){
            return false
          }
          var blocked = gameBoard[pieceY][pieceX].wallBlocking(pieceX, pieceY, kingX, kingY, gameBoard)
          gameBoard[pieceY][pieceX].captures = 0
          return (allowed && !blocked)

        } 
      }
    }
  }
  
  canGetTo(pieceX, pieceY, targetX, targetY, gameBoard){
    if (targetX - pieceX != 0) {
      gameBoard[pieceY][pieceX].captures = 2
    }
    var allowed = gameBoard[pieceY][pieceX].allow(targetX - pieceX, targetY - pieceY, gameBoard)
    if (!allowed){
      gameBoard[pieceY][pieceX].captures = 0
      return false
    }

    var blocked = gameBoard[pieceY][pieceX].wallBlocking(pieceX, pieceY, targetX - pieceX, targetY - pieceY, gameBoard)

    gameBoard[pieceY][pieceX].captures = 0
    return (allowed && !blocked)
  }

  checkMate(gameBoard, kingX, kingY){
    // var gameBoard = [];
    // for (var y = 0; y < 8; y++) {
    //   gameBoard.push([])
    //   for (var x = 0; x < 8; x++) {
    //     if (board[y][x] == 0) {
    //       gameBoard[y].push(0)
    //       continue
    //     }
    //     var copy = JSON.parse(JSON.stringify(board[y][x]))
    //     gameBoard[y].push(copy)
    //   }
    // }

    for (let y = -1; y < 2; y++) {
      for (let x = -1; x < 2; x++) {
        var newX = kingX + x
        var newY = kingY + y
        
        if (newX > 7 || newX < 0 || newY > 7 || newY < 0){
          continue
        }
        
        if (gameBoard[newY][newX] != 0 && (x != 0 || y != 0)){
          if (gameBoard[newY][newX].colourWhite == gameBoard[kingY][kingX].colourWhite){
            continue
          }
        }

        var start = gameBoard[kingY][kingX]
        var end = gameBoard[newY][newX]

        gameBoard[newY][newX] = start
        gameBoard[kingY][kingX] = 0

        var inCheck = false

        for (var i = 0; i < 8; i++) {
          for (var j = 0; j < 8; j++) {
            if (gameBoard[i][j] == 0){
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

        gameBoard[kingY][kingX] = start
        gameBoard[newY][newX] = end

        if (!inCheck) {
          return false
        }
      }
    }
    return true
  }
}