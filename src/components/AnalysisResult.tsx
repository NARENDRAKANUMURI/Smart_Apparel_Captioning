import { AlertCircle, Sparkles, Tag, Palette, Shirt, Calendar, Lightbulb } from 'lucide-react';
import { AnalysisResult as AnalysisResultType } from '@/hooks/useApparelAnalysis';
import { cn } from '@/lib/utils';

interface AnalysisResultProps {
  result: AnalysisResultType;
  imagePreview: string;
}

export const AnalysisResult = ({ result, imagePreview }: AnalysisResultProps) => {
  if (!result.isValid) {
    return (
      <div className="animate-fade-in">
        <div className="bg-destructive/10 border border-destructive/30 rounded-xl p-6 flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-destructive/20 flex items-center justify-center flex-shrink-0">
            <AlertCircle className="w-6 h-6 text-destructive" />
          </div>
          <div>
            <h3 className="font-display font-bold text-lg text-destructive">Invalid Image</h3>
            <p className="text-muted-foreground mt-1">{result.reason}</p>
            <p className="text-sm text-muted-foreground mt-3">
              Please upload an image containing clothing or apparel items.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-6">
      {/* Main Caption */}
      <div className="bg-gradient-card rounded-xl p-6 border border-border">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center flex-shrink-0 shadow-glow">
            <Sparkles className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h3 className="font-display font-bold text-lg text-gradient">AI Caption</h3>
            <p className="text-foreground mt-2 leading-relaxed">{result.caption}</p>
          </div>
        </div>
      </div>

      {/* Detected Items */}
      {result.items && result.items.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-display font-bold text-lg flex items-center gap-2">
            <Shirt className="w-5 h-5 text-primary" />
            Detected Items
          </h3>
          <div className="grid gap-4 md:grid-cols-2">
            {result.items.map((item, index) => (
              <div
                key={index}
                className={cn(
                  "bg-card rounded-xl p-5 border border-border",
                  "hover:border-primary/40 transition-all duration-300",
                  "animate-scale-in"
                )}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <Tag className="w-4 h-4 text-primary" />
                  <span className="font-display font-semibold text-foreground capitalize">
                    {item.type}
                  </span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Palette className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Color:</span>
                    <span className="text-foreground capitalize">{item.color}</span>
                  </div>
                  {item.pattern && (
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground ml-6">Pattern:</span>
                      <span className="text-foreground capitalize">{item.pattern}</span>
                    </div>
                  )}
                  {item.style && (
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground ml-6">Style:</span>
                      <span className="text-foreground capitalize">{item.style}</span>
                    </div>
                  )}
                  {item.material && (
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground ml-6">Material:</span>
                      <span className="text-foreground capitalize">{item.material}</span>
                    </div>
                  )}
                  {item.details && (
                    <p className="text-muted-foreground mt-2 text-xs">{item.details}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Occasion & Tips */}
      <div className="grid gap-4 md:grid-cols-2">
        {result.occasion && (
          <div className="bg-card rounded-xl p-5 border border-border">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-5 h-5 text-accent" />
              <span className="font-display font-semibold text-foreground">Occasion</span>
            </div>
            <p className="text-muted-foreground">{result.occasion}</p>
          </div>
        )}
        {result.fashionTips && (
          <div className="bg-card rounded-xl p-5 border border-border">
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="w-5 h-5 text-accent" />
              <span className="font-display font-semibold text-foreground">Styling Tip</span>
            </div>
            <p className="text-muted-foreground">{result.fashionTips}</p>
          </div>
        )}
      </div>
    </div>
  );
};
