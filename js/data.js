export const parkingSpots = [
    {
        id: 1,
        name: "South Parking",
        coords: [40.1772, 44.5035],
        slots: Array.from({ length: 10 }, (_, i) => ({
            id: i + 1,
            free: Math.random() > 0.4,
            booking: null
        }))
    },
    {
        id: 2,
        name: "North Parking",
        coords: [40.1855, 44.5152],
        slots: Array.from({ length: 10 }, (_, i) => ({
            id: i + 1,
            free: Math.random() > 0.3,
            booking: null
        }))
    }
];
