const ImageUpload = ({ onImageChange, error }) => (
  <div className="mb-4">
    <label className="block text-gray-700 text-sm font-medium mb-1">
      Upload Profile Picture
    </label>
    <input
      type="file"
      onChange={onImageChange}
      className="w-full p-3 border border-gray-300 rounded-lg"
    />
    {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
  </div>
);

export default ImageUpload;
