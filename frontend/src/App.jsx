import React, { useState, useEffect } from "react";

const API_BASE = "/api";

function App() {
  const [meals, setMeals] = useState([]);
  const [plan, setPlan] = useState(null);
  const [view, setView] = useState("vault");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [formData, setFormData] = useState({
    name: "",
    ingredients: "",
    image: null,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMeals();
  }, []);

  const fetchMeals = async () => {
    const res = await fetch(`${API_BASE}/meals/`);
    const data = await res.json();
    setMeals(data);
  };

  const fetchPlan = async (date) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/generate-plan/?date_str=${date}`);
      const data = await res.json();
      setPlan(data);
    } catch (err) {
      console.error("Failed to fetch plan", err);
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("name", formData.name);
    data.append("ingredients", formData.ingredients);
    if (formData.image) data.append("image", formData.image);

    await fetch(`${API_BASE}/meals/`, { method: "POST", body: data });
    setFormData({ name: "", ingredients: "", image: null });
    fetchMeals();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8 font-sans">
      <header className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold text-gray-800">🍽️ Meal Planner</h1>
        <nav className="flex gap-2">
          <button
            onClick={() => setView("vault")}
            className={`px-4 py-2 rounded transition ${view === "vault" ? "bg-blue-600 text-white" : "bg-white text-gray-600 shadow-sm"}`}
          >
            The Vault
          </button>
          <button
            onClick={() => {
              setView("plan");
              fetchPlan(selectedDate);
            }}
            className={`px-4 py-2 rounded transition ${view === "plan" ? "bg-blue-600 text-white" : "bg-white text-gray-600 shadow-sm"}`}
          >
            📅 Plan Plan
          </button>
        </nav>
      </header>

      <main className="max-w-4xl mx-auto">
        {view === "vault" ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Add Meal Form */}
            <div className="bg-white p-6 rounded-xl shadow-md h-fit">
              <h2 className="text-xl font-semibold mb-4">Add New Meal</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  placeholder="Meal Name (e.g. Tacos)"
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
                <textarea
                  placeholder="Ingredients (comma separated: Beef, Tortillas, Cheese)"
                  className="w-full p-2 border rounded h-24 focus:ring-2 focus:ring-blue-500 outline-none"
                  value={formData.ingredients}
                  onChange={(e) =>
                    setFormData({ ...formData, ingredients: e.target.value })
                  }
                  required
                />
                <div className="flex flex-col gap-2">
                  <label className="text-sm text-gray-500">Upload Photo</label>
                  <input
                    type="file"
                    className="text-sm"
                    onChange={(e) =>
                      setFormData({ ...formData, image: e.target.files[0] })
                    }
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

            {/* Meal List */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Your Favorites</h2>
              <div className="grid grid-cols-1 gap-4">
                {meals.length === 0 && (
                  <p className="text-gray-500 italic">
                    No meals in the vault yet. Add some above!
                  </p>
                )}
                {meals.map((meal) => (
                  <div
                    key={meal.id}
                    className="bg-white p-4 rounded-xl shadow-sm flex gap-4 items-center transition hover:shadow-md"
                  >
                    {meal.image_url ? (
                      <img
                        src={meal.image_url}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center text-2xl">
                        🥘
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-gray-800">
                        {meal.name}
                      </h3>
                      <p className="text-sm text-gray-500 leading-relaxed">
                        {meal.ingredients}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Date Picker Control */}
            <div className="bg-white p-4 rounded-xl shadow-sm flex items-center gap-4">
              <label className="font-semibold text-gray-700">
                Plan for date:
              </label>
              <input
                type="date"
                className="border p-1 rounded"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
              <button
                onClick={() => fetchPlan(selectedDate)}
                className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
              >
                Update Plan
              </button>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-md">
              <h2 className="text-2xl font-bold mb-6 text-blue-800">
                Menu for {selectedDate}
              </h2>
              {loading ? (
                <div className="flex justify-center py-10">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
                </div>
              ) : plan ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div>
                    <h3 className="font-semibold text-gray-500 uppercase mb-4 border-b pb-2">
                      The Menu
                    </h3>
                    <ul className="space-y-4">
                      {plan.meals.length > 0 ? (
                        plan.meals.map((m, i) => (
                          <li
                            key={i}
                            className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500"
                          >
                            <span className="font-bold text-gray-800">
                              {m.name}
                            </span>
                          </li>
                        ))
                      ) : (
                        <li className="text-gray-400">
                          No meals available to pick from. Add more in The
                          Vault!
                        </li>
                      )}
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-500 uppercase mb-4 border-b pb-2">
                      Shopping List
                    </h3>
                    <ul className="list-disc list-inside space-y-2">
                      {plan.shopping_list.length > 0 ? (
                        plan.shopping_list.map((item, i) => (
                          <li key={i} className="text-gray-700">
                            {item}
                          </li>
                        ))
                      ) : (
                        <li className="text-gray-400">No items</li>
                      )}
                    </ul>
                  </div>
                </div>
              ) : (
                <p>No plan generated.</p>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
