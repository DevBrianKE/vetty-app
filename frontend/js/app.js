const API_URL = "http://127.0.0.1:5000/products";

// ---------------- FETCH PRODUCTS ----------------
async function fetchProducts() {
    const productList = document.getElementById("product-list");
    if (!productList) return;

    try {
        const res = await fetch(API_URL);
        const products = await res.json();

        productList.innerHTML = "";

        products.forEach(product => {
            const div = document.createElement("div");
            div.className = "bg-white p-6 rounded-lg shadow hover:shadow-lg transition flex flex-col";

            div.innerHTML = `
                <h3 class="text-lg font-bold mb-2">${product.name}</h3>
                <p class="text-gray-600 mb-4">${product.description}</p>

                <p class="text-green-600 font-semibold mb-4">$${product.price}</p>

                <div class="flex justify-between mt-auto">
                    <button onclick="addToCart(${product.id}, '${product.name}', ${product.price})"
                        class="bg-green-600 text-white px-3 py-2 rounded hover:bg-green-500">
                        Add
                    </button>

                    <a href="pages/product-detail.html?id=${product.id}" 
                        class="text-blue-600 hover:underline">
                        View
                    </a>
                </div>
            `;

            productList.appendChild(div);
        });

    } catch (err) {
        console.error(err);
    }
}

fetchProducts();


// ---------------- CART SYSTEM (LOCAL STORAGE) ----------------
function addToCart(id, name, price) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    const existing = cart.find(item => item.id === id);

    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ id, name, price, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    alert("Added to cart 🛒");
}

// ---------------- LOAD CART ----------------
function loadCart() {
    const cartContainer = document.getElementById("cart-items");
    const totalEl = document.getElementById("cart-total");

    if (!cartContainer) return;

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    cartContainer.innerHTML = "";

    let total = 0;

    cart.forEach(item => {
        total += item.price * item.quantity;

        const div = document.createElement("div");
        div.className = "bg-white p-4 rounded shadow flex justify-between items-center";

        div.innerHTML = `
            <div>
                <h3 class="font-bold">${item.name}</h3>
                <p class="text-sm text-gray-500">Qty: ${item.quantity}</p>
            </div>

            <div class="text-right">
                <p class="text-green-600 font-bold">$${item.price * item.quantity}</p>
                <button onclick="removeFromCart(${item.id})"
                    class="text-red-500 text-sm hover:underline mt-1">
                    Remove
                </button>
            </div>
        `;

        cartContainer.appendChild(div);
    });

    totalEl.textContent = `$${total}`;
}


// ---------------- REMOVE ITEM ----------------
function removeFromCart(id) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    cart = cart.filter(item => item.id !== id);

    localStorage.setItem("cart", JSON.stringify(cart));

    loadCart(); // refresh UI
}

