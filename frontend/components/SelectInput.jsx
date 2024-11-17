const SelectInput = ({
  label,
  name,
  value,
  onChange,
  options,
  error,
  required,
}) => (
  <div className="mb-4 text-black">
    <label className="block text-gray-700 text-sm font-medium mb-1">
      {required === true ? `${label} *` : label}
    </label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      className="min-w-72 w-full p-3 border border-gray-300 bg-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
    >
      <option value="" disabled>
        Select {name.charAt(0).toUpperCase() + name.slice(1)}
      </option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
    {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
  </div>
);

export default SelectInput;
