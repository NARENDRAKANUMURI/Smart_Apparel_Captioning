import { useState } from 'react';
import { X, Download, Loader2, ExternalLink, ImageOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { FashionProduct } from '@/data/fashionDataset';
import { toast } from 'sonner';

interface ProductModalProps {
  product: FashionProduct | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ProductModal = ({ product, isOpen, onClose }: ProductModalProps) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  if (!product) return null;

  const handleDownload = async () => {
    setIsDownloading(true);
    const filename = `${product.id}_${product.articleType.replace(/\s+/g, '_')}.jpg`;
    
    try {
      // Fetch the local image asset directly
      const response = await fetch(product.imageUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success(`Downloaded ${product.productDisplayName}`);
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download image');
    } finally {
      setIsDownloading(false);
    }
  };

  const details = [
    { label: 'Product ID', value: product.id },
    { label: 'Gender', value: product.gender },
    { label: 'Master Category', value: product.masterCategory },
    { label: 'Sub Category', value: product.subCategory },
    { label: 'Article Type', value: product.articleType },
    { label: 'Base Colour', value: product.baseColour },
    { label: 'Season', value: product.season },
    { label: 'Year', value: product.year },
    { label: 'Usage', value: product.usage },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-xl pr-8">
            {product.productDisplayName}
          </DialogTitle>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-6 mt-4">
          {/* Image */}
          <div className="relative rounded-xl overflow-hidden bg-secondary/30">
            {!imageError ? (
              <img
                src={product.imageUrl}
                alt={product.productDisplayName}
                className={`w-full h-auto transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                onLoad={() => setImageLoaded(true)}
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-full aspect-[3/4] flex items-center justify-center bg-secondary/50">
                <ImageOff className="w-16 h-16 text-muted-foreground/50" />
              </div>
            )}
            {!imageLoaded && !imageError && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
              </div>
            )}
          </div>

          {/* Details */}
          <div className="space-y-6">
            <div className="flex flex-wrap gap-2">
              <Badge className="bg-gradient-primary text-primary-foreground">
                {product.masterCategory}
              </Badge>
              <Badge variant="outline">{product.gender}</Badge>
              <Badge variant="secondary">{product.usage}</Badge>
            </div>

            <div className="space-y-3">
              <h4 className="font-display font-semibold text-sm text-muted-foreground uppercase tracking-wider">
                Product Details
              </h4>
              <div className="grid grid-cols-2 gap-3">
                {details.map((detail) => (
                  <div key={detail.label} className="space-y-1">
                    <p className="text-xs text-muted-foreground">{detail.label}</p>
                    <p className="text-sm font-medium">{detail.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                className="flex-1 gap-2 bg-gradient-primary"
                onClick={handleDownload}
                disabled={isDownloading}
              >
                {isDownloading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Download className="w-4 h-4" />
                )}
                Download Image
              </Button>
              <Button
                variant="outline"
                className="gap-2"
                onClick={() => window.open(product.imageUrl, '_blank')}
              >
                <ExternalLink className="w-4 h-4" />
                Open Original
              </Button>
            </div>

            <div className="p-4 rounded-lg bg-secondary/30 border border-border/50">
              <p className="text-xs text-muted-foreground">
                This image is part of the{' '}
                <a
                  href="https://www.kaggle.com/datasets/paramaggarwal/fashion-product-images-small"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Fashion Product Images Dataset
                </a>{' '}
                from Kaggle. The dataset contains 44,000+ fashion product images with detailed metadata.
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
