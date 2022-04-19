import { map } from './map.js';

//Enumeration permettant de connaître le type de l'hexagone 
export const HextilesType = Object.freeze({
    EauProfonde:1,
	Eau:2,
    Phare:3,
	Sable:4,
	Desert:5,
	Savanne:6,
	HerbeVerte:7,
	Foret:8,
	ForetDense:9,
	Plateau:10,
	Colline:11,
	Neige:12,
	Montagne:13,
	Volcan:14,
	Ville:15,
	River:16
});

//Classe permettant de stocker les hexagones en connaissant le type, l'élévation, la colonne et la ligne
export class Hex {
    constructor(type, elevation, col, row) {
        this.type = type;
        this.elevation = elevation;
        this.col = col;
        this.row = row;
    }
}

//Convertisseur des coordonnées des hexagones en coodonnées de pixel
export function HexToPixel(hex){
	var x = (25 * hex.col) + 16;
	var y = (14 * hex.row) + 34;
	return [x, y];
}

//Fonction permettant de recuperer un hexagone voisin selon la direction choisi
const neighbor_directions = [
    [+1, +1], [+1, -1], [ 0, -2], 
    [-1, -1], [-1, +1], [ 0, +2], 
];
function neighbor(hex, direction){
    let dir = neighbor_directions[direction];

    if(hex === undefined){
    	return undefined;
    }

    let col = map[hex.col + dir[0]];
  	if (col === undefined || [hex.row + dir[1]] === undefined) { 
  		return undefined;
  	}
	else
	{
		return col[hex.row + dir[1]];
	}
}

//Fonction qui permet de regarder si un certain type d'hexagone existe déjà dans un certain range au dessus
export function checkIfAlreadyExistInRange(hex, r){
	for(let i = -r; i < r; i++){
		for(let j = i%2; -j < r*2; j-=2){
			let neighbor_col = map[hex.col+i];
			if(neighbor_col !== undefined){
				let neighbor = neighbor_col[hex.row+j];
				if(neighbor !== undefined){
					if(hex.type == neighbor.type){
						return true;
					}
				}
			}
		}
	}
	return false;
}

//Permet de trouver un certain type d'Hextile sur la map a partir d'une autre tuile
export function FindHextile(hex, type){
	var queue = [hex];
	var alreadyInQ =[];
	while (queue.length != 0){
		var current = queue.shift();
		if (current !== undefined && current.type == type){
		    return current;
		}
		alreadyInQ.push(current);
		for(let i = 0; i < 6; i++){
			if (!alreadyInQ.includes(neighbor(current, i))){
				queue.push(neighbor(current, i));
				alreadyInQ.push(neighbor(current, i));
			}
		}
	}
}

//Fonction pour trouver toutes les tuiles d'un certain type sur la map
export function FindAllHextileOfType(type){
	var hexOfType = [];
    map.forEach(e => e.forEach(function(hex){
        if(hex.type === type){
        	hexOfType.push(hex);
        }
    }));
    return hexOfType;
}