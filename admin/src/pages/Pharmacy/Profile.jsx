import { useContext, useEffect, useState } from "react"
import { PharmacyContext } from "../../context/PharmacyContext"
import axios from "axios"
import { toast } from "react-toastify"
import { assets } from "../../assets/assets"

const PharmacyProfile = () => {
    const { profileData, getProfileData, pToken, backendUrl } = useContext(PharmacyContext)
    const [isEdit, setIsEdit] = useState(false)
    const [loading, setLoading] = useState(true) // Add loading state
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        address: {
            line1: '',
            line2: ''
        },
        license: '',
        about: ''
    })

    useEffect(() => {
        loadProfile()
    }, [])

    const loadProfile = async () => {
        try {
            await getProfileData()
            setLoading(false)
        } catch (error) {
            console.error("Error loading profile:", error)
            toast.error("Failed to load profile")
            setLoading(false)
        }
    }

    useEffect(() => {
        if (profileData) {
            setFormData({
                name: profileData.name || '',
                phone: profileData.phone || '',
                address: profileData.address || { line1: '', line2: '' },
                license: profileData.license || '',
                about: profileData.about || ''
            })
        }
    }, [profileData])

    const handleUpdate = async () => {
        try {
            const { data } = await axios.post(
                `${backendUrl}/api/pharmacy/update-profile`,
                formData,
                { headers: { ptoken: pToken } }
            )

            if (data.success) {
                toast.success("Profile updated successfully")
                setIsEdit(false)
                getProfileData()
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.error("Update error:", error)
            toast.error("Failed to update profile")
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading profile...</p>
                </div>
            </div>
        )
    }

    if (!profileData) {
        return (
            <div className="m-5 text-center text-gray-600">
                Failed to load profile data. Please try again later.
            </div>
        )
    }

    return (
        <div className="m-5 max-w-2xl">
            <div className="flex flex-col gap-4">
                <div>
                    <img 
                        className="w-36 h-36 rounded-lg object-cover bg-gray-100" 
                        src={profileData.image || assets.pharmacy_pic} 
                        alt="Pharmacy Profile"
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = assets.pharmacy_pic;
                        }}
                    />
                </div>

                <div className="flex-1 border border-gray-400 rounded-lg p-8 py-7 bg-white">
                    {/* Name */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Name</label>
                        {isEdit ? (
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                className="mt-1 block w-full rounded border-gray-300 shadow-sm p-2"
                            />
                        ) : (
                            <p className="mt-1 text-gray-900">{profileData.name}</p>
                        )}
                    </div>

                    {/* Email */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <p className="mt-1 text-gray-900">{profileData.email}</p>
                    </div>

                    {/* Phone */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Phone</label>
                        {isEdit ? (
                            <input
                                type="text"
                                value={formData.phone}
                                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                className="mt-1 block w-full rounded border-gray-300 shadow-sm p-2"
                            />
                        ) : (
                            <p className="mt-1 text-gray-900">{profileData.phone}</p>
                        )}
                    </div>

                    {/* License */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">License Number</label>
                        <p className="mt-1 text-gray-900">{profileData.license}</p>
                    </div>

                    {/* Address */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Address</label>
                        {isEdit ? (
                            <div className="space-y-2">
                                <input
                                    type="text"
                                    placeholder="Address Line 1"
                                    value={formData.address.line1}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        address: {...formData.address, line1: e.target.value}
                                    })}
                                    className="mt-1 block w-full rounded border-gray-300 shadow-sm p-2"
                                />
                                <input
                                    type="text"
                                    placeholder="Address Line 2"
                                    value={formData.address.line2}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        address: {...formData.address, line2: e.target.value}
                                    })}
                                    className="mt-1 block w-full rounded border-gray-300 shadow-sm p-2"
                                />
                            </div>
                        ) : (
                            <div className="mt-1 text-gray-900">
                                <p>{profileData.address?.line1}</p>
                                <p>{profileData.address?.line2}</p>
                            </div>
                        )}
                    </div>

                    {/* About */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">About</label>
                        {isEdit ? (
                            <textarea
                                value={formData.about}
                                onChange={(e) => setFormData({...formData, about: e.target.value})}
                                rows={4}
                                className="mt-1 block w-full rounded border-gray-300 shadow-sm p-2"
                            />
                        ) : (
                            <p className="mt-1 text-gray-900">{profileData.about}</p>
                        )}
                    </div>

                    <div className="mt-6">
                        {isEdit ? (
                            <div className="flex gap-4">
                                <button
                                    onClick={handleUpdate}
                                    className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90"
                                >
                                    Save Changes
                                </button>
                                <button
                                    onClick={() => setIsEdit(false)}
                                    className="border border-gray-300 px-4 py-2 rounded-md hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => setIsEdit(true)}
                                className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90"
                            >
                                Edit Profile
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PharmacyProfile
