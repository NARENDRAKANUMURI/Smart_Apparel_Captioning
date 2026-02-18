import { useState, useMemo } from 'react';
import { Database, FileImage, Download, Grid, List, Loader2, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/Navbar';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { fashionProducts, categoryStats, FashionProduct } from '@/data/fashionDataset';
import { DatasetFilters, FilterState } from '@/components/dataset/DatasetFilters';
import { ProductCard } from '@/components/dataset/ProductCard';
import { ProductModal } from '@/components/dataset/ProductModal';
import { ImageUploadSection } from '@/components/dataset/ImageUploadSection';

const ITEMS_PER_PAGE = 8;

const Dataset = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [displayedCount, setDisplayedCount] = useState(ITEMS_PER_PAGE);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<FashionProduct | null>(null);
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    gender: 'all',
    category: 'all',
    season: 'all',
    color: 'all',
  });

  // Filter products based on current filters
  const filteredProducts = useMemo(() => {
    return fashionProducts.filter(product => {
      const matchesSearch = filters.search === '' || 
        product.productDisplayName.toLowerCase().includes(filters.search.toLowerCase()) ||
        product.articleType.toLowerCase().includes(filters.search.toLowerCase());
      
      const matchesGender = filters.gender === 'all' || product.gender === filters.gender;
      const matchesCategory = filters.category === 'all' || product.masterCategory === filters.category;
      const matchesSeason = filters.season === 'all' || product.season === filters.season;
      const matchesColor = filters.color === 'all' || product.baseColour === filters.color;

      return matchesSearch && matchesGender && matchesCategory && matchesSeason && matchesColor;
    });
  }, [filters]);

  const displayedProducts = filteredProducts.slice(0, displayedCount);
  const hasMore = displayedCount < filteredProducts.length;

  const handleLoadMore = () => {
    setIsLoading(true);
    setTimeout(() => {
      setDisplayedCount((prev) => Math.min(prev + ITEMS_PER_PAGE, filteredProducts.length));
      setIsLoading(false);
      toast.success(`Loaded more products`);
    }, 500);
  };

  const handleDownloadDataset = () => {
    toast.loading('Preparing dataset for download...', { id: 'dataset-download' });
    setTimeout(() => {
      const csvContent = [
        'id,productDisplayName,gender,masterCategory,subCategory,articleType,baseColour,season,year,usage,imageUrl',
        ...fashionProducts.map((p) => 
          `${p.id},"${p.productDisplayName}",${p.gender},${p.masterCategory},${p.subCategory},${p.articleType},${p.baseColour},${p.season},${p.year},${p.usage},${p.imageUrl}`
        ),
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'fashion_product_dataset.csv';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success('Dataset CSV downloaded!', { id: 'dataset-download' });
    }, 1000);
  };

  // Reset displayed count when filters change
  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    setDisplayedCount(ITEMS_PER_PAGE);
  };

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[150px] animate-float" />
          <div className="absolute bottom-0 left-1/3 w-[400px] h-[400px] bg-accent/10 rounded-full blur-[120px]" />
        </div>

        <div className="relative z-10 container max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <Database className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Kaggle Fashion Dataset</span>
            </div>
            <h1 className="font-display text-4xl md:text-6xl font-bold tracking-tight mb-4">
              <span className="text-gradient">Fashion Product</span>
              <span className="text-foreground"> Images</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-6">
              Explore 44,000+ labeled fashion images from the Kaggle Fashion Product Images dataset.
              Download, visualize, and use for your AI models.
            </p>
            <a
              href="https://www.kaggle.com/datasets/paramaggarwal/fashion-product-images-small"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-primary hover:underline"
            >
              <ExternalLink className="w-4 h-4" />
              View on Kaggle
            </a>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="p-6 rounded-2xl bg-gradient-card border border-border/50">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center">
                  <FileImage className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <div className="font-display text-3xl font-bold text-gradient">44,000+</div>
                  <div className="text-muted-foreground text-sm">Product Images</div>
                </div>
              </div>
            </div>
            <div className="p-6 rounded-2xl bg-gradient-card border border-border/50">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center">
                  <Grid className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <div className="font-display text-3xl font-bold">7</div>
                  <div className="text-muted-foreground text-sm">Master Categories</div>
                </div>
              </div>
            </div>
            <div className="p-6 rounded-2xl bg-gradient-card border border-border/50">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                  <Download className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <div className="font-display text-3xl font-bold">593 MB</div>
                  <div className="text-muted-foreground text-sm">Dataset Size</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 border-y border-border/50 bg-card/30">
        <div className="container max-w-6xl mx-auto px-4">
          <h2 className="font-display text-2xl font-bold mb-8">Categories Overview</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categoryStats.map((item) => (
              <div
                key={item.id}
                className="group p-5 rounded-xl bg-background border border-border/50 hover:border-primary/30 transition-all duration-300 cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-display font-semibold text-lg mb-1">{item.category}</h3>
                    <p className="text-muted-foreground text-sm">
                      {item.count.toLocaleString()} images
                    </p>
                  </div>
                  <div className={cn(
                    "w-3 h-3 rounded-full",
                    item.color === 'primary' ? 'bg-primary' : 'bg-accent'
                  )} />
                </div>
                <div className="mt-4 h-2 bg-secondary rounded-full overflow-hidden">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all duration-500 group-hover:opacity-80",
                      item.color === 'primary' ? 'bg-gradient-primary' : 'bg-accent'
                    )}
                    style={{ width: `${(item.count / 18500) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content Tabs */}
      <section className="py-16">
        <div className="container max-w-6xl mx-auto px-4">
          <Tabs defaultValue="browse" className="space-y-8">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
              <TabsTrigger value="browse">Browse Dataset</TabsTrigger>
              <TabsTrigger value="upload">Upload Images</TabsTrigger>
            </TabsList>

            {/* Browse Tab */}
            <TabsContent value="browse" className="space-y-6">
              {/* Filters */}
              <DatasetFilters
                filters={filters}
                onFilterChange={handleFilterChange}
                resultCount={filteredProducts.length}
              />

              {/* View Toggle */}
              <div className="flex items-center justify-between">
                <h2 className="font-display text-xl font-bold">
                  Sample Products ({displayedProducts.length} of {filteredProducts.length})
                </h2>
                <div className="flex border border-border/50 rounded-lg overflow-hidden">
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn("rounded-none", viewMode === 'grid' && 'bg-secondary')}
                    onClick={() => setViewMode('grid')}
                  >
                    <Grid className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn("rounded-none", viewMode === 'list' && 'bg-secondary')}
                    onClick={() => setViewMode('list')}
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Products Grid */}
              {filteredProducts.length > 0 ? (
                <div className={cn(
                  "grid gap-6",
                  viewMode === 'grid' 
                    ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4" 
                    : "grid-cols-1"
                )}>
                  {displayedProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onView={setSelectedProduct}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No products match your filters</p>
                </div>
              )}

              {/* Load More & Download */}
              <div className="flex items-center justify-center gap-4 pt-6">
                {hasMore && (
                  <Button
                    variant="outline"
                    className="border-border/50"
                    onClick={handleLoadMore}
                    disabled={isLoading}
                  >
                    {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    {isLoading ? 'Loading...' : `Load More (${filteredProducts.length - displayedCount} remaining)`}
                  </Button>
                )}
                <Button
                  variant="default"
                  className="gap-2"
                  onClick={handleDownloadDataset}
                >
                  <Download className="w-4 h-4" />
                  Download Dataset CSV
                </Button>
              </div>
            </TabsContent>

            {/* Upload Tab */}
            <TabsContent value="upload">
              <ImageUploadSection />
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Product Modal */}
      <ProductModal
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />

      {/* Footer */}
      <footer className="py-8 border-t border-border/50 bg-card/30">
        <div className="container max-w-6xl mx-auto px-4 text-center text-muted-foreground text-sm">
          <p>
            Dataset source:{' '}
            <a
              href="https://www.kaggle.com/datasets/paramaggarwal/fashion-product-images-small"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Kaggle Fashion Product Images
            </a>
            {' '}• Images for research and educational purposes.
          </p>
        </div>
      </footer>
    </main>
  );
};

export default Dataset;
