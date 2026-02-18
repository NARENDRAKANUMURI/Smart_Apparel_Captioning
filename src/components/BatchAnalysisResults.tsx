import { Loader2, CheckCircle, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { AnalysisResult as AnalysisResultType } from '@/hooks/useApparelAnalysis';
import { AnalysisResult } from './AnalysisResult';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface ImageAnalysis {
  id: string;
  preview: string;
  status: 'pending' | 'analyzing' | 'complete' | 'error';
  result?: AnalysisResultType;
  error?: string;
}

interface BatchAnalysisResultsProps {
  analyses: ImageAnalysis[];
}

export const BatchAnalysisResults = ({ analyses }: BatchAnalysisResultsProps) => {
  const [expandedId, setExpandedId] = useState<string | null>(
    analyses.length === 1 ? analyses[0]?.id : null
  );

  const completedCount = analyses.filter(a => a.status === 'complete').length;
  const errorCount = analyses.filter(a => a.status === 'error').length;
  const pendingCount = analyses.filter(a => a.status === 'pending' || a.status === 'analyzing').length;

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="flex items-center gap-3 flex-wrap">
        {completedCount > 0 && (
          <Badge variant="secondary" className="bg-accent/20 text-accent border-accent/30">
            <CheckCircle className="w-3 h-3 mr-1" />
            {completedCount} Complete
          </Badge>
        )}
        {pendingCount > 0 && (
          <Badge variant="secondary" className="bg-primary/20 text-primary border-primary/30">
            <Loader2 className="w-3 h-3 mr-1 animate-spin" />
            {pendingCount} Processing
          </Badge>
        )}
        {errorCount > 0 && (
          <Badge variant="destructive">
            <AlertCircle className="w-3 h-3 mr-1" />
            {errorCount} Failed
          </Badge>
        )}
      </div>

      {/* Results Grid */}
      <div className="space-y-3">
        {analyses.map((analysis) => (
          <div
            key={analysis.id}
            className={cn(
              "bg-card rounded-xl border border-border overflow-hidden transition-all",
              expandedId === analysis.id && "ring-2 ring-primary/30"
            )}
          >
            {/* Header */}
            <button
              onClick={() => setExpandedId(expandedId === analysis.id ? null : analysis.id)}
              className="w-full flex items-center gap-4 p-4 hover:bg-secondary/30 transition-colors"
            >
              <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border border-border">
                <img
                  src={analysis.preview}
                  alt="Analyzed"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = '/placeholder.svg';
                  }}
                />
              </div>

              <div className="flex-1 min-w-0 text-left">
                {analysis.status === 'analyzing' && (
                  <div className="flex items-center gap-2 text-primary">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm font-medium">Analyzing...</span>
                  </div>
                )}
                {analysis.status === 'pending' && (
                  <span className="text-sm text-muted-foreground">Waiting...</span>
                )}
                {analysis.status === 'complete' && analysis.result && (
                  <div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-accent" />
                      <span className="text-sm font-medium text-foreground">
                        {analysis.result.isValid ? 'Analysis Complete' : 'Invalid Image'}
                      </span>
                    </div>
                    {analysis.result.caption && (
                      <p className="text-sm text-muted-foreground truncate mt-1">
                        {analysis.result.caption}
                      </p>
                    )}
                  </div>
                )}
                {analysis.status === 'error' && (
                  <div className="flex items-center gap-2 text-destructive">
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-sm">{analysis.error || 'Analysis failed'}</span>
                  </div>
                )}
              </div>

              {analysis.status === 'complete' && (
                <div className="flex-shrink-0">
                  {expandedId === analysis.id ? (
                    <ChevronUp className="w-5 h-5 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-muted-foreground" />
                  )}
                </div>
              )}
            </button>

            {/* Expanded Content */}
            {expandedId === analysis.id && analysis.status === 'complete' && analysis.result && (
              <div className="border-t border-border p-4 bg-secondary/10">
                <AnalysisResult result={analysis.result} imagePreview={analysis.preview} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
