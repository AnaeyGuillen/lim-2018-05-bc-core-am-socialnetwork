initFirebase();
$('#btn-home').click(()=>{
  document.getElementById('home').style.display = 'block';
  document.getElementById('myNotifications').style.display = 'none';
  document.getElementById('search').style.display = 'none';
  document.getElementById('userProfile').style.display = 'none';
});
$('#btn-search').click(()=>{
  document.getElementById('home').style.display = 'none';
  document.getElementById('myNotifications').style.display = 'none';
  document.getElementById('search').style.display = 'block';
  document.getElementById('userProfile').style.display = 'none';
});
$('#btn-notification').click(()=>{
  document.getElementById('home').style.display = 'none';
  document.getElementById('myNotifications').style.display = 'block';
  document.getElementById('search').style.display = 'none';
  document.getElementById('userProfile').style.display = 'none';
});
$('#btn-userProfile').click(()=>{
  document.getElementById('home').style.display = 'none';
  document.getElementById('myNotifications').style.display = 'none';
  document.getElementById('search').style.display = 'none';
  document.getElementById('userProfile').style.display = 'block';
});
document.getElementById('myNotifications').style.display = 'none';
document.getElementById('search').style.display = 'none';
document.getElementById('userProfile').style.display = 'none';
//input para la persona buscada
let wordSearch = '';
document.getElementById("searchText").addEventListener("change", () => {
  wordSearch = document.getElementById('searchText').value;
});
$('#buttonSearch').click(()=>searchPeople(wordSearch));
//boton para cerrar sesion
$('#signOut').click(()=>closeSession());
$('#savePost').click(()=>savePost());
//le damos la bienvenida al usuario actual
let userUID = localStorage.currentUser;
welcomeUser(userUID);
