import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import { motion } from "framer-motion";
import { Calendar, Clock, FileText, Lock, Users } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { AuthContext } from "../provider/AuthProvider";

export default function CreateExam() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [examName, setExamName] = useState('');
  const [roomId, setRoomId] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState('');
  const [startTime, setStartTime] = useState('');
  const [subject, setSubject] = useState('');
  const [maxStudents, setMaxStudents] = useState('');
  const [proctoringLevel, setProctoringLevel] = useState('');
  const [roomPassword, setRoomPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [examinerInfo, setExaminerInfo] = useState(null);

  useEffect(() => {
    // Get examiner info from sessionStorage
    const username = sessionStorage.getItem("username");
    const name = sessionStorage.getItem("examinerName");
    
    // If not in sessionStorage, try to get from user context or make API call
    if (username) {
      setExaminerInfo({
        username,
        name: name || username
      });
    }
  }, [user]);

  const generateRandomPassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setRoomPassword(result);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!roomId || !roomPassword || !examName) {
      toast.error("Please provide exam name, room ID, and password");
      return;
    }

    setIsLoading(true);
    try {
      const username = sessionStorage.getItem("username");
      const examinerName = sessionStorage.getItem("examinerName");
      
      const response = await axios.post('https://codeguard-server-side-walb.onrender.com/api/rooms', {
        roomId: roomId.replace(/\s+/g, '-').toLowerCase(),
        password: roomPassword,
        examName: examName,
        courseName: examName, // Keep for backward compatibility
        examDuration: duration ? parseInt(duration) : null,
        examDescription: description,
        examSubject: subject,
        maxStudents: maxStudents ? parseInt(maxStudents) : null,
        proctoringLevel: proctoringLevel,
        startTime: startTime || null,
        examinerId: username, // Use username as examiner ID
        examinerName: examinerName || username,
        examinerUsername: username
      });

      if (response.status === 201) {
        toast.success("Exam created successfully!");
        // Navigate to monitoring dashboard
        navigate(`/monitoring/${roomId.replace(/\s+/g, '-').toLowerCase()}`);
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        if (error.response.status === 409) {
          toast.error("A room with this ID already exists. Please choose a different name.");
        } else {
          toast.error(error.response.data.message || 'Failed to create exam');
        }
      } else {
        toast.error("Failed to create exam. Please try again.");
      }
      console.error("Exam creation failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-full mx-auto"
    >
      <Card className="bg-white border-none shadow-none">
        <CardHeader>
          <CardTitle className="text-3xl gradient-text">Create New Exam</CardTitle>
          <CardDescription className="text-muted-foreground">
            Set up a new exam to be conducted immediately
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Exam Name */}
            <div className="space-y-2">
              <Label htmlFor="examName" className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-primary" />
                Exam Name / Title *
              </Label>
              <Input
                id="examName"
                placeholder="e.g., Midterm Exam - Computer Science"
                className="bg-secondary/50"
                value={examName}
                onChange={(e) => setExamName(e.target.value)}
                required
              />
            </div>

            {/* Room ID */}
            <div className="space-y-2">
              <Label htmlFor="roomId" className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-primary" />
                Room ID *
              </Label>
              <Input
                id="roomId"
                placeholder="e.g., cse-301-midterm"
                className="bg-secondary/50"
                value={roomId}
                onChange={(e) => {
                  const value = e.target.value.replace(/\s+/g, '-').toLowerCase();
                  setRoomId(value);
                }}
                required
              />
              <p className="text-xs text-muted-foreground">Room ID will be converted to lowercase with hyphens</p>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Brief description of the exam..."
                className="bg-secondary/50 min-h-24"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
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
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="date" className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary" />
                  Start Time (Optional)
                </Label>
                <Input
                  id="date"
                  type="datetime-local"
                  className="bg-secondary/50"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                />
              </div>
            </div>

            {/* Subject and Max Students */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="subject">Subject / Course Code</Label>
                <Select value={subject} onValueChange={setSubject}>
                  <SelectTrigger className="bg-secondary/50">
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cs">Computer Science</SelectItem>
                    <SelectItem value="math">Mathematics</SelectItem>
                    <SelectItem value="physics">Physics</SelectItem>
                    <SelectItem value="chemistry">Chemistry</SelectItem>
                    <SelectItem value="engineering">Engineering</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxStudents" className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-primary" />
                  Max Students (Optional)
                </Label>
                <Input
                  id="maxStudents"
                  type="number"
                  placeholder="50"
                  className="bg-secondary/50"
                  value={maxStudents}
                  onChange={(e) => setMaxStudents(e.target.value)}
                />
              </div>
            </div>

            {/* Proctoring Settings */}
            <div className="space-y-2">
              <Label htmlFor="proctoring">Proctoring Level</Label>
              <Select value={proctoringLevel} onValueChange={setProctoringLevel}>
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

            {/* Room Password */}
            <div className="space-y-2">
              <Label htmlFor="roomPassword" className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-primary" />
                Room Password *
              </Label>
              <div className="flex gap-2">
                <Input
                  id="roomPassword"
                  type="password"
                  placeholder="Enter a secure password"
                  className="bg-secondary/50 flex-1"
                  value={roomPassword}
                  onChange={(e) => setRoomPassword(e.target.value)}
                  required
                />
                <Button 
                  type="button"
                  onClick={generateRandomPassword} 
                  variant="outline"
                >
                  Generate
                </Button>
              </div>
            </div>

            {/* Submit Button */}
            {/* <div className="flex gap-4">
              <Button
                type="submit"
                className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
                disabled={isLoading}
              >
                {isLoading ? 'Creating Exam...' : 'Create Exam & Start Monitoring'}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => {
                  // Reset form
                  setExamName('');
                  setRoomId('');
                  setDescription('');
                  setDuration('');
                  setStartTime('');
                  setSubject('');
                  setMaxStudents('');
                  setProctoringLevel('');
                  setRoomPassword('');
                }}
              >
                Clear
              </Button>
            </div> */}
            {/* Submit and Clear Buttons */}
<div className="flex justify-center gap-4 mt-6">
  <Button
    type="submit"
    className="w-48 h-10 text-sm font-semibold rounded-lg bg-black text-white hover:bg-gray-800 transition-all"
    disabled={isLoading}
  >
    {isLoading ? 'Creating Exam...' : 'Create Exam'}
  </Button>
  <Button
    type="button"
    className="w-48 h-10 text-sm font-semibold rounded-lg bg-black text-white hover:bg-gray-800 transition-all"
    onClick={() => {
      // Reset form
      setExamName('');
      setRoomId('');
      setDescription('');
      setDuration('');
      setStartTime('');
      setSubject('');
      setMaxStudents('');
      setProctoringLevel('');
      setRoomPassword('');
    }}
  >
    Clear
  </Button>
</div>

          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}