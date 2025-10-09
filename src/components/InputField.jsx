// src/components/InputField.jsx
import React from "react";
import Select from "react-select"; // Import react-select

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
    control: (provided) => ({
      ...provided,
      minHeight: "44px",
      border: "1px solid #cbd5e1",
      borderRadius: "0.5rem",
      paddingLeft: "2.25rem",
      boxShadow: "none",
      "&:hover": {
        borderColor: "#94a3b8",
      },
    }),
    valueContainer: (provided) => ({
      ...provided,
      padding: "0 4px",
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "#94a3b8",
    }),
  };

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
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 z-10"
          size={18}
        />
        <Select
          options={options}
          styles={customStyles}
          placeholder={`Pilih ${label}...`}
          {...props}
        />
      </div>
    </div>
  );
};
