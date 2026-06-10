const products = [
  { id:1, name:"Single Bed", category:"furniture", rent:500, deposit:1000, emoji:"🛏️", color:"#fff3e0", desc:"Comfortable single bed with mattress" },
  { id:2, name:"Double Sofa", category:"furniture", rent:700, deposit:1500, emoji:"🛋️", color:"#e8f5e9", desc:"Modern 2-seater sofa for living room" },
  { id:3, name:"Dining Table", category:"furniture", rent:400, deposit:800, emoji:"🍽️", color:"#fce4ec", desc:"4-seater wooden dining table" },
  { id:4, name:"Wardrobe", category:"furniture", rent:600, deposit:1200, emoji:"🚪", color:"#f3e5f5", desc:"Large 3-door wardrobe with mirror" },
  { id:5, name:"Study Table", category:"furniture", rent:300, deposit:600, emoji:"📚", color:"#e3f2fd", desc:"Compact study table for students" },
  { id:6, name:"Bookshelf", category:"furniture", rent:250, deposit:500, emoji:"📖", color:"#fff8e1", desc:"5-shelf wooden bookshelf" },
  { id:7, name:"Refrigerator", category:"appliance", rent:800, deposit:2000, emoji:"❄️", color:"#e0f7fa", desc:"Double door 260L refrigerator" },
  { id:8, name:"Washing Machine", category:"appliance", rent:700, deposit:1800, emoji:"🫧", color:"#e8eaf6", desc:"6.5 kg fully automatic washing machine" },
  { id:9, name:'Television 32"', category:"appliance", rent:500, deposit:1000, emoji:"📺", color:"#fafafa", desc:"32 inch HD Smart LED TV" },
  { id:10, name:"Air Conditioner", category:"appliance", rent:1200, deposit:3000, emoji:"🌬️", color:"#e1f5fe", desc:"1.5 ton split AC with remote" },
  { id:11, name:"Microwave Oven", category:"appliance", rent:350, deposit:700, emoji:"⏲️", color:"#fbe9e7", desc:"20L microwave oven with grill" },
  { id:12, name:"Water Purifier", category:"appliance", rent:400, deposit:800, emoji:"💧", color:"#e0f2f1", desc:"RO+UV water purifier 7L tank" },
];

let cart = [];
let currentUser = null;

function renderProducts(filter = "all") {
  const grid = document.getElementById("productGrid");
  const filtered = filter === "all" ? products : products.filter(p => p.category === filter);
  grid.innerHTML = filtered.map(p => `
    <div class="product-card">
      <div class="product-img-box" style="background:${p.color};height:180px;display:flex;flex-direction:column;align-items:center;justify-content:center;font-size:4.5rem;border-radius:15px 15px 0 0;">
        ${p.emoji}
        <div style="font-size:0.85rem;color:#555;margin-top:8px;font-weight:bold">${p.name}</div>
      </div>
      <div class="product-info">
        <span class="category-tag">${p.category === "furniture" ? "🛋️ Furniture" : "⚡ Appliance"}</span>
        <h3>${p.name}</h3>
        <p>${p.desc}</p>
        <div class="price">₹${p.rent}/month</div>
        <div class="deposit">Security Deposit: ₹${p.deposit}</div>
        <button onclick="addToCart(${p.id})">Add to Cart 🛒</button>
      </div>
    </div>
  `).join("");
}

function filterProducts(cat, btn) {
  document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");
  renderProducts(cat);
}

function addToCart(id) {
  const product = products.find(p => p.id === id);
  if (cart.find(c => c.id === id)) { alert(`${product.name} already in cart!`); return; }
  cart.push({ ...product });
  renderCart();
  alert(`✅ ${product.name} added to cart!`);
}

function removeFromCart(id) {
  cart = cart.filter(c => c.id !== id);
  renderCart();
}

