import { useState } from 'react';
import { Sparkles, RotateCcw, Image as ImageIcon, Video, History } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MultiImageUploader } from '@/components/MultiImageUploader';
import { VideoUploader } from '@/components/VideoUploader';
import { BatchAnalysisResults } from '@/components/BatchAnalysisResults';
import { VideoAnalysisResult } from '@/components/VideoAnalysisResult';
import { UploadHistory } from '@/components/dataset/UploadHistory';
import { useBatchAnalysis } from '@/hooks/useBatchAnalysis';
import { useVideoAnalysis } from '@/hooks/useVideoAnalysis';
import { Navbar } from '@/components/Navbar';

interface ImageItem {
  id: string;
  url?: string;
  base64?: string;
  preview: string;
}

const Caption = () => {
  const [mode, setMode] = useState<'image' | 'video'>('image');
  const [showHistory, setShowHistory] = useState(false);
  const { analyses, isAnalyzing, analyzeImages, reset } = useBatchAnalysis();
  const { isAnalyzing: isAnalyzingVideo, progress, frames, totalFrames, analyzeVideo, reset: resetVideo } = useVideoAnalysis();

  const handleImagesSelect = async (images: ImageItem[]) => {
    await analyzeImages(images);
  };

  const handleVideoSelect = async (file: File) => {
    await analyzeVideo(file);
  };

  const handleReset = () => {
    reset();
    resetVideo();
  };

  const hasResults = analyses.length > 0 || isAnalyzing;
  const hasVideoResults = frames.length > 0 || isAnalyzingVideo;

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-accent/10 rounded-full blur-[100px] animate-float" style={{ animationDelay: '-3s' }} />
      </div>

      <div className="relative z-10 container max-w-5xl mx-auto px-4 pt-32 pb-12">
        {/* Header */}
        <header className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">AI-Powered Fashion Analysis</span>
          </div>
          <h1 className="font-display text-4xl md:text-6xl font-bold tracking-tight mb-4">
            <span className="text-gradient">Apparel</span>
            <span className="text-foreground"> Captioner</span>
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto">
            Upload multiple clothing images or videos and get instant AI-powered descriptions, 
            style analysis, and fashion recommendations.
          </p>
        </header>

        {/* Toggle between Uploader and History */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex rounded-lg border border-border p-1 bg-secondary/30">
            <Button
              variant={!showHistory ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setShowHistory(false)}
              className={!showHistory ? 'bg-gradient-primary' : ''}
            >
              <ImageIcon className="w-4 h-4 mr-2" />
              Analyze
            </Button>
            <Button
              variant={showHistory ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setShowHistory(true)}
              className={showHistory ? 'bg-gradient-primary' : ''}
            >
              <History className="w-4 h-4 mr-2" />
              History
            </Button>
          </div>
        </div>

        {showHistory ? (
          <div className="animate-fade-in">
            <UploadHistory />
          </div>
        ) : (
          /* Main Content */
          <div className="space-y-8">
            {!hasResults && !hasVideoResults ? (
              <div className="animate-fade-in">
                <Tabs value={mode} onValueChange={(v) => setMode(v as 'image' | 'video')} className="w-full">
                  <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
                    <TabsTrigger value="image" className="gap-2">
                      <ImageIcon className="w-4 h-4" />
                      Images
                    </TabsTrigger>
                    <TabsTrigger value="video" className="gap-2">
                      <Video className="w-4 h-4" />
                      Video
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="image">
                    <MultiImageUploader onImagesSelect={handleImagesSelect} disabled={isAnalyzing} />
                  </TabsContent>
                  
                  <TabsContent value="video">
                    <VideoUploader onVideoSelect={handleVideoSelect} disabled={isAnalyzingVideo} />
                  </TabsContent>
                </Tabs>
              </div>
            ) : hasVideoResults ? (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="font-display text-2xl font-bold">Video Analysis Results</h2>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="gap-2"
                    onClick={handleReset}
                    disabled={isAnalyzingVideo}
                  >
                    <RotateCcw className="w-4 h-4" />
                    New Analysis
                  </Button>
                </div>
                <VideoAnalysisResult 
                  frames={frames} 
                  progress={progress} 
                  isAnalyzing={isAnalyzingVideo}
                  totalFrames={totalFrames}
                />
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="font-display text-2xl font-bold">Analysis Results</h2>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="gap-2"
                    onClick={handleReset}
                    disabled={isAnalyzing}
                  >
                    <RotateCcw className="w-4 h-4" />
                    New Analysis
                  </Button>
                </div>
                <BatchAnalysisResults analyses={analyses} />
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <footer className="mt-16 text-center text-muted-foreground text-sm">
          <p>Powered by AI vision technology • Works with any clothing image or video</p>
        </footer>
      </div>
    </main>
  );
};

export default Caption;
