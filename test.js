var changes = diffChars("aaaa", "caab")
var changes = diffChars("lsjflasfj", "that jaguar")

// console.log(changes);

/*
function chng(old, nww) {
    var changes = diffChars(old,nww);
    lst = [];
    index = 0;
    for (const change of changes) {


        var added = "";
        //console.log("> "+index)
        var isAdded = !!change["added"]?1:0;
        var isRemoved = !!change["removed"]?1:0;
        var isNotChanged = !isAdded && !isRemoved?1:0; 

        if (isRemoved || isNotChanged) { index += change["count"]; }
        if (isAdded) { added += change["value"]; }
        // If both values are undefined, then it was not changed and we can ignore it
        // Else set status to true=added & false=removed
        if (isNotChanged) { continue; }
        else { var status = isAdded?1:0; }


        if (isAdded) {
            lst.push([1, index, change["value"]]);
        }
        if (isRemoved) {
            lst.push([0, index]);
        }

        return lst;
        // console.log(status)

        //console.log(change["count"])// + ": " + isAdded + isRemoved + isNotChanged);
    }
}
*/


function diffEncode(old, nww) {
    var changes = diffChars(old,nww);
    lst = "";
    var removed = "";
    index = 0;
    for (const change of changes) {

        //console.log("> "+index)
        var isAdded = !!change["added"]?1:0;
        var isRemoved = !!change["removed"]?1:0;
        var isNotChanged = !isAdded && !isRemoved?1:0; 

        if (isRemoved) { removed += change["value"]; }

        if (isAdded)      { lst += "A"; }
        if (isRemoved)    { lst += "D"; }
        if (isNotChanged) { lst += "O"; }

        lst += change["count"];

        // console.log(status)

        //console.log(change["count"])// + ": " + isAdded + isRemoved + isNotChanged);
    }
    return [lst, removed];
}
/*

D2 A5 O1 D2 O1 D3 A4
*/

function parse(lst) {
    var arr = [];
    var count = "";
    var kind = lst[0];
    // console.log(lst[0]);

    for (const v of lst.slice(1)) {
        if ("ADO".includes(v)) {
            arr.push([kind, count]);
            kind = v;
            count = "";
        }
        else {
            count += v;
        }
    }
    arr.push([kind, count]);
    return arr;
}

var a = "aaaa"; b = "bbbb";
function pushPop(here, there, count) {
    here = here.concat(there.slice(0, count))
    there = there.slice(count);
    return [here, there];
}

function diffDecode(newString, lst, removed) {

    var oldString = "";
    
    for (let elem of parse(lst)) {
        var [kind, count] = elem;

        if (kind === "A") {
            newString = pushPop(oldString, newString, count)[1];
        }
        if (kind === "D") {
            [oldString, removed] = pushPop(oldString, removed, count);
        }
        if (kind === "O") {
            [oldString, newString] = pushPop(oldString, newString, count);
        }
    }

    return oldString;
}

// console.log(diffEncode("lsjflasfj", "that jaguar"));
var [lst, removed] = diffEncode("lsjflasfj", "that jaguar");
// console.log(diffDecode(lst, removed));

