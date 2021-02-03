

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

let cursor_location = 0;
function get_nth_index(index, data) {
    let collection = [];
    let curr_index = -1;
    for (let i = 0; i < data.length; i++) {

        if (data[i] === "<") {
            collection.push(data[i]);
            continue;
        }
        else if (collection.length !== 0) {
            if (data[i] === ">") {
                collection.push(data[i]);
                if (collection.toString().replaceAll(",", "") === "<br>") {
                    curr_index++;
                }
                else if (collection.toString().replaceAll(",", "") === "<span class=\"invisible\">") {
                    continue;
                }
                else if (collection.toString().replaceAll(",", "") === "<span class=\"invisible\">*</span>") {
                    curr_index++;
                    console.log(index, curr_index);
                }

            }
            else {
                collection.push(data[i]);
                continue;
            }
            collection = [];
        }
        else {
            curr_index++;
        }
        if (curr_index === index) {

            return i;
        }
    }
    return undefined;
}
//required fixes
//---->>>in the get_nth_index, make sure that we check to see that entity code in the innerHTML is also accounted for, #____;
//---->>>also fix the change_cursor function to allow cursor change w/o removing a value in the text
function change_cursor() {
    let middle = get_nth_index((innerText.innerText.length - 1) + cursor_location, innerText.innerHTML);
    middle++;
    innerText.innerHTML = innerText.innerHTML.slice(0, middle) + cursor.outerHTML + innerText.innerHTML.slice(middle, innerText.innerHTML.length - 1);
}
newText.addEventListener("input", (event) => {
    innerText.innerHTML = newText.value;
    innerText.innerHTML = innerText.innerHTML.replaceAll(" ", "<span class=\"invisible\">*</span>");
    innerText.innerHTML = innerText.innerHTML.replaceAll("\n", "<br>");
    change_cursor();

});
function cursor_position(dir) {
    innerText.innerHTML = innerText.innerHTML.replaceAll(cursor.outerHTML, "");
    if (dir === "right") {
        if (cursor_location !== 0) {
            cursor_location++;
        }
    }
    else if (dir === "left") {
        if (Math.abs(cursor_location) !== innerText.innerText.length) {
            cursor_location--;
        }
    }
    else if (dir === "up") {

    }
    else if (dir === "down") {

    }
    change_cursor();
}
newText.addEventListener("keydown", (event) => {
    if (event.code === "ArrowRight") {
        cursor_position("right");
    }
    else if (event.code === "ArrowLeft") {
        cursor_position("left");
    }
    else if (event.code === "ArrowUp") {
        cursor_position("up");
    }
    else if (event.code === "ArrowDown") {
        cursor_position("down");
    }
});