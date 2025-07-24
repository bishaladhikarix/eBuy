import { useState, useMemo, useCallback } from 'react';
import './Default.css';

interface Product {
  id: number;
  title: string;
  category: string;
  price: number;
  image: string;
  description?: string;
}

interface ProductGridProps {
  products?: Product[];
  selectedCategory?: string;
  searchText?: string;
  onProductClick?: (product: Product) => void;
}

const Default: React.FC<ProductGridProps> = ({ 
  products = [], 
  selectedCategory = '', 
  searchText = '', 
  onProductClick 
}) => {
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());

  // Sample products data if none provided
  const defaultProducts: Product[] = [
    {
      id: 1,
      title: "Gaming Laptop Pro",
      category: "Laptop",
      price: 1299,
      image: "https://cdn.thewirecutter.com/wp-content/media/2024/11/cheapgaminglaptops-2048px-7981.jpg",
      description: "High-performance gaming laptop with RTX graphics and fast processor for ultimate gaming experience"
    },
    {
      id: 2,
      title: "RTX 4080 Graphics Card",
      category: "Graphic Card",
      price: 899,
      image: "https://cdn.thewirecutter.com/wp-content/media/2024/11/cheapgaminglaptops-2048px-7981.jpg",
      description: "Powerful graphics card for 4K gaming and professional rendering workloads"
    },
    {
      id: 3,
      title: "DDR5 32GB RAM Kit",
      category: "Ram",
      price: 299,
      image: "https://cdn.thewirecutter.com/wp-content/media/2024/11/cheapgaminglaptops-2048px-7981.jpg",
      description: "High-speed DDR5 memory kit for enhanced system performance and multitasking"
    },
    {
      id: 4,
      title: "Intel i9 Processor",
      category: "Cpu",
      price: 599,
      image: "https://via.placeholder.com/150x120/f0f0f0/666666?text=CPU",
      description: "Latest generation processor with excellent performance for gaming and productivity"
    },
    {
      id: 5,
      title: "4K Gaming Monitor",
      category: "Monitor",
      price: 449,
      image: "https://via.placeholder.com/150x120/f0f0f0/666666?text=Monitor",
      description: "Ultra-wide 4K monitor with high refresh rate perfect for gaming and content creation"
    },
    {
      id: 6,
      title: "Z790 Motherboard",
      category: "Mother Board",
      price: 249,
      image: "https://via.placeholder.com/150x120/f0f0f0/666666?text=Motherboard",
      description: "Feature-rich motherboard with latest chipset supporting DDR5 and PCIe 5.0"
    },
    {
      id: 7,
      title: "Business Laptop",
      category: "Laptop",
      price: 899,
      image: "https://via.placeholder.com/150x120/f0f0f0/666666?text=Business+Laptop",
      description: "Professional laptop designed for business use with long battery life and security features"
    },
    {
      id: 8,
      title: "Budget Graphics Card",
      category: "Graphic Card",
      price: 299,
      image: "https://via.placeholder.com/150x120/f0f0f0/666666?text=Budget+GPU",
      description: "Affordable graphics card perfect for 1080p gaming and basic content creation"
    },
    {
      id: 9,
      title: "Ultrabook Laptop",
      category: "Laptop",
      price: 1099,
      image: "https://via.placeholder.com/150x120/f0f0f0/666666?text=Ultrabook",
      description: "Thin and lightweight laptop with premium build quality and excellent portability"
    },
    {
      id: 10,
      title: "MacBook Laptop",
      category: "Laptop",
      price: 1599,
      image: "https://via.placeholder.com/150x120/f0f0f0/666666?text=MacBook",
      description: "Premium build quality and excellent portability with Apple's ecosystem integration"
    },
    {
      id: 11,
      title: "Gaming Monitor 144Hz",
      category: "Monitor",
      price: 349,
      image: "https://via.placeholder.com/150x120/f0f0f0/666666?text=Gaming+Monitor",
      description: "High refresh rate monitor perfect for competitive gaming and smooth visuals"
    },
    {
      id: 12,
      title: "Mini-ITX Motherboard",
      category: "Mother Board",
      price: 199,
      image: "https://via.placeholder.com/150x120/f0f0f0/666666?text=Mini+ITX",
      description: "Compact motherboard perfect for small form factor builds without compromising features"
    }
  ];

  const productData = products.length > 0 ? products : defaultProducts;

  // Memoized filtered products for better performance
  const filteredProducts = useMemo(() => {
    return productData.filter(product => {
      const matchesCategory = !selectedCategory || 
        product.category.toLowerCase() === selectedCategory.toLowerCase();
      
      const matchesSearch = !searchText || 
        product.title.toLowerCase().includes(searchText.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchText.toLowerCase());
      
      return matchesCategory && matchesSearch;
    });
  }, [productData, selectedCategory, searchText]);

  // Optimized image error handler
  const handleImageError = useCallback((productId: number, event: React.SyntheticEvent<HTMLImageElement>) => {
    const target = event.target as HTMLImageElement;
    if (!imageErrors.has(productId)) {
      setImageErrors(prev => new Set(prev).add(productId));
      target.src = "https://via.placeholder.com/150x120/f0f0f0/666666?text=No+Image";
    }
  }, [imageErrors]);

  // Optimized product click handler
  const handleProductClick = useCallback((product: Product) => {
    if (onProductClick) {
      onProductClick(product);
    } else {
      console.log('Product clicked:', product);
    }
  }, [onProductClick]);

  // Format price with proper currency
  const formatPrice = useCallback((price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  }, []);

  // Keyboard navigation handler
  const handleKeyDown = (event: React.KeyboardEvent, product: Product) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleProductClick(product);
    }
  };

  return (
    <div className="product-grid-container">

      <div className="products-grid" role="grid" aria-label="Product grid">
        {filteredProducts.map((product, index) => (
          <div 
            key={product.id} 
            className="product-card"
            onClick={() => handleProductClick(product)}
            onKeyDown={(e) => handleKeyDown(e, product)}
            role="gridcell"
            tabIndex={0}
            aria-label={`${product.title}, ${product.category}, ${formatPrice(product.price)}`}
          >
            <div className="product-image">
              <img 
                src={product.image} 
                alt={product.title}
                loading={index < 6 ? "eager" : "lazy"}
                onError={(e) => handleImageError(product.id, e)}
              />
            </div>
            
            <div className="product-info">
              <h3 className="product-title">{product.title}</h3>
              <p className="product-category">{product.category}</p>
              <p className="product-price">{formatPrice(product.price)}</p>
            </div>

            <div className="product-hover-overlay" aria-hidden="true">
              <div className="hover-content">
                <h3 className="hover-title">{product.title}</h3>
                <p className="hover-category">{product.category}</p>
                <p className="hover-price">{formatPrice(product.price)}</p>
                <div className="hover-description">
                  <span className="description-label">Description:</span>
                  <p className="description-text">
                    {product.description || "No description available"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="no-products-message" role="status" aria-live="polite">
          <p>No products found</p>
          {selectedCategory && (
            <p>No products in category: "{selectedCategory}"</p>
          )}
          {searchText && (
            <p>No products matching search: "{searchText}"</p>
          )}
        </div>
      )}

      <div className="results-info" role="status" aria-live="polite">
        <p>
          Showing {filteredProducts.length} of {productData.length} products
          {selectedCategory && ` in category: ${selectedCategory}`}
          {searchText && ` matching: "${searchText}"`}
        </p>
      </div>
    </div>
  );
};

export default Default;