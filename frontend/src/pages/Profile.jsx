import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { logout } from "../utils/auth";

const Profile = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/user/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(res.data);
      } catch (error) {
        console.error("Gagal ambil data profile:", error);
      }
    };

    fetchProfile();
  }, []);

  const handleUpdateProfile = () => {
    navigate("/update-profile");
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Profile User</h2>
      {user ? (
        <div>
          <p className="mb-2">
            <strong>Nama:</strong> {user.name}
          </p>
          <p className="mb-2">
            <strong>Email:</strong> {user.email}
          </p>
          <div className="flex gap-2 mt-4">
            <button
              onClick={handleUpdateProfile}
              className="bg-blue-900 text-white px-3 py-1 rounded hover:bg-blue-950"
            >
              Update Profile
            </button>
            <button
              onClick={logout}
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Profile;

// import React, { useEffect, useState } from "react";
// import axios from "axios";

// const Profile = () => {
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         const res = await axios.get("http://localhost:5000/api/user/profile", {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         setUser(res.data);
//       } catch (error) {
//         console.error("Gagal ambil data profile:", error);
//       }
//     };

//     fetchProfile();
//   }, []);

//   return (
//     <div className="max-w-md mx-auto p-6">
//       <h2 className="text-2xl font-bold mb-4">Profile Kamu</h2>
//       {user ? (
//         <div>
//           <p className="mb-2">
//             <strong>Nama:</strong> {user.name}
//           </p>
//           <p className="mb-2">
//             <strong>Email:</strong> {user.email}
//           </p>
//         </div>
//       ) : (
//         <p>Loading...</p>
//       )}
//     </div>
//   );
// };

// export default Profile;



