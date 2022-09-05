class Pawn extends Piece {
  constructor(x, y, piece, colourWhite, num) {
    super(x, y, piece, colourWhite);
    this.num= num
  }
  allow(movedX, movedY, gameBoard, ident = "null"){
    if (this.y == 1 && this.colourWhite){
      this.x = Math.round(this.x)
      gameBoard[0][this.x-1].promote(movedX, movedY, gameBoard, this.p)
      socket.emit("promotion", this.x-1, 0, this.p)
      this.x = 1000
    } else if (this.y == 1 && !this.colourWhite){
      gameBoard[7][8-this.x].promote(movedX, movedY, gameBoard, this.p)
      socket.emit("promotion", 8-this.x, 7, this.p)
      this.x = 1000
    }

    if (this.colourWhite==true){
      if ((movedY==-1 || movedY==-2)&& movedX==0 && this.movesMade==0 && this.captures==0) {
        this.movesMade+=1
        return true
      }
      else if (movedY==-1 && movedX==0 && this.movesMade>0&& this.captures==0){
        this.movesMade+=1
        if (this.y==1){
          gameBoard[0][Math.floor(this.x+0.4)-1]=0
        }
        return true
      }
      else if (movedY==-1 && (movedX==1|| movedX==-1)&& this.captures== 2){
        this.movesMade+=1
        console.log(this.x, movedX, movedY, this.y)
        return true
      }
       else if(Math.floor(this.y+0.4)-movedY==4 && (movedX==1 || movedX==-1)&& gameBoard[3][Math.floor(this.x+0.4)-1].movesMade==1 && ident[0]== "P" &&ident[1]== Math.floor(this.x+0.4)){ 
        this.enP=true

        this.x = Math.floor(this.x+0.4)
        this.y = 3
        gameBoard[3][this.x - 1]=0

        socket.emit("castle", gameBoard, "white")
        return true 
      }
      else {
        return false
      }
  } else {
      if ((movedY==1 || movedY==2)&& movedX==0 && this.movesMade==0&& this.captures==0) {
        this.movesMade+=1
        if (movedY==2){ 
          
        }
        return true
        
      }
      else if (movedY==1 && movedX==0   && this.movesMade>0&& this.captures==0){
        this.movesMade+=1
        
        return true
      }
      else if (movedY==1 && (movedX==1|| movedX==-1)&& (this.captures==2)){
        this.movesMade+=1
        console.log(Math.floor(this.y+0.4))
        return true
      }
      else if (this.enPassant== true){
        this.movesMade+=1
        return true
      }
      else if( (movedX==1 || movedX==-1)&& Math.floor(this.y+0.4)==3 && ident[0]== "P" &&ident[1]== (Math.floor(this.x+0.4) )){ 
        this.enP=true 

        this.x = Math.floor(this.x + 0.4)
        this.y = 3
        gameBoard[4][8-this.x]=0
        
        socket.emit("castle", gameBoard, "black")
        return true 
      }
      else {
        return false
      }
    }
  }

  wallBlocking(x, y, diffX, diffY, gameBoard){
    if (Math.abs(diffX) > 0 && Math.abs(diffY) > 0){
      if (gameBoard[y + diffY][x + diffX] == 0){
        return true
      } else {
        return false
      }
    }

    for (let i = 1; i <= Math.abs(diffY); i++) {
      //The coordinates in the pawns path
      var pathY = y + i * (Math.abs(diffY) / diffY)

      if (gameBoard[pathY][x] != 0) {
        return true
      }
    }

    return false
  }
  
  promote(movedX, movedY, gameBoard, toPromoteTo){
    if (toPromoteTo=='q'){
      if (this.colourWhite){
        gameBoard[0][this.x-1]=0
        gameBoard[0][this.x-1] = new Queen()
        gameBoard[0][this.x-1].x = this.x
        gameBoard[0][this.x-1].y = 1
        gameBoard[0][this.x-1].piece = wq
        gameBoard[0][this.x-1].colourWhite = true
        
        gameBoard[0][this.x-1].drawPiece(ctx, 488, 488)
      }
      else{
        gameBoard[7][8-this.x]=0
        gameBoard[7][8-this.x] = new Queen()
        gameBoard[7][8-this.x].x = this.x
        gameBoard[7][8-this.x].y = 1
        gameBoard[7][8-this.x].piece = bq
        gameBoard[7][8-this.x].colourWhite = false 
        
        gameBoard[7][8-this.x].drawPiece(ctx, 488, 488)
      } 
      }
    else if (toPromoteTo== 'r'){
      if (this.colourWhite){
        gameBoard[0][this.x-1]=0
        gameBoard[0][this.x-1] = new Rook()
        gameBoard[0][this.x-1].x = this.x
        gameBoard[0][this.x-1].y = 1
        gameBoard[0][this.x-1].piece = wr
        gameBoard[0][this.x-1].colourWhite = true
        
        gameBoard[0][this.x-1].drawPiece(ctx, 488, 488)
      }
      else{
        gameBoard[7][8-this.x]=0
        gameBoard[7][8-this.x] = new Rook()
        gameBoard[7][8-this.x].x = this.x
        gameBoard[7][8-this.x].y = 1
        gameBoard[7][8-this.x].piece = br
        gameBoard[7][8-this.x].colourWhite = false 
        
        gameBoard[7][8-this.x].drawPiece(ctx, 488, 488)
      }  
    }
    else if (toPromoteTo== 'n'){
      if (this.colourWhite){
        gameBoard[0][this.x-1]=0
        gameBoard[0][this.x-1] = new Knight()
        gameBoard[0][this.x-1].x = this.x
        gameBoard[0][this.x-1].y = 1
        gameBoard[0][this.x-1].piece = wn
        gameBoard[0][this.x-1].colourWhite = true
        gameBoard[0][this.x-1].drawPiece(ctx, 488, 488)
      }
      else{
        gameBoard[7][8-this.x]=0
        gameBoard[7][8-this.x] = new Knight()
        gameBoard[7][8-this.x].x = this.x
        gameBoard[7][8-this.x].y = 1
        gameBoard[7][8-this.x].piece = bn
        gameBoard[7][8-this.x].colourWhite = false 
        
        gameBoard[7][8-this.x].drawPiece(ctx, 488, 488)
      } 
    }
    else if (toPromoteTo== 'b'){
      if (this.colourWhite){
        gameBoard[0][this.x-1]=0
        gameBoard[0][this.x-1] = new Bish()
        gameBoard[0][this.x-1].x = this.x
        gameBoard[0][this.x-1].y = 1
        gameBoard[0][this.x-1].piece = wb
        gameBoard[0][this.x-1].colourWhite = true
        gameBoard[0][this.x-1].drawPiece(ctx, 488, 488)
      }
      else{
        gameBoard[7][8-this.x]=0
        gameBoard[7][8-this.x] = new Bish()
        gameBoard[7][8-this.x].x = this.x
        gameBoard[7][8-this.x].y = 1
        gameBoard[7][8-this.x].piece = bb
        gameBoard[7][8-this.x].colourWhite = false
        gameBoard[7][8-this.x].drawPiece(ctx, 488, 488)
      }  
    }
  }
    
}