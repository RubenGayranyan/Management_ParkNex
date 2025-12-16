export function bookSlot(slot, data) {
    const now = new Date();
    const arrival = new Date(data.arrival);
    const leaving = new Date(data.leaving);

    if (arrival < now) return alert("Arrival in past is forbidden");
    if (leaving - arrival < 3600000)
        return alert("Minimum booking is 1 hour");

    slot.free = false;
    slot.booking = {
        code: Math.random().toString(36).substr(2, 6).toUpperCase(),
        ...data
    };

    alert("Booking code: " + slot.booking.code);
}
