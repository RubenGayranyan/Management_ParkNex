export function renderParkingInfo(spots, onSelect) {
    const box = document.getElementById("parkingInfo");
    box.innerHTML = "";

    spots.forEach(spot => {
        const free = spot.slots.filter(s => s.free).length;

        const div = document.createElement("div");
        div.className = "parking-card";
        div.innerHTML = `
            <h2 class="spot_name">${spot.name}</h3>
            <b class="spotInfo_label">Total slots:</b> <span class="spotInfo_total">${spot.slots.length}</span><br>
            <b class="spotInfo_label">Available:</b> <span class="spotInfo_free">${free}</span>
        `;

        div.onclick = () => onSelect(spot);
        box.appendChild(div);
    });
}

export function renderSlots(spot, onSelectSlot) {
    const box = document.getElementById("slots");
    box.innerHTML = "";

    document.getElementById("parkingName").textContent = spot.name;

    spot.slots.forEach(slot => {
        const el = document.createElement("div");
        el.className = `slot ${slot.free ? "free" : "busy"}`;
        el.innerHTML = `#${slot.id}`;

        if (!slot.free && slot.booking) {
            const mins = Math.max(0,
                Math.floor((new Date(slot.booking.leaving) - new Date()) / 60000)
            );
            el.innerHTML += `<small>Free in ${mins} min</small>`;
        }

        if (slot.free) el.onclick = () => onSelectSlot(slot);

        box.appendChild(el);
    });
}
