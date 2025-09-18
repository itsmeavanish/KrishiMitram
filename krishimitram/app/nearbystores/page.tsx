"use client";
import React, { useState, useEffect } from "react";
import { Input } from "../../components/ui/input";
import Dropdown from "../../components/ui/dropdown";
import Storescard from "../../components/ui/storescard";
import Navigation from "@/components/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge, MapPin, MessageCircle, Phone, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";


// Store type definition
interface Store {
    _id: string;
    storeName: string;
    storetype: string;
    storesize: string;
    distance: number;
    contact: string;
    GSTno: string;
    address: string;
    geolocation: {
        lat: number;
        lng: number;
    };
    ownerName: string;
    role: string;
}


// User location type
interface UserLocation {
    lat: number | null;
    lng: number | null;
}

const StorePage: React.FC = () => {
    const [storeType, setStoreType] = useState<string>("pesticide fertilizer store");
    const [search, setSearch] = useState<string>("");
    const [stores, setStores] = useState<Store[]>([]);
    const [userLocation, setUserLocation] = useState<UserLocation>({
        lat: null,
        lng: null,
    });
    const [selectedStore, setSelectedStore] = useState<Store | null>(null)
    const storeTypes: string[] = ["pesticide fertilizer store", "equipment store"];

    // Get user geolocation
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position: GeolocationPosition) => {
                    setUserLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    });
                },
                (err: GeolocationPositionError) => {
                    console.error("Geolocation error:", err);
                }
            );
        } else {
            console.error("Geolocation not supported");
        }
    }, []);

    const handleSearch = async () => {
        if (!userLocation.lat || !userLocation.lng) {
            alert("Unable to get your location.");
            return;
        }

        try {
            console.log({
                search,
                storeType,
                geolocation: userLocation,
            });

            const response = await fetch("https://krishimitram-server.onrender.com/api/stores/search", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    search,
                    storeType,
                    geolocation: userLocation,
                }),
            });

            if (!response.ok) throw new Error("Failed to fetch stores");
            const data: Store[] = await response.json();
            setStores(data);
            console.log(data);
        } catch (err) {
            console.error(err);
            alert("Error fetching stores.");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-card/20 to-secondary/10">
            <Navigation />
            <section className="pt-24 pb-12">
                <div className="min-h-screen">
                    <h1 className="text-5xl font-bold text-green-800 text-center mb-8">
                        🌿 Nearby Stores
                    </h1>

                    {/* Search section */}
                    <div className="flex flex-wrap gap-4 justify-center mb-10">

                        <Input
                            placeholder="Search store..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="border-green-400 focus:border-green-600 focus:ring-green-600 w-60"
                        />

                        <Dropdown
                            options={storeTypes}
                            value={storeType}
                            onChange={setStoreType}
                        />

                        <button
                            onClick={handleSearch}
                            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg shadow-md transition"
                        >
                            Search
                        </button>
                    </div>

                    {/* Stores Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
                        {stores.map((store, index) => (
                            <Card key={index} className="h-full border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg group">
                                <div className="aspect-video relative overflow-hidden">
                                    <img
                                        src={"/placeholder.svg"}
                                        alt={store.storetype}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                </div>
                                <CardHeader className="pb-2">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-1">
                                            {/* {getCategoryIcon(store.storetype)} */}
                                        </div>
                                    </div>
                                    <CardTitle className="text-2xl font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2 cursor-pointer">
                                        {store.storeName}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    <div className="flex items-center justify-between text-muted-foreground">
                                        <div className="flex items-center">
                                            <MapPin className="h-3 w-3 mr-1" />
                                            {store.address || "Location not available"}
                                        </div>
                                    </div>
                                    <Button
                                        size="sm"
                                        className="w-full bg-primary hover:bg-primary/90"
                                        onClick={() => setSelectedStore(store)}
                                    >
                                        View Details
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>
            {selectedStore && (
                <Dialog open={!!selectedStore} onOpenChange={() => setSelectedStore(null)}>
                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle className="text-2xl">{selectedStore.storeName}</DialogTitle>
                            <DialogDescription className="text-lg">
                                {selectedStore.distance} km
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div>
                                <img
                                    src={"/placeholder.svg"}
                                    alt={selectedStore.storeName}
                                    className="w-full aspect-video object-cover rounded-lg"
                                />
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <h3 className="font-semibold mb-2">Description</h3>
                                    <p className="text-muted-foreground">{selectedStore.storetype}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <h4 className="font-medium mb-1">Category</h4>
                                        {selectedStore.storetype}
                                    </div>
                                    <div>
                                        <h4 className="font-medium mb-1">Location</h4>
                                        <div className="flex items-center text-muted-foreground">
                                            <MapPin className="h-4 w-4 mr-1" />
                                            {selectedStore.address || "N/A"}
                                        </div>
                                    </div>
                                </div>
                                <div className="border-t pt-4">
                                    <h3 className="font-semibold mb-2">Seller Information</h3>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="font-medium">{selectedStore.ownerName}</div>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button className="bg-primary hover:bg-primary/90">
                                                <MessageCircle className="h-4 w-4 mr-2" />
                                                Chat
                                            </Button>
                                            <Button variant="outline">
                                                <Phone className="h-4 w-4 mr-2" />
                                                Call
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    );
};

export default StorePage;
