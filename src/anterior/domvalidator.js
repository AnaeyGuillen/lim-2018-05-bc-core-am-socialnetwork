let sugerir = document.getElementById('sugerencias');
var itemMin8 = document.createElement('li');
itemMin8.innerHTML = 'minimo 8 caracteres';
var itemUpper = document.createElement('li');
itemUpper.innerHTML = 'debe contener una mayuscula';
var itemLower = document.createElement('li');
itemLower.innerHTML = 'debe contener una minuscula';
var itemNum = document.createElement('li');
itemNum.innerHTML = 'debe contener un numero';
sugerir.appendChild(itemMin8);
sugerir.appendChild(itemUpper);
sugerir.appendChild(itemLower);
sugerir.appendChild(itemNum);
document.getElementById("register").disabled = true;
document.getElementById('emailRegisterAccess').addEventListener('input', () =>{
  let myInput = document.getElementById('emailRegisterAccess').value;
  valido = document.getElementById('emailOK');
  emailValidator(myInput) ? valido.innerHTML = "\u2714" : valido.innerHTML ="\u2718";
});
document.getElementById('name').addEventListener('input', () => {
  let myInput = document.getElementById('name').value;
  valido = document.getElementById('nameOK');
  nameValidator(myInput) ? valido.innerHTML = "\u2714" : valido.innerHTML ="\u2718";
});
document.getElementById('passwordRegisterAccess').addEventListener('input', () => {
  let myInput = document.getElementById('passwordRegisterAccess').value;
  validoEmail = document.getElementById('emailOK');
  valido = document.getElementById('passwordOK');
  sugerir = document.getElementById('sugerencias');
  //MOSTRANDO SUGERENCIAS
  /^(?=.*\d).{1,}$/.test(myInput) ? valuesGood(itemNum): sugerir.appendChild(itemNum);
  /^(?=.*[A-Z]).{1,}$/.test(myInput) ? valuesGood(itemUpper): sugerir.appendChild(itemUpper);
  /^(?=.*[a-z]).{1,}$/.test(myInput) ? valuesGood(itemLower): sugerir.appendChild(itemLower);
  /^.{8,}$/.test(myInput) ? valuesGood(itemMin8): sugerir.appendChild(itemMin8);

  if (passwordValidator(myInput)) {
    valido.innerText = "\u2714";
    if(validoEmail.text = "\u2714") {
      document.getElementById("register").disabled = false;
    }
  } else {
    valido.innerText = "\u2718";
    document.getElementById("register").disabled = true;
  }
});
// Validando el Login
document.getElementById("login").disabled = true;
document.getElementById('emailNormalAccess').addEventListener('input', () =>{
  let myInput = document.getElementById('emailNormalAccess').value;
  valido = document.getElementById('emailOKAccess');
  emailValidator(myInput) ? valido.innerHTML = "\u2714" : valido.innerHTML ="\u2718";
});

document.getElementById('passwordNormalAccess').addEventListener('input', () => {
  let myInput = document.getElementById('passwordNormalAccess').value;
  validoEmail = document.getElementById('emailOKAccess');
  valido = document.getElementById('passwordOKAccess');
  sugerir = document.getElementById('sugerenciasAccess');
  //MOSTRANDO SUGERENCIAS
  /^(?=.*\d).{1,}$/.test(myInput) ? valuesGood(itemNum): sugerir.appendChild(itemNum);
  /^(?=.*[A-Z]).{1,}$/.test(myInput) ? valuesGood(itemUpper): sugerir.appendChild(itemUpper);
  /^(?=.*[a-z]).{1,}$/.test(myInput) ? valuesGood(itemLower): sugerir.appendChild(itemLower);
  /^.{8,}$/.test(myInput) ? valuesGood(itemMin8): sugerir.appendChild(itemMin8);

  if (passwordValidator(myInput)) {
    valido.innerText = "\u2714";
    if(validoEmail.text = "\u2714") {
      document.getElementById("login").disabled = false;
    }
  } else {
    valido.innerText = "\u2718";
    document.getElementById("login").disabled = true;
  }
});
function valuesGood (myNode) {
  for(let i=0; i<=3; i++){
    if(sugerir.childNodes[i] == myNode) {
      sugerir.removeChild(sugerir.childNodes[i]);
    }
  }
}
