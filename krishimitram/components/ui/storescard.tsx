import React, { ReactNode } from "react"

interface CardProps {
  title: string
  description: string
  contact?: string
  footer?: ReactNode
  onClick?: () => void
}

const Storescard: React.FC<CardProps> = ({ title, description, contact, footer, onClick }) => {
  return (
    <div
      onClick={onClick}
      style={{
        padding: "20px",
        borderRadius: "12px",
        boxShadow: "0px 2px 8px rgba(0,0,0,0.1)",
        border: "1px solid #ddd",
        backgroundColor: "#fff",
        cursor: onClick ? "pointer" : "default",
        transition: "transform 0.2s",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
    >
      <h3 style={{ marginBottom: "10px", fontSize: "18px", fontWeight: 600 }}>
        {title}
      </h3>
      <p style={{ marginBottom: "10px", color: "#555" }}>{description}</p>
      {contact && (
        <p style={{ marginBottom: "10px", fontWeight: 500 }}>
          Contact: {contact}
        </p>
      )}
      {footer && <div style={{ marginTop: "10px" }}>{footer}</div>}
    </div>
  )
}

export default Storescard
