chrome.runtime.onMessage.addListener(function (request) {
  observer = new MutationObserver(mCallback);

  function mCallback(mutations) {
    const re = new RegExp('presente', 'gi')
    const matches = document.getElementsByClassName("z38b6 CnDs7d hPqowe")[0].innerHTML.match(re)
    if(matches !== null) {
      notifyMe(`Foram digitados ${matches.length / 2} presentes no chat :)`) 
    }
  }

  observer.observe(document.getElementsByClassName("z38b6 CnDs7d hPqowe")[0], {childList: true});
})

function notifyMe(mesage) {
  // Let's check if the browser supports notifications
  if (!("Notification" in window)) {
    alert("This browser does not support desktop notification");
  }

  // Let's check whether notification permissions have already been granted
  else if (Notification.permission === "granted") {
    // If it's okay let's create a notification
    var notification = new Notification(mesage);
  }

  // Otherwise, we need to ask the user for permission
  else if (Notification.permission !== "denied") {
    Notification.requestPermission().then(function (permission) {
      // If the user accepts, let's create a notification
      if (permission === "granted") {
        var notification = new Notification(mesage);
      }
    });
  }

  // At last, if the user has denied notifications, and you
  // want to be respectful there is no need to bother them any more.
}