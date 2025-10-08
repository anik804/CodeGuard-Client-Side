import React, { useState } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Label } from '../components/ui/label';
import { Button } from '../components/ui/button';
import axios from 'axios';
import { ExamInstructions } from '../components/ExamInstruction';
import { Input } from '../components/ui/input';

export function StudentDashboardContent() {
  const [roomId, setRoomId] = useState('');
  const [password, setPassword] = useState('');
  const [hasJoined, setHasJoined] = useState(false);
  const [loading, setLoading] = useState(false);
  const [username] = useState("Student"); 

  const handleJoinRoom = async (e) => {
    e.preventDefault();

    if (!roomId || !password) {
      alert("Please fill in both Room ID and Password.");
      return;
    }

    try {
      setLoading(true);

      // Call backend API
      const response = await axios.post("https://codeguard-server-side-walb.onrender.com/rooms/validate", {
        roomId,
        password,
      });

      if (response.data.success) {
        console.log("✅ Room validated successfully:", response.data);
        setHasJoined(true);
      } else {
        alert(response.data.message || "Invalid credentials.");
      }

    } catch (err) {
      console.error("❌ Error joining room:", err);
      if (err.response) {
        alert(err.response.data.message || "Invalid credentials.");
      } else {
        alert("Server connection failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen w-full bg-cover bg-center flex justify-center items-center p-4"
      style={{ backgroundImage: `url('/src/assets/background.jpg')` }}
    >
      <div className="w-full max-w-4xl">
        {/* Top Navbar */}
        <div className="bg-[#1a0f3d] text-white p-4 flex items-center justify-between rounded-t-lg shadow-xl">
          <div className="flex items-center space-x-3">
            <img src="/src/assets/logo.png" alt="IIUC Logo" className="h-8 w-8" />
            <h1 className="text-xl font-semibold">CodeGuard - Student Dashboard</h1>
          </div>
          <span className="text-sm">Welcome, {username}</span>
        </div>

        {/* Conditional Rendering */}
        {hasJoined ? (
          <ExamInstructions
            courseName="CSE-2321 Lab Final - Data Structure"
            durationMinutes={90}
            roomId={roomId}
            username={username}
          />
        ) : (
          <Card className="w-full rounded-t-none shadow-xl">
            <CardHeader>
              <CardTitle className="text-center text-2xl font-bold text-gray-800 pt-8">
                Join an Exam Room To Start Exam
              </CardTitle>
            </CardHeader>
            <CardContent className="pb-10">
              <form onSubmit={handleJoinRoom} className="w-full max-w-sm mx-auto space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="room-id" className="text-gray-700">Room ID</Label>
                  <Input
                    id="room-id"
                    placeholder="Enter the Room ID"
                    value={roomId}
                    onChange={(e) => setRoomId(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter the room password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-green-700 hover:bg-green-800 text-white text-lg py-6 mt-4"
                >
                  {loading ? "Validating..." : "Join Room"}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
