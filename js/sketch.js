//Standaard values initializeren
let selectedYear = "2010";
let selectedContinent = "America";
let selectedDisease = "Syphilis";
let selectedAge = "30-49 years";

let maleObj = {};
let femaleObj = {};
let totalAmount;

var particleSystems = [];

$(function () {
  //Initalizeren slider, min and max values en standaard value
  $('#slider').slider({
    range: "max",
    min: 0,
    max: 7,
    value: 4,
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
      particleSystems = [];
    }
  });

  //Sla de geselecteerde opties op in globale variabelen om ahv deze de gepaste JSON files op te halen
  $('#opt-year li').click(function () {
    $(this).addClass('selected-opt').siblings().removeClass('selected-opt');
    selectedYear = $(this).text();
    fileChecker();
    particleSystems = [];
  })

  $('#opt-disease li').click(function () {
    $(this).addClass('selected-opt').siblings().removeClass('selected-opt');
    selectedDisease = $(this).text();
    fileChecker();
    particleSystems = [];
  });

  $('#opt-region li').click(function () {
    $(this).addClass('selected-opt').siblings().removeClass('selected-opt');
    selectedContinent = $(this).text();
    fileChecker();
    particleSystems = [];
  });

})

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 100);
  background(0);
  fileChecker();
}

function draw() {
  background(0);
  for (let system of particleSystems) {
    system.addParticle();
    system.run();
  }
<<<<<<< HEAD
<<<<<<< HEAD
}
=======
>>>>>>> 90669a0cad5886affdbb315829302d5ae2e8ef3d
=======
}
>>>>>>> ac938b5a98a9373ef326f94b714c1861304ed712

function windowResized() {
  resizeCanvas(windowWidth, windowHeight, WEBGL);
}

/*--------------------------------------------
-------------------PARTICLES------------------
---------------------------------------------*/
let movePosX = 0;
let movePosY = 0;
let xRot = 0.0;
let yRot = 0.0;
let rotVal = 100;

class Particle {
  //Creeër een particle op de locatie van het orgaan (verkregen uit de json file)
  constructor(amount, xLoc, yLoc) {
    this.position = createVector(parseInt(xLoc - 95), parseInt(yLoc + 20));
    this.velocity = createVector(random(-1, 1), random(-1, 1));
    //Multiply velocity om de animatie trager te laten gaan
    this.velocity.mult(.8);
    this.acceleration = createVector(-0.000001, 0.000001);
  //  this.acceleration = createVector(cos(xRot) / 100, sin(yRot) / 100);
    this.alpha = 100;
    this.amount = amount;

  }

  isDead() {
    return this.alpha < 0;
  }

  update() {
    this.velocity.add(this.acceleration);
    this.position.add(this.velocity);
      this.alpha -= this.amount / 50;
    //console.log(cos(xRot) / 1000);

    //this.position.x+=cos(radians(this.position.y+this.position.x)*10);
    //this.position.y+=sin(radians(this.position.y+this.position.x)*10);

    // xRot += rotVal;
    // yRot += rotVal;
  }

  show() {
    noFill();
    let hue;

    if (selectedDisease == "Syphilis") {
      hue = 65;
    } else if (selectedDisease == "Chlamydia") {
      hue = 35;
    } else if (selectedDisease == "Gonorrhoea") {
      hue = 0;
    } else if (selectedDisease == "Genital herpes") {
      hue = 180;
    } else {
      hue = 325;
    }

    //stroke(hue, 100, 100, this.alpha);
    //point(this.position.x, this.position.y);
    noStroke();
    fill(hue, 100, 100, this.alpha)
    let rad = 5;
    ellipse(this.position.x, this.position.y, rad, rad);
  }
}

class Particlesystem {
  constructor(maxAmount, originX, originY) {
    this.origin = createVector(originX, originY)
    this.particles = [];
    this.maxAmount = maxAmount;
    this.totalPassed = 0;
  }

  addParticle(amount = 5) {
    //Check of het aantal gestorven particles kleiner is dan het totaal aantal gevraagde particles
    //Indien ja, voeg een particle toe aan particlesystem
    if (this.totalPassed < this.maxAmount) {
      for (let i = 0; i < 100; i++) {
        let p = new Particle(this.maxAmount, this.origin.x, this.origin.y);
        this.particles.push(p);
        this.totalPassed++;
      }
    }
  }

  run() {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      this.particles[i].update();
      this.particles[i].show();
      if (this.particles[i].isDead()) {
        // remove this particle
        this.particles.splice(i, 1);
      }
    }
  }
}

function addSystem(amount, loc) {
  let amountScalar = 100;
  //Schaal amount aantal particles tot een kleiner aantal
  let newSystem = new Particlesystem(parseInt(amount / amountScalar), parseInt(loc.x), parseInt(loc.y));
  particleSystems.push(newSystem);
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
<<<<<<< HEAD

  console.log(selectedContinent)
  console.log(selectedAge)
  console.log(selectedYear)
  console.log(selectedDisease)
  console.log(maleObj)
  console.log(femaleObj)
=======
>>>>>>> 90669a0cad5886affdbb315829302d5ae2e8ef3d
}

//Verkrijg de hoeveelheid personen die deze ziekte hebben ahv de gevraagde parameters
//Sla deze data op in het female en male object om deze nadien te gebruiken voor de visualisatie//Extra calls te maken
function getAmount(data) {
  maleObj.amount = data.diseases[selectedDisease].ages.male[selectedAge];
  femaleObj.amount = data.diseases[selectedDisease].ages.female[selectedAge];
  totalAmount = data.diseases[selectedDisease]["Both sexes"];
  console.log(totalAmount);
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
  //Creeër een nieuw particlesystem met de verkregen locaties en aantal personen die de ziekte hebben, deze worden gebruikt om de visualisatie duidelijk te maken
  maleObj.organs.forEach(function (organOfSelected) {
    addSystem(maleObj.amount.replace(".", ""), locations.male[organOfSelected]);
  });
  femaleObj.organs.forEach(function (organOfSelected) {
    addSystem(femaleObj.amount.replace(".", ""), locations.female[organOfSelected]);
  });
};
