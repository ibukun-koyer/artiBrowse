

const errorX = document.querySelector(".errorFlash");
if (errorX !== null) {
    errorX.addEventListener("click", (event) => {
        const div = event.target.i;
        if (event.target.localName === "i") {
            // console.log("the button has been pressed");
            event.target.parentElement.remove();
        }
    });
}