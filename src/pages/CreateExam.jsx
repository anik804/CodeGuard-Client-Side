import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Clock, FileText, Users } from "lucide-react";
import { toast } from "sonner";

export default function CreateExam() {
  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success("Exam created successfully!");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto"
    >
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-3xl gradient-text">Create New Exam</CardTitle>
          <CardDescription className="text-muted-foreground">
            Set up a new exam to be conducted immediately
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Exam Title */}
            <div className="space-y-2">
              <Label htmlFor="title" className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-primary" />
                Exam Title
              </Label>
              <Input
                id="title"
                placeholder="e.g., Midterm Exam - Computer Science"
                className="bg-secondary/50"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Brief description of the exam..."
                className="bg-secondary/50 min-h-24"
              />
            </div>

            {/* Duration and Date Grid */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="duration" className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary" />
                  Duration (minutes)
                </Label>
                <Input
                  id="duration"
                  type="number"
                  placeholder="90"
                  className="bg-secondary/50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="date" className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary" />
                  Start Time
                </Label>
                <Input
                  id="date"
                  type="datetime-local"
                  className="bg-secondary/50"
                />
              </div>
            </div>

            {/* Subject and Max Students */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Select>
                  <SelectTrigger className="bg-secondary/50">
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cs">Computer Science</SelectItem>
                    <SelectItem value="math">Mathematics</SelectItem>
                    <SelectItem value="physics">Physics</SelectItem>
                    <SelectItem value="chemistry">Chemistry</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxStudents" className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-primary" />
                  Max Students
                </Label>
                <Input
                  id="maxStudents"
                  type="number"
                  placeholder="50"
                  className="bg-secondary/50"
                />
              </div>
            </div>

            {/* Proctoring Settings */}
            <div className="space-y-2">
              <Label htmlFor="proctoring">Proctoring Level</Label>
              <Select>
                <SelectTrigger className="bg-secondary/50">
                  <SelectValue placeholder="Select proctoring level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">High - Full Monitoring</SelectItem>
                  <SelectItem value="medium">Medium - Periodic Checks</SelectItem>
                  <SelectItem value="low">Low - Basic Monitoring</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4">
              <Button
                type="submit"
                className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
              >
                Create Exam Now
              </Button>
              <Button
                type="button"
                variant="outline"
                className="flex-1"
              >
                Save as Draft
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
