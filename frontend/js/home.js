const PRODUCT_API = "http://127.0.0.1:5000/products";

// Example static services (replace with API if available)
const services = [
    { id: 1, name: "Grooming", description: "Professional grooming services for your pet" },
    { id: 2, name: "Vaccination", description: "Professional vaccination services for your pet" },
    { id: 3, name: "Health Checkup", description: "Regular health examinations and diagnostics" },
    { id: 4, name: "Dental Care", description: "Comprehensive dental cleaning and care" },
    { id: 5, name: "Emergency Care", description: "24/7 emergency veterinary services" },
];

// ---------------- FEATURED PRODUCTS ----------------
async function loadFeaturedProducts() {
    const container = document.getElementById("featured-products");
    container.innerHTML = "";

    try {
        const res = await fetch(PRODUCT_API);
        const products = await res.json();

        // Show only first 4
        products.slice(0, 4).forEach(product => {
            const div = document.createElement("div");
            div.className = "bg-white p-6 rounded-lg shadow hover:shadow-lg transition flex flex-col";
            const imageUrl = product.image_url || 'https://via.placeholder.com/300x200?text=No+Image';

            div.innerHTML = `
                <img src="${imageUrl}" class="w-full h-40 object-cover rounded mb-2">
                <h3 class="text-lg font-bold mb-2">${product.name}</h3>
                <p class="text-gray-600 mb-4">${product.description}</p>
                <p class="text-green-600 font-semibold mb-4">$${product.price}</p>
                <div class="flex justify-between mt-auto">
                    <button onclick="addToCart(${product.id}, '${product.name}', ${product.price})"
                        class="bg-green-600 text-white px-3 py-2 rounded hover:bg-green-500">Add</button>
                    <a href="pages/product-detail.html?id=${product.id}" class="text-blue-600 hover:underline">View</a>
                </div>
            `;
            container.appendChild(div);
        });
    } catch (err) {
        console.error(err);
    }
}

// ---------------- FEATURED SERVICES ----------------
function loadFeaturedServices() {
    const container = document.getElementById("featured-services");
    container.innerHTML = "";

    // Show only first 3 services
    services.slice(0, 3).forEach(service => {
        const div = document.createElement("div");
        div.className = "bg-white p-6 rounded-lg shadow hover:shadow-lg transition";
        div.innerHTML = `
            <h3 class="text-lg font-bold mb-2">${service.name}</h3>
            <p class="text-gray-600 mb-4">${service.description}</p>
            <button class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-500 transition">Book</button>
        `;
        container.appendChild(div);
    });
}

// Load featured items
loadFeaturedProducts();
loadFeaturedServices();

// Add to cart function
function addToCart(id, name, price) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existing = cart.find(item => item.id === id);

    if (existing) existing.quantity += 1;
    else cart.push({ id, name, price, quantity: 1 });

    localStorage.setItem("cart", JSON.stringify(cart));
    alert("Added to cart 🛒");
}
