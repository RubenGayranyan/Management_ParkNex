export function timeLeft(end){
    const now = new Date();
    const e = new Date(end);
    let diff = e - now;
    if(diff<=0) return '0h 0m';
    const hours = Math.floor(diff/3600000);
    const minutes = Math.floor((diff%3600000)/60000);
    return `${hours}h ${minutes}m`;
}

export function distance(lat1, lon1, lat2, lon2){
    // Haversine formula
    const R = 6371e3;
    const φ1 = lat1*Math.PI/180;
    const φ2 = lat2*Math.PI/180;
    const Δφ = (lat2-lat1)*Math.PI/180;
    const Δλ = (lon2-lon1)*Math.PI/180;
    const a = Math.sin(Δφ/2)*Math.sin(Δφ/2)+Math.cos(φ1)*Math.cos(φ2)*Math.sin(Δλ/2)*Math.sin(Δλ/2);
    const c = 2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a));
    return R*c;
}
