const currentTab = {title: '', form: []}

document.addEventListener('DOMContentLoaded', function () {

  chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
   currentTab.title =  tabs[0].title
   loadStorage(tabs[0].title)
  });

  document.querySelector('button').addEventListener('click', onClick, false)
   
   function onClick(){
      currentTab.form.push(getFormData())
      persistTable()
   }

 }, false)

function loadStorage(title){
   chrome.storage.sync.get([title], function(result) {
      if(typeof result[title] !== 'undefined' ) {
         currentTab.form = result[title].form
         result[title].form.map((line, index) => addRow(line, index, title))
      }
   });
}

function persistTable(){
   chrome.storage.sync.set({[currentTab.title]: {form: currentTab.form}}, function() {
   });
}
 


function getFormData(){
   const formOutput = {keyword: 'word', howManyTimes: 1, doNotify: true, doAnswer: null, doing: false}
   
   let form = document.forms[0]

   formOutput.keyword = form.elements["keyword"].value

   formOutput.howManyTimes = form.elements["howManyTimes"].value > 1 ? form.elements["howManyTimes"].value : 1

   formOutput.doNotify = form.elements["doNotify"].checked

   formOutput.doAnswer = form.elements["doAnswer"].checked ? {answerText: form.elements["answerText"].value} : null

   return formOutput;
}

function addRow(form, index, title){
   let table = document.getElementById("tableActions")
   
   let row = table.insertRow();
   
   let meet = row.insertCell(0);
   let keyword = row.insertCell(1);
   let times = row.insertCell(2);
   let actions = row.insertCell(3);

   meet.innerHTML = title
   keyword.innerHTML = form.keyword
   times.innerHTML = form.howManyTimes
   actions.innerHTML = ""
   addActionButton(index, actions, form)
   addRemoveButton(index, actions, table)
}

function addActionButton(sourceIndex, elementContainer, form){
   let button = document.createElement("button");
   button.innerHTML = "v";

   elementContainer.appendChild(button);

   if(form.doing){
      sendActions(form)
      button.disabled = true
   }
   else{
      button.addEventListener ("click", function() {
         sendActions(form)
         form.doing = true
         persistTable()
         button.disabled = true
   });
   }
}

function sendActions(form){
   chrome.tabs.query({currentWindow: true, active: true}, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, form)
   });
}

function addRemoveButton(sourceIndex, elementContainer, table){
   let button = document.createElement("button");
   button.innerHTML = "x";

   elementContainer.appendChild(button);

   button.addEventListener ("click", function() {
      removeFormLine(sourceIndex)
   });

   function removeFormLine(index){
      currentTab.form = [...currentTab.form.slice(0, index), ...currentTab.form.slice(index + 1, currentTab.form.length)]
      persistTable(currentTab.title, {form: currentTab.form})
      table.deleteRow(index + 1)
   }

   //remover action ao remover o botão

}

