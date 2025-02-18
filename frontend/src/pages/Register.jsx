const Register = () => {
    return (
      <div className="flex justify-center items-center">
        <div className="bg-white shadow-md p-6 rounded-lg md:w-1/2 lg:w-1/3">
          <h2 className="text-xl font-bold mb-4">Register</h2>
          <input type="text" placeholder="Nama" className="border p-2 w-full mb-3" />
          <input type="email" placeholder="Email" className="border p-2 w-full mb-3" />
          <input type="password" placeholder="Password" className="border p-2 w-full mb-3" />
          <button className="bg-blue-900 text-white p-2 w-full">Register</button>
        </div>
      </div>
    );
  };
  
  export default Register;
  