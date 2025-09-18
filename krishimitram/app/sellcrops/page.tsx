"use client";
import React, { useState, useEffect } from "react";
import Storescard from "@/components/ui/storescard";
import Navigation from "@/components/navigation";
import StockedCropForm from "@/components/stokedcropform";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, MessageCircle, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface Buyer {
    _id: string;
    buyerId: string;
    buyerName: string;
    cropName: string;
    amount: number;
    price: number;
    distance: number;
    contact: string;
}

interface Location {
    lat: number;
    lng: number;
}


const SearchBuyersPage: React.FC = () => {
    const [cropName, setCropName] = useState<string>("");
    const [buyers, setBuyers] = useState<Buyer[]>([]);
    const [userLocation, setUserLocation] = useState<Location>({
        lat: null,
        lng: null,
    });
    const [loading, setLoading] = useState<boolean>(false);
    const [showForm, setShowForm] = useState(false);
    const [selectedBuyer, setSelectedBuyer] = useState<Buyer | null>(null)

    // Get farmer geolocation
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) =>
                    setUserLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    }),
                (err) => console.error("Geolocation error:", err)
            );
        } else {
            console.error("Geolocation not supported");
        }
    }, []);

    const handleSearch = async () => {
        if (!cropName) return alert("Enter crop name");
        if (!userLocation.lat || !userLocation.lng)
            return alert("Unable to get your location.");

        try {
            setLoading(true);
            const res = await fetch("https://krishimitram-server.onrender.com/api/buyers/search", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ cropName, geolocation: userLocation }),
            });

            if (!res.ok) throw new Error("Failed to fetch buyers");
            const data: Buyer[] = await res.json();

            setBuyers(data);
            console.log(data);

        } catch (err) {
            console.error(err);
            alert("Error fetching buyers");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-card/20 to-secondary/10">
            <Navigation />
            <section className="pt-24 pb-12">
                <div className="min-h-screen">
                    <h1 className="text-3xl font-bold mb-6 text-center text-green-800">
                        🌱 Search Buyers
                    </h1>

                    <div className="flex gap-4 mb-6 justify-center">
                        <button
                            onClick={() => setShowForm(true)}
                            className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg font-medium shadow-md transition-transform transform hover:scale-105"
                        >
                            + Register Crop for Sale
                        </button>
                        <input
                            type="text"
                            placeholder="Enter crop name..."
                            value={cropName}
                            onChange={(e) => setCropName(e.target.value)}
                            className="border border-green-400 p-2 rounded-lg w-64 focus:ring-2 focus:ring-green-500 focus:outline-none shadow-sm"
                        />
                        <button
                            onClick={handleSearch}
                            className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg font-medium shadow-md transition-transform transform hover:scale-105"
                        >
                            Search
                        </button>
                    </div>

                    {loading && <p className="text-center text-green-600">Loading buyers...</p>}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
                        {showForm && (
                            <div className="mt-6">
                                <StockedCropForm farmerId={"68c99bda2363389995d7dd85"} /> {/* pass real farmerId here */}
                            </div>
                        )}
                        {buyers.length === 0 && !loading && (
                            <p className="text-center text-gray-500 col-span-2">
                                No buyers found.
                            </p>
                        )}

                        {buyers.map((buyer, index) => (
                            <Card key={index} className="h-full border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg group">
                                <div className="aspect-video relative overflow-hidden">
                                    <img
                                        src={"/placeholder.svg"}
                                        alt={buyer.buyerName || buyer.cropName}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                </div>
                                <CardHeader className="pb-2">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-1">
                                        </div>
                                    </div>
                                    <CardTitle className="text-2xl font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2 cursor-pointer">
                                        {buyer.buyerName}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    <p>Crop : {buyer.cropName}</p>
                                    <p>Amount : {buyer.amount} kg</p>
                                    <p>Price : ₹{buyer.price}</p>
                                    <p>Contact : {buyer.contact}</p>
                                    <div className="flex items-center justify-between text-muted-foreground">
                                        <div className="flex items-center">
                                            <MapPin className="h-3 w-3 mr-1" />
                                            Distance : {buyer.distance}
                                        </div>
                                    </div>
                                    <Button
                                        size="sm"
                                        className="w-full bg-primary hover:bg-primary/90"
                                        onClick={() => setSelectedBuyer(buyer)}
                                    >
                                        View Details
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>
            {selectedBuyer && (
                <Dialog open={!!selectedBuyer} onOpenChange={() => setSelectedBuyer(null)}>
                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle className="text-2xl">{selectedBuyer.cropName}</DialogTitle>
                            <DialogDescription className="text-lg">
                                {selectedBuyer.buyerName}
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div>
                                <img
                                    src={"/placeholder.svg"}
                                    alt={selectedBuyer.buyerName || selectedBuyer.cropName}
                                    className="w-full aspect-video object-cover rounded-lg"
                                />
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <h3 className="font-semibold mb-2">Status</h3>
                                    <p className="text-muted-foreground">{selectedBuyer.amount} kg</p>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <h4 className="font-medium mb-1">Category</h4>
                                        {selectedBuyer.cropName}
                                    </div>
                                    <div>
                                        <h4 className="font-medium mb-1">Location</h4>
                                        <div className="flex items-center text-muted-foreground">
                                            <MapPin className="h-4 w-4 mr-1" />
                                            Distance: {selectedBuyer.distance} km
                                        </div>
                                    </div>
                                </div>
                                <div className="border-t pt-4">
                                    <h3 className="font-semibold mb-2">Seller Information</h3>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="font-medium">{selectedBuyer.buyerName}</div>
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

export default SearchBuyersPage;
