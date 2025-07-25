import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Badge } from "./ui/badge";
import { Checkbox } from "./ui/checkbox";
import { Plus, Trash2, Clock } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

interface Supplement {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  timeOfDay: string[];
  taken: boolean;
  lastTaken?: Date;
}

interface SupplementTrackerProps {
  supplements: Supplement[];
  onAddSupplement: (supplement: Omit<Supplement, 'id' | 'taken'>) => void;
  onRemoveSupplement: (id: string) => void;
  onToggleTaken: (id: string) => void;
}

export function SupplementTracker({ supplements, onAddSupplement, onRemoveSupplement, onToggleTaken }: SupplementTrackerProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newSupplement, setNewSupplement] = useState({
    name: '',
    dosage: '',
    frequency: 'daily',
    timeOfDay: [] as string[],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSupplement.name && newSupplement.dosage) {
      onAddSupplement({
        name: newSupplement.name,
        dosage: newSupplement.dosage,
        frequency: newSupplement.frequency,
        timeOfDay: newSupplement.timeOfDay,
      });
      setNewSupplement({
        name: '',
        dosage: '',
        frequency: 'daily',
        timeOfDay: [],
      });
      setIsDialogOpen(false);
    }
  };

  const handleTimeOfDayChange = (time: string, checked: boolean) => {
    setNewSupplement(prev => ({
      ...prev,
      timeOfDay: checked 
        ? [...prev.timeOfDay, time]
        : prev.timeOfDay.filter(t => t !== time)
    }));
  };

  const takenCount = supplements.filter(s => s.taken).length;
  const completionRate = supplements.length > 0 ? (takenCount / supplements.length) * 100 : 0;

  const groupedSupplements = supplements.reduce((acc, supplement) => {
    const times = supplement.timeOfDay.length > 0 ? supplement.timeOfDay : ['anytime'];
    times.forEach(time => {
      if (!acc[time]) {
        acc[time] = [];
      }
      acc[time].push(supplement);
    });
    return acc;
  }, {} as Record<string, Supplement[]>);

  const timeOrder = ['morning', 'afternoon', 'evening', 'anytime'];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2>Supplement Tracker</h2>
          <p className="text-muted-foreground">Manage your daily supplements</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Supplement
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Supplement</DialogTitle>
              <DialogDescription>
                Add a supplement to your daily routine
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Supplement Name</Label>
                <Input
                  id="name"
                  value={newSupplement.name}
                  onChange={(e) => setNewSupplement({ ...newSupplement, name: e.target.value })}
                  placeholder="e.g., Vitamin D3"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="dosage">Dosage</Label>
                <Input
                  id="dosage"
                  value={newSupplement.dosage}
                  onChange={(e) => setNewSupplement({ ...newSupplement, dosage: e.target.value })}
                  placeholder="e.g., 1000 IU, 2 capsules"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="frequency">Frequency</Label>
                <Select value={newSupplement.frequency} onValueChange={(value) => setNewSupplement({ ...newSupplement, frequency: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="as-needed">As Needed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Time of Day</Label>
                <div className="space-y-2">
                  {['morning', 'afternoon', 'evening'].map((time) => (
                    <div key={time} className="flex items-center space-x-2">
                      <Checkbox
                        id={time}
                        checked={newSupplement.timeOfDay.includes(time)}
                        onCheckedChange={(checked) => handleTimeOfDayChange(time, checked as boolean)}
                      />
                      <Label htmlFor={time} className="capitalize">{time}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <Button type="submit" className="w-full">Add Supplement</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Today's Progress</CardTitle>
          <CardDescription>
            {takenCount} of {supplements.length} supplements taken ({Math.round(completionRate)}%)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="w-full bg-secondary rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300" 
              style={{ width: `${completionRate}%` }}
            ></div>
          </div>
          <div className="mt-4 flex gap-2">
            <Badge variant={completionRate === 100 ? "default" : "secondary"}>
              {completionRate === 100 ? "Complete!" : "In Progress"}
            </Badge>
            <Badge variant="outline">
              {supplements.length} Total
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Supplements by Time */}
      <div className="space-y-4">
        {timeOrder.map((timeSlot) => {
          const timeSupplements = groupedSupplements[timeSlot];
          if (!timeSupplements || timeSupplements.length === 0) return null;

          return (
            <Card key={timeSlot}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 capitalize">
                  <Clock className="h-4 w-4" />
                  {timeSlot}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {timeSupplements.map((supplement) => (
                    <div key={supplement.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3 flex-1">
                        <Checkbox
                          checked={supplement.taken}
                          onCheckedChange={() => onToggleTaken(supplement.id)}
                        />
                        <div className={`flex-1 ${supplement.taken ? 'opacity-60' : ''}`}>
                          <div className="flex items-center gap-2">
                            <span className={supplement.taken ? 'line-through' : ''}>{supplement.name}</span>
                            <Badge variant="outline" className="text-xs">{supplement.dosage}</Badge>
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {supplement.frequency} • {supplement.timeOfDay.join(', ')}
                            {supplement.lastTaken && (
                              <span> • Last taken: {supplement.lastTaken.toLocaleDateString()}</span>
                            )}
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onRemoveSupplement(supplement.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {supplements.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">No supplements added yet</p>
            <p className="text-sm text-muted-foreground mt-1">Click "Add Supplement" to get started</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}