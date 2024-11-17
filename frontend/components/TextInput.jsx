const TextInput = ({
  label,
  name,
  value,
  onChange,
  error,
  type = 'text',
  required,
  placeholder = '',
}) => (
  <div className="mb-4 text-black">
    <label className="block text-gray-700 text-sm font-medium mb-1">
      {required === true ? `${label} *` : label}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="min-w-72 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-black"
    />
    {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
  </div>
);

export default TextInput;
