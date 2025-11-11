import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';

export function StudentDashboardContent({ onStudentNameChange }) {
  const navigate = useNavigate();
  const [roomId, setRoomId] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState('Student');

  useEffect(() => {
    const storedName = sessionStorage.getItem('studentName');
    const storedId = sessionStorage.getItem('studentId');
    if (storedName) setUsername(storedName);
    else if (storedId) setUsername(storedId);
  }, []);

  const fakeExams = [
    { id: 1, course: 'Data Structures', examiner: 'Dr. Rahman', date: '2025-10-01', score: 85 },
    { id: 2, course: 'Algorithms', examiner: 'Prof. Karim', date: '2025-09-15', score: 90 },
    { id: 3, course: 'Operating Systems', examiner: 'Ms. Sultana', date: '2025-08-30', score: 78 },
    { id: 4, course: 'Database Systems', examiner: 'Mr. Ahmed', date: '2025-08-20', score: 88 },
    { id: 5, course: 'Computer Networks', examiner: 'Dr. Alam', date: '2025-07-25', score: 92 },
    { id: 6, course: 'Software Engineering', examiner: 'Prof. Noor', date: '2025-07-10', score: 80 },
    { id: 7, course: 'Compiler Design', examiner: 'Ms. Jahan', date: '2025-06-30', score: 84 },
    { id: 8, course: 'AI', examiner: 'Mr. Saif', date: '2025-06-15', score: 91 },
    { id: 9, course: 'Machine Learning', examiner: 'Dr. Tania', date: '2025-05-25', score: 87 },
    { id: 10, course: 'Web Development', examiner: 'Dr. Rahman', date: '2025-05-10', score: 95 },
  ];

  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const examsPerPage = 3;

  const filteredExams = fakeExams.filter(
    (exam) =>
      exam.examiner.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exam.course.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredExams.length / examsPerPage);
  const currentExams = filteredExams.slice(
    (currentPage - 1) * examsPerPage,
    currentPage * examsPerPage
  );

  useEffect(() => setCurrentPage(1), [searchQuery]);

  const handleJoinRoom = async (e) => {
    e.preventDefault();
    if (!roomId || !password) {
      alert('Please fill in both Room ID and Password.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:3000/api/rooms/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomId,
          password,
          studentId: sessionStorage.getItem('studentId')
        })
      });

      const data = await response.json();
      if (data.success) {
        sessionStorage.setItem('roomId', roomId);
        navigate(`/student-dashboard/exam/${roomId}`);
      } else {
        alert(data.message || 'Invalid credentials.');
        setLoading(false);
      }
    } catch (error) {
      console.error('Error joining room:', error);
      alert('Failed to join room. Please try again.');
      setLoading(false);
    }
  };

  const handlePrev = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNext = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  return (
    <div className="w-full max-w-7xl mx-auto space-y-12 px-4 sm:px-6 lg:px-8">

      {/* Join Exam Room */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Card className="shadow-lg bg-white text-black w-full sm:w-3/4 md:w-2/3 lg:w-1/2 mx-auto">
          <CardHeader>
            <CardTitle className="text-center text-2xl font-bold pt-6">
              Join an Exam Room
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-8">
            <form onSubmit={handleJoinRoom} className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="room-id" className="text-gray-700">Room ID</Label>
                <Input
                  id="room-id"
                  placeholder="Enter Room ID"
                  value={roomId}
                  onChange={(e) => setRoomId(e.target.value)}
                  required
                  className="text-black"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="password" className="text-gray-700">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="text-black"
                />
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-black text-white py-4 mt-2 font-semibold"
              >
                {loading ? 'Validating...' : 'Join Room'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>

      {/* Past Exams */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <Card className="shadow-lg bg-white border border-gray-200 w-full">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-700">Past Exams</CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              placeholder="Search by course or examiner"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="mb-4 w-full"
            />

            {currentExams.length === 0 ? (
              <p className="text-gray-500">No exams found.</p>
            ) : (
              <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {currentExams.map((exam) => (
                  <motion.div
                    key={exam.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                  >
                    <Card className="p-4 border shadow-sm hover:shadow-md hover:scale-105 transition-all duration-300">
                      <p className="text-sm text-gray-600"><strong>Course:</strong> {exam.course}</p>
                      <p className="text-gray-700"><strong>Examiner:</strong> {exam.examiner}</p>
                      <p className="text-gray-700"><strong>Date:</strong> {exam.date}</p>
                      <p className="text-gray-700"><strong>Score:</strong> {exam.score}</p>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}

            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row justify-between items-center mt-4 space-y-2 sm:space-y-0">
                <Button onClick={handlePrev} disabled={currentPage === 1}>
                  Previous
                </Button>
                <span className="text-gray-600">
                  Page {currentPage} of {totalPages}
                </span>
                <Button onClick={handleNext} disabled={currentPage === totalPages}>
                  Next
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
