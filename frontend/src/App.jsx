import { useState, useEffect, useRef } from "react";
import Header from "./components/Header";
import VaultView from "./components/VaultView";
import PlanView from "./components/PlanView";

function getMonday(date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setDate(diff));
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

const API_BASE = "/api";

export default function App() {
  const [meals, setMeals] = useState([]);
  const [plan, setPlan] = useState(null);
  const [view, setView] = useState("vault");
  const [selectedDate, setSelectedDate] = useState(
    getMonday(new Date()).toISOString().split("T")[0],
  );
  const [formData, setFormData] = useState({
    name: "",
    ingredients: "",
    image: null,
  });
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const weekDays = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + i);
    weekDays.push(d.toISOString().split("T")[0]);
  }

  useEffect(() => {
    fetchMeals();
  }, []);

  const fetchMeals = async () => {
    const res = await fetch(`${API_BASE}/meals/`);
    setMeals(await res.json());
  };

  const fetchPlan = async (date) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/generate-plan/?date_str=${date}`);
      setPlan(await res.json());
    } catch (err) {
      console.error("Failed to fetch plan", err);
    }
    setLoading(false);
  };

  const changeWeek = (direction) => {
    const current = new Date(selectedDate);
    current.setDate(current.getDate() + direction * 7);
    setSelectedDate(getMonday(current).toISOString().split("T")[0]);
    fetchPlan(getMonday(current).toISOString().split("T")[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("name", formData.name);
    data.append("ingredients", formData.ingredients);
    if (formData.image) data.append("image", formData.image);

    const res = await fetch(`${API_BASE}/meals/`, { method: "POST", body: data });
    if (!res.ok) {
      console.error("Failed to save meal:", res.status, await res.text());
      return;
    }
    setFormData({ name: "", ingredients: "", image: null });
    if (fileInputRef.current) fileInputRef.current.value = "";
    fetchMeals();
  };

  const deleteMeal = async (id) => {
    await fetch(`${API_BASE}/meals/${id}`, { method: "DELETE" });
    fetchMeals();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8 font-sans">
      <Header
        view={view}
        setView={setView}
        selectedDate={selectedDate}
        fetchPlan={fetchPlan}
      />
      <main className="max-w-4xl mx-auto">
        {view === "vault" ? (
          <VaultView
            meals={meals}
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleSubmit}
            onDelete={deleteMeal}
            fileInputRef={fileInputRef}
          />
        ) : (
          <PlanView
            loading={loading}
            plan={plan}
            weekDays={weekDays}
            formatDate={formatDate}
            selectedDate={selectedDate}
            changeWeek={changeWeek}
            fetchPlan={fetchPlan}
          />
        )}
      </main>
    </div>
  );
}
