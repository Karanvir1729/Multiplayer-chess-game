class Bish extends Piece {
  constructor(x, y, piece, colourWhite) {
    super(x, y, piece, colourWhite);
    
  }
  allow(movedX, movedY, gameBoard){
    if ((Math.abs(movedX)==Math.abs(movedY))&& (this.captures==2 ||this.captures==0)){
      return true
    }
    else{
      return false
    }
  }

  wallBlocking(x, y, diffX, diffY, gameBoard, needPath){
    var path = [[x, y]]
    for (let i = 1; i < Math.abs(diffX); i++) {
      //The coordinates in the bishops path
      var pathY = y + i * (Math.abs(diffY) / diffY)
      var pathX = x + i * (Math.abs(diffX) / diffX)
      
      if (needPath){
        path.push([pathX, pathY])
      }

      if (!needPath && gameBoard[pathY][pathX] != 0) {
        return true
      }
    }

    if (needPath){
       return path
    }
    return false
  }

}