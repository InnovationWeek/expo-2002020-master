//Standaard values initializeren
let selectedYear = "2010";
let selectedContinent = "America";
let selectedDisease = "Syphilis";
let selectedAge = "0-28 days";

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

  // var len = 100;
  // translate(width / 3, height / 3);
  // for (var i = 0; i < 4; i++) {
  //   rotate(PI / 2);
  //   len -= 5;
  //   fractalLines(len, PI / 4);
  // }

  fileChecker();
}

function draw() {
  background(0);
  for (let system of particleSystems) {
    system.addParticle();
    system.run();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

/*--------------------------------------------
-------------------PARTICLES------------------
---------------------------------------------*/


class Particle {
  constructor(xLoc, yLoc) {
    this.position = createVector(parseInt(xLoc - 95), parseInt(yLoc + 20));
    this.velocity = createVector(random(-1, 1), random(-1, 1));
    this.acceleration = createVector(-0.001, 0.001);
    this.alpha = 100;

    // //steering
    // this.target = createVector(x, y);
    // this.maxspeed = 3;    // Maximum speed
    // this.maxforce = 0.05; // Maximum steering force
  }

  isDead() {
    return this.alpha < 0;
  }

  update() {
    this.velocity.add(this.acceleration);
    this.position.add(this.velocity);
    this.alpha -= 5;
  }

  show() {
    noFill();
    //stroke(255);
    let hue;

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

    stroke(hue, 100, 100, this.alpha);
    let rad = 10;
      ellipse(this.position.x, this.position.y, rad / 2, rad / 2);
  }
}

class Particlesystem {
  constructor(amount, originX, originY) {
    this.origin = createVector(originX, originY)
    this.particles = [];
  }

  addParticle(amount = 5) {
    for (let i = 0; i < amount; i++) {
      let p = new Particle(this.origin.x, this.origin.y);
      this.particles.push(p);
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

function addSystem(loc) {
  console.log("add System", loc)
  let amount = 5
  let newSystem = new Particlesystem(amount, parseInt(loc.x), parseInt(loc.y));
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
  maleObj.organs.forEach(function (organOfSelected) {
    maleObj.organsLoc.push(locations.male[organOfSelected]);
    addSystem(locations.male[organOfSelected]);
  });
  femaleObj.organs.forEach(function (organOfSelected) {
    femaleObj.organsLoc.push(locations.female[organOfSelected]);
    console.log("organ adding as system", locations.female[organOfSelected], organOfSelected);
    addSystem(locations.female[organOfSelected]);
  });
};
