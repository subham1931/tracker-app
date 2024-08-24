const socket = io();

if (navigator.geolocation) {
    navigator.geolocation.watchPosition((position) => {
        const { latitude, longitude, accuracy } = position.coords;
        console.log('Latitude:', latitude, 'Longitude:', longitude, 'Accuracy:', accuracy);
        socket.emit('send-location', { latitude, longitude });
    },
        (error) => {
            console.error(error);
        }, {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 0,
    });
}

const map = L.map("map").setView([0, 0], 10)

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "OpenStreetMap"
}).addTo(map)

const markers = {}

socket.on("recive-location", (data) => {
    const { id, latitude, longitude } = data;
    map.setView([latitude, longitude], 14);
    if (markers[id]) {
        markers[id].setLatLng([latitude, longitude]);
    } else {
        markers[id] = L.marker([latitude, longitude]).addTo(map);
    }
});

socket.on("user-disconnected", (id) => {
    if(markers[id]){
        markers[id].removeFrom(map);
        delete markers[id];
    }
});