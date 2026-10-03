export default function AddMealForm({ formData, setFormData, onSubmit, fileInputRef }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md h-fit">
      <h2 className="text-xl font-semibold mb-4">Add New Meal</h2>
      <form onSubmit={onSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Meal Name (e.g. Tacos)"
          className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
        <textarea
          placeholder="Ingredients (comma separated: Beef, Tortillas, Cheese)"
          className="w-full p-2 border rounded h-24 focus:ring-2 focus:ring-blue-500 outline-none"
          value={formData.ingredients}
          onChange={(e) => setFormData({ ...formData, ingredients: e.target.value })}
          required
        />
        <div className="flex flex-col gap-2">
          <label className="text-sm text-gray-500">Upload Photo</label>
          <input
            ref={fileInputRef}
            type="file"
            className="text-sm"
            onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })}
          />
        </div>
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded font-semibold hover:bg-green-700 transition"
        >
          Save Meal
        </button>
      </form>
    </div>
  );
}
