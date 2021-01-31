let minutes = 5;
let sleep_time = 1000 /*ms*/ * 60 /*s*/ * minutes;
const sleepScreen = document.querySelector(".noOverflow");
const time = document.querySelector(".sleepScreenInfo");
const months = {
    1: "January",
    2: "Febuary",
    3: "March",
    4: "April",
    5: "May",
    6: "June",
    7: "July",
    8: "August",
    9: "September",
    10: "October",
    11: "November",
    12: "December"
}
const days = {
    1: "Monday",
    2: "Tuesday",
    3: "wednesday",
    4: "Thurday",
    5: "Friday",
    6: "Saturday",
    0: "Sunday"
}
let clicked = false;
function setNewTime() {
    let [month, date, year] = new Date().toLocaleDateString("en-US").split("/");
    let [hour, minute, second] = new Date().toLocaleTimeString("en-US").split(/:| /);
    let day = new Date;
    const new_date = document.createElement("div");
    const new_time = document.createElement("div");
    new_time.innerText = `${hour}:${minute}`;
    new_date.innerText = `${days[day.getDay()]} ${months[month]}, ${date}`;
    time.innerHTML = "";
    const outer = document.createElement("div");

    outer.append(new_time);
    outer.append(new_date);
    time.append(outer);
}
function sleepScr() {
    if (clicked === true) {
        clicked = false;
    }
    else if (clicked === false) {
        const sleep = document.querySelector(".sleepScreen");
        sleep.getAttribute("class").includes("rollup") ? sleep.classList.remove("rollup") : false;
        sleepScreen.getAttribute("class").includes("noOverflow") ? false : sleepScreen.classList.add("noOverflow");
        sleepScreen.getAttribute("class").includes("overflow") ? sleepScreen.classList.remove("overflow") : false;

        if (sleepScreen !== undefined) {
            setNewTime();
            setInterval(() => {
                setNewTime();
            }, 1000);
        }
    }
}
const wake = () => {
    if (sleepScreen !== undefined && sleepScreen.getAttribute("class").includes("overflow") === false) {
        const sleep = document.querySelector(".sleepScreen");
        sleep.getAttribute("class").includes("rollup") ? false : sleep.classList.add("rollup");
        sleepScreen.getAttribute("class").includes("noOverflow") ? sleepScreen.classList.remove("noOverflow") : false;
        sleepScreen.getAttribute("class").includes("overflow") ? false : sleepScreen.classList.add("overflow");

        clicked = true;
    }
}
if (should_sleep === "true") {
    sleepScr();
}
else {
    wake();
}
setInterval(sleepScr, sleep_time);
sleepScreen.addEventListener("click", function (event) {
    wake();

});
document.body.addEventListener("keyup", function (event) {
    wake();
});
