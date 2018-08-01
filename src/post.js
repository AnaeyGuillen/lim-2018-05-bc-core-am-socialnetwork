//escribiendo publicaciones
function savePost() {
  let message = document.getElementById('currentPost').value;
  if(message != '') {
    document.getElementById('currentPost').value = '';
    let optionValue = document.getElementById('privateOptions');
    optionValue = optionValue.options[optionValue.selectedIndex].value;
    firebase.database().ref('users/'+userUID+'/publicaciones').push({
      optionValue,
      message
    });
    let muroPosts = document.getElementById('myPosts');
    muroPosts.innerHTML = '';
    chargePosts(userUID, muroPosts);
  } else {
    alert('No se permite publicar algo vacio')
  }
};
//eliminar post
function removePost(idPost, userUID) {
 console.log("se va a borrar")
 //Ingresamos un mensaje a mostrar
 let mensaje = confirm("¿Deseas eliminar el POST");
 //Detectamos si el usuario acepto el mensaje
 if (mensaje) {
   // alert("¡Gracias por aceptar!");
   console.log(idPost)
   console.log(userUID)
   let dbRefObjectUsersPosts = firebase.database().ref().child('users-posts')
   firebase.database().ref().child('users/' + userUID + '/publicaciones/' + idPost).remove();
   // firebase.database().ref().child('posts/' + idPost).remove();
   muroPosts = document.getElementById('myPosts');
   while (muroPosts.firstChild) muroPosts.removeChild(muroPosts.firstChild);
   muroPosts.innerHTML = '';
   chargePosts(userUID, muroPosts);
   alert('The post is deleted successfully!');
 }
 //Detectamos si el usuario denegó el mensaje
 else {
   alert("¡Haz denegado la eliminacion del post !");
 }
}

//mostrando todas las publicaciones de personas a las que sigo
const chargeFriendPosts = () => {
  let usersIFollow = [];
  let friendPosts = document.getElementById('myFriendsPost');
  friendPosts.innerHTML = ''
  firebase.database().ref('users/'+userUID+'/quienes-sigo')
  .on('value', function(snapshot) {
    console.log(snapshot.val());
    let postData = JSON.stringify(snapshot.val(),null,3);//tbm funciona un solo parametro
    postData = JSON.parse(postData);
    let postUIDs = Object.keys(postData);
    for(i=0; i<postUIDs.length; i++) {
      let mensaje = (postData[postUIDs[i]].uidFollow);
      usersIFollow.push(mensaje);
    }
    usersIFollow.forEach(function(element) {
      console.log(element);
      chargePosts(element, friendPosts);
    });


  });
}


//mostrando las publicaciones publicas de todos los usuarios actuales
let chargePostsPublic = () =>{

  let postsPublic = document.getElementById('postPublic');
  postsPublic.innerHTML = ''

  firebase.database().ref("users")
  .on("child_added", s => {
    let objUser = s.val();
    let userName = objUser.nombre ;
    let userPhoto = objUser.foto ;
    let userUID = objUser.uid ;
    let publicationsByUser= objUser.publicaciones;
    console.log(userUID)
    console.log(objUser)
    console.log(userName)
    console.log(publicationsByUser)
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
        let aux= 0 ;
        postsPublic.innerHTML += `
        <div class="card horizontal card-posts white">
          <div class = "row" >
            <div class="input-field col s12"></div>
            <img width="6px" class="circle col s2" src="${userData.foto}"/>
            <div class="col s12">
              <span>${userData.nombre}</span>
              <i class="material-icons">${a}</i>
              <textarea id=${snapshot.key} class="contenido-post" disabled>${objPost.message}</textarea>
            </div>
            <div class="col s3 offset-s1">
              <button  class='waves-effect btn-small amber darken-3' id=${snapshot.key+ 'a'} onclick="likePost('${snapshot.key+'a'}','${snapshot.key+'d'}','${userUID}', '${snapshot.key}')"><i class="material-icons ">favorite_border</i></button>
              <button  class='waves-effect btn-small amber darken-3' id=${snapshot.key+ 'd'} onclick="dislikePost('${snapshot.key+'a'}','${snapshot.key+'d'}','${userUID}', '${snapshot.key}')"><i class="material-icons">favorite</i></button>
            </div>
            <div class="s12 blue-text" id=${snapshot.key+ 'card'}><strong>Le gusta a:</strong></div>
          </div>
          <div class="s12" id=${snapshot.key+ 'card'}><strong>Le gusta a:</strong></div>
        </div>
        `;
        let countLikeFriendExist = 0;
        firebase.database().ref('users/'+ userUID + '/publicaciones/'+snapshot.key+'/likesFromUsers')
        .on('value', snap => {
         if(snap.val()!= null) {
           let usersLikes = JSON.stringify(snap.val(),null,3);//tbm funciona un solo parametro
           usersLikes = JSON.parse(usersLikes);
           usersLikesObject = usersLikes;
           usersLikes = Object.keys(usersLikes);
           console.log(usersLikes);
           document.getElementById(snapshot.key+ 'card').innerHTML = '<strong>Le gusta a:</strong>';
           usersLikes.forEach(function(element) {
             if(usersLikesObject[element].amigo == localStorage.currentUser){
               countLikeFriendExist = 1;
             }
             document.getElementById(snapshot.key+ 'card').innerHTML += `<p>${usersLikesObject[element].nombre}</p>`;
           });
         }
        })
        if(countLikeFriendExist == 1){
          document.getElementById(snapshot.key + 'a').style.display = 'none';
          document.getElementById(snapshot.key + 'd').style.display = 'block';
        } else {
          console.log('no hay coincidencias');
          document.getElementById(snapshot.key + 'a').style.display = 'block';
          document.getElementById(snapshot.key + 'd').style.display = 'none';
        }
      }
      })
    });
  });

}



