import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import { Droplets, Plus, Minus, Target } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";

interface HydrationEntry {
  id: string;
  amount: number;
  time: Date;
  type: 'water' | 'coffee' | 'tea' | 'juice' | 'other';
}

interface HydrationTrackerProps {
  entries: HydrationEntry[];
  dailyGoal: number;
  onAddEntry: (entry: Omit<HydrationEntry, 'id'>) => void;
  onRemoveEntry: (id: string) => void;
  onUpdateGoal: (goal: number) => void;
}

const QUICK_AMOUNTS = [0.25, 0.5, 0.75, 1.0, 1.5];

const DRINK_TYPES = [
  { value: 'water', label: 'Water', emoji: '💧' },
  { value: 'coffee', label: 'Coffee', emoji: '☕' },
  { value: 'tea', label: 'Tea', emoji: '🍵' },
  { value: 'juice', label: 'Juice', emoji: '🧃' },
  { value: 'other', label: 'Other', emoji: '🥤' },
];

export function HydrationTracker({ entries, dailyGoal, onAddEntry, onRemoveEntry, onUpdateGoal }: HydrationTrackerProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isGoalDialogOpen, setIsGoalDialogOpen] = useState(false);
  const [newEntry, setNewEntry] = useState({
    amount: '',
    type: 'water' as const,
  });
  const [newGoal, setNewGoal] = useState(dailyGoal.toString());

  const totalIntake = entries.reduce((total, entry) => total + entry.amount, 0);
  const progress = (totalIntake / dailyGoal) * 100;
  const remaining = Math.max(0, dailyGoal - totalIntake);

  const handleQuickAdd = (amount: number) => {
    onAddEntry({
      amount,
      time: new Date(),
      type: 'water',
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(newEntry.amount);
    if (amount > 0) {
      onAddEntry({
        amount,
        time: new Date(),
        type: newEntry.type,
      });
      setNewEntry({ amount: '', type: 'water' });
      setIsDialogOpen(false);
    }
  };

  const handleGoalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const goal = parseFloat(newGoal);
    if (goal > 0) {
      onUpdateGoal(goal);
      setIsGoalDialogOpen(false);
    }
  };

  const todayEntries = entries.filter(entry => {
    const today = new Date();
    const entryDate = new Date(entry.time);
    return entryDate.toDateString() === today.toDateString();
  }).sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());

  const getProgressColor = () => {
    if (progress >= 100) return "bg-green-500";
    if (progress >= 75) return "bg-blue-500";
    if (progress >= 50) return "bg-yellow-500";
    return "bg-gray-400";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2>Hydration Tracker</h2>
          <p className="text-muted-foreground">Track your daily water intake</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isGoalDialogOpen} onOpenChange={setIsGoalDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Target className="mr-2 h-4 w-4" />
                Goal: {dailyGoal}L
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Set Daily Goal</DialogTitle>
                <DialogDescription>
                  Set your daily hydration goal in liters
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleGoalSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="goal">Daily Goal (Liters)</Label>
                  <Input
                    id="goal"
                    type="number"
                    step="0.1"
                    value={newGoal}
                    onChange={(e) => setNewGoal(e.target.value)}
                    placeholder="2.5"
                    required
                  />
                </div>
                <Button type="submit" className="w-full">Update Goal</Button>
              </form>
            </DialogContent>
          </Dialog>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Drink
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Drink</DialogTitle>
                <DialogDescription>
                  Log a drink to your hydration tracker
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Drink Type</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {DRINK_TYPES.map((drink) => (
                      <Button
                        key={drink.value}
                        type="button"
                        variant={newEntry.type === drink.value ? "default" : "outline"}
                        className="p-2 h-auto flex flex-col gap-1"
                        onClick={() => setNewEntry({ ...newEntry, type: drink.value as any })}
                      >
                        <span className="text-lg">{drink.emoji}</span>
                        <span className="text-xs">{drink.label}</span>
                      </Button>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount (Liters)</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.1"
                    value={newEntry.amount}
                    onChange={(e) => setNewEntry({ ...newEntry, amount: e.target.value })}
                    placeholder="0.5"
                    required
                  />
                </div>

                <Button type="submit" className="w-full">Add Drink</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Droplets className="h-5 w-5" />
            Today's Progress
          </CardTitle>
          <CardDescription>
            {totalIntake.toFixed(1)}L of {dailyGoal}L ({Math.round(progress)}%)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>{totalIntake.toFixed(1)}L / {dailyGoal}L</span>
            </div>
            <div className="w-full bg-secondary rounded-full h-3">
              <div 
                className={`h-3 rounded-full transition-all duration-300 ${getProgressColor()}`}
                style={{ width: `${Math.min(progress, 100)}%` }}
              ></div>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="text-center">
              <div className="text-sm text-muted-foreground">Remaining</div>
              <div className="text-lg">{remaining.toFixed(1)}L</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-muted-foreground">Completion</div>
              <Badge variant={progress >= 100 ? "default" : "secondary"} className="text-lg px-3 py-1">
                {Math.round(progress)}%
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Add */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Add Water</CardTitle>
          <CardDescription>Tap to quickly log common amounts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-5 gap-2">
            {QUICK_AMOUNTS.map((amount) => (
              <Button
                key={amount}
                variant="outline"
                className="h-16 flex flex-col gap-1"
                onClick={() => handleQuickAdd(amount)}
              >
                <Droplets className="h-4 w-4" />
                <span className="text-xs">{amount}L</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Entries */}
      <Card>
        <CardHeader>
          <CardTitle>Today's Entries</CardTitle>
          <CardDescription>Recent drinks you've logged</CardDescription>
        </CardHeader>
        <CardContent>
          {todayEntries.length > 0 ? (
            <div className="space-y-2">
              {todayEntries.map((entry) => {
                const drinkType = DRINK_TYPES.find(d => d.value === entry.type);
                return (
                  <div key={entry.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{drinkType?.emoji}</span>
                      <div>
                        <div className="flex items-center gap-2">
                          <span>{entry.amount}L</span>
                          <Badge variant="outline" className="text-xs">
                            {drinkType?.label}
                          </Badge>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {entry.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onRemoveEntry(entry.id)}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-4">No drinks logged today</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}