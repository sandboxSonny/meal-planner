const API_BASE = "/api";

export default function Header({ view, setView, selectedDate, fetchPlan }) {
  return (
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
  );
}
