const pup = require('puppeteer');
const fs = require('fs');
const fsa = require('fs/promises');
const path = require("path");
const cheerio = require("cheerio");
const axios = require("axios");

const OUTPUT_FILE = path.join(__dirname, '../data/allSpecies.json');

async function downloadEachPage(array, si, ei, outset, endset){
   const brow = await pup.launch();
    const page = await brow.newPage();

    for (i= si; i < array.length; i++){
    try{

    await page.goto("https://en.wikipedia.org/wiki/"+outset+array[i]+endset);
    const cont = await page.content();
    const stre = "C:\\Users\\Public\\Documents\\Websites\\allcountries\\files\\webs\\"+array[i]+".html";
    fs.writeFileSync(stre, cont);
    console.log("https://en.wikipedia.org/wiki/"+outset+array[i]+endset +" writen at " + stre);
    }catch(error){console.log(error);}
  }
}

async function writeAllStarsFromConstellation(){
    const constellations = ["Andromeda","Antlia","Apus","Aquarius","Aquila","Ara","Aries","Auriga","Bo%C3%B6tes","Caelum","Camelopardalis","Cancer","Canes Venatici","Canis Major","Canis Minor","Capricornus","Carina","Cassiopeia","Centaurus","Cepheus","Cetus","Chamaeleon","Circinus","Columba","Coma Berenices","Corona Australis","Corona Borealis","Corvus","Crater","Crux","Cygnus","Delphinus","Dorado","Draco","Equuleus","Eridanus","Fornax","Gemini","Grus","Hercules","Horologium","Hydra","Hydrus","Indus","Lacerta","Leo","Leo Minor","Lepus","Libra","Lupus","Lynx","Lyra","Mensa","Microscopium","Monoceros","Musca","Norma","Octans","Ophiuchus","Orion","Pavo","Pegasus","Perseus","Phoenix","Pictor","Pisces","Piscis Austrinus","Puppis","Pyxis","Reticulum","Sagitta","Sagittarius","Scorpius","Sculptor","Scutum","Serpens","Sextans","Taurus","Telescopium","Triangulum","Triangulum Australe","Tucana","Ursa Major","Ursa Minor","Vela","Virgo","Volans","Vulpecula","Andromeda","Antlia","Apus","Aquarius","Aquila","Ara","Argo Navis","Aries","Auriga","Bo%C3%B6tes","Caelum","Camelopardalis","Cancer","Canes Venatici","Canis Major","Canis Minor","Capricornus","Carina","Cassiopeia","Centaurus","Cepheus","Cetus","Chamaeleon","Circinus","Columba","Coma Berenices","Corona Australis","Corona Borealis","Corvus","Crater","Crux","Cygnus","Delphinus","Dorado","Draco","Equuleus","Eridanus","Fornax","Gemini","Grus","Hercules","Horologium","Hydra","Hydrus","Indus","Lacerta","Leo","Leo Minor","Lepus","Libra","Lupus","Lynx","Lyra","Mensa","Microscopium","Monoceros","Musca","Norma","Octans","Ophiuchus","Orion","Pavo","Pegasus","Perseus","Phoenix","Pictor","Pisces","Piscis Austrinus","Puppis","Pyxis","Reticulum","Sagitta","Sagittarius","Scorpius","Sculptor","Scutum","Serpens","Sextans","Taurus","Telescopium","Triangulum","Triangulum Australe","Tucana","Ursa Major","Ursa Minor","Vela","Virgo","Volans","Vulpecula",];    const brow = await pup.launch();
    for(let i = 0 ; i < constellations.length; i++){
    try{
    const constellation = constellations[i];
    const page = await brow.newPage();
    await page.goto("https://en.wikipedia.org/wiki/List_of_stars_in_"+constellation);
    const cont = await page.content();
    const stre = "C:\\Users\\Public\\Documents\\Websites\\allcosmos\\files\\listofstars\\"+constellation+".html";
    fs.writeFileSync(stre, cont);
    console.log("https://en.wikipedia.org/wiki/List_of_stars_in_"+constellation +" writen at " + stre);
    const file = fs.readFileSync(stre, 'utf-8');
    const regex = /<a href="\/wiki\/([^"]+)"/g;
    const links = [];
    let match;
    while ((match = regex.exec(file)) !== null) {
        links.push(match[1]);
    }
    let newstr = "const "+ constellation +"Stars = [";
    for (i= 0; i < links.length; i++){
         newstr +="\""+ links[i] + "\",";
    }
    newstr += "];";
    //console.log(newstr);
    console.log("Total links: " + links.length);
    fs.writeFileSync("C:\\Users\\Public\\Documents\\Websites\\allcosmos\\files\\listofstars\\"+constellation+"stars.txt", newstr);
  }catch(error){console.log(error);}}
}


