
//all colors
const color1 = "white";
const color2 = "pink";
const color3 = "yellow";
const color4 = "skyblue";
const color5 = "lime";
const color6 = "rgb(73, 73, 73)";
const transition_speed = "0.5s";
const template = document.querySelector(".template");
async function wait(char) {

    let promise = new Promise((resolve, reject) => {
        setTimeout(() => {
            const span = document.createElement("span");
            span.innerText = char;
            span.classList.add("textDecor");
            template.append(span);

            resolve();
        }, 100);
    });
    await promise;

}
async function delay() {
    if (template !== null) {
        const string = "Choose a template...";
        for (let char in string) {
            await wait(string[char]);
        }

    }
}
delay();
let temp_storage = "";
function change_color_dynamically(color, paper, color_num) {
    if (paper.getAttribute("class").indexOf("template1") !== -1) {
        color.addEventListener("mouseenter", (event) => {
            temp_storage = paper.style.backgroundColor;
            paper.style.backgroundColor = color_num;
            console.log(paper.style.backgroundColor);
            paper.style.transition = transition_speed;
        });
        color.addEventListener("mouseleave", (event) => {
            paper.style.backgroundColor = temp_storage;
            paper.style.transition = transition_speed;
        });
        color.addEventListener("click", (event) => {
            temp_storage = color_num;
            paper.style.backgroundColor = color_num;
        });
    }
    if (paper.getAttribute("class").indexOf("template3") !== -1) {
        color.addEventListener("mouseenter", (event) => {
            temp_storage = paper.children[0].style.backgroundColor;
            paper.children[0].style.backgroundColor = color_num;
            paper.children[0].style.transition = transition_speed;
        });
        color.addEventListener("mouseleave", (event) => {
            paper.children[0].style.backgroundColor = temp_storage;
            paper.children[0].style.transition = transition_speed;
        });
        color.addEventListener("click", (event) => {
            temp_storage = color_num;
            paper.children[0].style.backgroundColor = color_num;
        });
    }
    if (paper.getAttribute("class").indexOf("template5") !== -1) {
        color.addEventListener("mouseenter", (event) => {
            temp_storage = paper.style.backgroundImage;
            paper.style.backgroundImage = `linear-gradient(180deg, ${color_num}, white)`;
            paper.style.transition = transition_speed;
        });
        color.addEventListener("mouseleave", (event) => {
            paper.style.backgroundImage = temp_storage;
            paper.style.transition = transition_speed;
        });
        color.addEventListener("click", (event) => {
            temp_storage = color_num;
            paper.style.backgroundImage = color_num;
        });
    }

}

let papers = document.querySelector(".templates");
if (papers.childElementCount !== 0) {
    papers = Array.from(papers.children);
    papers.forEach((paper) => {
        paper.addEventListener("click", (event) => {
            const title = document.querySelector(".container-sm #title_");
            title.classList.add("hidden");
            console.dir(event.target);
            if (event.target.getAttribute("class").indexOf("template") !== -1) {
                const del_col = paper.children;
                console.dir(del_col);
                //parse for color
                for (let i = del_col.length - 1; i >= 0; i--) {
                    if (del_col[i].getAttribute("class").indexOf("color") !== -1) {
                        del_col[i].remove();
                    }
                }
                const newdoc = document.createElement("input");
                newdoc.setAttribute("name", "template");
                newdoc.setAttribute("value", paper.outerHTML);
                newdoc.classList.add("hidden");
                paper.append(newdoc);
                title.value = title.value === "" ? "untitled" : title.value;

                paper.append(title);
                event.target.submit();
            }

        })
        let colors = Array.from(paper.children);
        if (colors !== 0) {
            colors.forEach((color) => {
                if (color.getAttribute("class").indexOf("color1") !== -1) {
                    change_color_dynamically(color, paper, color1);
                }
                if (color.getAttribute("class").indexOf("color2") !== -1) {
                    change_color_dynamically(color, paper, color2);
                }
                if (color.getAttribute("class").indexOf("color3") !== -1) {
                    change_color_dynamically(color, paper, color3);
                }
                if (color.getAttribute("class").indexOf("color4") !== -1) {
                    change_color_dynamically(color, paper, color4);
                }
                if (color.getAttribute("class").indexOf("color5") !== -1) {
                    change_color_dynamically(color, paper, color5);
                }
                if (color.getAttribute("class").indexOf("color6") !== -1) {
                    change_color_dynamically(color, paper, color6);
                }
            })
        }

    });
}