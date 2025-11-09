import { BookOpen, Shield } from "lucide-react";

export function ExamInfoSection({ examDetails }) {
  if (!examDetails) return null;

  return (
    <section className="px-4 md:px-6 pt-4">
      <div className="glass-card rounded-xl p-4 md:p-6">
        <div className="flex items-center space-x-2 mb-4 pb-3 border-b border-gray-200">
          <BookOpen className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg font-bold gradient-text">Exam Information</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {examDetails.examDescription && (
            <div className="lg:col-span-2">
              <p className="text-xs text-gray-600 mb-1">Description</p>
              <p className="text-sm text-gray-800">{examDetails.examDescription}</p>
            </div>
          )}
          {examDetails.examSubject && (
            <div>
              <p className="text-xs text-gray-600 mb-1">Subject</p>
              <p className="text-sm font-semibold text-gray-800 capitalize">{examDetails.examSubject}</p>
            </div>
          )}
          {examDetails.maxStudents && (
            <div>
              <p className="text-xs text-gray-600 mb-1">Max Students</p>
              <p className="text-sm font-semibold text-gray-800">{examDetails.maxStudents}</p>
            </div>
          )}
          {examDetails.proctoringLevel && (
            <div>
              <p className="text-xs text-gray-600 mb-1">Proctoring Level</p>
              <div className="flex items-center space-x-1">
                <Shield className="w-4 h-4 text-blue-600" />
                <p className="text-sm font-semibold text-gray-800 capitalize">{examDetails.proctoringLevel}</p>
              </div>
            </div>
          )}
          {examDetails.startTime && (
            <div>
              <p className="text-xs text-gray-600 mb-1">Scheduled Start</p>
              <p className="text-sm font-semibold text-gray-800">
                {new Date(examDetails.startTime).toLocaleString()}
              </p>
            </div>
          )}
          {examDetails.createdAt && (
            <div>
              <p className="text-xs text-gray-600 mb-1">Created At</p>
              <p className="text-sm font-semibold text-gray-800">
                {new Date(examDetails.createdAt).toLocaleDateString()}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

