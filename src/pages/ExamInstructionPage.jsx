import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ExamInstructions } from '../components/ExamInstruction';
import axios from 'axios';

export default function ExamInstructionPage() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [examDetails, setExamDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState('Student');

  useEffect(() => {
    // Check if user is logged in
    const studentId = sessionStorage.getItem('studentId');
    if (!studentId) {
      navigate('/auth/login');
      return;
    }

    // Get student name from sessionStorage first (faster)
    const storedName = sessionStorage.getItem('studentName');
    if (storedName) {
      setUsername(storedName);
    }

    // Check if roomId exists in session (user joined the room)
    const storedRoomId = sessionStorage.getItem('roomId');
    if (!storedRoomId || storedRoomId !== roomId) {
      // Redirect to join exam page if room not joined
      navigate('/student-dashboard/join-exam');
      return;
    }

    // Fetch exam details
    const fetchExamDetails = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/rooms/${roomId}/exam-details`);
        const data = await response.json();
        if (data.success && data.room) {
          setExamDetails(data.room);
        }
      } catch (error) {
        console.error('Failed to fetch exam details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchExamDetails();

    // Fetch student name from API if not in sessionStorage (fallback)
    if (studentId && !storedName) {
      axios.get(`http://localhost:3000/api/students/${studentId}`)
        .then(res => {
          if (res.data?.name) {
            setUsername(res.data.name);
            sessionStorage.setItem('studentName', res.data.name);
          }
        })
        .catch(err => console.error('Failed to fetch student info:', err));
    }
  }, [roomId, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading exam details...</p>
        </div>
      </div>
    );
  }

  if (!examDetails) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-lg font-semibold mb-2">Exam not found</p>
          <p className="text-muted-foreground mb-4">The exam room you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/student-dashboard/join-exam')}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Go to Join Exam
          </button>
        </div>
      </div>
    );
  }

  return (
    <ExamInstructions
      courseName={examDetails.examName || examDetails.courseName || examDetails.roomId}
      durationMinutes={examDetails.examDuration || 90}
      roomId={roomId}
      username={username}
    />
  );
}

