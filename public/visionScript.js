function randomSquare() {
    var result= ''
    var letter= 'abcdefgh'
    var letterLength = letter.length
    result += letter.charAt(Math.floor(Math.random() *letterLength))
    result += Math.floor(Math.random() *8 + 1)  
   return result
}
var alpha= []
var letters= 'abcdefgh'
for (var j = 1; j < 9; j++) {
  for (var i = 1; i < 9; i++) {      
    var square = document.createElement("button");
    square.id = (j+"---"+ i);
    if (i==j|| i==j+2|| i==j+4|| i==j+6|| i==j-2|| i==j-4|| i==j-6){
      square.style.backgroundColor = "black";}
    else{
      square.style.backgroundColor = "red";}
    square.style.width='50px' 
    square.style.height='50px' 
    square.className="button"
    document.getElementById('chessBoardRow'+j).appendChild(square);
    var placeHold= document.getElementById(j+"---"+ i)
    alpha.push(placeHold)
  }}
alpha.forEach(element => element.addEventListener('click',()=>{ squareClicked.innerHTML= letters[element.id[4]-1]+ element.id[0]}));
clickToStartVisionTest.addEventListener("click", () => {
  console.log("Starting Vision Test")
  clickToStartVisionTest.disabled=true
  var timeleft = 60
  var downloadTimer = setInterval(function(){
    if(timeleft <= 0){
      clearInterval(downloadTimer)
      for (var j = 1; j < 9; j++) {
        for (var i = 1; i < 9; i++) {  
          document.getElementById(j+"---"+i).disabled=true
          clickToStartVisionTest.disabled=false
        }
      }
    }
    else{ 
    for (var j = 1; j < 9; j++) {
        for (var i = 1; i < 9; i++) {  
          document.getElementById(j+"---"+i).disabled=false
        }
      }
    }
  document.getElementById("timer").innerHTML = timeleft
  timeleft -= 1
  document.getElementById('clickToStopVisionTest').onclick = function() {
    console.log("STOPPING")
    timeleft=0
     clickToStartVisionTest.disabled=false
}
}, 1000) 
  score=0
  denominator=0
  document.getElementById("currentScore").innerHTML= (score+ "/"+ denominator)
  document.getElementById("question").innerHTML= randomSquare()

  alpha.forEach(element => element.addEventListener("click", () => {
    if (document.getElementById("question").innerHTML==letters[element.id[4]-1]+ element.id[0]){
      score+=1
    }
    denominator+=1
    document.getElementById("currentScore").innerHTML= (score+ "/"+ denominator)
    document.getElementById("question").innerHTML= randomSquare()
  })); 
})
