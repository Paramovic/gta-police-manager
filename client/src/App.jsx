import { useEffect, useState } from "react";
import logo from "./assets/logo.png";

function App() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/api/users")
      .then(res => res.json())
      .then(data => setUsers(Array.isArray(data) ? data : []))
      .catch(err => console.error(err));
  }, []);

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "Inter, sans-serif" }}>

      {/* SIDEBAR */}
      <div style={{
        width: "250px",
        backgroundColor: "#0f172a",
        color: "white",
        padding: "20px"
      }}>
        <h2 style={{ marginBottom: "30px" }}>SAPD</h2>

        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          <span style={{ cursor: "pointer" }}>Dashboard</span>
          <span style={{ cursor: "pointer" }}>Policías</span>
          <span style={{ cursor: "pointer" }}>Divisiones</span>
        </div>
      </div>

      {/* MAIN */}
      <div style={{ flex: 1, backgroundColor: "#f1f5f9" }}>

        {/* NAVBAR */}
        <div style={{
          backgroundColor: "white",
          padding: "15px 30px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid #e5e7eb"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <img src={logo} alt="SAPD" style={{ width: "40px" }} />
            <span style={{ fontWeight: "500" }}>San Andreas Police Department</span>
          </div>

          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            cursor: "pointer"
          }}>
            {/* Avatar */}
            <div style={{
              width: "35px",
              height: "35px",
              borderRadius: "50%",
              backgroundColor: "#1e293b",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "14px",
              fontWeight: "500"
            }}>
              AM
            </div>

            {/* Nombre */}
            <span style={{ fontWeight: "500" }}>
              Alberto Martinez
            </span>

            {/* Flecha */}
            <span style={{ fontSize: "12px" }}>
              ▼
            </span>
          </div>
        </div>

        {/* CONTENIDO */}
        <div style={{ padding: "30px" }}>
          <h2 style={{ marginBottom: "20px" }}>Policías</h2>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
            gap: "20px"
          }}>
            {users.map(user => (
              <div key={user._id} style={{
                backgroundColor: "white",
                padding: "20px",
                border: "1px solid #e5e7eb",
                boxShadow: "none"
              }}>
                <h3>{user.name}</h3>
                <p>Placa: {user.placa}</p>
                <p>Rango: {user.rank}</p>
                <p>{user.jurisdiccion}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

export default App;