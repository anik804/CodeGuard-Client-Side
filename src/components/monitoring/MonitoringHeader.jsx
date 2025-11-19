import { Upload, FileText, Clock, Users, AlertTriangle } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { formatTime } from "../../utils/timeFormatter";
import logo from "../../assets/logo.png";

export function MonitoringHeader({
  roomId,
  examDetails,
  examStarted,
  timer,
  examCountdown,
  questionFile,
  questionUrl,
  uploading,
  fileInputRef,
  onFileSelect,
  onUploadQuestion,
  onStartExam,
  onEndExam,
  activeStudents = 0,
  totalStudents = 0,
  flaggedCount = 0,
}) {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-md">
      <div className="px-4 md:px-6 py-3">
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg flex-shrink-0">
                <img src={logo} alt="CodeGuard Logo" className="h-7 w-7" />
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-lg md:text-xl font-bold gradient-text truncate">
                  CodeGuard Monitoring
                </h1>
                <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
                  <span className="px-2 py-0.5 bg-blue-100 rounded-md text-xs font-medium text-blue-700 border border-blue-200 whitespace-nowrap">
                    Room: {roomId}
                  </span>
                  {(examDetails?.examName || examDetails?.courseName) && (
                    <span className="px-2 py-0.5 bg-purple-100 rounded-md text-xs font-medium text-purple-700 border border-purple-200 truncate max-w-[150px]">
                      {examDetails.examName || examDetails.courseName}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap lg:flex-nowrap">
            {/* Upload question */}
            <div className="flex items-center gap-1.5 border-r pr-2 border-gray-300">
              <Input
                ref={fileInputRef}
                type="file"
                accept="application/pdf"
                onChange={onFileSelect}
                className="hidden"
              />
              <Button
                onClick={() => fileInputRef.current?.click()}
                variant="outline"
                size="sm"
                className="h-8 px-2.5 border-gray-300 bg-white hover:bg-gray-50 text-gray-700"
              >
                <Upload className="w-3.5 h-3.5" />
                <span className="hidden sm:inline text-xs ml-1">Upload</span>
              </Button>
              {questionFile && (
                <Button
                  onClick={onUploadQuestion}
                  disabled={uploading}
                  size="sm"
                  className="h-8 px-2.5 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {uploading ? (
                    <>
                      <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-xs ml-1">Saving</span>
                    </>
                  ) : (
                    <>
                      <FileText className="w-3.5 h-3.5" />
                      <span className="text-xs ml-1">Save</span>
                    </>
                  )}
                </Button>
              )}
              {questionUrl && !questionFile && (
                <div className="flex items-center gap-1 px-2 py-1 bg-green-600 rounded-md">
                  <FileText className="w-3.5 h-3.5 text-white" />
                  <span className="text-xs font-medium text-white">Ready</span>
                </div>
              )}
            </div>

            {/* Exam Controls */}
            <Button
              onClick={onStartExam}
              disabled={examStarted}
              size="sm"
              className={`h-8 px-3 text-xs font-semibold whitespace-nowrap ${
                examStarted 
                  ? "bg-gray-300 cursor-not-allowed text-gray-500" 
                  : "bg-green-600 hover:bg-green-700 text-white"
              }`}
            >
              {examStarted ? "Running" : "Start"}
            </Button>
            <Button
              onClick={onEndExam}
              disabled={!examStarted}
              size="sm"
              className={`h-8 px-3 text-xs font-semibold whitespace-nowrap ${
                !examStarted 
                  ? "bg-gray-300 cursor-not-allowed text-gray-500" 
                  : "bg-red-600 hover:bg-red-700 text-white"
              }`}
            >
              End
            </Button>

            {/* Stats Info */}
            <div className="flex items-center gap-1.5 border-r pr-2 border-gray-300">
              <div className="flex items-center gap-1 px-2 py-1 bg-blue-50 rounded-md border border-blue-200">
                <Users className="w-3.5 h-3.5 text-blue-600" />
                <span className="text-xs font-semibold text-blue-700">{activeStudents}/{totalStudents}</span>
              </div>
              {flaggedCount > 0 && (
                <div className="flex items-center gap-1 px-2 py-1 bg-red-50 rounded-md border border-red-200">
                  <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
                  <span className="text-xs font-semibold text-red-700">{flaggedCount}</span>
                </div>
              )}
            </div>

            {/* Timer - Single timer showing exam countdown when started, session time otherwise */}
            {examStarted && examDetails?.examDuration ? (
              <div className={`flex items-center gap-1.5 px-2.5 py-1.5 bg-white border-2 rounded-md shadow-sm whitespace-nowrap ${
                examCountdown <= 300 ? 'border-red-500 bg-red-50 animate-pulse' : 'border-blue-500 bg-blue-50'
              }`}>
                <Clock className={`w-4 h-4 ${examCountdown <= 300 ? 'text-red-600' : 'text-blue-600'}`} />
                <div>
                  <p className={`font-mono text-sm font-bold leading-tight ${examCountdown <= 300 ? 'text-red-700' : 'text-blue-700'}`}>
                    {formatTime(examCountdown)}
                  </p>
                  <p className="text-[9px] text-gray-600 leading-tight">Remaining</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white border border-gray-300 rounded-md shadow-sm whitespace-nowrap">
                <Clock className="w-4 h-4 text-gray-600" />
                <div>
                  <p className="font-mono text-sm font-bold leading-tight text-gray-800">{formatTime(timer)}</p>
                  <p className="text-[9px] text-gray-600 leading-tight">Session</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

