import WeekNav from "./WeekNav";

export default function PlanView({
  loading,
  plan,
  weekDays,
  formatDate,
  selectedDate,
  changeWeek,
  fetchPlan,
}) {
  return (
    <div className="space-y-6">
      <WeekNav
        weekDays={weekDays}
        formatDate={formatDate}
        selectedDate={selectedDate}
        changeWeek={changeWeek}
        fetchPlan={fetchPlan}
      />
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-blue-800">Weekly Menu</h2>
        {loading ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
          </div>
        ) : plan ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {plan.meals.map((m, i) => (
                <div
                  key={i}
                  className="bg-blue-50 rounded-lg border-l-4 border-blue-500 p-4"
                >
                  <span className="text-sm text-gray-500 font-semibold">
                    {weekDays[i] ? formatDate(weekDays[i]) : `Day ${i + 1}`}
                  </span>
                  <h3 className="font-bold text-gray-800 mt-1">{m.name}</h3>
                </div>
              ))}
            </div>
            <div className="border-t pt-4">
              <h3 className="font-semibold text-gray-500 uppercase mb-3">
                Shopping List
              </h3>
              {plan.shopping_list.length > 0 ? (
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {plan.shopping_list.map((item, i) => (
                    <li key={i} className="text-gray-700">
                      • {item}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-400">
                  No items. Add more meals in The Vault!
                </p>
              )}
            </div>
          </div>
        ) : (
          <p>No plan generated.</p>
        )}
      </div>
    </div>
  );
}
