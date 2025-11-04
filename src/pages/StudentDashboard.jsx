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
    { id: 11, course: 'Data Structures', examiner: 'Prof. Karim', date: '2025-04-28', score: 82 },
    { id: 12, course: 'Algorithms', examiner: 'Ms. Sultana', date: '2025-04-10', score: 89 },
    { id: 13, course: 'Operating Systems', examiner: 'Mr. Ahmed', date: '2025-03-25', score: 76 },
    { id: 14, course: 'Database Systems', examiner: 'Dr. Alam', date: '2025-03-10', score: 85 },
    { id: 15, course: 'Computer Networks', examiner: 'Prof. Noor', date: '2025-02-20', score: 90 },
    { id: 16, course: 'Software Engineering', examiner: 'Ms. Jahan', date: '2025-02-05', score: 79 },
    { id: 17, course: 'Compiler Design', examiner: 'Mr. Saif', date: '2025-01-28', score: 83 },
    { id: 18, course: 'AI', examiner: 'Dr. Tania', date: '2025-01-15', score: 88 },
    { id: 19, course: 'Machine Learning', examiner: 'Dr. Rahman', date: '2024-12-30', score: 92 },
    { id: 20, course: 'Web Development', examiner: 'Prof. Karim', date: '2024-12-15', score: 94 },
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

  useEffect(() => {
    const storedStudentId = sessionStorage.getItem('studentId');
    if (storedStudentId) {
      setUsername('Student Name'); // or fetch from backend
      onStudentNameChange?.('Student Name');
    }
  }, []);

  const handleJoinRoom = async (e) => {
    e.preventDefault();
    if (!roomId || !password) {
      alert('Please fill in both Room ID and Password.');
      return;
    }
    
    setLoading(true);
    try {
      // Validate room credentials
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
        // Navigate to exam instructions page
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

  // Reset page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  return (
    <div className="w-full mx-auto mt-40 p-4 grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Left column: Join Room */}
      <div>
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="text-center text-2xl h-28 font-bold text-gray-800 pt-6">
              Join an Exam Room
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-8">
            <form onSubmit={handleJoinRoom} className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="room-id">Room ID</Label>
                <Input
                  id="room-id"
                  placeholder="Enter Room ID"
                  value={roomId}
                  onChange={(e) => setRoomId(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-black hover:bg-black text-white py-4 mt-2"
              >
                {loading ? 'Validating...' : 'Join Room'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Right column: Past Exams */}
      <div>
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Past Exams</CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              placeholder="Search by course or examiner"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="mb-4"
            />

            {currentExams.length === 0 ? (
              <p>No exams found.</p>
            ) : (
              <div className="space-y-3 grid grid-cols-2 md:grid-cols-3 gap-4">
  {currentExams.map((exam) => (
    <Card key={exam.id} className="p-3 border shadow-sm h-48">
      <p className='text-sm'><strong>Course:</strong> {exam.course}</p>
      <p><strong>Examiner:</strong> {exam.examiner}</p>
      <p><strong>Date:</strong> {exam.date}</p>
      <p><strong>Score:</strong> {exam.score}</p>
    </Card>
  ))}
</div>

            )}

            {/* Pagination Buttons */}
            {totalPages > 1 && (
              <div className="flex justify-between mt-4">
                <Button onClick={handlePrev} disabled={currentPage === 1}>
                  Previous
                </Button>
                <span className="self-center">
                  Page {currentPage} of {totalPages}
                </span>
                <Button onClick={handleNext} disabled={currentPage === totalPages}>
                  Next
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}



// import { useEffect, useState } from 'react';

// import axios from 'axios';
// import { ExamInstructions } from '../components/ExamInstruction';
// import { Button } from '../components/ui/button';
// import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
// import { Input } from '../components/ui/input';
// import { Label } from '../components/ui/label';

// export function StudentDashboardContent({ onStudentNameChange }) {
//   const [roomId, setRoomId] = useState('');
//   const [password, setPassword] = useState('');
//   const [hasJoined, setHasJoined] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [username, setUsername] = useState('Student');

//   // ✅ Fetch student info when page loads (from backend using saved ID)
//   useEffect(() => {
//     const storedStudentId = sessionStorage.getItem('studentId');
//     if (storedStudentId) {
//       fetchStudentName(storedStudentId);
//     } else {
//       console.warn('⚠️ No studentId found in sessionStorage.');
//     }
//   }, []);

//   const fetchStudentName = async (studentId) => {
//     try {
//       const res = await axios.get(`http://localhost:3000/api/students/${studentId}`);
//       if (res.data?.name) {
//         setUsername(res.data.name);
//         onStudentNameChange?.(res.data.name); // Pass name to parent layout
//       }
//     } catch (err) {
//       console.error('❌ Failed to fetch student info:', err);
//     }
//   };

//   const handleJoinRoom = async (e) => {
//     e.preventDefault();

//     if (!roomId || !password) {
//       alert('Please fill in both Room ID and Password.');
//       return;
//     }

//     const storedStudentId = sessionStorage.getItem('studentId');
//     if (!storedStudentId) {
//       alert('Student ID not found. Please log in again.');
//       return;
//     }

//     try {
//       setLoading(true);

//       // ✅ Validate room credentials
//       const response = await axios.post('http://localhost:3000/api/rooms/validate', {
//         roomId,
//         password,
//         studentId: storedStudentId,
//       });

//       if (response.data.success) {
//         console.log('✅ Room validated successfully:', response.data);

//         // ✅ Save roomId only (studentId already saved from login)
//         sessionStorage.setItem('roomId', roomId);

//         setHasJoined(true);
//       } else {
//         alert(response.data.message || 'Invalid credentials.');
//       }
//     } catch (err) {
//       console.error('❌ Error joining room:', err);
//       if (err.response) {
//         alert(err.response.data.message || 'Invalid credentials.');
//       } else {
//         alert('Server connection failed. Please try again.');
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="w-full max-w-4xl mx-auto">
//       {/* Conditional Rendering */}
//       {hasJoined ? (
//         <ExamInstructions
//           courseName="CSE-2321 Lab Final - Data Structure"
//           durationMinutes={90}
//           roomId={roomId}
//           username={username}
//         />
//       ) : (
//         <Card className="w-full shadow-xl">
//           <CardHeader>
//             <CardTitle className="text-center text-2xl font-bold text-gray-800 pt-8">
//               Join an Exam Room To Start Exam
//             </CardTitle>
//           </CardHeader>
//           <CardContent className="pb-10">
//             <form onSubmit={handleJoinRoom} className="w-full max-w-sm mx-auto space-y-6">
//               <div className="space-y-2">
//                 <Label htmlFor="room-id" className="text-gray-700">
//                   Room ID
//                 </Label>
//                 <Input
//                   id="room-id"
//                   placeholder="Enter the Room ID"
//                   value={roomId}
//                   onChange={(e) => setRoomId(e.target.value)}
//                   required
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="password">Password</Label>
//                 <Input
//                   id="password"
//                   type="password"
//                   placeholder="Enter the room password"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   required
//                 />
//               </div>

//               <Button
//                 type="submit"
//                 disabled={loading}
//                 className="w-full bg-black hover:bg-black text-white text-lg py-6 mt-4"
//               >
//                 {loading ? 'Validating...' : 'Join Room'}
//               </Button>
//             </form>
//           </CardContent>
//         </Card>
//       )}
//     </div>
//   );
// }
