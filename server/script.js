const fs = require('fs');
const path = require('path');


// TO DO: per regio een json file met daarin de jaren en per jaar de ziekte en aantal getroffen
// mensen van die ziekte per geslacht. Plus de leeftijden.

function parseToString(file, diseases){
    let filePath = '../data/csv/' + file;
    let result;

    fs.readFile(filePath, {encoding: 'utf-8'},  function(err, data){
        if(err) console.log(err);
        else{
            diseases = ["Syphilis", "Chlamydia", "Gonorrhoea", "Genital herpes", "HIV/AIDS"];
            let object = {};
            let res = data.split('\n');
            let ages = Array(...new Set(res[5].split(';').filter(v => v.length != 0 && v.match('\^[0-9]+'))));

            ages = ages.slice(0, ages.length - 1);


            let region = res[1].split(';').join('').split(/(?:,| )+/).join('').split(':');
            let year = res[2].split(';').join('').split(/(?:,| )+/).join('').split(':');
            let params = res[4].split(';').filter(c => c.length != 0).slice(1, 4);
            let diseasesObjects = {};

            diseases.forEach((element, i) => {
                let s = res.filter(v => v.search(element) != -1).join('').split(';').filter(v => v.length != 0);
                let index = s.indexOf(element);
                let paramsValues = s.slice(index + 1, index + 4);
                let disease = {};
                
                params.forEach((key, i) => disease[key] = paramsValues[i]);
                ageObject = {};
                male = {};
                female = {};

                ages.forEach((age, i) => {
                    male[age] = s[i + 6];
                    female[age] = s[i + 12];
                });
                ageObject = {'male': male,
                            'female': female};

                disease['ages'] = ageObject;
                diseasesObjects[element] = disease;
            });

            object[region[0]] = region[1].split('\r')[0];
            object[year[0]] = year[1].split('\r')[0];
            object['diseases'] = diseasesObjects;
           createJSON(file, object);
        }
    });
}


function createJSON(file, sampleObject){
    fs.writeFile("../data/json/" + file.split('.csv').join('') + '.json', JSON.stringify(sampleObject), (err) => {
        if (err) {
            console.error(err);
            return;
        };
        console.log(file + " has been converted to JSON");
    });
}

// Example parses csv file to json object and creates a json file

const files = fs.readdirSync('../data/csv/');
files.forEach(parseToString);