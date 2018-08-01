//cargando todo del muro
const welcomeUser = (uid) => {
  var profile = firebase.database().ref().child('users/'+uid);
  profile.on('value', snap => {
    let userData = JSON.stringify(snap.val(),null,3);//tbm funciona un solo parametro
    userData = JSON.parse(userData);
    document.getElementById("userName").innerHTML = userData.nombre;
    document.getElementById('userPhoto').innerHTML = "<img id='user-photo' width='100px' class='circle img-responsive' src='"+userData.foto+"  '/>"
    document.getElementById('userEmail').innerHTML = userData.email;
  })
  let muroPosts = document.getElementById('myPosts');
  muroPosts.innerHTML = '';
  chargePostsPublic();
  chargeFriendPosts();
  chargePosts(userUID,muroPosts);
  chargeNotifications();
}

//mostrando la lista de usuarios registrados por busqueda
const searchPeople = (wordSearch) => {
  document.getElementById('userFilterList').innerHTML = '';
  firebase.database().ref("users")
  .on("child_added", s => {
    let user = s.val();
    console.log(s.val())
    console.log(s.key);
    if((user.nombre.toUpperCase()).indexOf(wordSearch.toUpperCase())!==-1 && user.nombre != document.getElementById("userName").innerHTML){
      $('#userFilterList').append(`
      <div class="collection-item avatar">
        <img class='col s3 circle' width=100px class="circle" src= ${user.foto} />
        <p class='col s6'><strong> ${user.nombre} </strong></p>
        <button class='btn-small amber darken-3 col s3' id=${'a' + s.key} value = ${user.uid} onclick="followPeople(${'a' + s.key},${'b' + s.key})">Seguir</button>
        <button class='btn-small amber darken-3 col s3' id=${'b' + s.key} value = ${user.uid} onclick="unfollowPeople(${'a' + s.key},${'b' + s.key})">Dejar de seguir</button>
      </div>
      `);
      let countFriendExist = 0;
      firebase.database().ref('users/'+ user.uid + '/notificaciones/')
      .on('value', snap => {
        let usersIFollow = JSON.stringify(snap.val(),null,3);//tbm funciona un solo parametro
        usersIFollow = JSON.parse(usersIFollow);
        usersIFollowObject = usersIFollow;
        usersIFollow = Object.keys(usersIFollow);
        usersIFollow.forEach(function(element) {
          if(usersIFollowObject[element].amigo == userUID){
            console.log(usersIFollowObject[element].amigo);
            countFriendExist = 1;
          }
        });
      })
      if(countFriendExist == 1){
        document.getElementById('a' + s.key).style.display = 'none';
        document.getElementById('b' + s.key).style.display = 'block';
      } else {
        console.log('no hay coincidencias');
        document.getElementById('a' + s.key).style.display = 'block';
        document.getElementById('b' + s.key).style.display = 'none';
      }
    }
  })
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
        <div class="card horizontal card-posts">
          <div class = "row" >
            <div class="input-field col s12"></div>
            <img width="4px" class="circle col s2" src="${userData.foto}"/>
            <div class="col s7">
              <span>${userData.nombre}</span>
              <i class="material-icons">${a}</i>
              <textarea id=${snapshot.key+'public'} class="contenido-post">${objPost.message}</textarea>
            </div>
            <div class="col s6 offset-s3">
              <button  class='waves-effect btn-small' id=${snapshot.key+ 'a1'} onclick="likePost('${snapshot.key+'a'}','${snapshot.key+'d'}','${userUID}', '${snapshot.key}')"><i class="material-icons">favorite_border</i></button>
              <button  class='waves-effect btn-small' id=${snapshot.key+ 'd1'} onclick="dislikePost('${snapshot.key+'a'}','${snapshot.key+'d'}','${userUID}', '${snapshot.key}')"><i class="material-icons">favorite</i></button>
            </div>
            <div class="s12" id=${snapshot.key+ 'card'}><strong>Le gusta a:</strong></div>
          </div>
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
           count = usersLikes.length;
           document.getElementById(snapshot.key+ 'card').innerHTML = '<strong>Le gusta a '+ count +' personas:</strong>';
           usersLikes.forEach(function(element) {
             if(usersLikesObject[element].amigo == localStorage.currentUser){
               countLikeFriendExist = 1;
             }
             document.getElementById(snapshot.key+ 'card').innerHTML += `<p>${usersLikesObject[element].nombre}</p>`;
           });
         }
        })
        if(countLikeFriendExist == 1){
          document.getElementById(snapshot.key + 'a1').style.display = 'none';
          document.getElementById(snapshot.key + 'd1').style.display = 'block';
        } else {
          console.log('no hay coincidencias');
          document.getElementById(snapshot.key + 'a1').style.display = 'block';
          document.getElementById(snapshot.key + 'd1').style.display = 'none';
        }
        document.getElementById(snapshot.key + "public").disabled = true;
      }
      })
    });
  });
}
//funcion para cerrar sesion
function closeSession() {
  firebase.auth().signOut()
  .then(function () {
    document.location.href = 'index.html';
  })
  .catch(function (error) {
    console.log(error);
  })
}
