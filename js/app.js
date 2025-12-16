import { parkingSpots } from "./data.js";
import { renderParkingInfo, renderSlots } from "./ui.js";
import { bookSlot } from "./booking.js";

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

    bookSlot(selectedSlot, {
        name: name.value.trim(),
        model: model.value.trim(),
        plate: plate.value.trim(),
        arrival: arrival.value,
        leaving: leaving.value
    });

    renderSlots(selectedSpot, slot => selectedSlot = slot);
    renderParkingInfo(parkingSpots, selectSpot);
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

    let found = null;

    for (const spot of parkingSpots) {
        for (const slot of spot.slots) {
            if (slot.booking && slot.booking.code === code) {
                found = { spot, slot };
                break;
            }
        }
    }

    if (!found) {
        result.innerHTML = `<p class="error">Booking not found</p>`;
        return;
    }

    const b = found.slot.booking;

    result.innerHTML = `
        <div class="booking-result">
            <h4>Booking Found ✅</h4>
            <p><b>Name:</b> ${b.name}</p>
            <p><b>Car:</b> ${b.model}</p>
            <p><b>Plate:</b> ${b.plate}</p>
            <p><b>Parking:</b> ${found.spot.name}</p>
            <p><b>Slot:</b> #${found.slot.id}</p>
            <p><b>Arrival:</b> ${new Date(b.arrival).toLocaleString()}</p>
            <p><b>Leaving:</b> ${new Date(b.leaving).toLocaleString()}</p>
        </div>
    `;
};
