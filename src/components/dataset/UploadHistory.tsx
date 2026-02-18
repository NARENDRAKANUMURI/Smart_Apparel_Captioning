import { useState, useEffect } from 'react';
import { History, Loader2, Eye, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface HistoryItem {
  id: string;
  file_name: string;
  image_url: string;
  caption: string | null;
  is_valid: boolean;
  analysis_result: {
    isValid?: boolean;
    reason?: string;
    caption?: string;
    items?: Array<{
      type: string;
      color: string;
      pattern: string;
      style: string;
      material?: string;
      details?: string;
    }>;
    occasion?: string;
    fashionTips?: string;
  } | null;
  created_at: string;
}

export const UploadHistory = () => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<HistoryItem | null>(null);

  const fetchHistory = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('upload_history')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setHistory((data as HistoryItem[]) || []);
    } catch (err) {
      console.error('Failed to fetch history:', err);
      toast.error('Failed to load upload history');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <History className="w-12 h-12 mx-auto mb-3 opacity-50" />
        <p>No upload history yet</p>
        <p className="text-sm mt-1">Upload and analyze images to see them here</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg font-semibold flex items-center gap-2">
          <History className="w-5 h-5" />
          Upload History ({history.length})
        </h3>
        <Button variant="outline" size="sm" onClick={fetchHistory}>
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {history.map((item) => (
          <div
            key={item.id}
            className={cn(
              "group relative rounded-lg overflow-hidden bg-secondary/30 border transition-all cursor-pointer hover:border-primary/30",
              item.is_valid ? "border-green-500/30" : "border-destructive/30"
            )}
            onClick={() => setSelectedItem(item)}
          >
            <div className="aspect-square relative">
              <img
                src={item.image_url}
                alt={item.file_name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
              <div className="w-full">
                <p className="text-xs text-white truncate">{item.file_name}</p>
                <p className="text-xs text-muted-foreground">{formatDate(item.created_at)}</p>
              </div>
            </div>

            {/* Status Badge */}
            <div className="absolute top-2 right-2">
              {item.is_valid ? (
                <Badge className="bg-green-500/80 text-xs">✓</Badge>
              ) : (
                <Badge variant="destructive" className="text-xs">✗</Badge>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Detail Modal */}
      <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedItem?.file_name}</DialogTitle>
          </DialogHeader>
          {selectedItem && (
            <div className="grid md:grid-cols-2 gap-6 mt-4">
              <div>
                <img
                  src={selectedItem.image_url}
                  alt={selectedItem.file_name}
                  className="w-full h-auto max-h-[50vh] object-contain rounded-lg"
                />
                <p className="text-sm text-muted-foreground mt-2">
                  Uploaded: {formatDate(selectedItem.created_at)}
                </p>
              </div>

              <div className="space-y-4">
                {selectedItem.caption && (
                  <div className="p-4 rounded-lg bg-primary/10 border border-primary/30">
                    <p className="font-medium">{selectedItem.caption}</p>
                  </div>
                )}

                {selectedItem.analysis_result?.items && selectedItem.analysis_result.items.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">
                      Detected Items
                    </h4>
                    {selectedItem.analysis_result.items.map((item, index) => (
                      <div key={index} className="p-3 rounded-lg bg-secondary/50 space-y-2">
                        <div className="flex flex-wrap gap-1.5">
                          <Badge className="bg-gradient-primary">{item.type}</Badge>
                          <Badge variant="outline">{item.color}</Badge>
                          <Badge variant="secondary">{item.style}</Badge>
                        </div>
                        {item.details && (
                          <p className="text-sm">{item.details}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {(selectedItem.analysis_result?.occasion || selectedItem.analysis_result?.fashionTips) && (
                  <div className="space-y-2 pt-2 border-t border-border">
                    {selectedItem.analysis_result?.occasion && (
                      <p className="text-sm">
                        <span className="font-medium">Occasion:</span> {selectedItem.analysis_result.occasion}
                      </p>
                    )}
                    {selectedItem.analysis_result?.fashionTips && (
                      <p className="text-sm">
                        <span className="font-medium">Fashion Tips:</span> {selectedItem.analysis_result.fashionTips}
                      </p>
                    )}
                  </div>
                )}

                {!selectedItem.is_valid && selectedItem.analysis_result?.reason && (
                  <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/30">
                    <p className="text-destructive">{selectedItem.analysis_result.reason}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};