function parse(s, finish,star) {

        let allcont = "";
        try {
                const filePath = path.join("stars", `${star}`);
                const html = fs.readFileSync(filePath, "utf-8");

                // Parse HTML
                const $ = cheerio.load(html);
                const text = $("body").text();

                let start = text.indexOf(s) + s.length;
                let end = start + 12;

                let extracted = clean(text.substring(start, end));

                allcont += "      \""+s+"\":"+`"${extracted}"`+finish;

            } catch (err) {
                console.error(err);
            }

            return allcont;
        }
    function parseInfobox(star) {
      const filePath = path.join("stars", star);
      const html = fs.readFileSync(filePath, "utf-8");
      const $ = cheerio.load(html);

      const data = {};

	  $(".infobox tr").each((i, row) => {
	      let label = "";
	      let value = "";

	      const th = $(row).find("th").first();
	      const tds = $(row).find("td");

	      if (th.length && tds.length === 1) {
	          // Standard case
	          label = th.text().trim();
	          value = tds.first().text().trim();

	      } else if (tds.length >= 2) {
	          // Alternative case (like Distance)
	          label = $(tds[0]).text().trim();
	          value = $(tds[1]).text().trim();
	      }

	      if (label && value) {
	          data[clean(label)] = clean(value);
	      }
	  });

    return data;
  }
    function clean(value) {
            return value
                .replace(/\[[^\]]*\]/g, "")   // remove [7], [note 1]
                .replace(/\s+/g, " ")         // normalize spaces
                //.replace(/[^\x00-\x7F]/g, "") // optional: remove weird unicode
                .trim();
        }
