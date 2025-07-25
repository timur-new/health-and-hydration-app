import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import { Droplets, Pill, Apple } from "lucide-react";

interface DashboardProps {
  nutritionData: {
    calories: number;
    calorieGoal: number;
    protein: number;
    proteinGoal: number;
    carbs: number;
    carbsGoal: number;
    fat: number;
    fatGoal: number;
  };
  supplementsData: {
    taken: number;
    total: number;
    supplements: Array<{ name: string; taken: boolean; }>;
  };
  hydrationData: {
    current: number;
    goal: number;
  };
}

export function Dashboard({ nutritionData, supplementsData, hydrationData }: DashboardProps) {
  const calorieProgress = (nutritionData.calories / nutritionData.calorieGoal) * 100;
  const supplementProgress = (supplementsData.taken / supplementsData.total) * 100;
  const hydrationProgress = (hydrationData.current / hydrationData.goal) * 100;

  return (
    <div className="space-y-6">
      <div>
        <h1>Health Tracker Dashboard</h1>
        <p className="text-muted-foreground">Track your daily nutrition, supplements, and hydration</p>
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
                  <span className="text-sm">{nutritionData.calories}/{nutritionData.calorieGoal}</span>
                </div>
                <Progress value={calorieProgress} className="h-2" />
              </div>
              
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="text-center">
                  <div className="text-muted-foreground">Protein</div>
                  <div>{nutritionData.protein}g</div>
                </div>
                <div className="text-center">
                  <div className="text-muted-foreground">Carbs</div>
                  <div>{nutritionData.carbs}g</div>
                </div>
                <div className="text-center">
                  <div className="text-muted-foreground">Fat</div>
                  <div>{nutritionData.fat}g</div>
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
                <Badge variant={supplementProgress === 100 ? "default" : "secondary"}>
                  {supplementsData.taken}/{supplementsData.total}
                </Badge>
              </div>
              <Progress value={supplementProgress} className="h-2" />
              <div className="space-y-1">
                {supplementsData.supplements.slice(0, 3).map((supplement, index) => (
                  <div key={index} className="flex items-center justify-between text-xs">
                    <span className={supplement.taken ? "text-muted-foreground line-through" : ""}>
                      {supplement.name}
                    </span>
                    <Badge variant={supplement.taken ? "default" : "outline"} className="text-xs">
                      {supplement.taken ? "✓" : "○"}
                    </Badge>
                  </div>
                ))}
              </div>
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
                <span className="text-sm">{hydrationData.current}L / {hydrationData.goal}L</span>
              </div>
              <Progress value={hydrationProgress} className="h-2" />
              <div className="text-center">
                <Badge variant={hydrationProgress >= 100 ? "default" : "secondary"}>
                  {Math.round(hydrationProgress)}% Complete
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}