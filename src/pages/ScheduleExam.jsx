import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Clock, FileText, Users, Bell } from "lucide-react";
import { toast } from "sonner";

export default function ScheduleExam() {
  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success("Exam scheduled successfully!");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-full mx-auto"
    >
      <Card className="bg-white border-none shadow-none">
        <CardHeader>
          <CardTitle className="text-3xl gradient-text">Schedule Exam for Later</CardTitle>
          <CardDescription className="text-muted-foreground">
            Plan and schedule an exam to be conducted at a future date and time
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
                placeholder="e.g., Final Exam - Data Structures"
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

            {/* Schedule Date and Time */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="scheduleDate" className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary" />
                  Scheduled Date
                </Label>
                <Input
                  id="scheduleDate"
                  type="date"
                  className="bg-secondary/50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="scheduleTime" className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary" />
                  Start Time
                </Label>
                <Input
                  id="scheduleTime"
                  type="time"
                  className="bg-secondary/50"
                />
              </div>
            </div>

            {/* Duration and Max Students */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="duration">Duration (minutes)</Label>
                <Input
                  id="duration"
                  type="number"
                  placeholder="120"
                  className="bg-secondary/50"
                />
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

            {/* Subject */}
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

            {/* Notification Settings */}
            <div className="space-y-2">
              <Label htmlFor="notification" className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-primary" />
                Send Notification
              </Label>
              <Select>
                <SelectTrigger className="bg-secondary/50">
                  <SelectValue placeholder="When to notify students" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1day">1 day before</SelectItem>
                  <SelectItem value="1week">1 week before</SelectItem>
                  <SelectItem value="immediately">Immediately</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Submit Button */}
            {/* <div className="flex gap-4">
              <Button
                type="submit"
                className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
              >
                Schedule Exam
              </Button>
              <Button
                type="button"
                variant="outline"
                className="flex-1"
              >
                Save as Draft
              </Button>
            </div> */}
            {/* Submit and Draft Buttons */}
<div className="flex justify-center gap-4 mt-6">
  <Button
    type="submit"
    className="w-40 h-10 text-sm font-semibold rounded-lg bg-black text-white hover:bg-gray-800 transition-all"
  >
    Schedule Exam
  </Button>
  <Button
    type="button"
    className="w-40 h-10 text-sm font-semibold rounded-lg bg-black text-white hover:bg-gray-800 transition-all"
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