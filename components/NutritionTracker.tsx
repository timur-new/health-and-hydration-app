import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Badge } from "./ui/badge";
import { Plus, Trash2 } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

interface FoodEntry {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  meal: string;
}

interface NutritionTrackerProps {
  entries: FoodEntry[];
  onAddEntry: (entry: Omit<FoodEntry, 'id'>) => void;
  onRemoveEntry: (id: string) => void;
  goals: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

export function NutritionTracker({ entries, onAddEntry, onRemoveEntry, goals }: NutritionTrackerProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newEntry, setNewEntry] = useState({
    name: '',
    calories: '',
    protein: '',
    carbs: '',
    fat: '',
    meal: 'breakfast'
  });

  const totals = entries.reduce(
    (acc, entry) => ({
      calories: acc.calories + entry.calories,
      protein: acc.protein + entry.protein,
      carbs: acc.carbs + entry.carbs,
      fat: acc.fat + entry.fat,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  const macroData = [
    { name: 'Protein', value: totals.protein, color: '#0088FE' },
    { name: 'Carbs', value: totals.carbs, color: '#00C49F' },
    { name: 'Fat', value: totals.fat, color: '#FFBB28' },
  ];

  const progressData = [
    {
      name: 'Calories',
      current: totals.calories,
      goal: goals.calories,
      percentage: (totals.calories / goals.calories) * 100,
    },
    {
      name: 'Protein',
      current: totals.protein,
      goal: goals.protein,
      percentage: (totals.protein / goals.protein) * 100,
    },
    {
      name: 'Carbs',
      current: totals.carbs,
      goal: goals.carbs,
      percentage: (totals.carbs / goals.carbs) * 100,
    },
    {
      name: 'Fat',
      current: totals.fat,
      goal: goals.fat,
      percentage: (totals.fat / goals.fat) * 100,
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newEntry.name && newEntry.calories) {
      onAddEntry({
        name: newEntry.name,
        calories: parseInt(newEntry.calories) || 0,
        protein: parseInt(newEntry.protein) || 0,
        carbs: parseInt(newEntry.carbs) || 0,
        fat: parseInt(newEntry.fat) || 0,
        meal: newEntry.meal,
      });
      setNewEntry({
        name: '',
        calories: '',
        protein: '',
        carbs: '',
        fat: '',
        meal: 'breakfast'
      });
      setIsDialogOpen(false);
    }
  };

  const groupedEntries = entries.reduce((acc, entry) => {
    if (!acc[entry.meal]) {
      acc[entry.meal] = [];
    }
    acc[entry.meal].push(entry);
    return acc;
  }, {} as Record<string, FoodEntry[]>);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2>Nutrition Tracker</h2>
          <p className="text-muted-foreground">Track your daily nutrition intake</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Food
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Food Entry</DialogTitle>
              <DialogDescription>
                Add a new food item to your nutrition log
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Food Name</Label>
                <Input
                  id="name"
                  value={newEntry.name}
                  onChange={(e) => setNewEntry({ ...newEntry, name: e.target.value })}
                  placeholder="e.g., Chicken Breast"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="meal">Meal</Label>
                <Select value={newEntry.meal} onValueChange={(value) => setNewEntry({ ...newEntry, meal: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="breakfast">Breakfast</SelectItem>
                    <SelectItem value="lunch">Lunch</SelectItem>
                    <SelectItem value="dinner">Dinner</SelectItem>
                    <SelectItem value="snack">Snack</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="calories">Calories</Label>
                  <Input
                    id="calories"
                    type="number"
                    value={newEntry.calories}
                    onChange={(e) => setNewEntry({ ...newEntry, calories: e.target.value })}
                    placeholder="0"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="protein">Protein (g)</Label>
                  <Input
                    id="protein"
                    type="number"
                    value={newEntry.protein}
                    onChange={(e) => setNewEntry({ ...newEntry, protein: e.target.value })}
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="carbs">Carbs (g)</Label>
                  <Input
                    id="carbs"
                    type="number"
                    value={newEntry.carbs}
                    onChange={(e) => setNewEntry({ ...newEntry, carbs: e.target.value })}
                    placeholder="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fat">Fat (g)</Label>
                  <Input
                    id="fat"
                    type="number"
                    value={newEntry.fat}
                    onChange={(e) => setNewEntry({ ...newEntry, fat: e.target.value })}
                    placeholder="0"
                  />
                </div>
              </div>

              <Button type="submit" className="w-full">Add Food</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Progress Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Daily Progress</CardTitle>
            <CardDescription>Current vs. Goal</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={progressData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value, name) => [Math.round(Number(value)), name]} />
                <Bar dataKey="current" fill="#8884d8" />
                <Bar dataKey="goal" fill="#e5e7eb" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Macro Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Macro Distribution</CardTitle>
            <CardDescription>Today's macronutrient breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={macroData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {macroData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}g`, 'Amount']} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-4 mt-4 text-xs">
              {macroData.map((item, index) => (
                <div key={index} className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded" style={{ backgroundColor: item.color }}></div>
                  <span>{item.name}: {item.value}g</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Food Entries by Meal */}
      <div className="space-y-4">
        {['breakfast', 'lunch', 'dinner', 'snack'].map((meal) => (
          <Card key={meal}>
            <CardHeader>
              <CardTitle className="capitalize">{meal}</CardTitle>
            </CardHeader>
            <CardContent>
              {groupedEntries[meal]?.length > 0 ? (
                <div className="space-y-2">
                  {groupedEntries[meal].map((entry) => (
                    <div key={entry.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span>{entry.name}</span>
                          <Badge variant="outline">{entry.calories} cal</Badge>
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          P: {entry.protein}g | C: {entry.carbs}g | F: {entry.fat}g
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onRemoveEntry(entry.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-4">No items logged for {meal}</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}