import { parkingSpots } from "./data.js";
import { renderParkingInfo, renderSlots } from "./ui.js";
import { bookSlot } from "./booking.js";

let bookings = [];

async function loadBookings() {
    try {
        const res = await fetch("./bookings.json");
        bookings = await res.json();
        // Применяем брони к парковкам
        bookings.forEach(b => {
            const spot = parkingSpots.find(s => s.id === b.spotId);
            if (!spot) return;
            const slot = spot.slots.find(s => s.id === b.slotId);
            if (!slot) return;
            slot.free = false;
            slot.booking = b;
        });
    } catch(e) {
        console.error("Could not load bookings.json", e);
    }
}

await loadBookings();

/* ================= MAP ================= */

let map = L.map("map").setView([40.18, 44.51], 13);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap"
}).addTo(map);

/* ================= STATE ================= */

let selectedSpot = null;
let selectedSlot = null;

/* ================= MARKERS ================= */

parkingSpots.forEach(spot => {
    L.marker(spot.coords)
        .addTo(map)
        .bindPopup(spot.name)
        .on("click", () => selectSpot(spot));
});

/* ================= INITIAL UI ================= */

renderParkingInfo(parkingSpots, selectSpot);

/* ================= FUNCTIONS ================= */

function selectSpot(spot) {
    selectedSpot = spot;
    selectedSlot = null;
    renderSlots(spot, slot => {
        selectedSlot = slot;
        enableForm();
    });
}

function enableForm() {
    ["name","model","plate","arrival","leaving","bookBtn"]
        .forEach(id => document.getElementById(id).disabled = false);
}

/* ================= BOOKING ================= */

document.getElementById("bookBtn").onclick = () => {
    if (!selectedSlot) {
        alert("Please select a free slot");
        return;
    }

    const data = {
        name: document.getElementById("name").value.trim(),
        model: document.getElementById("model").value.trim(),
        plate: document.getElementById("plate").value.trim(),
        arrival: document.getElementById("arrival").value,
        leaving: document.getElementById("leaving").value
    };

    const newBooking = bookSlot(selectedSlot, data);

    if (newBooking) {
        bookings.push({
            ...newBooking,
            spotId: selectedSpot.id,
            slotId: selectedSlot.id
        });
        renderSlots(selectedSpot, slot => selectedSlot = slot);
        renderParkingInfo(parkingSpots, selectSpot);
    }
};

/* ================= SEARCH BY CODE ================= */

document.getElementById("lookupBtn").onclick = () => {
    const code = document.getElementById("lookupCode").value.trim().toUpperCase();
    const result = document.getElementById("lookupResult");
    result.innerHTML = "";

    if (!code) {
        result.textContent = "Please enter booking code";
        return;
    }

    const found = bookings.find(b => b.code === code);

    if (!found) {
        result.innerHTML = `<p class="error">Booking not found</p>`;
        return;
    }

    result.innerHTML = `
        <div class="booking-result">
            <h4>Booking Found ✅</h4>
            <p><b>Name:</b> ${found.name}</p>
            <p><b>Car:</b> ${found.model}</p>
            <p><b>Plate:</b> ${found.plate}</p>
            <p><b>Parking:</b> ${parkingSpots.find(s => s.id === found.spotId).name}</p>
            <p><b>Slot:</b> #${found.slotId}</p>
            <p><b>Arrival:</b> ${new Date(found.arrival).toLocaleString()}</p>
            <p><b>Leaving:</b> ${new Date(found.leaving).toLocaleString()}</p>
        </div>
    `;
};
