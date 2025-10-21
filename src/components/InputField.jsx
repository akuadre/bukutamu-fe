// src/components/InputField.jsx
import React from "react";
import Select from "react-select";

// Komponen untuk Input Teks dan Textarea
export const InputField = ({ icon, label, ...props }) => {
  const Icon = icon;
  const isTextarea = props.type === "textarea";
  const InputComponent = isTextarea ? "textarea" : "input";

  return (
    <div className="relative">
      <label
        htmlFor={props.id}
        className="block font-semibold text-slate-700 mb-1"
      >
        {label}
      </label>
      <div className="relative">
        <Icon
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          size={18}
        />
        <InputComponent
          {...props}
          className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
        />
      </div>
    </div>
  );
};

// Komponen untuk Dropdown (React Select)
export const SelectField = ({ icon, label, options, ...props }) => {
  const Icon = icon;

  // Style kustom untuk React Select agar mirip desain kita
  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      minHeight: "44px",
      border: "1px solid #cbd5e1",
      borderRadius: "0.5rem",
      paddingLeft: "2.25rem",
      boxShadow: state.isFocused ? "0 0 0 2px #0ea5e9" : "none",
      borderColor: state.isFocused ? "#0ea5e9" : "#cbd5e1",
      "&:hover": {
        borderColor: state.isFocused ? "#0ea5e9" : "#94a3b8",
      },
    }),
    valueContainer: (provided) => ({
      ...provided,
      padding: "0 8px",
    }),
    input: (provided) => ({
      ...provided,
      margin: 0,
      padding: 0,
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "#94a3b8",
    }),
    menu: (provided) => ({
      ...provided,
      borderRadius: "0.5rem",
      border: "1px solid #e2e8f0",
      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? "#0ea5e9" : state.isFocused ? "#f1f5f9" : "white",
      color: state.isSelected ? "white" : "#334155",
      "&:hover": {
        backgroundColor: "#f1f5f9",
      },
    }),
  };

  return (
    <div className="relative">
      <label className="block font-semibold text-slate-700 mb-1">
        {label}
      </label>
      <div className="relative">
        <Icon
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 z-10"
          size={18}
        />
        <Select
          options={options}
          styles={customStyles}
          placeholder={`Pilih ${label}...`}
          isSearchable={true}
          noOptionsMessage={({ inputValue }) => 
            inputValue ? "Tidak ada hasil ditemukan" : "Tidak ada opsi tersedia"
          }
          {...props}
        />
      </div>
    </div>
  );
};