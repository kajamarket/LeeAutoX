
const BASE_URL = 'https://leeautox.leeplugshub.com/wp-json';

async function fetchWP(endpoint: string) {
  const fullUrl = `${BASE_URL}${endpoint}`;
  
  // Strategy 1: Direct fetch
  try {
    const response = await fetch(fullUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      }
    });
    if (response.ok) return await response.json();
  } catch (e) {
    console.warn(`Direct fetch failed for ${endpoint}, trying CORS proxy...`);
  }
  
  // Strategy 2: CORS Proxy (AllOrigins) as fallback
  try {
    const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(fullUrl)}`;
    const response = await fetch(proxyUrl);
    if (response.ok) return await response.json();
  } catch (e) {
    console.error(`All fallbacks failed for ${endpoint}`);
  }
  
  return null;
}

export const getVehicles = async (): Promise<any[]> => {
  // Using the Store API endpoint as requested for vehicle catalog, limited to 4 items
  const products = await fetchWP('/wc/store/products?per_page=4&offset=4');
  
  if (!products || !Array.isArray(products)) return [];
  
  return products.map(product => {
    const priceValue = product.prices?.price ? parseInt(product.prices.price).toLocaleString() : '0';
    const currency = '₦';
    
    return {
      id: product.id,
      name: product.name,
      price: `${currency}${priceValue}`,
      image: product.images?.[0]?.src || 'https://leeplugshub.com/wp-content/uploads/2026/05/Luxury.jpg',
      specs: product.short_description ? product.short_description.replace(/<[^>]*>?/gm, '').substring(0, 80) + '...' : 'Premium vehicle listing',
      link: product.permalink
    };
  });
};

export const getProducts = async (): Promise<any[]> => {
  // Fetch with offset for the parts section to show different items
  // Increased to 8 items as requested for the 2-column mobile layout
  const products = await fetchWP('/wc/store/products?per_page=8&offset=4');
  
  if (!products || !Array.isArray(products)) return [];
  
  return products.map(product => {
    const priceValue = product.prices?.price ? parseInt(product.prices.price).toLocaleString() : '0';
    // User requested USD sign changed to Naira
    const currency = '₦';

    return {
      id: product.id,
      name: product.name,
      category: product.categories?.[0]?.name || 'Automotive',
      price: `${currency}${priceValue}`,
      image: product.images?.[0]?.src || 'https://leeplugshub.com/wp-content/uploads/2026/05/Shipping.jpeg',
      link: product.permalink
    };
  });
};
