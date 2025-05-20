import { useContext, useState } from "react";
import { assets } from "../../assets/assets";
import { AdminContext } from "../../context/AdminContext";
import { toast } from "react-toastify";
import axios from "axios";

const AddNurse = () => {
    const [nurseImg, setNurseImg] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [department, setDepartment] = useState('Emergency');
    const [shift, setShift] = useState('morning');
    const [licenseNumber, setLicenseNumber] = useState('');
    const [specialization, setSpecialization] = useState('');
    const [experience, setExperience] = useState('1 Year');
    const [phone, setPhone] = useState('');
    const [address1, setAddress1] = useState('');
    const [address2, setAddress2] = useState('');

    const { backendUrl, aToken } = useContext(AdminContext);

    const onSubmitHandler = async (event) => {
        event.preventDefault();
    
        try {
            if (!nurseImg) {
                return toast.error('Image Not Selected');
            }
    
            const formData = new FormData();
    
            formData.append('image', nurseImg);
            formData.append('name', name);
            formData.append('email', email);
            formData.append('password', password);
            formData.append('department', department);
            formData.append('shift', shift);
            formData.append('licenseNumber', licenseNumber);
            // Add specialization to formData
            formData.append('specialization', department); // Using department as specialization
            formData.append('experience', experience);
            formData.append('phone', phone);
            formData.append('address', JSON.stringify({line1: address1, line2: address2}));
    
            const { data } = await axios.post(
                backendUrl + '/api/admin/add-nurse',
                formData,
                { headers: { aToken } }
            );
    
            if (data.success) {
                toast.success(data.message);
                // Reset form
                setNurseImg(false);
                setName('');
                setEmail('');
                setPassword('');
                setLicenseNumber('');
                setSpecialization('');
                setPhone('');
                setAddress1('');
                setAddress2('');
            } else {
                toast.error(data.message);
            }
    
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    };

    return (
        <form onSubmit={onSubmitHandler} className="m-5 w-full">
            <p className="mb-3 text-lg font-medium">Add Nurse</p>

            <div className="bg-white px-8 py-8 border rounded-w-full max-w-4xl max-h-[80vh] overflow-y-scroll">
                {/* Image Upload Section */}
                <div className="flex items-center gap-4 mb-8 text-gray-500">
                    <label htmlFor="nurse-img">
                        <img 
                            className="w-16 bg-gray-100 rounded-full cursor-pointer" 
                            src={nurseImg ? URL.createObjectURL(nurseImg) : assets.upload_area} 
                            alt="" 
                        />
                    </label>
                    <input 
                        onChange={(e) => setNurseImg(e.target.files[0])} 
                        type="file" 
                        id="nurse-img" 
                        hidden 
                    />
                    <p>Upload nurse picture</p>
                </div>

                {/* Form Fields */}
                <div className="flex flex-col lg:flex-row items-start gap-10 text-gray-600">
                    {/* Left Column */}
                    <div className="w-full lg:flex-1 flex flex-col gap-4">
                        <div className="flex-1 flex flex-col gap-1">
                            <p>Name</p>
                            <input 
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="border rounded px-3 py-2"
                                type="text"
                                required
                            />
                        </div>

                        <div className="flex-1 flex flex-col gap-1">
                            <p>Email</p>
                            <input 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="border rounded px-3 py-2"
                                type="email"
                                required
                            />
                        </div>

                        <div className="flex-1 flex flex-col gap-1">
                            <p>Password</p>
                            <input 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="border rounded px-3 py-2"
                                type="password"
                                required
                            />
                        </div>

                        <div className="flex-1 flex flex-col gap-1">
                            <p>Department</p>
                            <select 
                                value={department}
                                onChange={(e) => setDepartment(e.target.value)}
                                className="border rounded px-3 py-2"
                            >
                                <option value="Emergency">Emergency</option>
                                <option value="ICU">ICU</option>
                                <option value="OPD">OPD</option>
                                <option value="Pediatric">Pediatric</option>
                                <option value="General">General</option>
                            </select>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="w-full lg:flex-1 flex flex-col gap-4">
                        <div className="flex-1 flex flex-col gap-1">
                            <p>Shift</p>
                            <select 
                                value={shift}
                                onChange={(e) => setShift(e.target.value)}
                                className="border rounded px-3 py-2"
                            >
                                <option value="morning">Morning</option>
                                <option value="evening">Evening</option>
                                <option value="night">Night</option>
                            </select>
                        </div>

                        <div className="flex-1 flex flex-col gap-1">
                            <p>License Number</p>
                            <input 
                                value={licenseNumber}
                                onChange={(e) => setLicenseNumber(e.target.value)}
                                className="border rounded px-3 py-2"
                                type="text"
                                required
                            />
                        </div>

                        <div className="flex-1 flex flex-col gap-1">
                            <p>Experience</p>
                            <select 
                                value={experience}
                                onChange={(e) => setExperience(e.target.value)}
                                className="border rounded px-3 py-2"
                            >
                                {[1,2,3,4,5,6,7,8,9,10].map(year => (
                                    <option key={year} value={`${year} Year`}>{year} Year</option>
                                ))}
                            </select>
                        </div>

                        <div className="flex-1 flex flex-col gap-1">
                            <p>Phone</p>
                            <input 
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="border rounded px-3 py-2"
                                type="text"
                                required
                            />
                        </div>
                    </div>
                </div>

                {/* Address Section */}
                <div className="mt-4">
                    <p className="mb-2">Address</p>
                    <input 
                        value={address1}
                        onChange={(e) => setAddress1(e.target.value)}
                        className="w-full border rounded px-3 py-2 mb-2"
                        type="text"
                        placeholder="Address Line 1"
                        required
                    />
                    <input 
                        value={address2}
                        onChange={(e) => setAddress2(e.target.value)}
                        className="w-full border rounded px-3 py-2"
                        type="text"
                        placeholder="Address Line 2"
                        required
                    />
                </div>

                <button 
                    type="submit" 
                    className="bg-primary px-10 py-3 mt-6 text-white rounded-full"
                >
                    Add Nurse
                </button>
            </div>
        </form>
    );
};

export default AddNurse;
