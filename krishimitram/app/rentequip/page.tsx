"use client"
import React, { useEffect, useState } from "react"
import Storescard from "@/components/ui/storescard"
import Navigation from "@/components/navigation"
import EquipmentForm from "@/components/rentequipment"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, MessageCircle, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface GeoLocation {
    lat: number
    lng: number
}

interface Equipment {
    _id: string
    equipmentName: string
    type: string
    rate: {
        amount: number
        unit: string
    }
    status: string
    distance?: number
    contact?: string
    geolocation: GeoLocation
    ownerName: string
    ownerId: string
}

const SearchRentEquipPage: React.FC = () => {
    const [search, setSearch] = useState<string>("")
    const [type, setType] = useState<string>("")
    const [equipmentList, setEquipmentList] = useState<Equipment[]>([])
    const [geolocation, setGeolocation] = useState<GeoLocation | null>(null)
    const [viewForm, setViewForm] = useState(false);
    const [selectedEquip, setSelectedEquip] = useState<Equipment | null>(null)

    // Get user's geolocation
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    setGeolocation({
                        lat: pos.coords.latitude,
                        lng: pos.coords.longitude,
                    })
                },
                (err) => {
                    console.error("Geolocation error:", err)
                }
            )
        }
    }, [])

    const handleSearch = async () => {
        try {
            const body = { search, type, geolocation }

            const res = await fetch("https://krishimitram-server.onrender.com/api/rentequipment/search", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            })

            if (!res.ok) {
                throw new Error("Failed to fetch equipment")
            }

            const data: Equipment[] = await res.json()
            setEquipmentList(data)
            console.log(data);

        } catch (err) {
            console.error(err)
        }
    }

    useEffect(() => {
        if (geolocation) {
            handleSearch() // fetch initially after we have geolocation
        }
    }, [geolocation])

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-card/20 to-secondary/10">
            <Navigation />
            <section className="pt-24 pb-12">
                <div className="min-h-screen">
                    <h1 className="text-3xl font-bold text-green-800 mb-6 text-center">
                        🚜 Search Equipment
                    </h1>

                    {/* Search Filters */}
                    <div className="flex flex-wrap gap-4 justify-center mb-10">
                        <button
                            onClick={() => setViewForm(true)}
                            className="px-6 py-2 bg-green-600 text-white font-medium rounded-lg shadow-md hover:bg-green-700 transition duration-200"
                        >
                            Rent Your Equipment
                        </button>

                        {/* Search by name */}
                        <input
                            type="text"
                            placeholder="Search by equipment name..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="border-2 px-2 rounded-lg border-green-400 focus:border-green-600 focus:ring-green-600 w-60"
                        />

                        {/* Dropdown for type */}
                        <select
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            className="border-2 px-2 rounded-lg border-green-400 focus:border-green-600 focus:ring-green-600 w-60"
                        >
                            <option value="">All Types</option>
                            <option value="Tractor">Tractor</option>
                            <option value="Seeder">Seeder</option>
                            <option value="Harvester">Harvester</option>
                            <option value="Cultivator">Cultivator</option>
                            <option value="Plower">Plower</option>
                            <option value="Disk Harrow">Disk Harrow</option>
                        </select>

                        {/* Search button */}
                        <button
                            onClick={handleSearch}
                            className="px-6 py-2 bg-green-600 text-white font-medium rounded-lg shadow-md hover:bg-green-700 transition duration-200"
                        >
                            Search
                        </button>
                    </div>

                    {viewForm && <EquipmentForm />}
                    {/* Equipment Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
                        {equipmentList.map((equip, index) => (
                            <Card key={index} className="h-full border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg group">
                                <div className="aspect-video relative overflow-hidden">
                                    <img
                                        src={"/placeholder.svg"}
                                        alt={equip.type}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                </div>
                                <CardHeader className="pb-2">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-1">
                                        </div>
                                    </div>
                                    <CardTitle className="text-2xl font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2 cursor-pointer">
                                        {equip.equipmentName}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    <div className="flex items-center justify-between text-muted-foreground">
                                        <div className="flex items-center">
                                            <MapPin className="h-3 w-3 mr-1" />
                                            {`${equip.geolocation.lat},${equip.geolocation.lng}`}
                                        </div>
                                    </div>
                                    <Button
                                        size="sm"
                                        className="w-full bg-primary hover:bg-primary/90"
                                        onClick={() => setSelectedEquip(equip)}
                                    >
                                        View Details
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>
            {selectedEquip && (
                <Dialog open={!!selectedEquip} onOpenChange={() => setSelectedEquip(null)}>
                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle className="text-2xl">{selectedEquip.type}</DialogTitle>
                            <DialogDescription className="text-lg">
                                {selectedEquip.equipmentName}
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div>
                                <img
                                    src={"/placeholder.svg"}
                                    alt={selectedEquip.type}
                                    className="w-full aspect-video object-cover rounded-lg"
                                />
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <h3 className="font-semibold mb-2">Status</h3>
                                    <p className="text-muted-foreground">{selectedEquip.status}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <h4 className="font-medium mb-1">Category</h4>
                                        {selectedEquip.type}
                                    </div>
                                    <div>
                                        <h4 className="font-medium mb-1">Location</h4>
                                        <div className="flex items-center text-muted-foreground">
                                            <MapPin className="h-4 w-4 mr-1" />
                                            {`${selectedEquip.geolocation.lat},${selectedEquip.geolocation.lng}`}
                                        </div>
                                    </div>
                                </div>
                                <div className="border-t pt-4">
                                    <h3 className="font-semibold mb-2">Seller Information</h3>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="font-medium">{selectedEquip.ownerName}</div>
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
    )
}

export default SearchRentEquipPage