function renderCart() {
  const cartDiv = document.getElementById("cartItems");
  const summaryDiv = document.getElementById("cartSummary");
  const btn = document.getElementById("checkoutBtn");
  if (cart.length === 0) {
    cartDiv.innerHTML = "<p class='empty-msg'>Your cart is empty</p>";
    summaryDiv.innerHTML = "";
    btn.classList.add("hidden");
    return;
  }
  cartDiv.innerHTML = cart.map(item => `
    <div class="cart-item">
      <div class="cart-item-info">
        <h4>${item.emoji} ${item.name}</h4>
        <p>₹${item.rent}/month | Deposit: ₹${item.deposit}</p>
      </div>
      <button onclick="removeFromCart(${item.id})">Remove ✕</button>
    </div>
  `).join("");
  const totalRent = cart.reduce((s, i) => s + i.rent, 0);
  const totalDeposit = cart.reduce((s, i) => s + i.deposit, 0);
  summaryDiv.innerHTML = `
    <p>🛒 Items: <strong>${cart.length}</strong></p>
    <p>💰 Monthly Rent: <strong>₹${totalRent}</strong></p>
    <p>🔒 Security Deposit: <strong>₹${totalDeposit}</strong></p>
    <p>📦 First Payment: <strong>₹${totalRent + totalDeposit}</strong></p>
  `;
  btn.classList.remove("hidden");
}

function showLogin() { document.getElementById("loginModal").classList.remove("hidden"); }
function closeLogin() { document.getElementById("loginModal").classList.add("hidden"); }

function loginUser() {
  const name = document.getElementById("userName").value.trim();
  const email = document.getElementById("userEmail").value.trim();
  const phone = document.getElementById("userPhone").value.trim();
  if (!name || !email || !phone) { alert("Please fill all fields!"); return; }
  currentUser = { name, email, phone };
  document.getElementById("loginBtn").textContent = `👤 ${name}`;
  alert(`Welcome ${name}! Logged in successfully ✅`);
  closeLogin();
}

function checkout() {
  if (!currentUser) { alert("Please login first!"); showLogin(); return; }
  updateOrderSummary();
  document.getElementById("checkoutModal").classList.remove("hidden");
}

function updateOrderSummary() {
  const tenure = parseInt(document.getElementById("tenurePlan").value) || 1;
  const totalRent = cart.reduce((s, i) => s + i.rent, 0);
  const totalDeposit = cart.reduce((s, i) => s + i.deposit, 0);
  const discount = tenure >= 12 ? 0.15 : tenure >= 6 ? 0.10 : tenure >= 3 ? 0.05 : 0;
  const discountedRent = Math.round(totalRent * (1 - discount));
  const totalPayable = discountedRent * tenure + totalDeposit;
  document.getElementById("orderSummaryBox").innerHTML = `
    <p>📦 Items: <strong>${cart.map(i => i.name).join(", ")}</strong></p>
    <p>📅 Tenure: <strong>${tenure} Month(s)</strong></p>
    <p>💰 Monthly Rent: <strong>₹${discountedRent}</strong> ${discount > 0 ? `<span style="color:green">(${discount*100}% off)</span>` : ""}</p>
    <p>🔒 Deposit: <strong>₹${totalDeposit}</strong></p>
    <p>💳 Total Now: <strong>₹${totalPayable}</strong></p>
  `;
}

function closeCheckout() { document.getElementById("checkoutModal").classList.add("hidden"); }

function placeOrder() {
  const name = document.getElementById("deliveryName").value.trim();
  const address = document.getElementById("deliveryAddress").value.trim();
  const phone = document.getElementById("deliveryPhone").value.trim();
  const date = document.getElementById("deliveryDate").value;
  const tenure = document.getElementById("tenurePlan").value;
  if (!name || !address || !phone || !date) { alert("Please fill all fields!"); return; }
  const totalRent = cart.reduce((s, i) => s + i.rent, 0);
  const totalDeposit = cart.reduce((s, i) => s + i.deposit, 0);
  const order = {
    id: Date.now(), customer: name,
    address, phone, deliveryDate: date,
    tenure: `${tenure} Month(s)`,
    items: [...cart],
    monthlyRent: totalRent,
    deposit: totalDeposit,
    status: "Active"
  };
  const saved = JSON.parse(localStorage.getItem("rentease_orders") || "[]");
  saved.push(order);
  localStorage.setItem("rentease_orders", JSON.stringify(saved));
  cart = [];
  renderCart();
  renderRentals();
  closeCheckout();
  alert(`🎉 Order Placed!\n📅 Delivery: ${date}\n⏱️ Tenure: ${tenure} month(s)\nThank you!`);
}

