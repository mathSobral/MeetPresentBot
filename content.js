const props = {isDoing: false, messageInputClass: 'KHxj8b tL9Q4c'}

chrome.runtime.onMessage.addListener(function (request) {
  if(!props.isDoing){
    observeChatContainer(request)
    props.isDoing = true
  }
})

function observeChatContainer(options){
  observer = new MutationObserver(mCallback);

  function mCallback(mutations) {
    console.log(options.howManyTimes)
    const re = new RegExp(options.keyword, 'gi')
    const matches = document.getElementsByClassName("z38b6 CnDs7d hPqowe")[0].innerHTML.match(re)
    if(matches !== null) {
      let howManyTimesWasTyped = matches.length / 2
      console.log(howManyTimesWasTyped)
      if(howManyTimesWasTyped == options.howManyTimes){
        if(options.doNotify){
          notifyMe(`Foram digitados ${options.howManyTimes} presentes no chat :)\nTome suas providencias cero`) 
        }
        if(options.doAnswer){
          sendMessage(options.doAnswer.answerText)
        }
      }
    }
  }

  observer.observe(document.getElementsByClassName("z38b6 CnDs7d hPqowe")[0], {childList: true});

}

function sendMessage(message){
  const textArea = document.getElementsByClassName(props.messageInputClass).chatTextInput

  textArea.value = message

  const keyboardEvent = new KeyboardEvent('keydown', {
    code: 'Enter',
    key: 'Enter',
    charCode: 13,
    keyCode: 13,
    view: window,
    bubbles: true
});

  textArea.dispatchEvent(keyboardEvent)
}

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