
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


<script type="module">
/* ===============================
   🔥 FIREBASE IMPORTS
================================ */
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  onAuthStateChanged,
  signOut,
  createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.8.0/firebase-auth.js";

import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  getDocs,
  collection,
  deleteDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";

/* ===============================
   🔧 FIREBASE CONFIG
================================ */
const firebaseConfig = {
  apiKey: "AIzaSyCyIakQ4jzv_z7k_yXvBliTOqg687ZKjHk",
  authDomain: "pragati-dashboard.firebaseapp.com",
  projectId: "pragati-dashboard",
  storageBucket: "pragati-dashboard.firebasestorage.app",
  messagingSenderId: "580069668292",
  appId: "1:580069668292:web:70115744e2f5a83e016091",
  measurementId: "G-MYV9XGW3X1"
};

/* ===============================
   🚀 INIT APPS
================================ */
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const secondaryApp = initializeApp(firebaseConfig, "Secondary");
const secondaryAuth = getAuth(secondaryApp);

let CURRENT_USER_ROLE = null;




/* ===============================
   🎯 ELEMENTS
================================ */
const loginPage = document.getElementById("loginPage");
const appLayout = document.getElementById("appLayout");
const loginError = document.getElementById("loginError");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const userEmailSidebar = document.getElementById("userEmailSidebar");
const statUsers = document.getElementById("statUsers");

/* ===============================
   🔐 LOGIN
================================ */
window.login = async () => {
  try {
    await signInWithEmailAndPassword(
      auth,
      emailInput.value.trim(),
      passwordInput.value
    );
  } catch (err) {
    loginError.innerText = err.message;
  }
};


/* ===============================
   ♻️ SESSION HANDLER
================================ */



function animateCount(el, value) {
  let start = 0;
  const speed = 20;

  el.innerText = "0";

  const timer = setInterval(() => {
    start++;
    el.innerText = start;
    if (start >= value) clearInterval(timer);
  }, speed);
}

async function loadUserStats() {
  if (CURRENT_USER_ROLE !== "admin") {
    statUsers.innerText = "—";
    return;
  }

  const snap = await getDocs(collection(db, "users"));
  console.log("USER COUNT:", snap.size);

  animateCount(statUsers, snap.size);
}

let userReady = false;

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    loginPage.style.display = "flex";
    appLayout.style.display = "none";
    userReady = false;
    return;
  }

  const snap = await getDoc(doc(db, "users", user.uid));

  if (!snap.exists() || !snap.data().canLogin) {
    await signOut(auth);
    alert(!snap.exists() ? "Access denied" : "Account disabled");
    userReady = false;
    return;
  }

  CURRENT_USER_ROLE = snap.data().role;

  loginPage.style.display = "none";
  appLayout.style.display = "flex";
  userEmailSidebar.innerText = snap.data().email;
  userReady = true;

  applyRolePermissions();

  if (CURRENT_USER_ROLE === "admin") {
    loadUsers();
    loadUserStats();
  }
});

// at the bottom of your JS
window.loadPage = function(page, el) {
  if (!userReady) {
    alert("⏳ Checking login, please wait...");
    return;
  }

  const pages = {
    hybridsolar: "_hybridsolar.html",
    ongridsolar: "_ongridsolar.html",
    "3kwongrid": "_3kw_ongrid.html",
    moneyreceipt: "_receipt.html",
    vendor: "_vendor.html",
  };

  const frame = document.getElementById("toolFrame");
  frame.src = pages[page];
  document.getElementById("toolWrapper").style.display = "block";
  document.getElementById("toolDivider").style.display = "block";
  frame.style.height = "600px";

  document.querySelectorAll(".card").forEach(c => c.classList.remove("active"));
  if (el.closest(".card")) el.closest(".card").classList.add("active");
};

/* ===============================
   🔒 ROLE UI CONTROL
================================ */
function applyRolePermissions() {
  document.querySelectorAll(".admin-only").forEach(el => {
    el.style.display = CURRENT_USER_ROLE === "admin" ? "block" : "none";
  });
}
window.toggleSidebar = () => {
  document.querySelector(".sidebar").classList.toggle("open");
};

window.toggleTheme = () => {
  document.body.classList.toggle("dark");
  localStorage.setItem(
    "theme",
    document.body.classList.contains("dark") ? "dark" : "light"
  );
};

if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
}
/* ===============================
   ➕ ADD USER (ADMIN ONLY)
================================ */
window.addUser = async () => {
  if (CURRENT_USER_ROLE !== "admin") {
    alert("Admin only");
    return;
  }

  const email = newEmail.value.trim();
  const password = newPassword.value;
  const role = newRole.value;
  const msg = addUserMsg;

  if (!email || !password) {
    msg.innerText = "Email & password required";
    return;
  }

  try {
    const cred = await createUserWithEmailAndPassword(
      secondaryAuth,
      email,
      password
    );

    await setDoc(doc(db, "users", cred.user.uid), {
      email,
      role,
      canLogin: true,
      createdAt: serverTimestamp()
    });

    await signOut(secondaryAuth);
    msg.innerText = "User added";
    loadUsers();

  } catch (err) {
    msg.innerText = err.message;
  }
};

/* ===============================
   👥 LOAD USERS
================================ */
async function loadUsers() {
  if (CURRENT_USER_ROLE !== "admin") return;

  const snap = await getDocs(collection(db, "users"));
  userList.innerHTML = "";

  snap.forEach(d => {
    const u = d.data();
    userList.innerHTML += `
      <div>
        <b>${u.email}</b> (${u.role})
        ${u.canLogin
          ? `<button onclick="blockUser('${d.id}')">Block</button>`
          : `<button onclick="unblockUser('${d.id}')">Unblock</button>`
        }
        ${d.id !== auth.currentUser.uid
  ? `<button onclick="deleteUser('${d.id}')">Delete</button>`
  : '<em>(You)</em>'
}
      </div>
    `;
  });
}


/* ===============================
   🚫 USER ACTIONS
================================ */
window.blockUser = async (uid) => {
  await updateDoc(doc(db, "users", uid), { canLogin: false });
  loadUsers();
};

window.unblockUser = async (uid) => {
  await updateDoc(doc(db, "users", uid), { canLogin: true });
  loadUsers();
};



window.deleteUser = async (uid) => {
  if (CURRENT_USER_ROLE !== "admin") return;

  if (!confirm("Delete this user permanently?")) return;

  await deleteDoc(doc(db, "users", uid));
  loadUsers();
};


/* ===============================
   🚪 LOGOUT
================================ */
window.logout = async () => {
  await signOut(auth);
  loginPage.style.display = "flex";
  appLayout.style.display = "none";
};

/* ===============================
   🔁 RESET PASSWORD
================================ */
window.resetPassword = () => {
  sendPasswordResetEmail(auth, emailInput.value.trim())
    .then(() => alert("Reset email sent"))
    .catch(err => alert(err.message));
};


</script>


    document.querySelector('[data-filter="utility"]')
  .innerHTML += ` <small>(${document.querySelectorAll('[data-category*="utility"]').length})</small>`;

