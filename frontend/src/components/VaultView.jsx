import MealItem from "./MealItem";
import AddMealForm from "./AddMealForm";

export default function VaultView({
  meals,
  formData,
  setFormData,
  onSubmit,
  onDelete,
  fileInputRef,
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <AddMealForm
        formData={formData}
        setFormData={setFormData}
        onSubmit={onSubmit}
        fileInputRef={fileInputRef}
      />
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Your Favorites</h2>
        <div className="grid grid-cols-1 gap-4">
          {meals.length === 0 && (
            <p className="text-gray-500 italic">
              No meals in the vault yet. Add some above!
            </p>
          )}
          {meals.map((meal) => (
            <MealItem key={meal.id} meal={meal} onDelete={onDelete} />
          ))}
        </div>
      </div>
    </div>
  );
}
