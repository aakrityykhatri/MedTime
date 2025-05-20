import { useContext, useState } from "react"
import { assets } from "../../assets/assets"
import { AdminContext } from "../../context/AdminContext"
import { toast } from 'react-toastify'
import axios from 'axios'

const AddPharmacy = () => {
    const [pharmacyImg, setPharmacyImg] = useState(false)
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [license, setLicense] = useState('')
    const [phone, setPhone] = useState('')
    const [about, setAbout] = useState('')
    const [address1, setAddress1] = useState('')
    const [address2, setAddress2] = useState('')

    const { backendUrl, aToken } = useContext(AdminContext)

    const onSubmitHandler = async (event) => {
        event.preventDefault()

        try {
            if (!pharmacyImg) {
                return toast.error('Image Not Selected')
            }

            const formData = new FormData()

            formData.append('image', pharmacyImg)
            formData.append('name', name)
            formData.append('email', email)
            formData.append('password', password)
            formData.append('license', license)
            formData.append('phone', phone)
            formData.append('about', about)
            formData.append('address', JSON.stringify({line1: address1, line2: address2}))

            // Log formData contents for debugging
            for (let pair of formData.entries()) {
                console.log(pair[0] + ': ' + pair[1])
            }

            const {data} = await axios.post(
                backendUrl + '/api/admin/add-pharmacy',
                formData,
                {
                    headers: {
                        aToken,
                        'Content-Type': 'multipart/form-data'
                    }
                }
            )
            
            if (data.success) {
                toast.success(data.message)
                // Reset form
                setPharmacyImg(false)
                setName('')
                setEmail('')
                setPassword('')
                setLicense('')
                setPhone('')
                setAbout('')
                setAddress1('')
                setAddress2('')
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    return (
        <form onSubmit={onSubmitHandler} className="m-5 w-full">
            <p className="mb-3 text-lg font-medium">Add Pharmacy</p>

            <div className="bg-white px-8 py-8 border rounded-w-full max-w-4xl max-h-[80vh] overflow-y-scroll">
                <div className="flex items-center gap-4 mb-8 text-gray-500">
                    <label htmlFor="pharmacy-img">
                        <img 
                            className="w-16 bg-gray-100 rounded-full cursor-pointer" 
                            src={pharmacyImg ? URL.createObjectURL(pharmacyImg) : assets.upload_area} 
                            alt="" 
                        />
                    </label>
                    <input 
                        onChange={(e)=>setPharmacyImg(e.target.files[0])} 
                        type="file" 
                        id="pharmacy-img" 
                        hidden 
                    />
                    <p>Upload pharmacy picture</p>
                </div>

                <div className="flex flex-col lg:flex-row items-start gap-10 text-gray-600">
                    <div className="w-full lg:flex-1 flex flex-col gap-4">
                        {/* Basic Info */}
                        <div className="flex-1 flex flex-col gap-1">
                            <p>Pharmacy Name</p>
                            <input 
                                onChange={(e)=> setName(e.target.value)} 
                                value={name} 
                                className="border rounded px-3 py-2" 
                                type="text" 
                                placeholder="Name" 
                                required 
                            />
                        </div>

                        <div className="flex-1 flex flex-col gap-1">
                            <p>Email</p>
                            <input 
                                onChange={(e)=> setEmail(e.target.value)} 
                                value={email} 
                                className="border rounded px-3 py-2" 
                                type="email" 
                                placeholder="Email" 
                                required 
                            />
                        </div>

                        <div className="flex-1 flex flex-col gap-1">
                            <p>Password</p>
                            <input 
                                onChange={(e)=> setPassword(e.target.value)} 
                                value={password} 
                                className="border rounded px-3 py-2" 
                                type="password" 
                                placeholder="Password" 
                                required 
                            />
                        </div>

                        <div className="flex-1 flex flex-col gap-1">
                            <p>License Number</p>
                            <input 
                                onChange={(e)=> setLicense(e.target.value)} 
                                value={license} 
                                className="border rounded px-3 py-2" 
                                type="text" 
                                placeholder="License Number" 
                                required 
                            />
                        </div>

                        <div className="flex-1 flex flex-col gap-1">
                            <p>Phone</p>
                            <input 
                                onChange={(e)=> setPhone(e.target.value)} 
                                value={phone} 
                                className="border rounded px-3 py-2" 
                                type="text" 
                                placeholder="Phone Number" 
                                required 
                            />
                        </div>
                    </div>

                    <div className="w-full lg:flex-1 flex flex-col gap-4">
                        {/* Address */}
                        <div className="flex-1 flex flex-col gap-1">
                            <p>Address</p>
                            <input 
                                onChange={(e)=> setAddress1(e.target.value)} 
                                value={address1} 
                                className="border rounded px-3 py-2" 
                                type="text" 
                                placeholder="Address Line 1" 
                                required 
                            />
                            <input 
                                onChange={(e)=> setAddress2(e.target.value)} 
                                value={address2} 
                                className="border rounded px-3 py-2" 
                                type="text" 
                                placeholder="Address Line 2" 
                                required 
                            />
                        </div>

                        {/* About */}
                        <div>
                            <p className="mb-2">About Pharmacy</p>
                            <textarea 
                                onChange={(e)=> setAbout(e.target.value)} 
                                value={about} 
                                className="w-full px-4 pt-2 border rounded" 
                                placeholder="Write about pharmacy" 
                                rows={5} 
                                required 
                            />
                        </div>
                    </div>
                </div>

                <button type="submit" className="bg-primary px-10 py-3 mt-4 text-white rounded-full">
                    Add Pharmacy
                </button>
            </div>
        </form>
    )
}

export default AddPharmacy
