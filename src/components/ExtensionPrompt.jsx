import { useState, useEffect } from 'react';
import { useExtensionDetection, detectBrowser } from '../hooks/useExtensionDetection';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  AlertTriangle,
  Download,
  CheckCircle,
  Chrome,
  ExternalLink,
  RefreshCw,
  X,
  Info,
} from 'lucide-react';
import { toast } from 'sonner';

// Extension download URLs - Update these with your actual URLs
// After packaging the extension, update these URLs to point to your hosted ZIP files
// Options:
// 1. GitHub Releases: https://github.com/yourusername/repo/releases/latest/download/filename.zip
// 2. Your Server: https://your-domain.com/extensions/filename.zip
// 3. GitHub Pages: https://yourusername.github.io/repo/extensions/filename.zip
const EXTENSION_DOWNLOAD_URLS = {
  chrome: 'https://github.com/mrmushii/CodeGuardExtension/releases/download/v0.00/dist.zip',
  edge: 'https://github.com/mrmushii/CodeGuardExtension/releases/download/v0.00/dist.zip',
  // Fallback to Chrome version for Edge
  firefox: null, // Firefox not supported yet
  safari: null, // Safari not supported yet
  opera: 'https://github.com/mrmushii/CodeGuardExtension/releases/download/v0.00/dist.zip', // Use Chrome version
  unknown: 'https://github.com/mrmushii/CodeGuardExtension/releases/download/v0.00/dist.zip',
  brave:'https://github.com/mrmushii/CodeGuardExtension/releases/download/v0.00/dist.zip',
};

// Installation instructions for each browser
const INSTALLATION_INSTRUCTIONS = {
  chrome: [
    '1. Download the extension ZIP file',
    '2. Extract the ZIP file to a folder',
    '3. Open Chrome and go to chrome://extensions/',
    '4. Enable "Developer mode" (toggle in top right)',
    '5. Click "Load unpacked"',
    '6. Select the extracted extension folder',
    '7. The extension should now be installed!',
  ],
  edge: [
    '1. Download the extension ZIP file',
    '2. Extract the ZIP file to a folder',
    '3. Open Edge and go to edge://extensions/',
    '4. Enable "Developer mode" (toggle in bottom left)',
    '5. Click "Load unpacked"',
    '6. Select the extracted extension folder',
    '7. The extension should now be installed!',
  ],
  opera: [
    '1. Download the extension ZIP file',
    '2. Extract the ZIP file to a folder',
    '3. Open Opera and go to opera://extensions/',
    '4. Enable "Developer mode" (toggle in top right)',
    '5. Click "Load unpacked"',
    '6. Select the extracted extension folder',
    '7. The extension should now be installed!',
  ],
  brave: [
    '1. Download the extension ZIP file',
    '2. Extract the ZIP file to a folder',
    '3. Open Brave and go to brave://extensions/',
    '4. Enable "Developer mode" (toggle in top right)',
    '5. Click "Load unpacked"',
    '6. Select the extracted extension folder',
    '7. The extension should now be installed!',
  ],
};

