const a = document.querySelectorAll(".editOptions form");
let currently_in_use = false;
function provide_textarea(placeholder, max, search, anc, e, name) {

    const quoteLive = document.querySelector(search);
    let temp = quoteLive.innerHTML;

    const div = document.createElement("div");
    const textSec = document.createElement("textarea");

    textSec.classList.add("designTextArea");
    textSec.placeholder = placeholder;
    textSec.rows = 5;
    textSec.column = 10;
    // textSec.append(checkMark);
    div.classList.add("flex");
    div.append(textSec);

    div.classList.add("marginText");
    anc.parentElement.parentElement.setAttribute("id", "heightInc");

    anc.parentElement.parentElement.append(div);

    //check mark, x mark and available char bar
    const checkMark = document.createElement("i");
    const xMark = document.createElement("i");
    checkMark.classList.add("fas");
    checkMark.classList.add("fa-check-circle");
    checkMark.classList.add("horizontal_check_circle");
    xMark.classList.add("fa");
    xMark.classList.add("fa-times-circle");
    xMark.classList.add("horizontal_times_circle");
    div.append(checkMark);
    div.append(xMark);
    //end of mark, x mark, and available char bar
    //add a length bar below
    const lengthBar = document.createElement("div");
    const currLength = document.createElement("div");
    lengthBar.classList.add("lengthBar");
    currLength.classList.add("currLength");
    lengthBar.append(currLength);
    div.parentElement.append(lengthBar);

    let min = 0;

    let send = "";
    textSec.addEventListener("input", (event) => {

        quoteLive.innerHTML = "";
        if (textSec.value.length >= max) {
            send = textSec.value.slice(0, max);
            currLength.style.backgroundColor = "red";
            currLength.style.width = "100%";
            quoteLive.innerText = textSec.value.slice(0, max);
        }
        else {
            send = textSec.value;
            currLength.style.backgroundColor = "green";
            currLength.style.width = `${(textSec.value.length / max) * 100}%`;
            quoteLive.innerText = textSec.value;

        }

    });
    xMark.addEventListener("click", (event) => {
        quoteLive.innerHTML = temp;
        let childCount = div.parentElement.childElementCount;
        for (let i = childCount - 1; i >= 1; i--) {
            div.parentElement.children[i].remove();
        }
        anc.parentElement.parentElement.setAttribute("id", "");
        currently_in_use = false;

    });

    checkMark.addEventListener("click", (event) => {
        const submit_input = document.createElement("input");
        submit_input.setAttribute("name", name);
        submit_input.value = send;
        submit_input.classList.add("hidden");
        anc.append(submit_input);
        // console.dir(e);
        currently_in_use = false;
        e.target.submit();
    });

    //making sure no other option can be picked
    currently_in_use = true;

}
function image_get(anc, e) {
    const image_single = document.createElement("input");
    const label = document.createElement("label");
    const div = document.createElement("div");
    const wrap_input = document.createElement("div");
    image_single.setAttribute("type", "file");
    image_single.setAttribute("name", "image");
    image_single.setAttribute("id", "image");
    image_single.setAttribute("placeholder", "Please select an image");
    image_single.setAttribute("accept", "image/png, image/jpeg, image/jpg");

    label.setAttribute("for", "image");
    label.setAttribute("class", "button_file");
    label.innerText = "Upload file";
    wrap_input.append(label);
    wrap_input.append(image_single);
    wrap_input.classList.add("wrap");
    div.append(wrap_input);
    div.classList.add("flex");
    div.classList.add("editFile");
    anc.parentElement.parentElement.append(div);
    anc.parentElement.parentElement.setAttribute("id", "heightInc");

    //create marks
    const checkMark = document.createElement("i");
    const xMark = document.createElement("i");
    checkMark.classList.add("fas");
    checkMark.classList.add("fa-check-circle");
    checkMark.classList.add("vertical_check_circle");
    xMark.classList.add("fa");
    xMark.classList.add("fa-times-circle");
    xMark.classList.add("vertical_times_circle");

    //add marks to the list
    div.append(xMark);
    div.append(checkMark);
    //implementing the xmark
    xMark.addEventListener("click", () => {
        div.parentElement.setAttribute("id", "");
        div.parentElement.children[1].remove();
        currently_in_use = false;

    });
    checkMark.addEventListener("click", () => {
        anc.setAttribute("enctype", "multipart/form-data")
        image_single.classList.add("hidden");
        anc.append(image_single);
        div.parentElement.setAttribute("id", "");
        div.parentElement.children[1].remove();
        currently_in_use = false;
        e.target.submit();
    });
    currently_in_use = true;

}
for (let anc of a) {
    anc.addEventListener("submit", function (event) {
        console.log(event);
        event.preventDefault();

        let newReg = /quote/i;

        if ((newReg.test(anc.innerText) === true) && (currently_in_use !== true)) {
            let placeholder = "Please enter a new quote";
            let max = 100;
            let search = ".myQuote i";
            let name = "quote";
            let ret = provide_textarea(placeholder, max, search, anc, event, name);


        }

        newReg = /username/i;
        if ((newReg.test(anc.innerText) === true) && (currently_in_use !== true)) {
            let placeholder = "Please enter a new username";
            let max = 20;
            let search = ".username";
            let name = "username";
            let ret = provide_textarea(placeholder, max, search, anc, event, name);

        }
        newReg = /picture/i;
        if ((newReg.test(anc.innerText) === true) && (currently_in_use !== true)) {
            image_get(anc, event);
        }
    })
}