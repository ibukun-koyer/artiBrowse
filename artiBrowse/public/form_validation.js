

const texts = document.querySelectorAll(".textarea");
const details = document.querySelectorAll(".show");
// let show = true;
let show = [];


const list_of_invalids = ["$", "<", ">", ";", "\\", "{", "}", "[", "]", "+", "=", "?", "&", ",", ":", "'", "\"", "`"];
let message = "";
let messageList = [];
for (let i = 0; i < texts.length; i++) {
    show[i] = true;
    messageList[i] = "Text must have a minimum length of 5 and a maximum length of 40.";
}
let regEx = /[a-zA-Z0-9]+@[a-zA-Z]+\.[a-zA-Z]+/;
for (let i = 0; i < texts.length; i++) {
    texts[i].addEventListener("input", function (event) {
        if (details[i].nextElementSibling !== null) {
            details[i].nextElementSibling.remove();
            show[i] = true;
            details[i].classList.toggle("fa-caret-down");
            details[i].classList.toggle("fa-caret-up");
        }
        texts[i].setAttribute("id", "valid");
        message = "Looks Good!.";
        for (let j = 0; j < list_of_invalids.length; j++) {
            if (texts[i].value.indexOf(list_of_invalids[j]) !== -1) {
                texts[i].setAttribute("id", "invalid");
                message = `Text cannot include the following characters: ${list_of_invalids.toString()}.`;
            }
        }
        if (texts[i].getAttribute("name") === "email") {

            if (regEx.test(texts[i].value) === false) {
                texts[i].setAttribute("id", "invalid");
                message = "Email is invalid";
            }

        }
        if (texts[i].value.length < 5 || texts[i].value.length > 40) {
            texts[i].setAttribute("id", "invalid");
            message = "Text must have a minimum length of 5 and a maximum length of 40.";

        }

        messageList[i] = message;
        // let feedback = text.nextElementSibling;
        // feedback.innerText = message;
        // if (message === "Looks Good!.") {
        //     feedback.classList.remove("invalidText");
        //     feedback.classList.add("validText");
        // }
        // else {
        //     feedback.classList.remove("validText");
        //     feedback.classList.add("invalidText");
        // }

    })
}


for (let i = 0; i < details.length; i++) {
    details[i].addEventListener("click", function (event) {
        console.log("i want the detail bro");
        console.log(texts[i]);
        console.log(messageList[i]);
        if (messageList[i] !== undefined) {
            if (show[i] === true) {
                const dropDown = document.createElement("div");
                dropDown.innerText = messageList[i];
                dropDown.classList.add("drop");
                details[i].parentElement.append(dropDown);
                show[i] = false;
            }
            else {
                details[i].nextElementSibling.remove();
                show[i] = true;
            }

            details[i].classList.toggle("fa-caret-down");
            details[i].classList.toggle("fa-caret-up");
        }
    })
}
const check = () => {


    let wrong = false;

    for (let i = 0; i < texts.length; i++) {
        if (messageList[i] === "Looks Good!.") {
            texts[i].setAttribute("id", "valid");
        }
        else {
            texts[i].value = "";
            texts[i].setAttribute("id", "invalid");
            wrong = true;
        }

    }
    return wrong;

}
const submit = document.querySelector("form");
if (submit !== null) {
    submit.addEventListener("submit", function (event) {
        event.preventDefault();
        let wrong = check();
        // console.log(ret);
        if (wrong === false) {
            event.currentTarget.submit();
        }


    });
}
