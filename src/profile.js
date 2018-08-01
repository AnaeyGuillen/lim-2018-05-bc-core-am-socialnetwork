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
  chargeFriendPosts();
  chargePosts(userUID,muroPosts);
  chargeNotifications();
  // window.location.reload();
  chargePostsPublic();
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
