function shopApp() {
  return {
    // Application State
    loading: true,
    products: [],
    filteredProducts: [],
    categories: [],
    searchQuery: '',
    sortOption: 'relevance',
    cartItems: [],
    cartCount: 0,
    cartTotal: 0,
    activeFilters: {
      category: 'all',
      priceRange: 'all'
    },
    mobileSearchOpen: false,
    cartOpen: false,
    productDetailOpen: false,
    selectedProduct: {},
    authModalOpen: false,
    authTab: 'login',
    authLoading: false,
    checkoutStep: null, // null, 'confirmation'
    orderNumber: '',
    notification: {
      show: false,
      type: 'success', // 'success', 'error', 'info'
      title: '',
      message: '',
      duration: 3000
    },
    notificationProgress: 100,
    notificationTimer: null,
    notificationProgressTimer: null,
    
    // Auth Forms
    loginForm: {
      email: '',
      password: '',
      rememberMe: false
    },
    signupForm: {
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    },
    
    // Lifecycle Methods
    init() {
      // Load products from API
      this.fetchProducts();
      
      // Load cart from localStorage
      this.loadCart();
      
      // Add event listener for ESC key to close modals
      window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          this.productDetailOpen = false;
          this.cartOpen = false;
          this.authModalOpen = false;
          this.checkoutStep = null;
        }
      });
      
      // Set up listener for cart changes
      this.$watch('cartItems', (value) => {
        this.updateCartStats();
        this.saveCart();
      }, { deep: true });
      
      // Set up listener for search query
      this.$watch('searchQuery', () => {
        this.filterProducts();
      });
    },
    
    // API Methods
    async fetchProducts() {
      this.loading = true;
      
      try {
        // Simulate API call with a timeout
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Mock product data 
        this.products = [
          {
            id: 1,
            name: "Modern Desk Lamp",
            price: 89.99,
            image: "https://cdn.pixabay.com/photo/2017/08/24/15/23/light-2677309_960_720.jpg",
            category: "Home Decor",
            rating: 4,
            reviews: 24,
            description: "<p>Add a touch of modern elegance to your workspace with this sleek desk lamp. Features adjustable brightness levels and a USB charging port.</p><ul><li>Energy-efficient LED bulb included</li><li>Touch-sensitive controls</li><li>Adjustable arm for perfect positioning</li><li>Available in matte black, silver, and copper finishes</li></ul>",
            quantity: 1
          },
          {
            id: 2,
            name: "Premium Wireless Headphones",
            price: 199.99,
            image: "https://cdn.pixabay.com/photo/2018/09/17/14/27/headphones-3683983_960_720.jpg",
            category: "Electronics",
            rating: 5,
            reviews: 136,
            description: "<p>Experience superior sound quality with our premium wireless headphones. Features active noise cancellation and up to 30 hours of battery life.</p><ul><li>Bluetooth 5.0 connectivity</li><li>Built-in microphone for calls</li><li>Foldable design for easy travel</li><li>Memory foam ear cushions for extended comfort</li></ul>",
            quantity: 1
          },
          {
            id: 3,
            name: "Ceramic Plant Pot Set",
            price: 34.99,
            image: "https://cdn.pixabay.com/photo/2018/03/04/09/51/cactus-3197765_960_720.jpg",
            category: "Home Decor",
            rating: 4,
            reviews: 58,
            description: "<p>Elevate your indoor garden with this set of 3 ceramic plant pots. Each pot features a drainage hole and bamboo saucer.</p><ul><li>Set includes small, medium, and large pots</li><li>Minimalist design with matte finish</li><li>Perfect for succulents, cacti, and small houseplants</li><li>Available in white, gray, and terracotta colors</li></ul>",
            quantity: 1
          },
          {
            id: 4,
            name: "Artisan Coffee Mug",
            price: 19.99,
            image: "https://cdn.pixabay.com/photo/2015/09/09/17/55/coffee-932103_960_720.jpg",
            category: "Kitchen",
            rating: 5,
            reviews: 42,
            description: "<p>Handcrafted ceramic mug perfect for your morning coffee or tea. Each piece is unique with subtle variations in the glaze.</p><ul><li>12oz capacity</li><li>Microwave and dishwasher safe</li><li>Comfortable handle design</li><li>Made from locally sourced clay</li></ul>",
            quantity: 1
          },
          {
            id: 5,
            name: "Smart Fitness Watch",
            price: 149.99,
            image: "https://cdn.pixabay.com/photo/2015/02/02/11/09/office-620823_960_720.jpg",
            category: "Electronics",
            rating: 4,
            reviews: 89,
            description: "<p>Track your fitness goals with this advanced smartwatch. Features heart rate monitoring, sleep tracking, and GPS functionality.</p><ul><li>Water-resistant up to 50m</li><li>7-day battery life</li><li>Compatible with iOS and Android</li><li>Customizable watch faces and bands</li></ul>",
            quantity: 1
          },
          {
            id: 6,
            name: "Leather Notebook",
            price: 29.99,
            image: "https://cdn.pixabay.com/photo/2015/07/19/10/00/still-life-851328_960_720.jpg",
            category: "Stationery",
            rating: 5,
            reviews: 37,
            description: "<p>Classic leather-bound notebook with premium paper. Perfect for journaling, sketching, or taking notes.</p><ul><li>192 pages of acid-free paper (100 gsm)</li><li>Elastic closure and ribbon bookmark</li><li>Inner pocket for loose papers</li><li>Available in brown, black, and burgundy</li></ul>",
            quantity: 1
          },
          {
            id: 7,
            name: "Portable Bluetooth Speaker",
            price: 69.99,
            image: "https://cdn.pixabay.com/photo/2017/08/22/22/10/audio-2670765_960_720.jpg",
            category: "Electronics",
            rating: 4,
            reviews: 105,
            description: "<p>Take your music anywhere with this compact yet powerful Bluetooth speaker. Features 360° sound and a waterproof design.</p><ul><li>12 hours of playtime</li><li>IPX7 waterproof rating</li><li>Built-in microphone for calls</li><li>Connect multiple speakers for stereo sound</li></ul>",
            quantity: 1
          },
          {
            id: 8,
            name: "Minimalist Wall Clock",
            price: 39.99,
            image: "https://cdn.pixabay.com/photo/2017/10/31/01/59/clock-2904691_960_720.jpg",
            category: "Home Decor",
            rating: 4,
            reviews: 29,
            description: "<p>Add a touch of modern elegance to any room with this sleek wall clock. Features a silent sweeping mechanism for noiseless operation.</p><ul><li>12-inch diameter</li><li>Made from sustainable bamboo</li><li>Japanese quartz movement</li><li>Battery included</li></ul>",
            quantity: 1
          },
          {
            id: 9,
            name: "Premium Tea Sampler",
            price: 24.99,
            image: "https://cdn.pixabay.com/photo/2016/11/29/13/04/beverage-1869722_960_720.jpg",
            category: "Kitchen",
            rating: 5,
            reviews: 47,
            description: "<p>Discover new flavors with our premium loose leaf tea sampler. Includes 6 varieties of organic, ethically sourced teas.</p><ul><li>Each tin contains enough tea for 10-12 cups</li><li>Varieties include Earl Grey, English Breakfast, Green Jasmine, Chamomile, Rooibos, and Peppermint</li><li>Comes with steeping instructions</li><li>Packaged in reusable metal tins</li></ul>",
            quantity: 1
          },
          {
            id: 10,
            name: "Canvas Backpack",
            price: 59.99,
            image: "https://cdn.pixabay.com/photo/2017/08/06/12/52/woman-2592247_960_720.jpg",
            category: "Fashion",
            rating: 4,
            reviews: 73,
            description: "<p>Durable canvas backpack perfect for daily commutes, weekend trips, or hiking adventures. Features multiple pockets and padded laptop compartment.</p><ul><li>Water-resistant waxed canvas</li><li>Genuine leather trim and brass hardware</li><li>Fits laptops up to 15 inches</li><li>Available in olive, navy, and charcoal</li></ul>",
            quantity: 1
          },
          {
            id: 11,
            name: "Bamboo Cutting Board",
            price: 29.99,
            image: "https://cdn.pixabay.com/photo/2015/09/09/19/40/kitchen-933061_960_720.jpg",
            category: "Kitchen",
            rating: 5,
            reviews: 31,
            description: "<p>Sustainable bamboo cutting board with juice groove and handle. Perfect for food prep and serving charcuterie.</p><ul><li>Extra-large size (18\" x 12\")</li><li>Naturally antimicrobial bamboo</li><li>Reversible design with flat side for serving</li><li>Handwash recommended for longevity</li></ul>",
            quantity: 1
          },
          {
            id: 12,
            name: "Scented Soy Candle",
            price: 19.99,
            image: "https://cdn.pixabay.com/photo/2015/01/10/14/31/candle-595539_960_720.jpg",
            category: "Home Decor",
            rating: 4,
            reviews: 52,
            description: "<p>Hand-poured soy candle with natural essential oils. Creates a warm, inviting atmosphere with a clean, long-lasting burn.</p><ul><li>50 hour burn time</li><li>Available scents: Lavender Vanilla, Sea Salt & Sage, Amber & Moss</li><li>Reusable glass container</li><li>Cotton wick, phthalate-free</li></ul>",
            quantity: 1
          }
        ];
        
        // Extract unique categories
        this.categories = [...new Set(this.products.map(product => product.category))];
        
        // Apply initial filtering
        this.filterProducts();
        
      } catch (error) {
        this.showNotification('error', 'Error', 'Failed to load products. Please try again.');
        console.error('Error fetching products:', error);
      } finally {
        this.loading = false;
      }
    },
    
    // Filter & Sort Methods
    filterProducts() {
      let filtered = [...this.products];
      
      // Apply search query filter
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        filtered = filtered.filter(product => 
          product.name.toLowerCase().includes(query) || 
          product.category.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query)
        );
      }
      
      // Apply category filter
      if (this.activeFilters.category !== 'all') {
        filtered = filtered.filter(product => product.category === this.activeFilters.category);
      }
      
      // Apply price range filter
      if (this.activeFilters.priceRange !== 'all') {
        switch (this.activeFilters.priceRange) {
          case 'under50':
            filtered = filtered.filter(product => product.price < 50);
            break;
          case '50to100':
            filtered = filtered.filter(product => product.price >= 50 && product.price <= 100);
            break;
          case 'over100':
            filtered = filtered.filter(product => product.price > 100);
            break;
        }
      }
      
      // Apply sorting
      this.sortProducts(filtered);
    },
    
    sortProducts(productsToSort = null) {
      let products = productsToSort || this.filteredProducts;
      
      switch (this.sortOption) {
        case 'priceAsc':
          products.sort((a, b) => a.price - b.price);
          break;
        case 'priceDesc':
          products.sort((a, b) => b.price - a.price);
          break;
        case 'newest':
          // In a real app, we would sort by date
          // Here we'll just reverse the array as a placeholder
          products.reverse();
          break;
        case 'relevance':
        default:
          // Default sorting - by ID in this case
          products.sort((a, b) => a.id - b.id);
          break;
      }
      
      this.filteredProducts = [...products];
    },
    
    filterByCategory(category) {
      this.activeFilters.category = category;
      this.filterProducts();
    },
    
    filterByPriceRange(range) {
      this.activeFilters.priceRange = range;
      this.filterProducts();
    },
    
    resetFilters() {
      this.activeFilters.category = 'all';
      this.activeFilters.priceRange = 'all';
      this.searchQuery = '';
      this.sortOption = 'relevance';
      this.filterProducts();
    },
    
    // Cart Methods
    addToCart(product) {
      // Check if product already exists in cart
      const existingItemIndex = this.cartItems.findIndex(item => item.id === product.id);
      
      if (existingItemIndex !== -1) {
        // Update quantity if it exists
        this.cartItems[existingItemIndex].quantity += product.quantity || 1;
      } else {
        // Add new item to cart
        this.cartItems.push({
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          quantity: product.quantity || 1
        });
      }
      
      // Show notification
      this.showNotification('success', 'Added to Cart', `${product.name} has been added to your cart.`);
      
      // Reset the product quantity if it's the detail view
      if (this.selectedProduct.id === product.id) {
        this.selectedProduct.quantity = 1;
      }
    },
    
    removeFromCart(index) {
      const removedItem = this.cartItems[index];
      this.cartItems.splice(index, 1);
      
      // Show notification
      this.showNotification('info', 'Removed from Cart', `${removedItem.name} has been removed from your cart.`);
    },
    
    increaseQuantity(index) {
      this.cartItems[index].quantity++;
    },
    
    decreaseQuantity(index) {
      if (this.cartItems[index].quantity > 1) {
        this.cartItems[index].quantity--;
      } else {
        this.removeFromCart(index);
      }
    },
    
    updateCartStats() {
      // Update cart count
      this.cartCount = this.cartItems.reduce((total, item) => total + item.quantity, 0);
      
      // Update cart total
      this.cartTotal = this.cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    },
    
    // LocalStorage Methods
    saveCart() {
      localStorage.setItem('shopease-cart', JSON.stringify(this.cartItems));
    },
    
    loadCart() {
      const savedCart = localStorage.getItem('shopease-cart');
      if (savedCart) {
        try {
          this.cartItems = JSON.parse(savedCart);
          this.updateCartStats();
        } catch (e) {
          console.error('Failed to parse saved cart', e);
          // Reset cart if there's an error
          this.cartItems = [];
          localStorage.removeItem('shopease-cart');
        }
      }
    },
    
    clearCart() {
      this.cartItems = [];
      localStorage.removeItem('shopease-cart');
    },
    
    // UI Control Methods
    toggleCart() {
      this.cartOpen = !this.cartOpen;
      if (this.cartOpen) {
        document.body.classList.add('cart-open');
      } else {
        document.body.classList.remove('cart-open');
      }
    },
    
    openProductDetail(product) {
      // Create a clone of the product to avoid modifying the original
      this.selectedProduct = { ...product, quantity: 1 };
      this.productDetailOpen = true;
    },
    
    toggleAuthModal() {
      this.authModalOpen = !this.authModalOpen;
    },
    
    // Auth Methods
    loginUser() {
      this.authLoading = true;
      
      // Simulate API call with delay
      setTimeout(() => {
        // Here you would normally validate credentials against an API
        if (this.loginForm.email && this.loginForm.password) {
          // Success case
          this.showNotification('success', 'Login Successful', 'Welcome back!');
          this.authModalOpen = false;
          
          // Reset form
          this.loginForm = {
            email: '',
            password: '',
            rememberMe: false
          };
        } else {
          // Error case
          this.showNotification('error', 'Login Failed', 'Invalid email or password');
        }
        
        this.authLoading = false;
      }, 1000);
    },
    
    signupUser() {
      this.authLoading = true;
      
      // Simulate API call with delay
      setTimeout(() => {
        // Here you would normally send the form data to an API
        if (this.signupForm.email && 
            this.signupForm.password && 
            this.signupForm.name && 
            this.signupForm.password === this.signupForm.confirmPassword) {
          
          // Success case
          this.showNotification('success', 'Registration Successful', 'Your account has been created!');
          this.authTab = 'login'; // Switch to login tab
          
          // Reset form
          this.signupForm = {
            name: '',
            email: '',
            password: '',
            confirmPassword: ''
          };
        } else {
          // Error case
          this.showNotification('error', 'Registration Failed', 'Please check your information and try again.');
        }
        
        this.authLoading = false;
      }, 1000);
    },
    
    // Checkout Method
    checkout() {
      if (this.cartItems.length === 0) {
        this.showNotification('error', 'Empty Cart', 'Add some products to your cart before checkout.');
        return;
      }
      
      // Close cart
      this.cartOpen = false;
      document.body.classList.remove('cart-open');
      
      // Generate a fake order number
      this.orderNumber = Math.floor(100000 + Math.random() * 900000).toString();
      
      // Show confirmation screen
      this.checkoutStep = 'confirmation';
    },
    
    closeCheckoutAndContinueShopping() {
      // Clear the cart
      this.clearCart();
      
      // Close checkout
      this.checkoutStep = null;
      
      // Show notification
      this.showNotification('success', 'Order Placed', 'Your order has been placed successfully!');
    },
    
    // Notification Methods
    showNotification(type, title, message, duration = 3000) {
      // Clear any existing timers
      this.dismissNotification();
      
      // Set notification
      this.notification = {
        show: true,
        type,
        title,
        message,
        duration
      };
      
      // Set up auto-dismiss
      this.notificationProgress = 100;
      
      // Progress bar animation
      this.notificationProgressTimer = setInterval(() => {
        this.notificationProgress -= (100 / (this.notification.duration / 100));
        if (this.notificationProgress <= 0) {
          this.dismissNotification();
        }
      }, 100);
      
      // Auto dismiss after duration
      this.notificationTimer = setTimeout(() => {
        this.dismissNotification();
      }, this.notification.duration);
    },
    
    dismissNotification() {
      clearTimeout(this.notificationTimer);
      clearInterval(this.notificationProgressTimer);
      this.notification.show = false;
    },
    
    // Formatter Methods
    formatPrice(price) {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(price);
    },
    
    formatPriceRange(range) {
      switch (range) {
        case 'under50':
          return 'Under $50';
        case '50to100':
          return '$50 - $100';
        case 'over100':
          return 'Over $100';
        default:
          return 'All Prices';
      }
    }
  };
}