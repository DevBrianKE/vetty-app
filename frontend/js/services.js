// URL for  backend services API
const API_URL = "http://127.0.0.1:5000/services";

// ---------------- LOAD ALL SERVICES ----------------
async function loadServices() {
    const serviceList = document.getElementById("service-list");
    if (!serviceList) return;

    try {
        // Fetch services from backend API
        const res = await fetch(API_URL);
        const services = await res.json();

        serviceList.innerHTML = "";

        services.forEach(service => {
            const div = document.createElement("div");
            div.className = "bg-white p-6 rounded-lg shadow hover:shadow-lg transition";

            div.innerHTML = `
                <h3 class="text-lg font-bold mb-2">${service.name}</h3>
                <p class="text-gray-600 mb-4">${service.description}</p>

                <button onclick="bookService(${service.id})"
                    class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-500 transition">
                    Book
                </button>
            `;

            serviceList.appendChild(div);
        });

    } catch (err) {
        console.error("Error loading services:", err);
        // fallback: show some default services if backend fails
        showFallbackServices();
    }
}

// ---------------- BOOK SERVICE ----------------
function bookService(id) {
    // redirect to booking page with service id as query param
    window.location.href = `book-service.html?id=${id}`;
}

// ---------------- FALLBACK STATIC SERVICES ----------------
function showFallbackServices() {
    const serviceList = document.getElementById("service-list");
    const fallbackServices = [
        { id: 1, name: "Grooming", description: "Professional grooming services for your pet" },
        { id: 2, name: "Vaccination", description: "Professional vaccination services for your pet" },
        { id: 3, name: "Health Checkup", description: "Regular health examinations and diagnostics" },
        { id: 4, name: "Dental Care", description: "Comprehensive dental cleaning and care" },
        { id: 5, name: "Emergency Care", description: "24/7 emergency veterinary services" },
        { id: 6, name: "Training", description: "Behavioral and obedience training sessions" },
        { id: 7, name: "Pet Sitting", description: "In-home care for your pets while you’re away" },
    ];

    serviceList.innerHTML = "";

    fallbackServices.forEach(service => {
        const div = document.createElement("div");
        div.className = "bg-white p-6 rounded-lg shadow hover:shadow-lg transition";

        div.innerHTML = `
            <h3 class="text-lg font-bold mb-2">${service.name}</h3>
            <p class="text-gray-600 mb-4">${service.description}</p>

            <button onclick="bookService(${service.id})"
                class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-500 transition">
                Book
            </button>
        `;

        serviceList.appendChild(div);
    });
}

// Load services on page load
loadServices();
