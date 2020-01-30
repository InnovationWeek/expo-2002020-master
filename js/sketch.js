//Standaard values initializeren
let selectedYear = "2010";
let selectedContinent = "America";
let selectedDisease = "Syphilis";
let selectedAge = "0-28 days";

let maleObj = {};
let femaleObj = {};

$(function () {
  //Initalizeren slider, min and max values en standaard value
  $('#slider').slider({
    range: "max",
    min: 0,
    max: 7,
    value: 0,
    //Pas de gewenste values aan naar onze data
    slide: function (event, ui) {
      if (ui.value == 0) {
        selectedAge = "0-28 days";
      } else if (ui.value == 1) {
        selectedAge = "1-59 months";
      } else if (ui.value == 2) {
        selectedAge = "5-14 years";
      } else if (ui.value == 3) {
        selectedAge = "15-29 years";
      } else if (ui.value == 4) {
        selectedAge = "30-49 years";
      } else if (ui.value == 5) {
        selectedAge = "50-59 years";
      } else if (ui.value == 6) {
        selectedAge = "60-69 years";
      } else {
        selectedAge = "70+ years";
      }

      $('#amount').empty().append(`<p>Selected age: ${selectedAge}</p>`)
      fileChecker();
    }
  });

  //Sla de geselecteerde opties op in globale variabelen om ahv deze de gepaste JSON files op te halen
  $('#opt-year li').click(function () {
    $(this).addClass('selected-opt').siblings().removeClass('selected-opt');
    selectedYear = $(this).text();
    fileChecker();
  })

  $('#opt-disease li').click(function () {
    $(this).addClass('selected-opt').siblings().removeClass('selected-opt');
    selectedDisease = $(this).text();
    fileChecker();
  });

  $('#opt-region li').click(function () {
    $(this).addClass('selected-opt').siblings().removeClass('selected-opt');
    selectedContinent = $(this).text();
    fileChecker();
  });

})

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 100);
  background(0);
  var len = 100;
  translate(width / 3, height / 3);
  for (var i = 0; i < 4; i++) {
    rotate(PI / 2);
    len -= 5;
    fractalLines(len, PI / 4);
  }
}