function writeConstellationArrayJS(){
    const bare = "Andromeda, Antlia, Apus, Aquarius, Aquila, Ara, Aries, Auriga, Bo%C3%B6tes, Caelum, Camelopardalis, Cancer, Canes Venatici, Canis Major, Canis Minor, Capricornus, Carina, Cassiopeia, Centaurus, Cepheus, Cetus, Chamaeleon, Circinus, Columba, Coma Berenices, Corona Australis, Corona Borealis, Corvus, Crater, Crux, Cygnus, Delphinus, Dorado, Draco, Equuleus, Eridanus, Fornax, Gemini, Grus, Hercules, Horologium, Hydra, Hydrus, Indus, Lacerta, Leo, Leo Minor, Lepus, Libra, Lupus, Lynx, Lyra, Mensa, Microscopium, Monoceros, Musca, Norma, Octans, Ophiuchus, Orion, Pavo, Pegasus, Perseus, Phoenix, Pictor, Pisces, Piscis Austrinus, Puppis, Pyxis, Reticulum, Sagitta, Sagittarius, Scorpius, Sculptor, Scutum, Serpens, Sextans, Taurus, Telescopium, Triangulum, Triangulum Australe, Tucana, Ursa Major, Ursa Minor, Vela, Virgo, Volans, Vulpecula, Andromeda, Antlia, Apus, Aquarius, Aquila, Ara, Argo Navis, Aries, Auriga, Bo%C3%B6tes, Caelum, Camelopardalis, Cancer, Canes Venatici, Canis Major, Canis Minor, Capricornus, Carina, Cassiopeia, Centaurus, Cepheus, Cetus, Chamaeleon, Circinus, Columba, Coma Berenices, Corona Australis, Corona Borealis, Corvus, Crater, Crux, Cygnus, Delphinus, Dorado, Draco, Equuleus, Eridanus, Fornax, Gemini, Grus, Hercules, Horologium, Hydra, Hydrus, Indus, Lacerta, Leo, Leo Minor, Lepus, Libra, Lupus, Lynx, Lyra, Mensa, Microscopium, Monoceros, Musca, Norma, Octans, Ophiuchus, Orion, Pavo, Pegasus, Perseus, Phoenix, Pictor, Pisces, Piscis Austrinus, Puppis, Pyxis, Reticulum, Sagitta, Sagittarius, Scorpius, Sculptor, Scutum, Serpens, Sextans, Taurus, Telescopium, Triangulum, Triangulum Australe, Tucana, Ursa Major, Ursa Minor, Vela, Virgo, Volans, Vulpecula".trim().split(", ");
    let newstr = "const constellations = [";
    for (i= 0; i < bare.length; i++){
        newstr +="\""+ bare[i] + "\",";
    }
    newstr += "];";
    fs.writeFileSync("C:\\Users\\Public\\Documents\\Websites\\allcosmos\\files\\constellations.txt", newstr);

}
async function writeJSON(){


    const stars = fs.readdirSync("stars");
    const outset = "List_of_";
    const endset = "n_countries_by_area";

    const toseekL = ["Right Ascension", "Declination:","Apparent Magnitude","Absolute Magnitude","B-V color index",
  "U-B color index"];
    const toseekR = ["Mass","Spectral type","Rotational velocity","Luminosity","Surface Gravity (log g)","Distance",
    "Metallicity: [Fe/H]", "Temperature","Age"];
    let lbd = "[\n  {\n     ";
    //downloadEachPage(continents, 0, 2, outset, endset);
    for(i=0; i < stars.length; i++){

        console.log("Processing " + stars[i]);
        try{
        const url = "C:\\Users\\Public\\Documents\\Websites\\allcosmos\\files\\stars\\"+ stars[i]+".html";
        lbd+="\"name\":\""+ stars[i] +"\", \n        \"background\":\"files/images/GType.png\","+
        "\n        \"left\":[ \n        ";
        console.log("Processing " + stars[i]);

        for (let j = 0; j < toseekL.length; j++) {
            try{
            const finish =(j<toseekL.length-1)? ",\n": "\n";
            const newLine =parse( toseekL[j], finish, stars[i]);
          if(newLine && !newLine.includes("ptcontent")){  console.log("Appended " + newLine);
            lbd+=newLine;}

          }catch(error){console.log(error);}
        }
        lbd+="], \n        \"right\":[ \n ";
        for (let j = 0; j < toseekR.length; j++) {
            try{
            const finish =(j<toseekR.length-1)? ",\n": "\n";

            const newLine =parse(toseekR[j], finish, stars[i]);
            if(newLine && !newLine.includes("ptcontent")){
            console.log("Appended " + newLine);

            lbd+=newLine;}

          }catch(error){console.log(error);}
        }
        lbd+="], \n";

        }catch(error){console.log(error);}
    }
    lbd += "} \n ]";
    fs.writeFileSync(
        path.join("C:\\Users\\Public\\Documents\\Websites\\allcosmos\\files\\","starsauto.json"),
        lbd);
}
function writeJSONGPT(){
  const result = [];

  const elements = fs.readdirSync("elements");
  const outset = "List_of_";
  const endset = "n_countries_by_area";

  const toseek = ["Atomic Mass", "Mohs hardness", "Britnell Hardness", "Covalent Radius",
				"Van der Waals Radius", "Atomic Radius", "Speed of sound", "Melt point", "Boil point", "Poisson ratio",
      "Electrons per shield", "Density at standard conditions (T= 293 K)", "Heat of fusion", "Heat of vaporization",
      "Molar heat capacity (J/(mol·K) F)","Specific heat capacity (J/(kg·K) F)", "Thermal conductivity (W/(m·K))", "Pauling Scale", 
    "Thermal expansion (1/K)"];

  let lbd = "[\n  {\n     ";

  for (i=0; i < elements.length; i++) {
    const info = parseInfobox(elements[i]);

    result.push({name: elements[i].replace(".html", "")});
    for(let j = 0; j < toseek.length; j++){
      if(info[toseek[j]]){
        console.log("Found " + toseek[j] + " for " + elements[i]);
                    const last = (j<toseek.length-1)? ",\n": "\n";

        result.push({
          [toseek[j]]: info[toseek[j]+last]
        });
        }else{
            console.log("Did not find " + toseek[j] + " for " + elements[i]);
        }
      }
        
     result.push({"}": "\n"});  
    }
	
 console.log(result);

fs.writeFileSync(
"elementsauto.json",
JSON.stringify(result, null, 2)
);
}
writeJSONGPT();