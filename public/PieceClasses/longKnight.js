class LongKnight extends Piece {
  constructor(x, y, piece, colourWhite) {
    super(x, y, piece, colourWhite);
    
  }
  allow(movedX, movedY, gameBoard){
    if (((Math.abs(movedX)==2 && Math.abs(movedY)==3)||(Math.abs(movedX)==3 && Math.abs(movedY)==2))&& (this.captures==2 ||this.captures==0)){
      return true
    }
    else{
      return false
    }
  }
  wallBlocking(preX, preY, allLis){
    return false
  }
}