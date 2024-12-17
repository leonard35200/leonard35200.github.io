const div1 = document.getElementById('div1');
const div2 = document.getElementById('div2');
const div3 = document.getElementById('div3');
const p1 = document.getElementById('p1');
const h4_1 = document.getElementById('h4');
const btnValidation = document.getElementById('validation');
const entree = document.getElementById('entree');
let methode = ''
let chiffrage= ''
let TexteCode = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor. Cras elementum ultrices diam. Maecenas ligula massa, varius a, semper congue, euismod non, mi. "
  

function remplacerDivs() {
  h4.innerHTML= "Voulez-vous crypter ou décrypter ?"
  div1.style.opacity = "0";
  div1.style.zIndex = "1";
  div2.style.opacity = "1";
  div2.style.zIndex = "2";
  div2.style.transform = "scale(1)";
  setTimeout(() => div1.style.display = "none", 500); // Cacher div1 après la transition
}

function textarea() {
    div2.innerHTML = ' '
    h4.innerHTML = ""
    btnValidation.style.opacity = "1";
  entree.style.opacity = "1";
}
function validation(){
  div3.innerHTML =""
  btnValidation.style.opacity = "0";
  entree.style.opacity = "0";
  h4.innerHTML = "Voici votre texte " + chiffrage
  
  const texte = entree.value;
  cryptage(texte);
}
function cryptage(text){
  p1.innerHTML = TexteCode+text
}
document.getElementById('ROT13').addEventListener('click', function () {
  methode = 'ROT13';
  remplacerDivs();
});

document.getElementById('Cesar').addEventListener('click', function () {
  methode = 'Cesar';
  remplacerDivs();
});

document.getElementById('Vigenere').addEventListener('click', function () {
  methode = 'Vigenere';
  remplacerDivs();
});

document.getElementById('Polybe').addEventListener('click', function () {
  methode = 'Polybe';
  remplacerDivs();
});    

document.getElementById('cryptage').addEventListener('click', function () {
  chiffrage = 'crypté';
  textarea();
});    
document.getElementById('decryptage').addEventListener('click', function () {
  chiffrage = 'decrypté';
  textarea();
});   
  document.getElementById('validation').addEventListener('click', function () {
    validation() 
  }); 