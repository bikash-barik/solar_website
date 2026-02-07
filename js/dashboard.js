
function unlockDashboard() {
  const frame = document.getElementById("toolFrame");

  frame.src = "";

  document.getElementById("toolWrapper").style.display = "none";
  document.getElementById("toolDivider").style.display = "none";

  document.getElementById("dashboardCards").classList.remove("dashboard-locked");

  document.querySelectorAll(".card").forEach(c => c.classList.remove("active"));
}






function updateStats() {
  const cards = document.querySelectorAll(".card");

  let tools = 0;
  let utilities = 0;
  let links = 0;

  cards.forEach(card => {
    const cats = (card.dataset.category || "").split(" ");

    if (cats.includes("tool")) tools++;
    if (cats.includes("utility")) utilities++;

    links += card.querySelectorAll("a").length;
  });

  document.getElementById("statTools").innerText = tools;
  document.getElementById("statUtilities").innerText = utilities;
  document.getElementById("statLinks").innerText = links;
}

document.addEventListener("DOMContentLoaded", updateStats);





document.querySelectorAll(".card").forEach(card => {
  card.addEventListener("mousemove", e => {
    const r = card.getBoundingClientRect();
    card.style.setProperty("--x", e.clientX - r.left + "px");
    card.style.setProperty("--y", e.clientY - r.top + "px");
  });
});



const REC_KEY = "user_interest_score";
let interest = JSON.parse(localStorage.getItem(REC_KEY)) || {};

// track clicks
document.querySelectorAll(".card").forEach(card => {
  card.addEventListener("click", e => {
    if (e.target.tagName === "A") return; // allow normal link click

    const cats = (card.dataset.category || "").split(" ");
    cats.forEach(cat => {
      interest[cat] = (interest[cat] || 0) + 1;
    });

    localStorage.setItem(REC_KEY, JSON.stringify(interest));
  });
});
// apply recommendations
function applyRecommendations(){
  const maxInterest = Math.max(...Object.values(interest), 0);

  document.querySelectorAll(".card").forEach(card => {
    const cats = (card.dataset.category || "").split(" ");
    let score = 0;

    cats.forEach(c => score += interest[c] || 0);

    if(score === maxInterest && score > 0){
      card.classList.add("recommended");
      card.style.order = -2; // float to top
    }
  });
}

applyRecommendations();



    const favKey = "dashboard_favorites";
let favorites = JSON.parse(localStorage.getItem(favKey)) || [];

document.querySelectorAll(".fav-btn").forEach((btn, index) => {
  const card = btn.closest(".card");

  // restore favorite
  if (favorites.includes(index)) {
    btn.classList.add("active");
    card.style.order = -1;
  }

  btn.addEventListener("click", e => {
    e.stopPropagation();

    btn.classList.toggle("active");

    if (btn.classList.contains("active")) {
      favorites.push(index);
      card.style.order = -1;
    } else {
      favorites = favorites.filter(i => i !== index);
      card.style.order = "";
    }

    localStorage.setItem(favKey, JSON.stringify(favorites));
  });
});



    function updateSidebarCounts(){
  sidebarLinks.forEach(link => {
    const filter = link.dataset.filter;
    const countEl = link.querySelector(".count");

    let count = 0;

    cards.forEach(card => {
      const cats = (card.dataset.category || "").split(" ");
      if (filter === "all" || cats.includes(filter)) count++;
    });

    if (countEl) countEl.innerText = count;
  });
}

// call once on load
updateSidebarCounts();


document.addEventListener("DOMContentLoaded", () => {

  const sidebarLinks = document.querySelectorAll(".sidebar a[data-filter]");
  const cards = document.querySelectorAll(".card");
  const searchInput = document.getElementById("searchInput");

  let activeFilter = "all";

  // show all initially
  cards.forEach(card => card.classList.add("show"));

  function applyFilters(){
    const searchText = searchInput.value.toLowerCase();

    cards.forEach(card => {
      const categoryAttr = card.dataset.category || "";
      const categories = categoryAttr.split(" ");
      const text = card.innerText.toLowerCase();

      const matchCategory =
        activeFilter === "all" || categories.includes(activeFilter);

      const matchSearch = text.includes(searchText);

      if (matchCategory && matchSearch) {
        card.classList.remove("hide");
        card.classList.add("show");
      } else {
        card.classList.remove("show");
        card.classList.add("hide");
      }
    });
  }

  // sidebar click
  sidebarLinks.forEach(link => {
    link.addEventListener("click", e => {
      e.preventDefault();
      activeFilter = link.dataset.filter;

      sidebarLinks.forEach(l => l.classList.remove("active"));
      link.classList.add("active");

      applyFilters();
    });
  });

  // live search
  searchInput.addEventListener("input", applyFilters);

});





    document.querySelector('[data-filter="utility"]')
  .innerHTML += ` <small>(${document.querySelectorAll('[data-category*="utility"]').length})</small>`;

