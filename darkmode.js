let darkMode = localStorage.getItem("darkmode");
const themeSwitch = document.querySelector(".theme-switch");

const enableDarkMode = () => {
    document.body.classList.add("darkmode");
    localStorage.setItem("darkmode", "active");
}

const disableDarkMode = () => {
    document.body.classList.remove("darkmode");
    localStorage.setItem("darkmode", null);
}

if(darkMode === "active") enableDarkMode();

themeSwitch.addEventListener("click", () =>{
    darkMode = localStorage.getItem("darkmode"); 
    darkMode !== "active" ? enableDarkMode() : disableDarkMode();
});