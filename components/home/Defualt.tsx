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
}

interface ProductGridProps {
  onProductClick?: (product: Product) => void;
}

const Default: React.FC<ProductGridProps> = ({ onProductClick }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});
  const navigate = useNavigate();
  const { selectedCategory, searchText } = useSearch();

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
        if (searchText) {
          queryParams.append('search', searchText);
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
          created_at: product.created_at
        }));

        setProducts(transformedProducts);
        console.log('Transformed products:', transformedProducts);

      } catch (error: any) {
        console.error('Error fetching products:', error);
        setError(error.message || 'Failed to load products');
        setProducts([]); // Fallback to empty array
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory, searchText]); // Re-fetch when category or search changes

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
          console.log('Rendering product:', product.title, 'Description:', product.description);
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
          {searchText && (
            <p>No products matching search: "{searchText}"</p>
          )}
        </div>
      )}

      <div className="results-info" role="status" aria-live="polite">
        <p>
          Showing {products.length} products
          {selectedCategory && ` in category: ${selectedCategory}`}
          {searchText && ` matching: "${searchText}"`}
        </p>
      </div>
        </>
      )}
    </div>
  );
};

export default Default;