// cargar las Notificaciones
function chargeNotifications() {
  firebase.database().ref('users/'+userUID+'/notificaciones')
  .on('value', function(snapshot) {
    let myNotifications = [];
    let notificationData = JSON.stringify(snapshot.val(),null,3);//tbm funciona un solo parametro
    notificationData = JSON.parse(notificationData);
    let notifications = Object.keys(notificationData);
    for(i=0; i<notifications.length; i++) {
      let mensaje = (notificationData[notifications[i]].message);
      myNotifications.push(mensaje);
    }
    let friendNotifications = document.getElementById('notifications');
    friendNotifications.innerHTML = '';
    myNotifications.forEach(function(element) {
      friendNotifications.innerHTML += `<div class="card-panel card-notification"> ${element}</div>`;
    });
  });
}
