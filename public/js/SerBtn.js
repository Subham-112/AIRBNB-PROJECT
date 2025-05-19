const searchBtn = document.getElementById("searchBtn");
const searchBox = document.getElementById("searchInput");

searchBtn.addEventListener("click", () => {
    searchBox.classList.toggle("show-search");
});