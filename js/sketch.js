$(function(){
  $('#slider').slider({
    range: "max",
    min: 0,
    max: 7,
    value: 2,
    slide: function( event, ui ) {
      console.log(ui.value);
      if(ui.value == 0){
        $('#amount').empty().append(`<p>Selected age: ${ui.value}</p>`)
      }else if(ui.value == 7){
        $('#amount').empty().append(`<p>Selected age: 70+</p>`)
      }else{
        $('#amount').empty().append(`<p>Selected age: ${ui.value}0</p>`)
      }
    }
  });
  $( "#amount" ).val( $( "#slider-range-max" ).slider( "value" ) );
})

function setup() {
  createCanvas(1920, 1080);
  colorMode(HSB, 360, 100, 100, 100);
  background(0);
  drawPeople();
  translate(700, 600);
  //drawFractal(0, 0, 300);
  //drawBubbles();
  //drawLegend();
  var len = 100;
  for(var i = 0; i < 4; i++){
    rotate(PI/2);
    len-=5;
    fractalLines(len, PI/4);
  }
}

function draw() {
}

function drawPeople(){

}

function drawLegend(){
  var rad = 30;
  fill(0);
  stroke(200);
  rect(width-700, 100, width/4, 400, rad, rad, rad, rad);
  rect(width-680, 80, width/4-40, 50, rad, rad, rad, rad);
}

function drawFractal(x, y, d){
  stroke(0, 100, 100, 30);
  noFill();
  circle(x, y, d);
  if(d > 10){
    drawFractal(x+d, y, d/2);
    drawFractal(x-d, y, d/2);
    drawFractal(x, y+d, d/2);
  }
}

function drawBubbles(len) {
  noFill();
  stroke(255, 255, 255, 50);
  strokeWeight(1);
  ellipse(0, -len, -len-20, -len-20);
  translate(0, -len);
  if (len > 10){
    push();
    rotate(angle);
    drawBubble(len*0.67);
    pop();
    push();
    rotate(-angle);
    drawBubbles(len*0.67);
    pop();
  }
}

function fractalLines(len, angle){
  stroke(250, 100, 100, 50);
  line(0, 0, 0, len);
  //Verplaats de 'origin' van de tekening naar 0 op de x-as en de meegegeven waarde aan het argument lengte van de lijn (len, dit is dus het eindpunt op de y-as van deze lijn) op de y-as
  translate(0, len);
  //Blijf loopen/lijnen tekenen totdat de lengte (len) van de lijn kleiner is dan 4
  //Voor het effect van de vertakkingen die kleiner zijn dan de vorige vertakkingen
  //If statement schrijven we om een recursieve functie te stoppen, anders resulteert deze in een endless loop
  if (len > 4) {
    //Bewaar het huidige nulpunt (origin) in het geheugen van het programma
    push();
    //Roteer origin (richting van de tekening) in klokwijzerzin
    rotate(angle);
    //Teken deze functie opnieuw met een afwijking van 0.67 in de lengte
    fractalLines(len*0.67, angle);
    //Vraag de vorige origin-locatie op uit het geheugen en bewaar dit punt opnieuw
    pop();
    push();
    rotate(-angle);
    fractalLines(len*0.67, angle);
    pop();
  }
}