//mostrando todos las publicaciones del usuario actual
function chargePosts(userUID, muroPosts) {
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
       <div class="card card-posts">
        <div class = "row" >
          <div class="input-field col s12"></div>
          <img width="6px" class="circle col s2" src="${userData.foto}"/>
          <div class="col s12">
            <span>${userData.nombre}</span>
            <i class="material-icons">${a}</i>
            <textarea id=${snapshot.key} class="contenido-post col s12">${objPost.message}</textarea>
          </div>
          <div class='container col s12'>
            <button class='waves-effect btn-small amber darken-3' id=${snapshot.key+ 'a'} onclick="likePost('${snapshot.key+'a'}','${snapshot.key+'d'}','${userUID}', '${snapshot.key}')"><i class="material-icons">favorite_border</i></button></li>
            <button class='waves-effect btn-small amber darken-3' id=${snapshot.key+ 'd'} onclick="dislikePost('${snapshot.key+'a'}','${snapshot.key+'d'}','${userUID}', '${snapshot.key}')"><i class="material-icons">favorite</i></button></li>
            <button class='waves-effect btn-small amber darken-3' id=${snapshot.key+ 'r'} onclick="removePost('${snapshot.key}','${userUID}')"><i class="material-icons">delete</i></button></li>
            <button class='waves-effect btn-small amber darken-3' id=${snapshot.key + 'e'} onclick="editPost('${snapshot.key}','${userUID}','${objPost.usuario}','${objPost.optionValue}','${aux}','${snapshot.key}')"><i class="material-icons">border_color</i></button></li>
            <button class='waves-effect btn-small amber darken-3' id=${snapshot.key + 'se'} onclick="saveEditPost('${snapshot.key}','${userUID}','${objPost.usuario}','${objPost.optionValue}','${aux}','${snapshot.key}')"><i class="material-icons">archive</i></button></li>
          </div>
        </div>
        <div class="s12 blue-text" id=${snapshot.key+ 'card'}><strong>Le gusta a:</strong></div>

       </div>
       `;
       let countLikeFriendExist = 0;
       firebase.database().ref('users/'+ userUID + '/publicaciones/'+snapshot.key+'/likesFromUsers')
       .on('value', snap => {
         if(snap.val()!= null) {
           let usersLikes = JSON.stringify(snap.val(),null,3);//tbm funciona un solo parametro
           usersLikes = JSON.parse(usersLikes);
           usersLikesObject = usersLikes;
           usersLikes = Object.keys(usersLikes);
           console.log(usersLikes);
           document.getElementById(snapshot.key+ 'card').innerHTML = '<strong>Le gusta a:</strong>';
           usersLikes.forEach(function(element) {
             if(usersLikesObject[element].amigo == localStorage.currentUser){
               countLikeFriendExist = 1;
             }
             document.getElementById(snapshot.key+ 'card').innerHTML += `<p>${usersLikesObject[element].nombre}</p>`;
           });
         }
       })
       if(countLikeFriendExist == 1){
         document.getElementById(snapshot.key + 'a').style.display = 'none';
         document.getElementById(snapshot.key + 'd').style.display = 'block';
       } else {
         console.log('no hay coincidencias');
         document.getElementById(snapshot.key + 'a').style.display = 'block';
         document.getElementById(snapshot.key + 'd').style.display = 'none';
       }
       if(userUID !== localStorage.currentUser){
         document.getElementById(snapshot.key+'r' ).style.display = 'none';
         document.getElementById(snapshot.key+'e').style.display = 'none';
       }
      document.getElementById(snapshot.key).disabled = true;
      document.getElementById(snapshot.key + 'se').style.display = 'none';
     })
  });
}

//editar pulicaciones
function editPost(idPost, userUID, usuario, option, aux, idbtn) {

  console.log(aux)
  console.log("voy a poder editar el texto")
  let idBtnEdit= idbtn+'e';
  let idBtnSaveEdit= idbtn+'se';

  console.log("el id del post es : " + idPost )
  console.log("el id del btnEditar es " + idBtnEdit)

  let newUpdate = document.getElementById(idPost);

  newUpdate.disabled = false;

  document.getElementById( idBtnEdit).style.display = 'none';
  document.getElementById(idBtnSaveEdit).style.display = 'block';

}

function saveEditPost(idPost, userUID, usuario, option, aux, idbtn){
   idBtnEdit= idbtn+'e';
   idBtnSaveEdit= idbtn+'se';
   console.log("aqui guardaremos")
   console.log(aux)
   console.log(idPost)
   let newUpdateBySave = document.getElementById(idPost);
   console.log("el msje editado " + newUpdateBySave.value)
   console.log(newUpdateBySave.value)
    newUpdateBySave.disabled = true
    document.getElementById( idBtnEdit).style.display = 'block';
    document.getElementById(idBtnSaveEdit).style.display = 'none';
   //Inicio
   const nuevoPost = {
     optionValue: option,
     message: newUpdateBySave.value
     // usuario: usuario
   };
   console.log(nuevoPost)
   var updatesUser = {};
   updatesUser['users/' + userUID + '/publicaciones/' + idPost] = nuevoPost;
   firebase.database().ref().update(updatesUser);
   let muroPosts = document.getElementById('myPosts');
   muroPosts.innerHTML = '';
   chargePosts(userUID, muroPosts);
}
