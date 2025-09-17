import React from "react"

interface DropdownProps {
  options: string[]
  value: string
  onChange: (value: string) => void
}

const Dropdown: React.FC<DropdownProps> = ({ options, value, onChange }) => {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{
        padding: "10px 15px",
        borderRadius: "8px",
        border: "1px solid #ccc",
        fontSize: "16px",
      }}
    >
      {/* <option value="">Select</option> */}
      {options.map((opt, idx) => (
        <option key={idx} value={opt}>
          {opt.charAt(0).toUpperCase() + opt.slice(1).replace("_", " ")}
        </option>
      ))}
    </select>
  )
}

export default Dropdown
