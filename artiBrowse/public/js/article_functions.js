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
    let current = false;
    for (let i = 0; i < data.length; i++) {

        if ((index < -1) && (current === false)) {
            i = Math.abs(index + 2);
            current = true;

        }

        if ((data[i] === "<") || (data[i] === "&")) {
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

                }


            }
            else if (data[i] === ";") {
                curr_index++;
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
        if ((curr_index === index) && (index !== -1)) {

            return i;
        }
        if ((index < -1) && (curr_index === 0)) {

            return i;
        }

    }
    return index !== -1 ? undefined : curr_index + 1;
}
function next(curr, data) {
    return get_nth_index((curr * -1) - 2, data);
}
//required fixes
//---->>>in the get_nth_index, make sure that we check to see that entity code in the innerHTML is also accounted for, #____; -->fixed
//---->>>also fix the change_cursor function to allow cursor change w/o removing a value in the text    --> fixed

//---->>>create a up and down movement, understand that the text area uses current index to calculate ups index too 
//---->>>implement a home button functionality
//---->>>lastly implement a tab button
function change_cursor() {
    let loc = (innerText.innerText.length - 1) + cursor_location;
    let middle;
    if (loc !== -1) {
        middle = get_nth_index(loc, innerText.innerHTML);

        middle++;
    }
    else {
        middle = 0;
    }
    innerText.innerHTML = innerText.innerHTML.slice(0, middle) + cursor.outerHTML + innerText.innerHTML.slice(middle, innerText.innerHTML.length);
}
newText.addEventListener("input", (event) => {
    innerText.innerHTML = newText.value;
    innerText.innerHTML = innerText.innerHTML.replaceAll(" ", "<span class=\"invisible\">*</span>");
    innerText.innerHTML = innerText.innerHTML.replaceAll("\n", "<br>");

    change_cursor();

});
//fixes
//--->>>FIX THE FAULTY END OF THE LEFT AND RIGHT MOVEMENNTS -->FIXED
//--->>>FIX THE MYSTERIOUS DOWN ISSUE THAT OPENS SOMETIMES
//--->>>REFACTOR THE UP FUNCTION TO ALLOW IT TO BE USED AS THE DOWN FUNCTION AND POTENTIALLY THE HOME BUTTON FUNCTION
function up_down(dir) {
    let index_of_cursor = innerText.innerHTML.indexOf(cursor.outerHTML);
    let found_br = 0;
    let index = undefined;
    let loc = 0;
    if (index_of_cursor !== -1) {

        let regEx = /<br>/g;
        innerText.innerHTML = innerText.innerHTML.replaceAll(cursor.outerHTML, "");
        let res = [...innerText.innerHTML.matchAll(regEx)];
        for (let i = 0; i < res.length; i++) {
            if (res[i].index < index_of_cursor) {
                found_br = res[i].index;
                index = i;
            }
            else {
                break;
            }
        }

        if ((index === undefined) && (dir === "up")) {
            return;
        }
        else if (index === undefined) {  //IN THE DOWN FUNCTION, THIS SHOULD MEAN THAT THE PREVIOUS STARTS FROM INDEX 0, SET FOUND_BR TO 0-->implemented
            found_br = 0;
            index = -1;
        }
        if (dir === "Home") {
            if (index === -1) {
                cursor_location = (innerText.innerText.length) * -1;
            }
            else {
                // cursor_location = next(found_br, innerText.innerHTML) - innerText.innerHTML.length;
                cursor_location = (get_nth_index(-1, (innerText.innerHTML.slice(next(found_br, innerText.innerHTML), innerText.innerHTML.length))) - 1) * -1;


            }
            return;
        }
        if (dir === "End") {
            if (res[index + 1] === undefined) {
                cursor_location = 0;
            }
            else {
                cursor_location = get_nth_index(-1, (innerText.innerHTML.slice(res[index + 1].index, innerText.innerHTML.length))) * -1;
            }
            return;
        }
        //IF RES[INDEX+1] === UNDEFINED, THEN DOWN IS NOT POSSIBLE -->implemented
        if ((res[index + 1] === undefined) && (dir === "down")) {
            return;
        }


        let diff = get_nth_index(-1, innerText.innerHTML.slice(found_br, index_of_cursor));
        if (index !== -1) {
            diff--;
        }

        if ((index === 0) && (dir === "up")) {  //THIS CONDITION IS NOT NEEDED FOR DOWN -->implemented
            let loc = diff > found_br ? found_br : diff;
            cursor_location = get_nth_index(-1, innerText.innerHTML.slice(loc, innerText.innerHTML.length)) * -1;
        }
        else {
            //SHOULD BE RES[INDEX+1].INDEX, RES[INDEX+2].INDEX, IF RES[INDEX+2].INDEX !== UNDEFINED, ELSE SHOULD BE RES[INDEX+1].INDEX,
            //INNERTEXT.INNERTEXT.LENGTH - 1
            let newCutOut;
            if (dir === "up") {
                newCutOut = innerText.innerHTML.slice(res[index - 1].index, found_br);
            }
            else {
                if (res[index + 2] === undefined) {
                    newCutOut = innerText.innerHTML.slice(res[index + 1].index, innerText.innerHTML.length);
                }
                else {
                    newCutOut = innerText.innerHTML.slice(res[index + 1].index, res[index + 2].index);
                }

            }
            let get = get_nth_index(diff, newCutOut);


            if (get !== undefined) {
                if (dir === "up") {
                    let sum = res[index - 1].index + get + 1;
                    loc = sum;
                }
                else {
                    let sum = res[index + 1].index + get + 1;
                    loc = sum;
                    console.log(get, diff, newCutOut, res[index + 1].index);
                }
            }
            else {
                if (dir === "up") {
                    loc = found_br;
                }
                else {
                    loc = res[index + 2] === undefined ? innerText.innerHTML - 1 : res[index + 2].index;
                }
            }

            cursor_location = get_nth_index(-1, innerText.innerHTML.slice(loc, innerText.innerHTML.length)) * -1;

        }


    }
}
function cursor_position(dir) {
    try {
        if (dir === "right") {
            innerText.innerHTML = innerText.innerHTML.replaceAll(cursor.outerHTML, "");
            if (cursor_location !== 0) {
                cursor_location++;
            }
        }
        else if (dir === "left") {
            innerText.innerHTML = innerText.innerHTML.replaceAll(cursor.outerHTML, "");
            if (Math.abs(cursor_location) !== innerText.innerText.length) {
                cursor_location--;

            }
        }
        else if ((dir === "up") || (dir === "down") || (dir === "Home") || (dir === "End")) {
            up_down(dir);
        }

        change_cursor();
    }
    catch (e) {
        console.error(e);
    }
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
    else if ((event.code === "End") || (event.code === "Home")) {
        cursor_position(event.code);

    }

});



