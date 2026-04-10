// services.js

const serviceList = document.getElementById("service-list");
const featuredServices = document.getElementById("featured-services");

// Fetch all services from backend
fetch("http://127.0.0.1:5000/services")
    .then(res => res.json())
    .then(services => {
        if (!services.length) {
            if (serviceList) serviceList.innerHTML = "<p class='text-red-500'>No services available.</p>";
            if (featuredServices) featuredServices.innerHTML = "<p class='text-red-500'>No featured services.</p>";
            return;
        }

        services.forEach(service => {
            const card = document.createElement("div");
            card.className = "bg-white p-4 rounded-lg shadow";

            const imageUrl = service.image_url || "https://via.placeholder.com/300x200?text=No+Image";

            card.innerHTML = `
                <img src="${imageUrl}" alt="${service.name}" class="w-full h-40 object-cover rounded mb-2">
                <h3 class="font-bold text-lg mb-1">${service.name}</h3>
                <p class="text-gray-500 mb-2">${service.description}</p>
                <p class="text-green-600 font-semibold mb-2">$${service.price}</p>
                <button onclick="bookService(${service.id})" 
                    class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-500 transition">
                    Book Service
                </button>
            `;

            if (serviceList) serviceList.appendChild(card);

            // Featured services on homepage (limit 4)
            if (featuredServices && featuredServices.childElementCount < 4) {
                const featuredCard = card.cloneNode(true);
                featuredServices.appendChild(featuredCard);
            }
        });
    })
    .catch(err => {
        if (serviceList) serviceList.innerHTML = "<p class='text-red-500'>Failed to load services.</p>";
        if (featuredServices) featuredServices.innerHTML = "<p class='text-red-500'>Failed to load featured services.</p>";
    });

// Redirect to book-service page
function bookService(id) {
    window.location.href = `book-service.html?id=${id}`;
}
