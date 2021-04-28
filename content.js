const props = {isDoing: false, messageInputClassName: 'KHxj8b tL9Q4c', chatClassName: "z38b6 CnDs7d hPqowe", actionDone: false, title: ''}

chrome.runtime.onMessage.addListener(function (request, sender, sendRequest) {
  props.title = request.title

  if(!chatIsOpen()){
    sendRequest("failed")
    return;
  }

  if(!props.isDoing){
    observeChatContainer(request)
    sendRequest("success")
    props.isDoing = true
  }

})

function observeChatContainer(options){
  observer = new MutationObserver(mCallback);

  function mCallback(mutations) {
    if(!props.actionDone){
      check(options);
    }
  }

  function check(options){
    const re = new RegExp(options.keyword, 'gi')
    const matches = getChatContainer().innerHTML.match(re)
    if(matches !== null) {
      let howManyTimesWasTyped = matches.length / 2
      
      if(howManyTimesWasTyped >= options.howManyTimes){
        
        if(options.doNotify){
          notifyMe(`Foram digitadas ${options.keyword} ${options.howManyTimes} vezes no ${props.title}`) 
        }
        if(options.doAnswer){
          sendMessage(options.doAnswer.answerText)
        }

        props.actionDone = true

        clearData()
      }
    }
  }

  observer.observe(getChatContainer(), {childList: true});

}

function chatIsOpen(){
  return document.getElementsByClassName(props.chatClassName)[0] != undefined
}

function getChatContainer(){
  return document.getElementsByClassName(props.chatClassName)[0]
}

function clearData(){
  chrome.storage.sync.set({[props.title]: {title: '', form: []}}, function() {
    // reseting global variables after 1 sec
    setTimeout(function(){ 
      props.isDoing = false
     }, 1000);
  });
}

function sendMessage(message){
  const textArea = document.getElementsByClassName(props.messageInputClassName).chatTextInput

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

  if (!("Notification" in window)) {
    alert("This browser does not support desktop notification");
  }

  else if (Notification.permission === "granted") {
    // If it's okay let's create a notification
    var notification = new Notification(mesage);
  }

  else if (Notification.permission !== "denied") {
    Notification.requestPermission().then(function (permission) {
      
      if (permission === "granted") {
        var notification = new Notification(mesage);
      }
    });
  }

}