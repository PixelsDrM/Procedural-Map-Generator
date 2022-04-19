import { Hex, HextilesType, checkIfAlreadyExistInRange } from './hex.js';
import { drawHextile, drawName, drawRiver, drawRoad } from './draw.js';
import { SimplexNoise } from './simplex-noise.js';

//Stockage de la carte
export var map = Array.from(Array(Math.ceil(window.innerHeight/12)), () => new Array(Math.ceil(window.innerWidth/24)));

//window.onload permet d'executer une fonction une fois que toutes les ressources ont été chargé
window.onload = function(){
	//Définition d'un canvas avec sa valeur et son contexte
	var canvas = document.getElementById("canvas");
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	var ctx = canvas.getContext('2d');

	//Ajout d'un font bleu
	ctx.save();
	ctx.fillStyle = 'deepskyblue';
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	ctx.restore();

	//Fonction de génération du bruit
	let gen = new SimplexNoise();
	function noise(nx, ny) {
		return gen.noise2D(nx, ny) / 2 + 0.5; //Range : 0:1
	}

	//Création de la carte
	for (let y=0; y<window.innerHeight/14; y++) {
	    for (let x=y%2; x<window.innerWidth/25; x+=2) {

	    	//Génération de l'élevation grâce au bruit
	    	let nx = x/(window.innerWidth/25) - 0.5, ny = y/(window.innerHeight/14) - 0.5;
	    	var elevation = 1 * noise(1 * nx, 1 * ny)
				  + 0.5 * noise(2 * nx, 2 * ny)
				  + 0.25 * noise(4 * nx, 4 * ny);
	    	elevation /= (1.00+0.50+0.25);

	    	//Ile
	    	/*let d = 2 * Math.max(Math.abs(nx), Math.abs(ny));
	    	d = Math.pow(d, 1);
	    	elevation = (1 + elevation - d) / 2;*/
	    	
	    	//Génération des tuiles en fonction de l'élevation obtenue grace au bruit.
	    	if (elevation < 0.45) { map[x][y] = new Hex(HextilesType.EauProfonde, elevation, x, y); drawHextile(ctx, 4, 5, x, y); }//Eau Profonde
	    	else if(elevation < 0.451 && !checkIfAlreadyExistInRange(new Hex(HextilesType.Phare, 1, x, y), 10)) { map[x][y] = new Hex(HextilesType.Phare, elevation, x, y); drawHextile(ctx, 13, 5, x, y); }//Phare
			else if (elevation < 0.48) { map[x][y] = new Hex(HextilesType.Eau, elevation, x, y); drawHextile(ctx, 0, 5, x, y); }//Eau
			else if (elevation < 0.50) { map[x][y] = new Hex(HextilesType.Sable, elevation, x, y); drawHextile(ctx, 0, 4, x, y); }//Sable
			else if (elevation < 0.51) { map[x][y] = new Hex(HextilesType.Sable, elevation, x, y); drawHextile(ctx, 1, 4, x, y); }//Sable avec palmier
		    else if (elevation < 0.52) { map[x][y] = new Hex(HextilesType.Desert, elevation, x, y); drawHextile(ctx, 1, 2, x, y); }//Desert
			else if (elevation < 0.53) { map[x][y] = new Hex(HextilesType.Savanne, elevation, x, y); drawHextile(ctx, 10, 2, x, y); }//Savanne
			else if (elevation < 0.54) { map[x][y] = new Hex(HextilesType.Savanne, elevation, x, y); drawHextile(ctx, 9, 2, x, y); }//Savanne et roche
			else if (elevation < 0.57) { map[x][y] = new Hex(HextilesType.HerbeVerte, elevation, x, y); drawHextile(ctx, 2, 0, x, y); }//Herbe verte
			else if (elevation < 0.571 && !checkIfAlreadyExistInRange(new Hex(HextilesType.Ville, 1, x, y), 10)) { map[x][y] = new Hex(HextilesType.Ville, elevation, x, y); drawHextile(ctx, 0, 7, x, y); drawName(ctx, x, y); } //Ville sans rampart
			else if (elevation < 0.60) { map[x][y] = new Hex(HextilesType.HerbeVerte, elevation, x, y); drawHextile(ctx, 3, 0, x, y); }//Herbe verte
		  	else if (elevation < 0.67) { map[x][y] = new Hex(HextilesType.Foret, elevation, x, y); drawHextile(ctx, 5, 0, x, y); } //Foret
			else if (elevation < 0.71) { map[x][y] = new Hex(HextilesType.ForetDense, elevation, x, y); drawHextile(ctx, 5, 1, x, y); }//Foret dense
			else if (elevation < 0.72) { map[x][y] = new Hex(HextilesType.Plateau, elevation, x, y); drawHextile(ctx, 12, 3, x, y); }//Plateau
			else if (elevation < 0.73) { map[x][y] = new Hex(HextilesType.Plateau, elevation, x, y); drawHextile(ctx, 11, 3, x, y); }//Plateau avec du bois
			else if (elevation < 0.74) { map[x][y] = new Hex(HextilesType.Colline, elevation, x, y); drawHextile(ctx, 11, 0, x, y); }//Colline et Rocher
			else if (elevation < 0.75) { map[x][y] = new Hex(HextilesType.Neige, elevation, x, y); drawHextile(ctx, 5, 3, x, y); }//Neige
			else if (elevation < 0.77) { map[x][y] = new Hex(HextilesType.Neige, elevation, x, y); drawHextile(ctx, 8, 3, x, y); }//Neige et colline
		  	else if (elevation < 0.775 && !checkIfAlreadyExistInRange(new Hex(HextilesType.River, 1, x, y), 5)) { map[x][y] = new Hex(HextilesType.River, elevation, x, y); drawHextile(ctx, 0, 6, x, y); }//River
		  	else if (elevation < 0.90) { map[x][y] = new Hex(HextilesType.Montagne, elevation, x, y); drawHextile(ctx, 0, 6, x, y); }//Montagne
		  	else { map[x][y] = new Hex(HextilesType.Volcan, elevation, x, y); drawHextile(ctx, 4, 6, x, y); } //Volcan
		  	//ctx.fillText(x+","+y, 25*x+5, 14*y+32); //Permet d'afficher les coordonnées
	    }
	}
	drawRiver(ctx);
	//drawRoad(ctx);
}