function draw() {
  background(0);
  for (let i = 0; i < 5; i++) {
      let p = new Particle();
      particles.push(p);
  }
  for (let i = particles.length - 1; i >= 0; i--) {
      particles[i].update();
      particles[i].show();
      if (particles[i].isDead()) {
      // remove this particle
      particles.splice(i, 1);
      }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

class Particle {
  constructor() {
      this.position = createVector(windowWidth/2, windowHeight/2);
      this.velocity = createVector(random(-1, 1), random(-5, -2));
      //this.acceleration = createVector(0, 0.05);
      this.acceleration = createVector(0, random(0.05, 0.2));
      this.alpha = 100;

      //steering
      this.target = createVector(x, y);
      this.maxspeed = 3;    // Maximum speed
      this.maxforce = 0.05; // Maximum steering force
  }

  isDead() {
      return this.alpha < 0;
  }

  update() {
      this.velocity.add(this.acceleration);
      this.position.add(this.velocity);
      this.alpha -= 1;
  }

  show() {
      noStroke();
      //stroke(255);
      fill(0, 100, 100, this.alpha);
      ellipse(this.position.x, this.position.y, 16);
  }
}


/*--------------------------------------------
----------OPHALEN EN BIJHOUDEN DATA-----------
---------------------------------------------*/

//Check bij elke verandering welke JSON file moet opgehaald worden
function fileChecker() {
  if (selectedContinent == 'Africa') {
    loadJSON('./data/json/AFR' + selectedYear + '.json', getAmount);
  } else if (selectedContinent == 'Western Pacific') {
    loadJSON('./data/json/WPR' + selectedYear + '.json', getAmount);
  } else if (selectedContinent == 'America') {
    loadJSON('./data/json/AMR' + selectedYear + '.json', getAmount);
  } else if (selectedContinent == 'Europe') {
    loadJSON('./data/json/EUR' + selectedYear + '.json', getAmount);
  } else if (selectedContinent == 'Southeast Asia') {
    loadJSON('./data/json/SEAR' + selectedYear + '.json', getAmount);
  } else {
    loadJSON('./data/json/EMR' + selectedYear + '.json', getAmount);
  }
  loadJSON('./data/json/diseases.json', getDiseaseOrgans);
  console.log(selectedContinent)
  console.log(selectedAge)
  console.log(selectedYear)
  console.log(selectedDisease)
  console.log(maleObj)
  console.log(femaleObj)
}

//Verkrijg de hoeveelheid personen die deze ziekte hebben ahv de gevraagde parameters
//Sla deze data op in het female en male object om deze nadien te gebruiken voor de visualisatie
function getAmount(data) {
  maleObj.amount = data.diseases[selectedDisease].ages.male[selectedAge];
  femaleObj.amount = data.diseases[selectedDisease].ages.female[selectedAge];
}

//Haal de locatie op van de organen in het lichaam die aangetast worden door de geselecteerde ziekte
function getDiseaseOrgans(organs) {
  maleObj.organs = organs.male[selectedDisease];
  femaleObj.organs = organs.female[selectedDisease];
  loadJSON('./data/json/organs.json', getDiseaseLocations);
}

//Voor zowel mannen als vrouwen zoeken we naar de bijpassende x- en y-coördinaten in een aparte JSON file
//Door over de organen van de male en female objecten te itereren
function getDiseaseLocations(locations) {
  maleObj.organsLoc = [];
  femaleObj.organsLoc = [];
  maleObj.organs.forEach(function (organOfSelected) {
    maleObj.organsLoc.push(locations.male[organOfSelected]);
  });
  femaleObj.organs.forEach(function (organOfSelected) {
    femaleObj.organsLoc.push(locations.female[organOfSelected]);
  });
  //Teken een punt op de meest recente geselecteerde locatie
  drawDot();
};

function drawDot() {
  let hue, op;
  background(0)
  noFill();
  strokeWeight(2)

  //Check de geselecteerde ziekte en pas kleur aan
  if (selectedDisease == "Syphilis") {
    hue = 65;
  } else if (selectedDisease == "Chlamydia") {
    hue = 35;
  } else if (selectedDisease == "Gonorrhoea") {
    hue = 0;
  } else if (selectedDisease == "Genital herpes") {
    hue = 250;
  } else {
    hue = 325;
  }

  //Check de geselecteerde leeftijd en pas opacity aan
  //Is dit wel nodig als we de amount van particles aanpassen en zo het verschil in leeftijd weergeven?
  // if (selectedAge == "0-28 days") {
  //   op = 10;
  // } else if (selectedAge == "1-59 months") {
  //   op = 20;
  // } else if (selectedAge == "5-14 years") {
  //   op = 35;
  // } else if (selectedAge == "15-29 years") {
  //   op = 45;
  // } else if (selectedAge == "30-49 years") {
  //   op = 60;
  // } else if (selectedAge == "50-59 years") {
  //   op = 75;
  // } else if (selectedAge == "60-69 years") {
  //   op = 85;
  // } else {
  //   op = 100;
  // }

  stroke(hue, 100, 100, op);

  for (let organLoc of maleObj.organsLoc) {
    setShape(organLoc);
  }
  for (let organLoc of femaleObj.organsLoc) {
    setShape(organLoc);
  }

  function setShape(organLoc){
    //Waarden aanpassen aangezien onze JSON file niet helemaal de juiste locaties bevat
    organLoc.x = organLoc.x - 95;
    if (selectedContinent == "America") {
      square(organLoc.x, organLoc.y, 10);
    } else if (selectedContinent == "Western Pacific") {
      quad(organLoc.x-5, organLoc.y, organLoc.x, organLoc.y-5, organLoc.x+5, organLoc.y, organLoc.x, organLoc.y+5);
    } else if (selectedContinent == "Africa") {
      rect(organLoc.x, organLoc.y, 10, 1);
    } else if (selectedContinent == "Europe") {
      rect(organLoc.x, organLoc.y, 1, 10);
    } else if (selectedContinent == "Southeast Asia") {
      triangle(organLoc.x-5, organLoc.y-5, organLoc.x+5, organLoc.y-5, organLoc.x, organLoc.y);
    } else {
      ellipse(organLoc.x, organLoc.y, 10, 10);
    }
  }
}

/*--------------------------------------------
----------------CREATIVE CODE-----------------
---------------------------------------------*/
function fractalLines(len, angle) {
  stroke(250, 100, 100, 20);
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
        this.vel = createVector(random(-2, 2)),
        this.acc = createVector(random(0, 0.05))
    }

    update() {
      this.position.add(this.vel);
      this.velocity.add(this.acc)
    }
  }
}