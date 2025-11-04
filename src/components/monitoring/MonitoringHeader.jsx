import { Upload, FileText, Clock } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { formatTime } from "../../utils/timeFormatter";

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
}) {
  return (
    <header className="sticky top-0 z-50 bg-slate-900 border-b border-slate-700 shadow-lg">
      <div className="px-4 md:px-6 py-3">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3">
          <div className="flex-1">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center border border-slate-700">
                <img src="/src/assets/logo.png" alt="CodeGuard Logo" className="h-7 w-7" />
              </div>
              <div>
                <h1 className="text-lg md:text-xl font-bold text-slate-100">
                  CodeGuard Monitoring
                </h1>
                <div className="flex flex-wrap items-center gap-2 mt-0.5">
                  <span className="px-2 py-0.5 bg-slate-800 rounded-md text-xs font-medium text-slate-300 border border-slate-700">
                    Room: {roomId}
                  </span>
                  {examDetails?.courseName && (
                    <span className="px-2 py-0.5 bg-slate-800 rounded-md text-xs font-medium text-slate-300 border border-slate-700">
                      {examDetails.courseName}
                    </span>
                  )}
                  {examDetails?.examDuration && (
                    <span className="px-2 py-0.5 bg-slate-800 rounded-md text-xs font-medium text-slate-300 border border-slate-700">
                      {examDetails.examDuration} min
                    </span>
                  )}
                  {examStarted && (
                    <span className="px-2 py-0.5 bg-green-600 rounded-md text-xs font-semibold text-white">
                      ⏱️ {formatTime(timer)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Upload question - available before and during exam */}
            <div className="flex items-center space-x-2 border-r pr-2 border-slate-700">
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
                className="flex items-center space-x-1.5 border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 h-9 px-3"
              >
                <Upload className="w-4 h-4" />
                <span className="hidden sm:inline text-xs font-medium">Upload</span>
              </Button>
              {questionFile && (
                <Button
                  onClick={onUploadQuestion}
                  disabled={uploading}
                  className="flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 h-9 px-3"
                >
                  {uploading ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-xs">Saving...</span>
                    </>
                  ) : (
                    <>
                      <FileText className="w-3.5 h-3.5" />
                      <span className="text-xs font-medium">Save</span>
                    </>
                  )}
                </Button>
              )}
              {questionUrl && !questionFile && (
                <div className="flex items-center space-x-1.5 px-2.5 py-1.5 bg-green-600 rounded-md">
                  <FileText className="w-3.5 h-3.5 text-white" />
                  <span className="text-xs font-medium text-white">Ready</span>
                </div>
              )}
            </div>
            <Button
              onClick={onStartExam}
              disabled={examStarted}
              className={`h-9 px-4 text-xs font-semibold ${
                examStarted 
                  ? "bg-slate-700 cursor-not-allowed text-slate-400" 
                  : "bg-green-600 hover:bg-green-700 text-white"
              }`}
            >
              {examStarted ? "Running" : "Start Exam"}
            </Button>
            <Button
              onClick={onEndExam}
              disabled={!examStarted}
              className={`h-9 px-4 text-xs font-semibold ${
                !examStarted 
                  ? "bg-slate-700 cursor-not-allowed text-slate-400" 
                  : "bg-red-600 hover:bg-red-700 text-white"
              }`}
            >
              End Exam
            </Button>
            {/* Exam Countdown Timer */}
            {examStarted && examDetails?.examDuration && (
              <div className={`text-right bg-slate-800 border border-slate-700 text-slate-200 px-3 py-1.5 rounded-md ${examCountdown <= 300 ? 'animate-pulse bg-red-900/50 border-red-700' : ''}`}>
                <p className={`font-mono text-base font-bold ${examCountdown <= 300 ? 'text-red-300' : 'text-slate-200'}`}>
                  {formatTime(examCountdown)}
                </p>
                <p className="text-[10px] text-slate-400">Time Left</p>
              </div>
            )}
            {/* Session Timer */}
            <div className="text-right bg-slate-800 border border-slate-700 text-slate-200 px-3 py-1.5 rounded-md">
              <p className="font-mono text-base font-bold">{formatTime(timer)}</p>
              <p className="text-[10px] text-slate-400">Session</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