export function ExtensionPrompt({ onDismiss, showOnMount = true }) {
  const { isInstalled, isChecking, browser, checkExtension } = useExtensionDetection();
  const [showInstructions, setShowInstructions] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  const downloadUrl = EXTENSION_DOWNLOAD_URLS[browser] || EXTENSION_DOWNLOAD_URLS.chrome;
  const instructions = INSTALLATION_INSTRUCTIONS[browser] || INSTALLATION_INSTRUCTIONS.chrome;

  // Auto-dismiss if extension is installed
  useEffect(() => {
    if (isInstalled && !dismissed) {
      toast.success('Extension detected! You can now proceed with exams.');
      if (onDismiss) {
        setTimeout(() => onDismiss(), 2000);
      }
    }
  }, [isInstalled, dismissed, onDismiss]);

  // Don't show if dismissed or if extension is installed
  if (dismissed || isInstalled) {
    return null;
  }

  // Don't show if browser is not supported
  if (browser !== 'chrome' && browser !== 'edge' && browser !== 'opera' && browser !== 'brave') {
    return (
      <Alert className="mb-4 border-yellow-500 bg-yellow-50">
        <AlertTriangle className="h-4 w-4 text-yellow-600" />
        <AlertTitle className="text-yellow-800">Browser Not Supported</AlertTitle>
        <AlertDescription className="text-yellow-700">
          CodeGuard extension is only available for Chrome, Edge, Opera, and Brave browsers.
          Please switch to a supported browser to take exams.
        </AlertDescription>
      </Alert>
    );
  }

  // Don't show if no download URL available
  if (!downloadUrl) {
    return (
      <Alert className="mb-4 border-red-500 bg-red-50">
        <AlertTriangle className="h-4 w-4 text-red-600" />
        <AlertTitle className="text-red-800">Extension Not Available</AlertTitle>
        <AlertDescription className="text-red-700">
          Extension download is not available for your browser. Please contact support.
        </AlertDescription>
      </Alert>
    );
  }

  const handleDownload = () => {
    if (downloadUrl) {
      // Open download in new tab
      window.open(downloadUrl, '_blank');
      toast.info('Download started! Please follow the installation instructions after downloading.');
      setShowInstructions(true);
    } else {
      toast.error('Download URL not available');
    }
  };

  const handleDismiss = () => {
    setDismissed(true);
    if (onDismiss) {
      onDismiss();
    }
  };

  const handleRefresh = async () => {
    await checkExtension();
    if (!isInstalled) {
      toast.info('Extension still not detected. Make sure it is installed and enabled.');
    }
  };

  return (
    <Card className="mb-6 border-orange-500 bg-gradient-to-br from-orange-50 to-amber-50 shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {isChecking ? (
              <RefreshCw className="h-5 w-5 animate-spin text-orange-600" />
            ) : (
              <AlertTriangle className="h-5 w-5 text-orange-600" />
            )}
            <CardTitle className="text-lg font-semibold text-orange-900">
              CodeGuard Extension Required
            </CardTitle>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDismiss}
            className="h-8 w-8 p-0 text-orange-600 hover:text-orange-800 hover:bg-orange-100"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <AlertDescription className="text-orange-800">
          The CodeGuard Proctor extension is required to take exams. It monitors your
          browsing activity to ensure exam integrity.
        </AlertDescription>

        {/* Browser Info */}
        <div className="flex items-center gap-2 text-sm text-orange-700">
          <Chrome className="h-4 w-4" />
          <span>
            Detected Browser: <strong className="capitalize">{browser}</strong>
          </span>
        </div>

        {/* Status */}
        <div className="flex items-center gap-2">
          {isChecking ? (
            <>
              <RefreshCw className="h-4 w-4 animate-spin text-orange-600" />
              <span className="text-sm text-orange-700">Checking extension status...</span>
            </>
          ) : (
            <>
              <AlertTriangle className="h-4 w-4 text-orange-600" />
              <span className="text-sm text-orange-700">Extension not detected</span>
            </>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            onClick={handleDownload}
            className="bg-orange-600 hover:bg-orange-700 text-white flex items-center gap-2"
            disabled={isChecking}
          >
            <Download className="h-4 w-4" />
            Download Extension
          </Button>
          <Button
            onClick={handleRefresh}
            variant="outline"
            className="border-orange-300 text-orange-700 hover:bg-orange-100 flex items-center gap-2"
            disabled={isChecking}
          >
            <RefreshCw className={`h-4 w-4 ${isChecking ? 'animate-spin' : ''}`} />
            Check Again
          </Button>
        </div>

        {/* Installation Instructions */}
        {showInstructions && (
          <div className="mt-4 p-4 bg-white rounded-lg border border-orange-200">
            <div className="flex items-center gap-2 mb-3">
              <Info className="h-4 w-4 text-orange-600" />
              <h4 className="font-semibold text-orange-900">Installation Instructions</h4>
            </div>
            <ol className="list-decimal list-inside space-y-2 text-sm text-orange-800">
              {instructions.map((step, index) => (
                <li key={index} className="leading-relaxed">
                  {step}
                </li>
              ))}
            </ol>
            <div className="mt-4 p-3 bg-blue-50 rounded border border-blue-200">
              <p className="text-xs text-blue-800">
                <strong>Note:</strong> After installation, refresh this page and the extension
                should be detected automatically.
              </p>
            </div>
          </div>
        )}

        {/* Quick Links */}
        <div className="flex items-center gap-4 text-xs text-orange-600">
          <button
            onClick={() => {
              if (browser === 'chrome') {
                window.open('chrome://extensions/', '_blank');
              } else if (browser === 'edge') {
                window.open('edge://extensions/', '_blank');
              } else if (browser === 'opera') {
                window.open('opera://extensions/', '_blank');
              } else if (browser === 'brave') {
                window.open('brave://extensions/', '_blank');
              }
            }}
            className="hover:text-orange-800 underline flex items-center gap-1"
          >
            <ExternalLink className="h-3 w-3" />
            Open Extensions Page
          </button>
        </div>
      </CardContent>
    </Card>
  );
}

