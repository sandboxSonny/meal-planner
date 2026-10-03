export default function WeekNav({
  weekDays,
  formatDate,
  selectedDate,
  changeWeek,
  fetchPlan,
}) {
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm flex items-center justify-between">
      <div className="flex flex-wrap items-center gap-4">
        <button
          onClick={() => changeWeek(-1)}
          className="bg-gray-200 text-gray-700 px-3 py-1 rounded hover:bg-gray-300"
        >
          ←
        </button>
        <span className="font-semibold text-gray-700">
          {formatDate(weekDays[0])} – {formatDate(weekDays[6])}
        </span>
        <button
          onClick={() => changeWeek(1)}
          className="bg-gray-200 text-gray-700 px-3 py-1 rounded hover:bg-gray-300"
        >
          →
        </button>
        <button
          onClick={() => fetchPlan(selectedDate)}
          className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
        >
          Regenerate
        </button>
      </div>
    </div>
  );
}
