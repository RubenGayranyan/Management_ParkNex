export function bookSlot(slot, data) {
    const now = new Date();
    const arrival = new Date(data.arrival);
    const leaving = new Date(data.leaving);

    if (arrival < now) {
        alert("Arrival cannot be in the past");
        return null;
    }

    if (leaving - arrival < 3600000) {
        alert("Minimum booking is 1 hour");
        return null;
    }

    if (!slot.free) {
        alert("Slot already booked!");
        return null;
    }

    const booking = {
        code: Math.random().toString(36).substr(2, 6).toUpperCase(),
        ...data
    };

    slot.free = false;
    slot.booking = booking;

    alert("Booking confirmed! Your code: " + booking.code);
    return booking;
}
