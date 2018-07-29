//redireccionando al muro
function welcomeUser(uid) {
  var profile = firebase.database().ref().child('users/'+uid);
  profile.on('value', snap => {
    let userData = JSON.stringify(snap.val(),null,3);//tbm funciona un solo parametro
    userData = JSON.parse(userData);
    // console.log(userData);
    // console.log(userData.nombre);
    document.getElementById("userName").innerHTML = userData.nombre;
    document.getElementById('userPhoto').innerHTML = "<img width='100px' class='circle img-responsive' src='"+userData.foto+"  '/>"
    document.getElementById('userEmail').innerHTML = userData.email;
  })
  let muroPosts = document.getElementById('myPosts');
  muroPosts.innerHTML = '';
  chargePosts(userUID,muroPosts);
  chargeFriendPosts();
  chargeNotifications();
}

function savePost() {
  let message = document.getElementById('currentPost').value;
  console.log(message);
  // console.log("veamos si es vacio o no ")
  if(message != ''){
    document.getElementById('currentPost').value = '';
    let userUID = firebase.auth().currentUser.uid;
    let optionValue = document.getElementById('privateOptions');
    optionValue = optionValue.options[optionValue.selectedIndex].value;
    firebase.database().ref('users/'+userUID+'/publicaciones').push({
      optionValue,
      message
    });
    muroPosts.innerHTML = '';
    chargePosts(userUID, muroPosts);
  }else{
    alert("Usted no escribi ningun post")
  }
  
};
//mostrando todos las publicaciones del usuario actual
function chargePosts(userUID, muroPosts) {
  // console.log('Mostrando todas las publicaciones x usuario logueado')
  muroPosts.innerHTML = '';
  firebase.database().ref('users/'+userUID+'/publicaciones')
  .on('child_added', function(snapshot) {
     var objPost = snapshot.val();
    //  console.log(objPost);
     var profile = firebase.database().ref().child('users/'+userUID);
     profile.on('value',snap => {
      //  console.log("entro");
       let userData = JSON.stringify(snap.val(),null,3);//tbm funciona un solo parametro
       userData = JSON.parse(userData);
      //  muroPosts.innerHTML += "<img width='100px' class='circle img-responsive' src='"+userData.foto+"  '/>";
      let privacidad=objPost.optionValue
      let a = 'favorite_border';
      if(privacidad == 0){
        a = 'group';
      }else{
        a = 'public';
      }
      let aux= 0 ;
      muroPosts.innerHTML += `
       <div class="card horizontal pink lighten-4">
        <div class = "card-image">
          <img width="5px" class="circle" src="${userData.foto}"/>
        </div>
        <div class="card-content">
          <span>${userData.nombre}</span>
          <i class="material-icons">${a}</i>
          <textarea id=${snapshot.key} class="collection-item avatar">${objPost.message}</textarea>
          <button  class='waves-effect waves-light btn-small' id=${snapshot.key+ 'a'} onclick="contLikes()"><i class="material-icons">favorite_border</i></button>
          <button  class='waves-effect waves-light btn-small' onclick="removePost('${snapshot.key}','${userUID}')"><i class="material-icons">delete</i></button>
          <button class='waves-effect waves-light btn-small' id=${snapshot.key + 'e'} onclick="editPost('${snapshot.key}','${userUID}','${objPost.usuario}','${objPost.optionValue}','${aux}','${snapshot.key}')"><i class="material-icons">border_color</i></button>
          <button class='waves-effect waves-light btn-small' id=${snapshot.key + 'se'} onclick="saveEditPost('${snapshot.key}','${userUID}','${objPost.usuario}','${objPost.optionValue}','${aux}','${snapshot.key}')"><i class="material-icons">archive</i></button>
          </div> 
       </div>
       `;
      document.getElementById(snapshot.key).disabled = true;
      document.getElementById(snapshot.key + 'se').style.display = 'none';
 

     })
  });
}

function contLikes(){
  console.log("le he dado like")
}

//eliminar post
function removePost(idPost, userUID) {
  console.log("se va a borrar")
  //Ingresamos un mensaje a mostrar
  let mensaje = confirm("¿Deseas eliminar el POST");
  //Detectamos si el usuario acepto el mensaje
  if (mensaje) {
    console.log(idPost)
    console.log(userUID)
    let dbRefObjectUsersPosts = firebase.database().ref().child('users-posts')
    firebase.database().ref().child('users/' + userUID + '/publicaciones/' + idPost).remove();
    // muroPosts = document.getElementById('myFriendsPost');
    // muroPosts.innerHTML= '' ;
    while (muroPosts.firstChild) muroPosts.removeChild(muroPosts.firstChild);
    chargePosts(userUID, muroPosts);
  }
  //Detectamos si el usuario denegó el mensaje
  else {
    alert("¡Haz denegado la eliminacion del post !");
  }
 }
