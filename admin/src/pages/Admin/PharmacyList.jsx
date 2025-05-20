import { useContext, useEffect } from "react"
import { AdminContext } from "../../context/AdminContext"

const PharmacyList = () => {
    const { pharmacies, aToken, getAllPharmacies, changePharmacyAvailability } = useContext(AdminContext)

    useEffect(() => {
        if (aToken) {
            getAllPharmacies()
        }
    }, [aToken])

    console.log("Pharmacies:", pharmacies) // Debug log

    return (
        <div className="m-5 max-h-[90vh] overflow-y-scroll">
            <h1 className="text-lg font-medium">All Pharmacies ({pharmacies?.length || 0})</h1>
            <div className="w-full flex flex-wrap gap-4 pt-5 gap-y-6">
                {pharmacies && pharmacies.map((item, index) => (
                    <div 
                        className="border border-indigo-200 rounded-xl max-w-56 overflow-hidden cursor-pointer group" 
                        key={index}
                    >
                        <img 
                            className="w-full h-48 object-cover bg-indigo-50 group-hover:bg-primary transition-all duration-500" 
                            src={item.image} 
                            alt={item.name} 
                        />
                        <div className="p-4">
                            <div className={`flex items-center gap-2 text-sm text-center ${item.available ? 'text-green-500' : 'text-gray-500'}`}>
                                <p className={`w-2 h-2 ${item.available ? 'bg-green-500' : 'bg-gray-500'} rounded-full`}></p>
                                <p>{item.available ? 'Available' : 'Not Available'}</p>
                            </div>
                            <p className="text-neutral-800 text-lg font-medium">{item.name}</p>
                            <p className="text-zinc-600 text-sm">License: {item.license}</p>
                            <p className="text-zinc-600 text-sm mt-1">{item.phone}</p>
                            <div className="mt-2 flex items-center gap-1 text-sm">
                                <input 
                                    onChange={() => changePharmacyAvailability(item._id)} 
                                    type="checkbox" 
                                    checked={item.available} 
                                />
                                <p>Toggle Availability</p>
                            </div>
                        </div>
                    </div>
                ))}
                {(!pharmacies || pharmacies.length === 0) && (
                    <p className="text-gray-500">No pharmacies found. Add some pharmacies to see them here.</p>
                )}
            </div>
        </div>
    )
}

export default PharmacyList
