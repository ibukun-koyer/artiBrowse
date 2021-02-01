const getTemplate = document.querySelector(".center_template form");
const newText = document.createElement("textarea");
newText.classList.add("one_hundred_percent_size");
newText.classList.add("invisible");
getTemplate.append(newText);
newText.setAttribute("spellCheck", false);
//create text area
const innerText = document.createElement("div");
innerText.classList.add("abs");
innerText.innerText = newText.value;
const cursor = document.createElement("span");
cursor.innerText = "|";
cursor.classList.add("blink");
innerText.append(cursor);
getTemplate.prepend(innerText);
function fill_space(length, col) {
    let str = "";
    for (let i = length; i < col; i++) {
        str = str + "*";
    }
    return str;
}

let identifier = 0;
newText.addEventListener("input", (event) => {
    //currently using a base assumption that the cursor is always at the end of the input
    //would need to change that assumption later to include the fact that the cursor is moveable
    const prev_cursor = document.querySelector(".blink").remove();
    const innerText = document.querySelector(".abs");
    let data = event.data;
    console.log(event);
    if ((event.data === null) && (event.inputType === "insertLineBreak")) {
        data = "\n";
    }
    if ((event.data === null) && (event.inputType === "deleteContentBackward")) {
        data = "\b";
    }
    if (data === " ") {
        data = data.replace(" ", "<span class=\"invisible\">*</span>");
    }
    else if (data === "\t") {
        data = data.replace("\t", "<span class=\"invisible\">****</span>");
    }
    //insert the new value
    if (data !== "\b") {
        innerText.innerHTML = innerText.innerHTML + data;
    }

    if (data === "\n") {
        //working on enter
        let height = window.getComputedStyle(innerText).height;
        let j = parseFloat(height);
        let k = 0;
        let changed = false;
        console.log(j, parseFloat(height), height);
        while (j === parseFloat(height)) {
            if (k === 0) {
                innerText.innerHTML = innerText.innerHTML.replace("\n", `<span class=\"invisible\" id=\"class${identifier}\">${fill_space(0, k + 1)}</span>`);
            }
            else {
                innerText.innerHTML = innerText.innerHTML.replace(`<span class=\"invisible\" id=\"class${identifier}\">${fill_space(0, k)}</span>`, `<span class=\"invisible\" id=\"class${identifier}\">${fill_space(0, k + 1)}</span>`);
            }
            j = window.getComputedStyle(innerText).height;
            j = parseFloat(j);
            if (changed === false) {
                height = `${j}`;
                changed = true;
            }
            // if ((parseFloat(height) === 0) && (changed === false)) {
            //     height = `${j}`;
            //     changed = true;
            // }
            // else {
            k++;
            // }
        }
        if (changed === true) {
            innerText.innerHTML = innerText.innerHTML.replace(`<span class=\"invisible\" id=\"class${identifier}\">${fill_space(0, k)}</span>`, `<span class=\"invisible\" id=\"class${identifier}\">${fill_space(0, k - 1)}</span>`);
        }
        // if (parseFloat(height) === parseFloat(window.getComputedStyle(innerText).height)) {
        //     console.log("Back to previous height");
        // }
        height = `${j}`;
        identifier++;

    }
    else if (data === "\b") {
        let slice = innerText.innerHTML.length - 1;
        if (slice >= 0) {

            if (innerText.innerHTML[slice] === ">") {
                for (let i = slice; i >= 0; i--) {
                    if ((innerText.innerHTML[i] === "<") && (innerText.innerHTML[i + 1] !== "/")) {
                        if (slice === 0) {
                            innerText.innerHTML = "";
                        }
                        else {
                            innerText.innerHTML = innerText.innerHTML.slice(0, slice - 1);
                        }
                        break;
                    }
                    else {
                        slice--;
                    }

                }
            }
            else {
                innerText.innerHTML = innerText.innerHTML.slice(0, slice);
            }
        }
    }

    //insert the cursor

    innerText.append(cursor);


});
