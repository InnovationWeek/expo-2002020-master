const fs = require('fs');
const path = require('path');

function parseToString(file, diseases){
    let filePath = '../data/csv/' + file;
    let result;

    fs.readFile(filePath, {encoding: 'utf-8'},  function(err, data){
        if(err) console.log(err);
        else{
            diseases = ["Syphilis", "Chlamydia", "Gonorrhoea", "Genital herpes", "HIV/AIDS"];
            let object = {};
            let res = data.split('\n');
            let region = res[1].split(';').join('').split(/(?:,| )+/).join('').split(':');
            let year = res[2].split(';').join('').split(/(?:,| )+/).join('').split(':');
            let params = res[4].split(';').filter(c => c.length != 0).slice(1, 4);


            diseases.forEach((element, i) => {
                let s = res.filter(v => v.search(element) != -1).join('').split(';').filter(v => v.length != 0);
                let index = s.indexOf(element);
                let paramsValues = s.slice(index + 1, index + 4);
                let disease = {};
                disease['name'] = element;
                params.forEach((key, i) => disease[key] = paramsValues[i]);
           
       
                console.log(disease);
            });

            object[region[0]] = region[1].split('\r')[0];
            object[year[0]] = year[1].split('\r')[0];
            console.log(object);
        }
    });
}

parseToString('GHE2015_DAILY.csv');