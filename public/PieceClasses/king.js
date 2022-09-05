class King extends Piece {
  constructor(x, y, piece, colourWhite) {
    super(x, y, piece, colourWhite);

  }
  allow(movedX, movedY, gameBoard) {
    if ((Math.abs(movedX) == 1 && Math.abs(movedY) == 1) || (Math.abs(movedX) == 1 && Math.abs(movedY) == 0) || (Math.abs(movedX) == 0 && Math.abs(movedY) == 1)) {
      this.movesMade += 1
      return true

    }

    else if (this.movesMade == 0 && movedX == -2 && movedY == 0 && ((this.colourWhite && gameBoard[7][0].piece.id == "WR" && gameBoard[7][0].movesMade == 0) || (!this.colourWhite && gameBoard[0][0].piece.id == "BR" && gameBoard[0][0].movesMade == 0))) {

      this.castleLong = true

      if (this.cantCastle(gameBoard, 2, true)) {
        console.log("err")
        return false
      }

      if (this.colourWhite) {
        gameBoard[7][0].x = 4
        gameBoard[7][0].y = 8
        this.x = 3
        this.y = 8
        socket.emit("castle", gameBoard, "white")
        gameBoard[7][0] = 0
        gameBoard[7][3] = new Rook()
        gameBoard[7][3].x = 4
        gameBoard[7][3].y = 8
        gameBoard[7][3].piece = wr
        gameBoard[7][3].colourWhite = true
        gameBoard[7][3].drawPiece(ctx, 488, 488)

      }
      else {
        gameBoard[0][0].x = 5
        gameBoard[0][0].y = 8
        this.x = 6
        this.y = 8
        socket.emit("castle", gameBoard, "black")
        gameBoard[0][0] = 0
        gameBoard[0][3] = new Rook()
        gameBoard[0][3].x = 5
        gameBoard[0][3].y = 8
        gameBoard[0][3].piece = br
        gameBoard[0][3].colourWhite = false

        gameBoard[0][3].drawPiece(ctx, 488, 488)
      }
      this.movesMade += 1
      return true
    }
    else if (this.movesMade == 0 && movedX == 2 && movedY == 0 && ((this.colourWhite && gameBoard[7][7].piece.id == "WR" && gameBoard[7][7].movesMade == 0) || (!this.colourWhite && gameBoard[0][7].piece.id == "BR" && gameBoard[0][7].movesMade == 0))) {
      this.castleShort = true

      if (this.cantCastle(gameBoard, 2, true)) {
        console.log("err")
        return false
      }
      if (this.colourWhite) {
        gameBoard[7][7].x = 6
        gameBoard[7][7].y = 8
        this.x = 7
        this.y = 8
        socket.emit("castle", gameBoard, "white")
        gameBoard[7][7] = 0
        gameBoard[7][5]=0
        gameBoard[7][5] = new Rook()
        gameBoard[7][5].x = 6
        gameBoard[7][5].y = 8
        gameBoard[7][5].piece = wr
        gameBoard[7][5].colourWhite = true

        gameBoard[7][5].drawPiece(ctx, 488, 488)
      }
      else {
        gameBoard[0][7].x = 3
        gameBoard[0][7].y = 8
        this.x = 2
        this.y = 8
        socket.emit("castle", gameBoard, "black")
        gameBoard[0][7] = 0
  
        gameBoard[0][5] = new Rook()
        gameBoard[0][5].x = 3
        gameBoard[0][5].y = 8
        gameBoard[0][5].piece = br
        gameBoard[0][5].colourWhite = false

        gameBoard[0][5].drawPiece(ctx, 488, 488)
      }
      this.movesMade += 1
      return true
    }
    return false
  }
  wallBlocking(preX, preY, allLis) {
    return false
  }
  cantCastle(gameBoard, squares, short) {
    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 8; x++) {
        if (gameBoard[y][x] == 0) {
          continue
        }
        var kingX = this.x
        var kingY = this.y
        gameBoard[y][x].captures = 2
        if (short) {
          for (let s = 1; s < squares; s++) {
            var allowed = gameBoard[y][x].allow(kingX + s, kingY, gameBoard)
            var blocked = gameBoard[y][x].wallBlocking(x, y, kingX + s, kingY, gameBoard)
            gameBoard[y][x].captures = 0
            if (allowed == true && blocked == false) {
              break
            }
          }
        }
        else {
          for (let s = 1; s < squares; s++) {
            var allowed = gameBoard[y][x].allow(kingX - s, kingY, gameBoard)
            var blocked = gameBoard[y][x].wallBlocking(x, y, kingX - s, kingY, gameBoard)
            gameBoard[y][x].captures = 0
            if (allowed == true && blocked == false) {
              break
            }
          }
        }
        return (allowed && !blocked)
      }
    }
  }
}
