import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import axios for making API requests

export function ExaminerDashboardContent({ username }) {
  const navigate = useNavigate();
  const [examName, setExamName] = useState('');
  const [examDuration, setExamDuration] = useState('');
  const [roomPassword, setRoomPassword] = useState('');
  const [roomId, setRoomId] = useState(''); 
  const [isLoading, setIsLoading] = useState(false); // For loading state feedback
  const [isRoomCreated, setIsRoomCreated] = useState(false); // To track if room is successfully created

  const generateRandomPassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setRoomPassword(result);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert(`Copied "${text}" to clipboard!`);
  };

  // --- INTEGRATED API CALL ---
  const handleCreateRoom = async () => {
    // Basic validation
    if (!roomId || !roomPassword) {
      alert("Please set an Exam Name (for the Room ID) and a password.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post('http://localhost:3000/api/rooms', {
        roomId: roomId,
        password: roomPassword
      });

      if (response.status === 201) {
        alert(`Room "${response.data.roomId}" created successfully!`);
        setIsRoomCreated(true); // Mark room as created
        // Automatically navigate to the monitoring dashboard on success
        navigate(`/monitoring/${roomId}`);
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        // Handle specific API errors
        if (error.response.status === 409) {
          alert("Error: A room with this ID already exists. Please choose a different Exam Name.");
        } else {
          alert(`Error: ${error.response.data.message || 'An unexpected error occurred.'}`);
        }
      } else {
        // Handle other errors (e.g., network issues)
        alert("An error occurred. Please check your connection and try again.");
      }
      console.error("Room creation failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoToMonitoringDashboard = () => {
    if (!isRoomCreated) {
        alert("Please create the room first before navigating to the dashboard.");
        return;
    }
    if (!roomId) {
      alert("Please ensure a Room ID is set before proceeding.");
      return;
    }
    console.log("Navigating to monitoring dashboard for room:", roomId);
    navigate(`/monitoring/${roomId}`);
  };

  return (
    <div className="min-h-screen w-full bg-cover bg-center flex justify-center items-center p-4"
         style={{ backgroundImage: `url('/src/assets/background.jpg')` }}>
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-xl overflow-hidden">
        {/* Top Navbar */}
        <div className="bg-[#1a0f3d] text-white p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img src="/src/assets/logo.png" alt="IIUC Logo" className="h-8 w-8" />
            <h1 className="text-xl font-semibold">CodeGuard - Examiner Dashboard</h1>
          </div>
          <span className="text-sm">Welcome, {username}</span>
        </div>

        {/* Main Content */}
        <div className="p-8">
          <h2 className="text-2xl font-bold mb-6">Create New Exam Session</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Exam Details Section */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Exam Details:</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="exam-name">Exam Name/Course Code (used as Room ID)</Label>
                  <Input 
                    id="exam-name" 
                    placeholder="e.g., CSE-301-Midterm" 
                    value={examName}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\s+/g, '-'); // Replace spaces with hyphens for a clean ID
                      setExamName(e.target.value);
                      setRoomId(value);
                    }}
                  />
                </div>
                <div>
                  <Label htmlFor="exam-duration">Exam Duration (minutes)</Label>
                  <Input 
                    id="exam-duration" 
                    type="number" 
                    placeholder="e.g., 90" 
                    value={examDuration}
                    onChange={(e) => setExamDuration(e.target.value)}
                  />
                </div>
              </div>

              <h3 className="text-lg font-semibold mt-8 mb-4">Set Room Password</h3>
              <div className="flex w-full max-w-sm items-center space-x-2">
                <Input 
                  type="password" 
                  placeholder="Enter a secure password" 
                  value={roomPassword}
                  onChange={(e) => setRoomPassword(e.target.value)}
                />
                <Button onClick={generateRandomPassword} variant="secondary">Generate</Button>
              </div>

              <Button 
                onClick={handleCreateRoom} 
                className="mt-8 w-full md:w-auto bg-green-700 hover:bg-green-800 text-white"
                disabled={isLoading} // Disable button while loading
              >
                {isLoading ? 'Creating Room...' : 'Create Room & Start'}
              </Button>
            </div>

            {/* Room Details Section */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Share with Students:</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="room-id">Room ID</Label>
                  <div className="flex items-center space-x-2">
                    <Input id="room-id" value={roomId || "Set Exam Name first"} readOnly />
                    <Button onClick={() => copyToClipboard(roomId)} variant="outline" disabled={!roomId}>Copy</Button>
                  </div>
                </div>
                <div>
                  <Label htmlFor="room-password-display">Room Password</Label>
                  <div className="flex items-center space-x-2">
                    <Input id="room-password-display" type="text" value={roomPassword || "Set a password"} readOnly />
                    <Button onClick={() => copyToClipboard(roomPassword)} variant="outline" disabled={!roomPassword}>Copy</Button>
                  </div>
                </div>
              </div>

              <Button 
                onClick={handleGoToMonitoringDashboard} 
                className="mt-8 w-full md:w-auto bg-[#1a0f3d] hover:bg-[#2e1d5a] text-white"
                disabled={!isRoomCreated} // Button is disabled until the room is successfully created
              >
                Go To Monitoring Dashboard
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
