// ===================== CART LOGIC =====================
function getCart() {
    return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
}

// Add product to cart
function addToCart(id, name, price) {
    let cart = getCart();
    const existing = cart.find(item => item.id === id);
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ id, name, price, quantity: 1 });
    }
    saveCart(cart);
    alert(`${name} added to cart! 🛒`);
}

// ===================== CART PAGE =====================
function loadCart() {
    const cartItemsContainer = document.getElementById("cart-items");
    const cartTotalEl = document.getElementById("cart-total");
    const checkoutBtn = document.getElementById("checkout-btn");
    let cart = getCart();
    cartItemsContainer.innerHTML = "";
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `<p class="text-center text-gray-500">Your cart is empty.</p>`;
        cartTotalEl.innerText = "$0";
        checkoutBtn.disabled = true;
        checkoutBtn.classList.add("opacity-50", "cursor-not-allowed");
        return;
    }
    checkoutBtn.disabled = false;
    checkoutBtn.classList.remove("opacity-50", "cursor-not-allowed");

    let total = 0;
    cart.forEach((item, index) => {
        total += item.price * item.quantity;
        const div = document.createElement("div");
        div.className = "flex justify-between items-center bg-white p-4 rounded shadow mb-2";
        div.innerHTML = `
            <div class="flex flex-col">
                <p class="font-semibold">${item.name}</p>
                <p class="text-gray-500">Price: $${item.price}</p>
            </div>
            <div class="flex items-center space-x-2">
                <input type="number" min="1" value="${item.quantity}" 
                    class="w-16 p-1 border rounded text-center"
                    onchange="updateQuantity(${index}, this.value)">
                <button onclick="removeFromCart(${index})" 
                    class="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-500 transition">
                    Remove
                </button>
            </div>
        `;
        cartItemsContainer.appendChild(div);
    });
    cartTotalEl.innerText = `$${total.toFixed(2)}`;
}

function removeFromCart(index) {
    let cart = getCart();
    cart.splice(index, 1);
    saveCart(cart);
    loadCart();
}

function updateQuantity(index, newQty) {
    let cart = getCart();
    newQty = parseInt(newQty);
    if (newQty < 1) newQty = 1;
    cart[index].quantity = newQty;
    saveCart(cart);
    loadCart();
}

// ===================== PRODUCTS PAGE =====================
async function loadProducts() {
    const productList = document.getElementById("product-list");
    if (!productList) return;

    try {
        const res = await fetch("http://127.0.0.1:5000/products");
        const products = await res.json();
        productList.innerHTML = "";
        products.forEach(p => {
            const div = document.createElement("div");
            div.className = "bg-white p-4 rounded-lg shadow flex flex-col justify-between";
            const safeName = p.name.replace(/'/g, "\\'");
            div.innerHTML = `
                <img src="${p.image_url || 'https://via.placeholder.com/300x200'}" class="w-full h-40 object-cover rounded mb-2">
                <h3 class="font-bold text-lg mb-1">${p.name}</h3>
                <p class="text-gray-500 mb-1">${p.description || 'No description.'}</p>
                <p class="text-green-600 font-semibold mb-2">$${p.price}</p>
                <div class="mt-auto flex justify-between items-center">
                    <button onclick="addToCart(${p.id}, '${safeName}', ${p.price})" class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-500 transition">Add 🛒</button>
                    <a href="product-detail.html?id=${p.id}" class="text-green-600 hover:underline font-medium ml-2">View</a>
                </div>`;
            productList.appendChild(div);
        });
    } catch (err) {
        console.error(err);
    }
}

// ===================== SERVICES PAGE =====================
async function loadServices() {
    const serviceList = document.getElementById("service-list");
    if (!serviceList) return;

    try {
        const res = await fetch("http://127.0.0.1:5000/services");
        const services = await res.json();
        serviceList.innerHTML = "";
        services.forEach(s => {
            const div = document.createElement("div");
            div.className = "bg-white p-4 rounded-lg shadow flex flex-col justify-between";
            div.innerHTML = `
                <h3 class="font-bold text-lg mb-1">${s.name}</h3>
                <p class="text-gray-500 mb-2">${s.description || "No description."}</p>
                <p class="text-green-600 font-semibold mb-2">$${s.price}</p>
                <a href="service-detail.html?id=${s.id}" class="text-green-600 hover:underline font-medium mt-auto">Book Now</a>`;
            serviceList.appendChild(div);
        });
    } catch (err) {
        console.error(err);
    }
}

// ===================== SERVICE DETAIL =====================
async function loadServiceDetail() {
    const container = document.getElementById("service-detail");
    if (!container) return;

    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    if (!id) return container.innerHTML = "<p class='text-red-500'>No service selected.</p>";

    try {
        const res = await fetch(`http://127.0.0.1:5000/services/${id}`);
        const s = await res.json();
        container.innerHTML = `
            <h2 class="text-3xl font-bold mb-3">${s.name}</h2>
            <p class="text-gray-600 mb-4">${s.description || "No description."}</p>
            <p class="text-green-600 text-2xl font-semibold mb-4">$${s.price}</p>
            <form id="booking-form" class="flex flex-col items-center space-y-4">
                <input type="date" id="booking-date" class="p-2 border rounded w-1/2" required>
                <input type="time" id="booking-time" class="p-2 border rounded w-1/2" required>
                <button type="submit" class="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-500 transition">Confirm Booking</button>
            </form>
        `;
        document.getElementById("booking-form").addEventListener("submit", async e => {
            e.preventDefault();
            const date = document.getElementById("booking-date").value;
            const time = document.getElementById("booking-time").value;
            const res = await fetch("http://127.0.0.1:5000/bookings", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({ service_id: s.id, date, time })
            });
            const data = await res.json();
            alert(data.message || "Booking successful!");
        });
    } catch (err) {
        console.error(err);
    }
}

// ===================== INITIALIZE =====================
document.addEventListener("DOMContentLoaded", () => {
    loadProducts();
    loadServices();
    loadServiceDetail();
    if (document.getElementById("cart-items")) loadCart();

    const checkoutBtn = document.getElementById("checkout-btn");
    if (checkoutBtn) {
        checkoutBtn.addEventListener("click", async () => {
            const cart = getCart();
            if (!cart.length) return alert("Your cart is empty!");
            const res = await fetch("http://127.0.0.1:5000/orders", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ items: cart })
            });
            const data = await res.json();
            alert(data.message || "Checkout complete!");
            localStorage.removeItem("cart");
            loadCart();
        });
    }
});
