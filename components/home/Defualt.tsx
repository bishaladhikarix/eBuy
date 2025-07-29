import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSearch } from '../../context/searchcontext/SearchContext';
import './Default.css';

interface Product {
  id: number;
  title: string;
  category: string;
  price: number;
  image: string;
  images?: string[];
  description?: string;
  condition?: string;
  brand?: string;
  model?: string;
  seller_name?: string;
  created_at?: string;
  searchScore?: number; // For fuzzy search ranking
}

interface ProductGridProps {
  onProductClick?: (product: Product) => void;
}

// Debounce hook for search optimization
const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const Default: React.FC<ProductGridProps> = ({ onProductClick }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});
  const navigate = useNavigate();
  const { selectedCategory, searchText } = useSearch();
  
  // Debounce search text to avoid too many API calls
  const debouncedSearchText = useDebounce(searchText, 300);

  // Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        // Build query parameters
        const queryParams = new URLSearchParams();
        if (selectedCategory) {
          queryParams.append('category', selectedCategory);
        }
        if (debouncedSearchText && debouncedSearchText.trim()) {
          queryParams.append('brand_search', debouncedSearchText.trim());
          queryParams.append('fuzzy', 'true'); // Enable fuzzy search on backend for brand
        }
        queryParams.append('limit', '50'); // Get more products for homepage

        const response = await fetch(`/api/products?${queryParams.toString()}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch products');
        }

        // Transform the backend data to match our interface
        const transformedProducts: Product[] = data.data.products.map((product: any) => ({
          id: product.id,
          title: product.title,
          category: product.category_name,
          price: product.price,
          image: product.images && product.images.length > 0 
            ? `http://localhost:5000${product.images[0]}` 
            : "https://via.placeholder.com/150x120/f0f0f0/666666?text=No+Image",
          images: product.images?.map((img: string) => `http://localhost:5000${img}`) || [],
          description: product.description,
          condition: product.condition,
          brand: product.brand,
          model: product.model,
          seller_name: product.seller_name,
          created_at: product.created_at,
          searchScore: product.searchScore || 0 // For search result ranking
        }));

        setProducts(transformedProducts);
        console.log('Fuzzy brand search results:', transformedProducts);

      } catch (error: any) {
        console.error('Error fetching products:', error);
        setError(error.message || 'Failed to load products');
        setProducts([]); // Fallback to empty array
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory, debouncedSearchText]); // Re-fetch when category or debounced search changes

  // Optimized image error handler
  const handleImageError = useCallback((productId: number, event: React.SyntheticEvent<HTMLImageElement>) => {
    const target = event.target as HTMLImageElement;
    if (!imageErrors[productId]) {
      setImageErrors(prev => ({ ...prev, [productId]: true }));
      target.src = "https://via.placeholder.com/150x120/f0f0f0/666666?text=No+Image";
    }
  }, [imageErrors]);

  // Optimized product click handler
  const handleProductClick = useCallback((product: Product) => {
    if (onProductClick) {
      onProductClick(product);
    } else {
      // Navigate to product detail page with product ID
      navigate(`/viewproduct?id=${product.id}`);
    }
  }, [onProductClick, navigate]);

  // Format price with proper currency
  const formatPrice = useCallback((price: number) => {
    return new Intl.NumberFormat('en-NP', {
      style: 'currency',
      currency: 'NPR',
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
      {/* Loading State */}
      {loading && (
        <div className="loading-state" role="status" aria-live="polite">
          <p>Loading products...</p>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="error-state" role="alert">
          <p>Error: {error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="retry-button"
          >
            Retry
          </button>
        </div>
      )}

      {/* Products Grid */}
      {!loading && !error && (
        <>
          <div className="products-grid" role="grid" aria-label="Product grid">
        {products.map((product: Product, index: number) => {
          console.log('Rendering product:', product.title, 'Brand:', product.brand);
          return (
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
              {product.brand && (
                <p className="product-brand" style={{ color: '#666', fontSize: '0.9em' }}>
                  Brand: {product.brand}
                </p>
              )}
              <p className="product-price">{formatPrice(product.price)}</p>
            </div>

            <div className="product-hover-overlay" aria-hidden="true">
              <div className="hover-content">
                <p className="description-text">{product.description || 'No description available'}</p>
              </div>
            </div>
          </div>
          );
        })}
      </div>

      {products.length === 0 && (
        <div className="no-products-message" role="status" aria-live="polite">
          <p>No products found</p>
          {selectedCategory && (
            <p>No products in category: "{selectedCategory}"</p>
          )}
          {debouncedSearchText && (
            <p>No products matching brand: "{debouncedSearchText}"</p>
          )}
          {debouncedSearchText && (
            <p style={{ fontSize: '0.9em', color: '#666', marginTop: '8px' }}>
              💡 Try different brand names or check spelling
            </p>
          )}
        </div>
      )}

      <div className="results-info" role="status" aria-live="polite">
        <p>
          Showing {products.length} products
          {selectedCategory && ` in category: ${selectedCategory}`}
          {debouncedSearchText && ` with brand matching: "${debouncedSearchText}"`}
        </p>
      </div>
        </>
      )}
    </div>
  );
};

export default Default;