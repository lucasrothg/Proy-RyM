
let personajes= document.querySelector(".character");
let ubicaciones= document.querySelector(".location");
let tiemporProceso1= document.querySelector(".tiempo-proceso1");
let episodeLocations= document.querySelector(".episode-locations");
let tiemporProceso2= document.querySelector(".tiempo-proceso2");

const url1='https://rickandmortyapi.com/api/character';
const url2='https://rickandmortyapi.com/api/location';
const url3='https://rickandmortyapi.com/api/episode';

window.addEventListener('load', ()=> {
	console.log("loaded");
	llamados(); //llama a las funciones una vez cargada la pagina

});

const consulta = async function(dire, letra){
	var t0 = performance.now()
	console.log(t0);
	let hojas=0;
	let quedanHojas=true;
	let response = await fetch(dire);
	let totalLetras=0;
	let segundosProceso=0;
	if (response.ok) { // retorna ok
	  let data = await response.json();
	  //console.log(data);
	  let hojas=data.info.pages;
	  console.log(hojas);
	  let nuevo=dire.concat("?page=");
	  let i=0;
	  let compara="/".concat(letra).concat("/g"); //indica caracter a comparar
	  while(quedanHojas){
		  i++;
		  const response2=await fetch(nuevo.concat(i));
		  let data2 = await response2.json();
		  //buscamos dentro de cada hoja
		  for (j=0;j<20;j++){
			let resul=0;
			if (typeof data2.results[j] === 'undefined'){
				//console.log("shao");
				break;
			}
			else{
			  //llevamos el texto a lowercase y despues se cuenta
			  let nombre=data2.results[j].name.toLowerCase() ;
			  resul= (nombre.match(/c/g)||[]).length;
			  //actualizamos el resultado a mostrar
			  totalLetras+=resul;
			}
		  }
		  //console.log("hoja actual ".concat(i));
		  quedanHojas = i<hojas;
	  }
	  
	  var t1 = performance.now();
	  console.log("tiempo proceso ");
	  console.log(t1-t0);
	  return [totalLetras, t1-t0];
	} 
	else {
	  alert("HTTP-Error: " + response.status);
	}
	
}// fin función parte 1

const consulta2 = async function(){
	var t0 = performance.now();
	let hojas=0;
	let quedanHojas=true;
	let response = await fetch(url3);
	if (response.ok) { // retorna ok
	  let data = await response.json();
	  //console.log(data);
	  let hojas=data.info.pages;
	  console.log(hojas);
	  let nuevo=dire.concat("?page=");
	  let i=0;
	  while(quedanHojas){
		  i++;
		  const response2=await fetch(nuevo.concat(i));
		  let data2 = await response2.json();
		  
		  for (j=0;j<20;j++){
			let resul=0;
			if (typeof data2.results[j] === 'undefined'){
				//console.log("shao");
				break;
			}
			else{
			  let nombre=data2.results[j].name.toLowerCase() ;
			  resul= (nombre.match(/c/g)||[]).length;
			  totalLetras+=resul;
			}
		  }
		  console.log("hoja actual ".concat(i));
		  quedanHojas = i<hojas;
	  }
	  var t1 = performance.now()-t0;
	  console.log("valor to y t1 ".concat(t0).concat(" ").concat(t1));
	  return [totalLetras, t1];
	} 
	else {
	  alert("HTTP-Error: " + response.status);
	}
	
}



async function llamados(){
  let retorno1=[];
  retorno1=await consulta(url2, 'l');
  ubicaciones.textContent="cantiadad de letras en locations: ".concat(retorno1[0]);
  console.log('primer llamado'.concat(retorno1[1]));
  let retorno2=[];
  retorno2=await consulta(url1, 'c');
  personajes.textContent="cantidad de letras en characters: ".concat(retorno2[0]);
  console.log("segundo llamado" .concat(retorno2[1]));
  let retorno3=[];
  retorno3=await consulta(url3, 'e');
  episodios.textContent="cantidad de letras en episodes: ".concat(retorno3[0]);
  console.log("tercer llamado".concat(retorno3[1]));
  let retornoProceso1=0;
  console.log(retorno1[1]);
  retornoProceso1=retorno1[1]+retorno2[1]+retorno3[1];
  console.log(retornoProceso1);
  tiempoProceso1.textContent="tiempo de proceso total: ".concat(retornoProceso1);
  console.log("fin parte1");
  //let retorno3=await consulta(url3, 'e');
  //episodios.textContent="cantidad de letras en episodes: ".concat(retorno3);
  //{console.log("tercer llamado");
  
};