//editar pulicaciones
function editPost(idPost, userUID, usuario, option, aux, idbtn) {

 console.log(aux)
 console.log("voy a poder editar el texto")
 console.log(idPost)

 idBtnEdit= idbtn+'e';
 idBtnSaveEdit= idbtn+'se';


document.getElementById(idBtnSaveEdit).style.display = 'block';
document.getElementById( idBtnEdit).style.display = 'none';
 

 let newUpdate = document.getElementById(idPost);
 console.log(newUpdate.value)
 console.log(idbtn)
 newUpdate.disabled = false

}

function saveEditPost(idPost, userUID, usuario, option, aux, idbtn){

  idBtnEdit= idbtn+'e';
  idBtnSaveEdit= idbtn+'se';


 document.getElementById(idBtnSaveEdit).style.display = 'none';
document.getElementById(idBtnEdit).style.display = 'block';

  console.log("aqui guardaremos")
  let newUpdate = document.getElementById(idPost);
  console.log(newUpdate.value)
  newUpdate.disabled = true

  //Inicio

  const nuevoPost = {
    optionValue: option,
    message: newUpdate.value
    // usuario: usuario
  };
  console.log(nuevoPost)
  var updatesUser = {};
 //  var updatesPost = {};
 
  updatesUser['users/' + userUID + '/publicaciones/' + idPost] = nuevoPost;
  firebase.database().ref().update(updatesUser);
  let muroPosts = document.getElementById('myPosts');
  muroPosts.innerHTML = '';
  chargePosts(userUID, muroPosts);

  //Fin


}

//cargar las Notificaciones
function chargeNotifications() {

  firebase.database().ref('users/'+userUID+'/notificaciones')
  .on('value', function(snapshot) {
    let myNotifications = [];
    let notificationData = JSON.stringify(snapshot.val(),null,3);//tbm funciona un solo parametro
    notificationData = JSON.parse(notificationData);
    let notifications = Object.keys(notificationData);
    // console.log(notifications)
    for(i=0; i<notifications.length; i++) {
      let mensaje = (notificationData[notifications[i]].message);
      // console.log(mensaje);
      myNotifications.push(mensaje);
      // console.log(myNotifications);

    }
    let friendNotifications = document.getElementById('notifications');
    friendNotifications.innerHTML = '';
    myNotifications.forEach(function(element) {
      friendNotifications.innerHTML= `
      <div class="card-panel teal lighten-2"> ${element}
      </div>
      `;
    });

  });
}


//funcion para almacenar uid de seguidores
function followPeople() {
  //amigos 0 si son amigos y 1 si no son amigos
  let uidFollow = event.target.value;
  firebase.database().ref('users/'+userUID+'/quienes-sigo').push({
    uidFollow,
    habilitado : 1
  });
  let userName = document.getElementById('userName').innerHTML;
  firebase.database().ref('users/'+uidFollow+'/notificaciones').push({
    message : userName + ' quiere ser tu amigo'
  });
  console.log(uidFollow);
}
//funcion para dejar de seguir a alguie
function closeSession() {
  firebase.auth().signOut()
    .then(function () {
      document.location.href = 'index.html';
    })
    .catch(function (error) {
      console.log(error);
    })
}



function redirectHome() {
  document.getElementById('home').style.display = 'block';
  document.getElementById('myNotifications').style.display = 'none';
  document.getElementById('search').style.display = 'none';
  document.getElementById('userProfile').style.display = 'none';
}


function redirectSearch() {
  document.getElementById('home').style.display = 'none';
  document.getElementById('myNotifications').style.display = 'none';
  document.getElementById('search').style.display = 'block';
  document.getElementById('userProfile').style.display = 'none';
}


function redirectNotification() {
  document.getElementById('home').style.display = 'none';
  document.getElementById('myNotifications').style.display = 'block';
  document.getElementById('search').style.display = 'none';
  document.getElementById('userProfile').style.display = 'none';
}


function redirectProfile() {
  document.getElementById('home').style.display = 'none';
  document.getElementById('myNotifications').style.display = 'none';
  document.getElementById('search').style.display = 'none';
  document.getElementById('userProfile').style.display = 'block';
}



// document.getElementById('myNotifications').style.display = 'none';
// document.getElementById('search').style.display = 'none';
// document.getElementById('userProfile').style.display = 'none';
