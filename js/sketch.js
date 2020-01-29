let selectedYear, selectedContinent, selectedDisease, selectedAge;

$(function () {
  $('#slider').slider({
    range: "max",
    min: 0,
    max: 7,
    value: 2,
    slide: function (event, ui) {
      if(ui.value == 0){
        selectedAge = "0-28 days";
      }else if(ui.value == 1){
        selectedAge = "1-59 months";
      }else if(ui.value == 2){
        selectedAge = "5-14 years";
      }else if(ui.value == 3){
        selectedAge = "15-29 years";
      }else if(ui.value == 4){
        selectedAge = "30-49 years";
      }else if(ui.value == 5){
        selectedAge = "50-59 years";
      }else if(ui.value == 6){
        selectedAge = "60-69 years";
      }else{
        selectedAge = "70+ years";  
      }

      $('#amount').empty().append(`<p>Selected age: ${selectedAge}</p>`)
      fileChecker(selectedContinent, selectedYear);
    }
  });
  $("#amount").val($("#slider-range-max").slider("value"));
  

$('#opt-year li').click(function () {
  selectedYear = $(this).text();
  fileChecker(selectedContinent, selectedYear);
})

$('#opt-disease li').click(function(){
  selectedDisease = $(this).text();
  fileChecker(selectedContinent, selectedYear);
});

$('#opt-region li').click(function(){
  selectedContinent = $(this).text();
  fileChecker(selectedContinent, selectedYear);
});

})

function setup() {
  createCanvas(1920, 1080);
  colorMode(HSB, 360, 100, 100, 100);
  background(0);
  //drawFractal(0, 0, 300);
  //drawBubbles();
  // var len = 100;
  // for(var i = 0; i < 4; i++){
  //   rotate(PI/2);
  //   len-=5;
  //   fractalLines(len, PI/4);
  // }
}

function draw() {

}

function fileChecker(continent, year){
  if(continent == 'Africa'){
    loadJSON('./data/json/AFR'+year+'.json', getData);
  }else if (continent == 'Western Pacific'){
    loadJSON('./data/json/WPR'+year+'.json', getData);
  }else if(continent == 'America'){
    loadJSON('./data/json/AMR'+year+'.json', getData);
  }else if (continent == 'Europe'){
    loadJSON('./data/json/EUR'+year+'.json', getData);
  }else if(continent == 'Southeast Asia'){
    loadJSON('./data/json/SEAR'+year+'.json', getData);
  }else{
    loadJSON('./data/json/EMR'+year+'.json', getData);
  }
  console.log(selectedContinent)
  console.log(selectedAge)
  console.log(selectedYear)
  console.log(selectedDisease)

  }

function getData(data){
      console.log("Male:" + data.diseases[selectedDisease].ages.male[selectedAge]);
      console.log("Female:" + data.diseases[selectedDisease].ages.female[selectedAge]);
}

function getSixtData(sixtData) {
  console.log(sixtData);
}

function getFiftData(fifthData){
  console.log(fifthData);
}

function getTenthData(tenthData){
  console.log(tenthData);
}

function drawFractal(x, y, d) {
  stroke(0, 100, 100, 30);
  noFill();
  circle(x, y, d);
  if (d > 10) {
    drawFractal(x + d, y, d / 2);
    drawFractal(x - d, y, d / 2);
    drawFractal(x, y + d, d / 2);
  }
}

function drawBubbles(len) {
  noFill();
  stroke(255, 255, 255, 50);
  strokeWeight(1);
  ellipse(0, -len, -len - 20, -len - 20);
  translate(0, -len);
  if (len > 10) {
    push();
    rotate(angle);
    drawBubble(len * 0.67);
    pop();
    push();
    rotate(-angle);
    drawBubbles(len * 0.67);
    pop();
  }
}

function fractalLines(len, angle) {
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
    fractalLines(len * 0.67, angle);
    //Vraag de vorige origin-locatie op uit het geheugen en bewaar dit punt opnieuw
    pop();
    push();
    rotate(-angle);
    fractalLines(len * 0.67, angle);
    pop();
  }
}

function particleSystem() {
  class particle {
    constructor() {
      this.pos = createVector(width / 3, height / 2),
        this.vel = random(-2, 2),
        this.acc = random(0, 0.05)
    }

    update() {
      this.position.add(this.vel);
      this.velocity.add(this.acc)
    }
  }
}