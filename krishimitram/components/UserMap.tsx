"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useAuth } from '@/app/context/AuthContext'

// Custom marker icons
const centerIcon = new L.Icon({
    iconUrl: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
    iconSize: [40, 40],
});

const farmerIcon = new L.Icon({
    iconUrl: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
    iconSize: [35, 35],
});

const officerIcon = new L.Icon({
    iconUrl: "https://maps.google.com/mapfiles/ms/icons/green-dot.png",
    iconSize: [35, 35],
});

const buyerIcon = new L.Icon({
    iconUrl: "https://maps.google.com/mapfiles/ms/icons/yellow-dot.png",
    iconSize: [35, 35],
});

const storeOwnerIcon = new L.Icon({
    iconUrl: "https://maps.google.com/mapfiles/ms/icons/orange-dot.png",
    iconSize: [35, 35],
});

type User = {
    _id: string;
    name?: string;
    ownerName?: string;
    storeName?: string;
    company?: string;
    role: string;
    geolocation?: { lat: number; lng: number };
};

// ✅ Custom Legend Component
function MapLegend() {
    const map = useMap();

    useEffect(() => {
        const legend = L.control({ position: "bottomright" });

        legend.onAdd = () => {
            const div = L.DomUtil.create("div", "info legend");
            div.innerHTML = `
        <h4 style="margin:4px 0;font-size:14px;">Legend</h4>
        <div><img src="https://maps.google.com/mapfiles/ms/icons/red-dot.png" width="18" /> My Location</div>
        <div><img src="https://maps.google.com/mapfiles/ms/icons/blue-dot.png" width="18" /> Farmer</div>
        <div><img src="https://maps.google.com/mapfiles/ms/icons/green-dot.png" width="18" /> Officer</div>
        <div><img src="https://maps.google.com/mapfiles/ms/icons/yellow-dot.png" width="18" /> Buyer</div>
        <div><img src="https://maps.google.com/mapfiles/ms/icons/orange-dot.png" width="18" /> Storeowner</div>
      `;
            div.style.background = "white";
            div.style.padding = "6px";
            div.style.borderRadius = "6px";
            div.style.boxShadow = "0 0 6px rgba(0,0,0,0.3)";
            return div;
        };

        legend.addTo(map);

        return () => {
            legend.remove();
        };
    }, [map]);

    return null;
}

export default function UserMap() {
    const { user } = useAuth();
    console.log("81", user);


    const [users, setUsers] = useState<User[]>([]);
    const [lat, setLat] = useState<number | null>(null);
    const [lng, setLng] = useState<number | null>(null);

    // Get current location
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    setLat(pos?.coords.latitude);
                    setLng(pos?.coords.longitude);
                },
                (err) => {
                    console.error("Geolocation error:", err);
                },
                { enableHighAccuracy: true }
            );

        }
    },[]);

    // Fetch users
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await fetch("/api/users");
                const data = await res.json();
                setUsers(data);
                console.log(data);
                console.log("112", user);


            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };

        fetchUsers();
    }, []);

    const filterUser = users.filter((u) => u._id != user?.user?._id);
    console.log("124", filterUser);

    if (lat === null || lng === null) {
        return <div>Loading map...</div>;
    }

    return (
        <MapContainer
            center={[lat, lng]} // ✅ use actual geolocation as center
            zoom={15}
            style={{ height: "500px", width: "100%" }}
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/">OSM</a>'
            />

            {/* 🔵 Circle around your location */}
            <Circle
                center={[lat, lng]}
                radius={2000}
                pathOptions={{ color: "blue", fillColor: "blue", fillOpacity: 0.2 }}
            />

            {/* 🔴 My Location marker */}
            <Marker position={[lat, lng]} icon={centerIcon}>
                <Popup>
                    <b>My Location</b>
                </Popup>
            </Marker>

            {/* Other users */}
            {users
                .filter(
                    (u) =>
                        u.geolocation &&
                        u.geolocation.lat &&
                        u.geolocation.lng &&
                        u._id !== user?.user?._id // exclude yourself
                )
                .map((u) => {
                    let icon=farmerIcon;
                    switch (u.role.toLowerCase()) {
                        case "farmer":
                            icon = farmerIcon;
                            break;
                        case "officer":
                            icon = officerIcon;
                            break;
                        case "buyer":
                            icon = buyerIcon;
                            break;
                        case "storeowner":
                            icon = storeOwnerIcon;
                            break;
                        default:
                            icon = centerIcon;
                    }
                    return (
                        <Marker
                            key={u._id}
                            position={[u.geolocation.lat, u.geolocation.lng]}
                            icon={icon}
                        >
                            <Popup>
                                <b>{u.name || u.ownerName || u.storeName || "User"}</b>
                                <br />
                                Role: {u.role}
                            </Popup>
                        </Marker>
                    );
                })}
            <MapLegend />
        </MapContainer>

    );
}
