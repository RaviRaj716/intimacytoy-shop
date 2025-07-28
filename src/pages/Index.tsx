import { useState, useMemo, useEffect } from 'react';
import { Search, X, Shield, Truck, Gift } from 'lucide-react';
import { ProductCard } from '@/components/ProductCard';
import { ProductModal } from '@/components/ProductModal';
import { FilterBar } from '@/components/FilterBar';
import { AdminPanel } from '@/components/AdminPanel';
import { products } from '@/data/products';
import { useLivePrices } from '@/hooks/useLivePrices';
import type { Product } from '@/types/product';

const Index = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 350]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  // Fetch live prices from Google Sheets
  const { livePrices, isLoading: pricesLoading } = useLivePrices();

  // Merge products with live prices
  const productsWithLivePrices = useMemo(() => {
    return products.map(product => {
      const livePrice = livePrices[product.sku.toUpperCase()];
      if (livePrice) {
        return {
          ...product,
          minPrice: livePrice,
          maxPrice: livePrice,
          priceRange: `${livePrice}USD`
        };
      }
      return product;
    });
  }, [livePrices]);

  // Check for shared product in URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const sharedProductSku = urlParams.get('product');
    
    if (sharedProductSku) {
      const sharedProduct = productsWithLivePrices.find(p => p.sku === sharedProductSku);
      if (sharedProduct) {
        setSelectedProduct(sharedProduct);
        // Clean up URL without refreshing
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }
  }, [productsWithLivePrices]);

  const categories = useMemo(() => {
    const cats = new Set<string>();
    products.forEach(product => {
      if (product.features.toLowerCase().includes('dildo')) cats.add('dildo');
      else if (product.features.toLowerCase().includes('vibrat')) cats.add('vibrator');
      else if (product.features.toLowerCase().includes('masturbat')) cats.add('masturbator');
      else if (product.features.toLowerCase().includes('spray') || product.features.toLowerCase().includes('cream')) cats.add('enhancement');
      else if (product.features.toLowerCase().includes('doll')) cats.add('doll');
      else cats.add('accessory');
    });
    return Array.from(cats);
  }, []);

  const filteredProducts = useMemo(() => {
    return productsWithLivePrices.filter(product => {
      const matchesSearch = product.features.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.sku.toLowerCase().includes(searchTerm.toLowerCase());
      
      const price = product.minPrice;
      const matchesPrice = price >= priceRange[0] && price <= priceRange[1];
      
      let matchesCategory = true;
      if (selectedCategory !== 'all') {
        const features = product.features.toLowerCase();
        matchesCategory = features.includes(selectedCategory) ||
                         (selectedCategory === 'enhancement' && (features.includes('spray') || features.includes('cream'))) ||
                         (selectedCategory === 'accessory' && !features.includes('dildo') && !features.includes('vibrat') && !features.includes('masturbat') && !features.includes('spray') && !features.includes('cream') && !features.includes('doll'));
      }
      
      return matchesSearch && matchesPrice && matchesCategory;
    });
  }, [searchTerm, priceRange, selectedCategory, productsWithLivePrices]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20" />
        <div className="relative container mx-auto px-4 md:px-6 pt-12 md:pt-20 pb-0 md:pb-0 text-center">
          <h1 className="text-4xl md:text-6xl font-light text-white mb-4 md:mb-6 tracking-wide">
            Luxe
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent font-medium">
              Intimacy
            </span>
          </h1>
          <p className="text-base md:text-xl text-purple-200 max-w-2xl mx-auto leading-relaxed mb-6">
            Premium intimate wellness products in Dubai, UAE. Lowest prices, highest quality, 
            free delivery with complete privacy.
          </p>
          
          {/* Key Features - Mobile Optimized */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 max-w-4xl mx-auto mb-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <Shield className="w-6 h-6 md:w-8 md:h-8 text-green-400 mx-auto mb-2" />
              <h3 className="text-white font-medium text-sm md:text-base mb-1">Premium Quality</h3>
              <p className="text-purple-200 text-xs md:text-sm">Laboratory-grade silicone, health assured</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <Truck className="w-6 h-6 md:w-8 md:h-8 text-blue-400 mx-auto mb-2" />
              <h3 className="text-white font-medium text-sm md:text-base mb-1">Free Delivery UAE</h3>
              <p className="text-purple-200 text-xs md:text-sm">2-3 days, cash on delivery, anonymous packaging</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <Gift className="w-6 h-6 md:w-8 md:h-8 text-purple-400 mx-auto mb-2" />
              <h3 className="text-white font-medium text-sm md:text-base mb-1">Free Gifts</h3>
              <p className="text-purple-200 text-xs md:text-sm">Surprise gifts with every order</p>
            </div>
          </div>
        </div>
        {/* Ad Image Section - Mobile Only */}
        <div className="max-w-sm mx-auto mb-5 md:hidden">
          <a 
            href="https://palmai.live?source=palm_ai_banner" 
            target="_blank" 
            rel="noopener noreferrer"
            className="block"
          >
            <div className="relative overflow-hidden rounded-2xl shadow-2xl transition-transform duration-300 hover:scale-105 active:scale-95">
              <img 
                src="/images/website image.png" 
                alt="Premium Adult Products Dubai UAE" 
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            </div>
          </a>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="container mx-auto px-4 md:px-6 py-6 md:py-8">
        <div className="flex flex-col gap-4 md:gap-6 mb-6 md:mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-400 w-4 h-4 md:w-5 md:h-5" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 md:pl-12 pr-4 py-3 bg-white/10 backdrop-blur-sm border border-purple-300/30 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300 text-sm md:text-base"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-purple-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4 md:w-5 md:h-5" />
              </button>
            )}
          </div>
          
          <FilterBar
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            priceRange={priceRange}
            onPriceRangeChange={setPriceRange}
          />
        </div>

        {/* Products Grid - Mobile Optimized */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-8">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.sku}
              product={product}
              onClick={() => setSelectedProduct(product)}
            />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12 md:py-20">
            <div className="text-purple-300 text-lg md:text-xl">No products found matching your criteria</div>
            <p className="text-purple-400 mt-2 text-sm md:text-base">Try adjusting your filters or search terms</p>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="container mx-auto px-4 md:px-6 py-8 md:py-12 border-t border-purple-400/20">
        <div className="text-center">
          <h3 className="text-white text-lg md:text-xl font-medium mb-4">Professional Adult Toy Seller in Dubai</h3>
          <p className="text-purple-200 text-sm md:text-base max-w-3xl mx-auto leading-relaxed">
            We provide the lowest prices in UAE with highest quality products. All items come with health assurance, 
            anonymous delivery, and complete privacy protection. Based in Dubai with local warehouse for fast delivery.
          </p>
        </div>
      </div>

      {/* Product Modal */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          isOpen={!!selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}

      {/* Admin Panel */}
      <AdminPanel />
    </div>
  );
};

export default Index;