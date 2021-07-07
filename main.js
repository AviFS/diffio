// Don't exactly remember what they do; something to do with the cookies I don't use anymore
// Don't use unless you know what you're doing
// EDIT: Actually old_text is important because it stores what the real value of the old text is when the innerText
// is all screwed up displaying the diff. Think we can get rid of new_text
var old_text;
var new_text;

let oldText; // = document.getElementById("oldText");
let newText; // = document.getElementById("newText");
// Use these to get textbox values instead// var oldText = document.getElementById("new").innerText.trimEnd();
// var newText = document.getElementById("oldText").innerText.trimEnd();


function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for(let i = 0; i <ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function init() {
  oldText = document.getElementById("oldText");
  newText = document.getElementById("newText");
  // Commented out because is now getting in the way
  // TODO: Fix this cookie stuff and decide if I even need it

  old_text = getCookie("old_text");
  new_text = getCookie("new_text");

  /* get rid?
  document.getElementById("oldText").innerHTML = old_text;
  document.getElementById("newText").innerHTML = new_text;
  */
  parseLink()
  diffIt();
}

function updateText(textbox) {
  if (textbox === "old_text") {
    old_text = oldText.innerText;
    document.cookie = `old_text = ${old_text};`;
  }
  else if (textbox === "new_text") {
    new_text = newText.innerText;
    document.cookie = `new_text = ${new_text};`;
  }
  else {
    alert(`Function updateText(${textbox} is undefined.)`)
  }
}

function grayout() {
  var nww = document.getElementById("oldText");
  nww.focus();
  nww.innerHTML = old_text;
}

function getRadioButtonValue(name) {
  var radios = document.getElementsByName(name);
  for (var i = 0; i < radios.length; i++) {
    if (radios[i].checked) { return radios[i].value; }
  }
}

function updateDiffStyle() {
  var style = getRadioButtonValue("diff-style");
  document.getElementById("oldText").className = `textarea ${style}`;
  diffIt();
}

function updateDiffKind() {
  // Recall 'diffIt()', it'll take care of doing the right kind
  diffIt();
}

function diffIt() {
  var oldTextValue = oldText.innerText.trimEnd();
  var newTextValue = newText.innerText.trimEnd()

  res = "";
  var diff;
  diff = diffChars(oldTextValue, newTextValue);
  // if (kind === "byCharacter") { diff = diffChars(old_text, nww.innerHTML); }
  //else { return; }
  diff.forEach((part) => {
  // green for additions, red for deletions
  // grey for common parts
  const color = part.added ? 'green' :
    part.removed ? 'red' : 'grey';
  res += `<span class="${color}">${part.value}</span>`;
  document.getElementById("oldText").innerHTML = res;
});
}

function diffTioRun() {
   TIO.run(newText.innerText, "a", "brainfuck").then(n=>
      document.getElementById("output").innerText = n[0]===""?"No output.":n[0]
    );
} 

function makeLink() {
  var newTextValue = newText.innerText.trimEnd()
  
  var [lst, removed] = diffEncode(old_text, newTextValue);
  params = {
    "unspecified": [newTextValue, lst, removed],
    "specified": {}
  }
  
  link = location.protocol + '//' + location.host + location.pathname + '?' + gen.makeLink(params)
  window.prompt("Copy to clipboard: Cmd+C & Enter", link);
  console.log(link);
  return link;
}

function parseLink() {
  var search = window.location.search;
  var hash = window.location.hash;

  console.log(hash);
  if (search === "" && hash === "") { return; }
  if (search.slice(0,1) === "?") {
    search = search.slice(1);
    state = gen.parseLink(search);
    var [newString, lst, removed] = state["unspecified"];

    oldString =  diffDecode(newString, lst, removed);
    console.log([newString, lst, removed, oldString])

    new_text = newString;
    old_text = oldString;

    newText.innerText = newString;
    oldText.innerText = oldString;
  }

  if (hash.slice(0,2) === "##") {
    hash = hash.slice(2);
    state = TIO.parseLink(hash); 
    console.log(state);


    old_text = state["code"];
    new_text = state["code"];

    newText.innerHTML = state["code"];
    oldText.innerHTML = state["code"];
  }
  return;
}