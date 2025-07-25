import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./components/ui/card";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Label } from "./components/ui/label";
import { Progress } from "./components/ui/progress";
import { Badge } from "./components/ui/badge";
import { BarChart3, Apple, Pill, Droplets, Plus, Trash2 } from "lucide-react";

interface FoodEntry {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  meal: string;
}

interface Supplement {
  id: string;
  name: string;
  dosage: string;
  taken: boolean;
}

interface HydrationEntry {
  id: string;
  amount: number;
  time: Date;
}

export default function App() {
  // Sample data to demonstrate the app
  const [foodEntries, setFoodEntries] = useState<FoodEntry[]>([
    {
      id: '1',
      name: 'Oatmeal with Berries',
      calories: 300,
      protein: 8,
      carbs: 54,
      fat: 6,
      meal: 'breakfast'
    },
    {
      id: '2',
      name: 'Grilled Chicken Salad',
      calories: 450,
      protein: 35,
      carbs: 15,
      fat: 28,
      meal: 'lunch'
    }
  ]);

  const [supplements, setSupplements] = useState<Supplement[]>([
    { id: '1', name: 'Vitamin D3', dosage: '2000 IU', taken: true },
    { id: '2', name: 'Omega-3', dosage: '1000mg', taken: false },
    { id: '3', name: 'Magnesium', dosage: '400mg', taken: false }
  ]);

  const [hydrationEntries, setHydrationEntries] = useState<HydrationEntry[]>([
    { id: '1', amount: 0.5, time: new Date() },
    { id: '2', amount: 0.3, time: new Date() }
  ]);

  const [hydrationGoal] = useState(2.5);
  const nutritionGoals = {
    calories: 2000,
    protein: 150,
    carbs: 200,
    fat: 65,
  };

  // Calculate totals
  const nutritionTotals = foodEntries.reduce(
    (acc, entry) => ({
      calories: acc.calories + entry.calories,
      protein: acc.protein + entry.protein,
      carbs: acc.carbs + entry.carbs,
      fat: acc.fat + entry.fat,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  const supplementsData = {
    taken: supplements.filter(s => s.taken).length,
    total: supplements.length,
  };

  const hydrationTotal = hydrationEntries.reduce((total, entry) => total + entry.amount, 0);

  const toggleSupplement = (id: string) => {
    setSupplements(prev => prev.map(s => 
      s.id === id ? { ...s, taken: !s.taken } : s
    ));
  };

  const addHydration = (amount: number) => {
    setHydrationEntries(prev => [...prev, {
      id: Date.now().toString(),
      amount,
      time: new Date()
    }]);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <h1>Health Tracker</h1>
          <p className="text-muted-foreground">Track your nutrition, supplements, and hydration</p>
        </div>

        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="nutrition" className="flex items-center gap-2">
              <Apple className="h-4 w-4" />
              Nutrition
            </TabsTrigger>
            <TabsTrigger value="supplements" className="flex items-center gap-2">
              <Pill className="h-4 w-4" />
              Supplements
            </TabsTrigger>
            <TabsTrigger value="hydration" className="flex items-center gap-2">
              <Droplets className="h-4 w-4" />
              Hydration
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard">
            <div className="space-y-6">
              <div>
                <h2>Health Overview</h2>
                <p className="text-muted-foreground">Your daily health metrics at a glance</p>
              </div>
              
              <div className="grid gap-6 md:grid-cols-3">
                {/* Nutrition Card */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm">Nutrition</CardTitle>
                    <Apple className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm">Calories</span>
                          <span className="text-sm">{nutritionTotals.calories}/{nutritionGoals.calories}</span>
                        </div>
                        <Progress value={(nutritionTotals.calories / nutritionGoals.calories) * 100} className="h-2" />
                      </div>
                      
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div className="text-center">
                          <div className="text-muted-foreground">Protein</div>
                          <div>{nutritionTotals.protein}g</div>
                        </div>
                        <div className="text-center">
                          <div className="text-muted-foreground">Carbs</div>
                          <div>{nutritionTotals.carbs}g</div>
                        </div>
                        <div className="text-center">
                          <div className="text-muted-foreground">Fat</div>
                          <div>{nutritionTotals.fat}g</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Supplements Card */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm">Supplements</CardTitle>
                    <Pill className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Today's Progress</span>
                        <Badge variant={supplementsData.taken === supplementsData.total ? "default" : "secondary"}>
                          {supplementsData.taken}/{supplementsData.total}
                        </Badge>
                      </div>
                      <Progress value={(supplementsData.taken / supplementsData.total) * 100} className="h-2" />
                    </div>
                  </CardContent>
                </Card>

                {/* Hydration Card */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm">Hydration</CardTitle>
                    <Droplets className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Water Intake</span>
                        <span className="text-sm">{hydrationTotal.toFixed(1)}L / {hydrationGoal}L</span>
                      </div>
                      <Progress value={(hydrationTotal / hydrationGoal) * 100} className="h-2" />
                      <div className="text-center">
                        <Badge variant={hydrationTotal >= hydrationGoal ? "default" : "secondary"}>
                          {Math.round((hydrationTotal / hydrationGoal) * 100)}% Complete
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Nutrition Tab */}
          <TabsContent value="nutrition">
            <div className="space-y-6">
              <div>
                <h2>Nutrition Tracker</h2>
                <p className="text-muted-foreground">Track your daily nutrition intake</p>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Daily Progress</CardTitle>
                    <CardDescription>Calories and macros vs. goals</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Calories</span>
                        <span>{nutritionTotals.calories} / {nutritionGoals.calories}</span>
                      </div>
                      <Progress value={(nutritionTotals.calories / nutritionGoals.calories) * 100} />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Protein</span>
                        <span>{nutritionTotals.protein}g / {nutritionGoals.protein}g</span>
                      </div>
                      <Progress value={(nutritionTotals.protein / nutritionGoals.protein) * 100} />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Carbs</span>
                        <span>{nutritionTotals.carbs}g / {nutritionGoals.carbs}g</span>
                      </div>
                      <Progress value={(nutritionTotals.carbs / nutritionGoals.carbs) * 100} />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Fat</span>
                        <span>{nutritionTotals.fat}g / {nutritionGoals.fat}g</span>
                      </div>
                      <Progress value={(nutritionTotals.fat / nutritionGoals.fat) * 100} />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Food Entries</CardTitle>
                    <CardDescription>Today's logged meals</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {foodEntries.map(entry => (
                        <div key={entry.id} className="flex items-center justify-between p-3 border rounded">
                          <div>
                            <div>{entry.name}</div>
                            <div className="text-xs text-muted-foreground capitalize">{entry.meal} • {entry.calories} cal</div>
                          </div>
                          <Badge variant="outline">{entry.calories} cal</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Supplements Tab */}
          <TabsContent value="supplements">
            <div className="space-y-6">
              <div>
                <h2>Supplement Tracker</h2>
                <p className="text-muted-foreground">Manage your daily supplements</p>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Today's Supplements</CardTitle>
                  <CardDescription>
                    {supplementsData.taken} of {supplementsData.total} supplements taken
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {supplements.map(supplement => (
                      <div key={supplement.id} className="flex items-center justify-between p-3 border rounded">
                        <div className="flex items-center gap-3">
                          <input 
                            type="checkbox" 
                            checked={supplement.taken}
                            onChange={() => toggleSupplement(supplement.id)}
                            className="rounded"
                          />
                          <div className={supplement.taken ? 'opacity-60' : ''}>
                            <div className={supplement.taken ? 'line-through' : ''}>{supplement.name}</div>
                            <div className="text-xs text-muted-foreground">{supplement.dosage}</div>
                          </div>
                        </div>
                        <Badge variant={supplement.taken ? "default" : "outline"}>
                          {supplement.taken ? "✓" : "○"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Hydration Tab */}
          <TabsContent value="hydration">
            <div className="space-y-6">
              <div>
                <h2>Hydration Tracker</h2>
                <p className="text-muted-foreground">Track your daily water intake</p>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Droplets className="h-5 w-5" />
                      Today's Progress
                    </CardTitle>
                    <CardDescription>
                      {hydrationTotal.toFixed(1)}L of {hydrationGoal}L ({Math.round((hydrationTotal / hydrationGoal) * 100)}%)
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Progress value={(hydrationTotal / hydrationGoal) * 100} className="h-3" />
                    
                    <div className="grid grid-cols-5 gap-2">
                      {[0.25, 0.5, 0.75, 1.0, 1.5].map(amount => (
                        <Button
                          key={amount}
                          variant="outline"
                          onClick={() => addHydration(amount)}
                          className="h-16 flex flex-col gap-1"
                        >
                          <Droplets className="h-4 w-4" />
                          <span className="text-xs">{amount}L</span>
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Today's Entries</CardTitle>
                    <CardDescription>Water intake log</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {hydrationEntries.map(entry => (
                        <div key={entry.id} className="flex items-center justify-between p-3 border rounded">
                          <div className="flex items-center gap-3">
                            <Droplets className="h-4 w-4 text-blue-500" />
                            <div>
                              <div>{entry.amount}L</div>
                              <div className="text-xs text-muted-foreground">
                                {entry.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </div>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}