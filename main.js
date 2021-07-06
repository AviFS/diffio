// Don't exactly remember what they do; something to do with the cookies I don't use anymore
// Don't use unless you know what you're doing
// EDIT: Actually old_text is important because it stores what the real value of the old text is when the innerText
// is all screwed up displaying the diff. Think we can get rid of new_text
var old_text;
var new_text;

// Use these to get textbox values instead// var oldText = document.getElementById("tew").innerText.trimEnd();
// var newText = document.getElementById("old").innerText.trimEnd();


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
  // Commented out because is now getting in the way
  // TODO: Fix this cookie stuff and decide if I even need it

  old_text = getCookie("old_text");
  new_text = getCookie("new_text");

  /* get rid?
  document.getElementById("old").innerHTML = old_text;
  document.getElementById("tew").innerHTML = new_text;
  */
  parseLink()
  diffIt();
}

function updateText(textbox) {
  if (textbox === "old_text") {
    old_text = document.getElementById("old").innerText;
    document.cookie = `old_text = ${old_text};`;
  }
  else if (textbox === "new_text") {
    new_text = document.getElementById("tew").innerText;
    document.cookie = `new_text = ${new_text};`;
  }
  else {
    alert(`Function updateText(${textbox} is undefined.)`)
  }
}

function grayout() {
  var nww = document.getElementById("old");
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
  document.getElementById("old").className = `textarea ${style}`;
  diffIt();
}

function updateDiffKind() {
  // Recall 'diffIt()', it'll take care of doing the right kind
  diffIt();
}

function diffIt() {
  var nww = document.getElementById("tew");
  var old = document.getElementById("old");
  var kind = getRadioButtonValue("diff-kind");

  var oldText = document.getElementById("tew").innerText.trimEnd();
  var newText = document.getElementById("old").innerText.trimEnd()

  res = "";
  var diff;
  diff = diffChars(oldText, newText);
  // if (kind === "byCharacter") { diff = diffChars(old_text, nww.innerHTML); }
  //else { return; }
  diff.forEach((part) => {
  // green for additions, red for deletions
  // grey for common parts
  const color = part.added ? 'green' :
    part.removed ? 'red' : 'grey';
  res += `<span class="${color}">${part.value}</span>`;
  document.getElementById("old").innerHTML = res;
});
}

function diffTioRun() {
   TIO.run(tew.innerHTML, "a", "brainfuck").then(
     n=>document.getElementById("output").innerHTML = n[0]
     );
} 

function makeLink() {
  newString = document.getElementById("tew").innerText;
  oldString = document.getElementById("old").innerText;
  var [lst, removed] = diffEncode(oldString, newString);
  params = {
    "unspecified": [newString, lst, removed],
    "specified": {}
  }

  console.log(location.protocol + '//' + location.host + location.pathname + '?' + gen.makeLink(params));
  return location.protocol + '//' + location.host + location.pathname + '?' + gen.makeLink(params);
}

function parseLink() {
  var search = window.location.search;
  var hash = window.location.hash;


  var newer = document.getElementById("tew");
  var older = document.getElementById("old");

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

    newer.innerText = newString;
    older.innerText = oldString;
  }

  if (hash.slice(0,2) === "##") {
    hash = hash.slice(2);
    state = TIO.parseLink(hash); 
    console.log(state);


    old_text = state["code"];
    new_text = state["code"];

    newer.innerHTML = state["code"];
    older.innerHTML = state["code"];
  }
  return;
}