export function renderParkingInfo(spots, onSelect) {
    const box = document.getElementById("parkingInfo");
    box.innerHTML = "";

    spots.forEach(spot => {
        const free = spot.slots.filter(s => s.free).length;

        const div = document.createElement("div");
        div.className = "parking-card";
        div.innerHTML = `
            <h3>${spot.name}</h3>
            <p>Total slots: ${spot.slots.length}</p>
            <p>Available: <b>${free}</b></p>
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
