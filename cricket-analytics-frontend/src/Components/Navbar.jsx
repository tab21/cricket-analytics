import React, { useState } from "react";

const Navbar = ({ onSearch }) => {
  const [query, setQuery] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <nav
      style={{
        padding: "20px",
        background: "linear-gradient(90deg, #ff7e5f, #feb47b)",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
        backdropFilter: "blur(10px)",
        borderRadius: "10px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        margin: "20px auto",
        maxWidth: "600px",
      }}
    >
      <form
        onSubmit={handleSearch}
        style={{
          display: "flex",
          alignItems: "center",
          width: "100%",
          gap: "10px",
        }}
      >
        <input
          type="text"
          placeholder="Search Player..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{
            flex: 1,
            padding: "10px 15px",
            borderRadius: "30px",
            border: "none",
            outline: "none",
            fontSize: "16px",
            color: "#333",
            background: "rgba(255, 255, 255, 0.8)",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          }}
        />
        <button
          type="submit"
          style={{
            padding: "10px 25px",
            borderRadius: "30px",
            border: "none",
            fontSize: "16px",
            fontWeight: "bold",
            background: "linear-gradient(45deg, #6a11cb, #2575fc)",
            color: "white",
            cursor: "pointer",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          }}
        >
          Go
        </button>
      </form>
    </nav>
  );
};

export default Navbar;
