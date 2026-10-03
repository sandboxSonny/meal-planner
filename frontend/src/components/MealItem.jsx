export default function MealItem({ meal, onDelete }) {
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm flex gap-4 items-center transition hover:shadow-md">
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
        <h3 className="font-bold text-lg text-gray-800">{meal.name}</h3>
        <p className="text-sm text-gray-500 leading-relaxed">
          {meal.ingredients}
        </p>
      </div>
      <button
        onClick={() => onDelete(meal.id)}
        className="text-gray-400 hover:text-red-500 transition p-2"
        title="Delete meal"
      >
        ✕
      </button>
    </div>
  );
}
