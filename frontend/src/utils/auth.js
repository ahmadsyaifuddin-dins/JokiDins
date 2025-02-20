export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "/login"; // Redirect ke halaman login
};

// export const getUser = () => {
//     return JSON.parse(localStorage.getItem("user"));
//   };
  
//   export const logout = () => {
//     localStorage.removeItem("user");
//     window.location.href = "/login";
//   };
  



