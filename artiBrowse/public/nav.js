const nav = document.querySelector(".fa-bars");
if (nav !== null) {
    nav.addEventListener("click", (event) => {
        nav.children[0].classList.toggle("barsShow");
    });
}