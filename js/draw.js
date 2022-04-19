import { HextilesType, HexToPixel, FindHextile, FindAllHextileOfType } from './hex.js';

const HEXTILES_IMAGE = new Image();
HEXTILES_IMAGE.src = 'src/hextiles.png';

//Permet d'afficher une tuile choisi à une location precise
export function drawHextile(ctx, hexX, hexY, locX, locY){
	ctx.drawImage(HEXTILES_IMAGE, 32*hexX, 48*hexY, 32, 48, 25*locX, 14*locY, 32, 48);
}

//Liste avec tous les noms de ville
const nomVille = ['Almalexia','Angel Pine','Baja','Balmora','Carthag','Cocorico','Darnassus','Dol Amroth','Edge City','Exodar','Fairfield','Felwithe','Gongaga','Gates Falls','Hobbitebourg','Hyrule','Icara','Innsmouth','Jericho','Junon','Kalm','Kusa','Liberty City','Los Santos','Megaton','Midgar','Naglimund','New Mombasa','Onn','Osgiliath','Paradise City','Port-Crane','Quahog','Quiquendone','Rapture','Ravenholm','San Fierro','Smallville','Tortuga','Tsan-Chan','Undercity','Utai','Vallusa','Varna','Wadesdah','Westopolis','Xanadu','Yazuac','York Shin City','Zanarkand','Zion'];
//Choix d'un nom aléatoire parmi tous les noms de ville et l'affiche à l'emplacement désiré
export function drawName(ctx, x, y){
	if(nomVille.length > 0){
		let index = Math.floor(Math.random()*nomVille.length);
		let nom = nomVille[index];
		nomVille.splice(index, 1);
	
		ctx.save(); //Sauvegarde des paramètres canvas
		ctx.shadowOffsetX = 2; //Création d'une ombre sous le nom de la ville
	  	ctx.shadowOffsetY = 2; //Création d'une ombre sous le nom de la ville
	  	ctx.shadowBlur = 2; //Flou de l'ombre
	 	ctx.shadowColor = 'black'; //Couleur de l'ombre
		ctx.fillStyle = 'white'; //Couleur du texte
		ctx.font = '18px Times New Roman'; //Taille et Type de l'écriture
		ctx.textAlign = 'center'; //Allignement du texte au centre
		ctx.fillText(nom, 25*x+15, 14*y+18); //Affichage du texte
		ctx.restore(); //Permet d'enlever l'ombre sous les hexagones
	}
}

//Dessine une riviere à partir des montagnes de type River jusqu'a l'océan
export function drawRiver(ctx){
	var river = FindAllHextileOfType(HextilesType.River);
	
	for(let i = 0; i < river.length; i++){
		if(river[i].type != HextilesType.River){
			continue;
		}
		var waterCoord = HexToPixel(FindHextile(river[i], HextilesType.Eau));
	    var riverCoord = HexToPixel(river[i]);
	
		var p1 = {x:waterCoord[0], y:waterCoord[1]}, // point 1
	    p2 = {x:riverCoord[0], y:riverCoord[1]}, // point 2
	    mx = (p2.x - p1.x) * 0.5, // mid-point between point 1 and 2
	    my = (p2.y - p1.y) * 0.5,
	    c1 = {x: p1.x, y: p1.y + my}, // create center point objects
	    c2 = {x: p2.x, y: p2.y - my},
	    steps = 0.01; /// curve resolution
	    /// render the smooth curves using 1/4 ellipses    
		
		ctx.save();
		ctx.beginPath();

		for(var isFirst = true,            /// first point is moveTo, rest lineTo
		        angle = 1.5 * Math.PI,     /// start angle in radians
		        goal = 2 * Math.PI,        /// goal angle
		        x, y; angle < goal; angle += steps) {

		    /// calculate x and y using cos/sin
		    x = c1.x + mx * Math.cos(angle);
		    y = c1.y + my * Math.sin(angle);

		    /// move or draw line
		    (isFirst) ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
		    isFirst = false;
		}

		for(var isFirst = true,
		        angle = Math.PI,
		        goal = 0.5 * Math.PI,
		        x, y;angle > goal; angle -= steps) {

		    x = c2.x + mx * Math.cos(angle);
		    y = c2.y + my * Math.sin(angle);

		    (isFirst) ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
		    isFirst = false;
		}
		ctx.strokeStyle='deepskyblue';
		ctx.lineWidth = 5;
		ctx.stroke();
		ctx.restore();
	}
}

//Dessine une route entre deux villes
export function drawRoad(ctx){
	var ville = FindAllHextileOfType(HextilesType.Ville);
	if(ville.length < 2){
		return;
	}

	var startCoord = HexToPixel(ville[0]);
    var goalCoord = HexToPixel(ville[1]);

    ctx.save();
	ctx.beginPath();
	ctx.setLineDash([10, 10]); //Permet de faire des pointillés
	ctx.moveTo(startCoord[0], startCoord[1]);
	ctx.lineTo(goalCoord[0], goalCoord[1]);
	ctx.strokeStyle='red';
	ctx.lineWidth = 3;
	ctx.stroke();
	ctx.restore();
}