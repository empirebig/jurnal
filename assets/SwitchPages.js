`use strict`;

const filePage = document.querySelector('.filePage');
const structPage = document.querySelector('.structPage');
const statsPage = document.querySelector('.statsPage');
const supportPage = document.querySelector('.supportPage');
const aboutPage = document.querySelector('.aboutPage');

document.querySelector('.file').addEventListener('click', function() {
    switchPage("file");
});

document.querySelector('.struct').addEventListener('click', function() {
    switchPage("struct");
});

document.querySelector('.stats').addEventListener('click', function() {
    switchPage("stats");
});

document.querySelector('.support').addEventListener('click', function() {
    switchPage("support")
});

document.querySelector('.about').addEventListener('click', function() {
    switchPage("about");
});

function switchPage(pageName) {
    switch (pageName) {
        case pageName = "file":
            structPage.classList.add("pageHide")
            statsPage.classList.add("pageHide")
            supportPage.classList.add("pageHide")
            aboutPage.classList.add("pageHide")
            filePage.classList.remove("pageHide")
            break
        case pageName = "struct":
            filePage.classList.add("pageHide")
            statsPage.classList.add("pageHide")
            supportPage.classList.add("pageHide")
            aboutPage.classList.add("pageHide")
            structPage.classList.remove("pageHide")
            break
        case pageName = "stats":
            structPage.classList.add("pageHide")
            filePage.classList.add("pageHide")
            supportPage.classList.add("pageHide")
            aboutPage.classList.add("pageHide")
            statsPage.classList.remove("pageHide")
            break
        case pageName = "support":
            structPage.classList.add("pageHide")
            statsPage.classList.add("pageHide")
            filePage.classList.add("pageHide")
            aboutPage.classList.add("pageHide")
            supportPage.classList.remove("pageHide")
            break
        case pageName = "about":
            structPage.classList.add("pageHide")
            statsPage.classList.add("pageHide")
            supportPage.classList.add("pageHide")
            filePage.classList.add("pageHide")
            aboutPage.classList.remove("pageHide")
            break
        default:
            structPage.classList.add("pageHide")
            statsPage.classList.add("pageHide")
            supportPage.classList.add("pageHide")
            aboutPage.classList.add("pageHide")
            filePage.classList.remove("pageHide")
            break
    }
}