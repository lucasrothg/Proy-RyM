
let personajes= document.querySelector(".character");
let ubicaciones= document.querySelector(".location");
let episodios= document.querySelector(".episode");
let tiempoProceso1= document.querySelector(".tiempo-proceso1");
let episodeLocations= document.querySelector(".episode-locations");
let tiempoProceso2= document.querySelector(".tiempo-proceso2");
let cont=0; //contador de episodios

const url1='https://rickandmortyapi.com/api/character';
const url2='https://rickandmortyapi.com/api/location';
const url3='https://rickandmortyapi.com/api/episode';

window.addEventListener('load', ()=> {
	console.log("loaded");
	llamados(); //llama a las funciones una vez cargada la pagina

});

const consulta = async function(dire, letra){
	var t0 = performance.now()
	let hojas=0;
	let quedanHojas=true;
	let response = await fetch(dire);
	let totalLetras=0;
	let segundosProceso=0;
	if (response.ok) { // retorna http code ok
	  let data = await response.json();
	  //console.log(data);
	  let hojas=data.info.pages;
	  //console.log(hojas);
	  let nuevo=dire+'?page=';
	  let i=0;
	  let re = new RegExp(letra, "g");
	  while(quedanHojas){
		  i++;
		  const response2=await fetch(nuevo+i);
		  let data2 = await response2.json();
		  //console.log(data2);
		  //buscamos dentro de cada hoja
		  for (j=0;j<20;j++){
			let res1=0;
			if (typeof data2.results[j] === 'undefined'){
				//console.log("final");
				break;
			}
			else{
			  //llevamos el texto a lowercase y despues se cuenta
			  let nombre=data2.results[j].name.toLowerCase() ;
			  res1= (nombre.match(re)||[]).length;
			  //console.log("total letras ".concat(res1));
			  //actualizamos el resultado a mostrar
			  totalLetras+=res1;
			}
		  }
		  //console.log("hoja actual ".concat(i));
		  quedanHojas = i<hojas;
	  }
	  
	  var t1 = performance.now();
	  return [totalLetras, t1-t0];
	} 
	else {
	  alert("HTTP-Error: " + response.status);
	}
	
}// fin función parte 1


const consulta2 = async function(url){
	let t2 = performance.now();
	let hojas=0;
	let quedanHojas=true;
	let response = await fetch(url);
	if (response.ok) { // retorna http code ok
	  let data = await response.json();
	  //console.log(data);
	  let hojas=data.info.pages;//total de hojas
	  //console.log(hojas);
	  let tot=data.info.count; //total de episodes
	  //console.log(tot);
	  let nuevo=url+"?page=";
	  let i=0;
	  cont=0; //cuenta los episodes
	  let finales=Array(tot);//contiene los array todasUbiaciones de origins para cada episode
	  while(quedanHojas){
		  i++;
		  const response2=await fetch(nuevo+i);
		  let data2 = await response2.json();
		  for (j=0;j<20;j++){
			let resul=0;
			let todasUbicaciones=[];//todas los origins del episodio
			if (typeof data2.results[j] === 'undefined'){
				break;
			}
			else{
			  let pers1= [];
			  pers1=data2.results[j].characters; //personajes del episodio
			  //obtener todas las origin de cada personaje, guardar en una lista.
			  let largo=0;
			  largo=pers1.length;
			  //console.log(pers1);
			  //console.log(largo);
			  for (k=0;k<largo;k++){
				  let ubic1="";
				  ubic1= await consulta3(pers1[k]);
				  //console.log(ubic1);	
				  if (!todasUbicaciones.includes(ubic1)){
					//console.log("no esta");
				    todasUbicaciones.push(ubic1);
				  }
				  /*else{
					console.log("esta");
			      }*/
			  }
			  //console.log("salida del ciclo por episode ".concat(j));  
			  //console.log(todasUbicaciones);
			  finales[cont]=todasUbicaciones;
			  cont++;
			  //console.log(finales[cont-1]);
			}
		  }
		  //console.log("hoja actual ".concat(i));
		  //console.log(finales);
		  quedanHojas = i<hojas;
	  }
	  let t3 = performance.now();
	  //console.log("proceso 2 ".concat(t3-t2));
	  return [t3-t2, finales];
	} 
	else {
	  alert("HTTP-Error: " + response.status);
	}
	
}


const consulta3 = async function(url){
	let response = await fetch(url);
	if (response.ok) { // retorna http code ok
	  let data = await response.json();
	  //console.log(data);
	  let origen=[];
	  origen=data.origin.name;
	  //console.log(origen);
	  return origen;
	}
}

async function fetchTodas() {
  const [locationsResponse, charactersResponse, locationsResponse] = await Promise.all([
    fetch('/movies'),
    fetch('/categories')
  ]);

  const movies = await moviesResponse.json();
  const categories = await categoriesResponse.json();

  return [movies, categories];
}

async function llamados(){
  let retorno1=[];
  retorno1=await consulta(url2, 'l');
  ubicaciones.textContent="cantiadad de letras 'l' en locations: "+(retorno1[0]);
  //console.log('primer llamado'.concat(retorno1[1]));
  let retorno2=[];
  retorno2=await consulta(url1, 'c');
  personajes.textContent="cantidad de letras 'c' en characters: "+(retorno2[0]);
  //console.log("segundo llamado" .concat(retorno2[1]));
  let retorno3=[];
  retorno3=await consulta(url3, 'e');
  episodios.textContent="cantidad de letras 'e' en episodes: "+(retorno3[0]);
  //console.log("tercer llamado".concat(retorno3[1]));
  let retornoProceso1=0;
  retornoProceso1=(retorno1[1]+retorno2[1]+retorno3[1]).toFixed(4);
  //console.log(retornoProceso1);
  tiempoProceso1.textContent="tiempo de proceso total: "+(retornoProceso1)+" milisegundos";
  //console.log("fin parte1");
  let retorno4=[];
  retorno4=await consulta2(url3);
  tiempoProceso2.textContent="tiempo de proceso total: "+(retorno4[0].toFixed(4))+" milisegundos";
  //console.log(retorno4[1]);
  for (i=0; i<cont; i++){
	let nuevo = document.createElement("p");
	let text = document.createTextNode((i+1).toString()+'. total '+ (retorno4[1][i].length)+(' origenes: ')+(retorno4[1][i]));
    nuevo.appendChild(text);
	document.getElementById("elementos").appendChild(nuevo);
  }
}






