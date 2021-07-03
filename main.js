var old_text;
var new_text;


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
  old_text = getCookie("old_text");
  new_text = getCookie("new_text");
  document.getElementById("old").innerHTML = old_text;
  document.getElementById("tew").innerHTML = new_text;
  diff();
}

function updateText(textbox) {
  if (textbox === "old_text") {
    old_text = document.getElementById("old").innerHTML;
    document.cookie = `old_text = ${old_text};`;
  }
  else if (textbox === "new_text") {
    new_text = document.getElementById("tew").innerHTML;
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

function getDiffStyle() {
  var radios = document.getElementsByName('diff-style');
  for (var i = 0; i < radios.length; i++) {
    if (radios[i].checked) { return radios[i].value; }
  }
}

function updateDiffStyle() {
  const style = getDiffStyle();
  document.getElementById("old").className = `textarea ${getDiffStyle()}`;
}

function diff() {
  var nww = document.getElementById("tew");
  var old = document.getElementById("old");

  res = ""
  const diff = diffChars(old_text, nww.innerHTML);
  diff.forEach((part) => {
  // green for additions, red for deletions
  // grey for common parts
  const color = part.added ? 'green' :
    part.removed ? 'red' : 'grey';
  res += `<span class="${color}">${part.value}</span>`;
  document.getElementById("old").innerHTML = res;
});
}