function renderRentals() {
  const div = document.getElementById("myRentals");
  const orders = JSON.parse(localStorage.getItem("rentease_orders") || "[]");
  if (orders.length === 0) { div.innerHTML = "<p class='empty-msg'>No active rentals yet.</p>"; return; }
  div.innerHTML = orders.map((o, i) => `
    <div class="rental-card">
      <h4>${o.items.map(x => x.emoji + " " + x.name).join(", ")}</h4>
      <p>👤 ${o.customer} | 📞 ${o.phone}</p>
      <p>📍 ${o.address}</p>
      <p>📅 Delivery: ${o.deliveryDate} | ⏱️ Tenure: ${o.tenure}</p>
      <p>💰 Monthly: ₹${o.monthlyRent} | 🔒 Deposit: ₹${o.deposit}</p>
      <p class="rental-status">● ${o.status}</p>
      <button class="extend-btn" onclick="extendRental(${i})">Extend ➕</button>
      <button class="return-btn" onclick="returnRental(${i})">Return 📦</button>
    </div>
  `).join("");
}

function extendRental(i) {
  const orders = JSON.parse(localStorage.getItem("rentease_orders") || "[]");
  const m = prompt("Extend by how many months?");
  if (m && !isNaN(m)) {
    orders[i].tenure = `${parseInt(orders[i].tenure) + parseInt(m)} Month(s)`;
    orders[i].status = "Extended";
    localStorage.setItem("rentease_orders", JSON.stringify(orders));
    renderRentals();
    alert(`✅ Extended by ${m} month(s)!`);
  }
}

function returnRental(i) {
  if (confirm("Schedule return for this rental?")) {
    const orders = JSON.parse(localStorage.getItem("rentease_orders") || "[]");
    orders[i].status = "Return Scheduled";
    localStorage.setItem("rentease_orders", JSON.stringify(orders));
    renderRentals();
    alert("📦 Return scheduled! We will contact you soon.");
  }
}

function submitMaintenance() {
  const name = document.getElementById("maintName").value.trim();
  const product = document.getElementById("maintProduct").value.trim();
  const issue = document.getElementById("maintIssue").value;
  const desc = document.getElementById("maintDesc").value.trim();
  if (!name || !product || !issue || !desc) { alert("Please fill all fields!"); return; }
  const request = { id: Date.now(), name, product, issue, desc, status: "Pending" };
  const saved = JSON.parse(localStorage.getItem("rentease_maintenance") || "[]");
  saved.push(request);
  localStorage.setItem("rentease_maintenance", JSON.stringify(saved));
  document.getElementById("maintName").value = "";
  document.getElementById("maintProduct").value = "";
  document.getElementById("maintIssue").value = "";
  document.getElementById("maintDesc").value = "";
  renderMaintenance();
  alert("✅ Maintenance request submitted!");
}

function renderMaintenance() {
  const div = document.getElementById("maintRequests");
  const requests = JSON.parse(localStorage.getItem("rentease_maintenance") || "[]");
  if (requests.length === 0) { div.innerHTML = ""; return; }
  div.innerHTML = `<h3 style="margin:20px 0 10px">Your Requests:</h3>` +
    requests.map(r => `
      <div class="maint-card">
        <strong>🔧 ${r.product}</strong> — ${r.issue}
        <p style="color:#666;font-size:0.9rem;margin-top:5px">${r.desc}</p>
        <p style="color:orange;font-weight:bold;margin-top:5px">⏳ ${r.status}</p>
      </div>
    `).join("");
}

renderProducts();
renderCart();
renderRentals();
renderMaintenance();