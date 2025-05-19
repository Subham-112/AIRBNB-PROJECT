const searchInput = document.getElementById("searchInput");

function performSearch() {
  const query = searchInput.value.toLowerCase().trim();
  const listingItems = document.querySelectorAll(".listing-item");

  listingItems.forEach(item => {
    const title = item.dataset.title;
    const price = item.dataset.price;
    const country = item.dataset.country;

    const match = title.includes(query) || price.includes(query) || country.includes(query);
    item.style.display = match ? "block" : "none";
  });

  const countrySections = document.querySelectorAll(".country-section");
  countrySections.forEach(section => {
    const items = section.querySelectorAll(".listing-item");
    const visible = Array.from(items).some(item => item.style.display !== "none");
    section.style.display = visible ? "block" : "none";
  });
}

searchInput.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    e.preventDefault();
    performSearch();
  }
});