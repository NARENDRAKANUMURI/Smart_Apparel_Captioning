import { FrameAnalysis } from '@/hooks/useVideoAnalysis';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CheckCircle, XCircle, Clock } from 'lucide-react';

interface VideoAnalysisResultProps {
  frames: FrameAnalysis[];
  progress: number;
  isAnalyzing: boolean;
  totalFrames: number;
}

export const VideoAnalysisResult = ({ frames, progress, isAnalyzing, totalFrames }: VideoAnalysisResultProps) => {
  if (frames.length === 0 && !isAnalyzing) return null;

  return (
    <div className="space-y-6">
      {/* Progress */}
      {isAnalyzing && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Analyzing frames...</span>
            <span className="text-foreground font-medium">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
          <p className="text-xs text-muted-foreground text-center">
            {frames.length} of {totalFrames} frames analyzed
          </p>
        </div>
      )}

      {/* Frame Results */}
      <ScrollArea className="h-[500px] pr-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {frames.map((frame) => (
            <div
              key={frame.frameNumber}
              className="bg-card border border-border rounded-lg overflow-hidden animate-fade-in"
            >
              {/* Frame Preview */}
              <div className="relative aspect-video bg-secondary">
                <img
                  src={frame.preview}
                  alt={`Frame ${frame.frameNumber}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 left-2 flex items-center gap-2">
                  <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm">
                    <Clock className="w-3 h-3 mr-1" />
                    {frame.timestamp}s
                  </Badge>
                  {frame.isValid ? (
                    <Badge className="bg-green-500/80 backdrop-blur-sm">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Valid
                    </Badge>
                  ) : (
                    <Badge variant="destructive" className="backdrop-blur-sm">
                      <XCircle className="w-3 h-3 mr-1" />
                      Invalid
                    </Badge>
                  )}
                </div>
              </div>

              {/* Frame Caption */}
              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-muted-foreground">
                    Frame {frame.frameNumber}
                  </span>
                </div>

                {frame.isValid && frame.caption ? (
                  <>
                    <p className="text-sm text-foreground leading-relaxed">
                      {frame.caption}
                    </p>
                    
                    {frame.items && frame.items.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {frame.items.map((item, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {item.color} {item.type}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground italic">
                    {frame.reason || 'No apparel detected in this frame'}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Summary */}
      {!isAnalyzing && frames.length > 0 && (
        <div className="bg-card border border-border rounded-lg p-4">
          <h3 className="font-display font-semibold mb-2">Analysis Summary</h3>
          <div className="flex gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Total Frames:</span>{' '}
              <span className="font-medium">{frames.length}</span>
            </div>
            <div>
              <span className="text-muted-foreground">With Apparel:</span>{' '}
              <span className="font-medium text-green-500">
                {frames.filter(f => f.isValid).length}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">No Apparel:</span>{' '}
              <span className="font-medium text-muted-foreground">
                {frames.filter(f => !f.isValid).length}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
