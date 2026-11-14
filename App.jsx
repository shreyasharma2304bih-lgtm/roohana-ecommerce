import React, { useEffect, useMemo, useState } from "react";

const products = [
  {
    id: 1,
    name: "The Sunday Linen Shirt",
    category: "Tops",
    price: 2490,
    color: "Oat milk",
    badge: "Bestseller",
    image:
      "https://images.unsplash.com/photo-1598554747436-c9293d6a588f?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 2,
    name: "Everywhere Wide-Leg Pant",
    category: "Bottoms",
    price: 3290,
    color: "Warm sand",
    badge: "",
    image:
      "https://images.unsplash.com/photo-1506629905607-d9b1c8b9b1c4?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 3,
    name: "Soft Form Knit Tank",
    category: "Tops",
    price: 1790,
    color: "Sage",
    badge: "New",
    image:
      "https://images.unsplash.com/photo-1583743814966-8936f37f4678?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 4,
    name: "The Long Weekend Dress",
    category: "Dresses",
    price: 4490,
    color: "Terracotta",
    badge: "",
    image:
      "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 5,
    name: "Cloud Nine Cardigan",
    category: "Knitwear",
    price: 3990,
    color: "Buttercream",
    badge: "Almost gone",
    image:
      "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 6,
    name: "Daylight Cotton Tee",
    category: "Tops",
    price: 1490,
    color: "Soft white",
    badge: "",
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 7,
    name: "Easy Does It Midi Skirt",
    category: "Bottoms",
    price: 2790,
    color: "Olive",
    badge: "New",
    image:
      "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 8,
    name: "Golden Hour Slip Dress",
    category: "Dresses",
    price: 4190,
    color: "Fig",
    badge: "",
    image:
      "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=900&q=85",
  },
];

const categories = ["All pieces", "Tops", "Bottoms", "Dresses", "Knitwear"];
const FREE_SHIPPING_THRESHOLD = 5000;

function Icon({ name, size = 20 }) {
  const shared = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
  };

  if (name === "search") {
    return (
      <svg {...shared}>
        <circle cx="10.8" cy="10.8" r="6.8" />
        <path d="m16 16 4.2 4.2" />
      </svg>
    );
  }
  if (name === "bag") {
    return (
      <svg {...shared}>
        <path d="M5 8h14l1 12H4L5 8Z" />
        <path d="M9 9V6a3 3 0 0 1 6 0v3" />
      </svg>
    );
  }
  if (name === "account") {
    return (
      <svg {...shared}>
        <circle cx="12" cy="8" r="3.5" />
        <path d="M5 20a7 7 0 0 1 14 0" />
      </svg>
    );
  }
  if (name === "close") {
    return (
      <svg {...shared}>
        <path d="m6 6 12 12M18 6 6 18" />
      </svg>
    );
  }
  if (name === "arrow") {
    return (
      <svg {...shared}>
        <path d="M4.5 12h15m-6-6 6 6-6 6" />
      </svg>
    );
  }
  return null;
}

function formatPrice(price) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
}

function App() {
  const [activeCategory, setActiveCategory] = useState("All pieces");
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const [authMessage, setAuthMessage] = useState("");
  const [notice, setNotice] = useState("");
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const filteredProducts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return products.filter((product) => {
      const matchesCategory =
        activeCategory === "All pieces" || product.category === activeCategory;
      const matchesSearch =
        !query ||
        `${product.name} ${product.category} ${product.color}`
          .toLowerCase()
          .includes(query);
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  useEffect(() => {
    if (!notice) return undefined;
    const timer = window.setTimeout(() => setNotice(""), 2400);
    return () => window.clearTimeout(timer);
  }, [notice]);

  useEffect(() => {
    if (!cartOpen && !authOpen) return undefined;
    const closeOnEscape = (event) => {
      if (event.key === "Escape") {
        setCartOpen(false);
        setAuthOpen(false);
      }
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [cartOpen, authOpen]);

  function addToCart(product) {
    setCart((currentCart) => {
      const existing = currentCart.find((item) => item.id === product.id);
      if (existing) {
        return currentCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item,
        );
      }
      return [...currentCart, { ...product, quantity: 1 }];
    });
    setNotice(`${product.name} added to your bag`);
  }

  function updateQuantity(productId, amount) {
    setCart((currentCart) =>
      currentCart
        .map((item) =>
          item.id === productId
            ? { ...item, quantity: item.quantity + amount }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
  }

  function handleSubscribe(event) {
    event.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    setEmail("");
  }

  function handleAuthSubmit(event) {
    event.preventDefault();
    setAuthMessage(
      "Sign-in is ready to connect, but this storefront does not have an account service yet.",
    );
  }

  return (
    <>
      <div className="announcement">
        A little something extra: complimentary shipping on orders of ₹5,000 or more
      </div>
      <header className="site-header">
        <a className="wordmark" href="#home" aria-label="Roohana home">
          roohana<span>.</span>
        </a>
        <nav className="main-nav" aria-label="Main navigation">
          <a href="#collection">New in</a>
          <a href="#collection">Clothing</a>
          <a href="#story">Our story</a>
        </nav>
        <div className="header-actions">
          <button
            className="account-button"
            onClick={() => {
              setAuthMessage("");
              setAuthMode("login");
              setAuthOpen(true);
            }}
          >
            <Icon name="account" size={18} />
            <span>Log in</span>
          </button>
          <button
            className={`icon-button search-toggle${searchOpen ? " is-active" : ""}`}
            aria-label={searchOpen ? "Close search" : "Open search"}
            onClick={() => {
              setSearchOpen((open) => !open);
              setSearchQuery("");
            }}
          >
            <Icon name="search" />
          </button>
          <button
            className="bag-button"
            aria-label={`Open shopping bag, ${cartCount} items`}
            onClick={() => setCartOpen(true)}
          >
            <Icon name="bag" />
            <span>Bag</span>
            <span className="bag-count">{cartCount}</span>
          </button>
        </div>
      </header>

      <main>
        <section className="hero" id="home">
          <div className="hero-copy">
            <span className="eyebrow"><span className="eyebrow-line" /> A softer kind of everyday</span>
            <h1>Wear your own kind of <em>wonderful.</em></h1>
            <p>
              Feel-good clothes for wherever the day takes you. Thoughtfully
              made, endlessly wearable, completely you.
            </p>
            <a className="button button-dark" href="#collection">
              Find your feel <Icon name="arrow" size={17} />
            </a>
            <div className="hero-footnote">
              <span className="footnote-star">✳</span>
              Made for real life, and all its little moments.
            </div>
          </div>
          <div className="hero-visual">
            <img
              src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1500&q=90"
              alt="Woman wearing an effortless neutral outfit in warm afternoon light"
            />
            <div className="hero-sticker">
              <span>Good clothes.</span>
              <span>Good feelings.</span>
              <span className="sticker-star">✳</span>
            </div>
            <div className="hero-image-caption">The everyday edit · 01 / 04</div>
          </div>
        </section>

        <section className="values-strip" aria-label="Our values">
          <span>Designed to be lived in</span>
          <span className="value-divider">✳</span>
          <span>Made with a little more thought</span>
          <span className="value-divider">✳</span>
          <span>Here for the long run</span>
        </section>

        <section className="collection section-shell" id="collection">
          <div className="section-heading">
            <div>
              <span className="eyebrow">Good things, just in</span>
              <h2>Pieces to feel like <em>you.</em></h2>
            </div>
            <a className="text-link desktop-link" href="#collection">
              Shop all clothing <Icon name="arrow" size={17} />
            </a>
          </div>
          <div className="collection-toolbar">
            <div className="category-tabs" role="tablist" aria-label="Filter by category">
              {categories.map((category) => (
                <button
                  className={activeCategory === category ? "active" : ""}
                  key={category}
                  role="tab"
                  aria-selected={activeCategory === category}
                  onClick={() => setActiveCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>
            {searchOpen && (
              <label className="search-field">
                <Icon name="search" size={17} />
                <input
                  autoFocus
                  aria-label="Search products"
                  placeholder="Search pieces..."
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                />
                {searchQuery && (
                  <button
                    className="clear-search"
                    aria-label="Clear search"
                    onClick={() => setSearchQuery("")}
                  >
                    <Icon name="close" size={15} />
                  </button>
                )}
              </label>
            )}
          </div>
          {filteredProducts.length > 0 ? (
            <div className="product-grid">
              {filteredProducts.map((product) => (
                <article className="product-card" key={product.id}>
                  <div className="product-image-wrap">
                    <img src={product.image} alt={product.name} loading="lazy" />
                    {product.badge && (
                      <span className="product-badge">{product.badge}</span>
                    )}
                    <button
                      className="quick-add"
                      onClick={() => addToCart(product)}
                      aria-label={`Add ${product.name} to bag`}
                    >
                      <span>Quick add</span>
                      <span className="quick-add-plus">+</span>
                    </button>
                  </div>
                  <div className="product-info">
                    <div>
                      <h3>{product.name}</h3>
                      <p>{product.color}</p>
                    </div>
                    <span className="product-price">{formatPrice(product.price)}</span>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="empty-search">
              <span className="eyebrow">Nothing here just yet</span>
              <p>Try another search or choose a different category.</p>
              <button
                className="text-link"
                onClick={() => {
                  setSearchQuery("");
                  setActiveCategory("All pieces");
                }}
              >
                See all pieces <Icon name="arrow" size={17} />
              </button>
            </div>
          )}
          <a className="text-link mobile-link" href="#collection">
            Shop all clothing <Icon name="arrow" size={17} />
          </a>
        </section>

        <section className="story-banner" id="story">
          <div className="story-image">
            <img
              src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1200&q=85"
              alt="A relaxed, sunlit moment in everyday Roohana style"
              loading="lazy"
            />
          </div>
          <div className="story-copy">
            <span className="eyebrow">A little more about us</span>
            <h2>Clothes should make room for <em>life.</em></h2>
            <p>
              The coffee runs, the long lunches, the plans that change. We make
              considered pieces that feel right through all of it — and for
              seasons to come.
            </p>
            <a className="text-link" href="#newsletter">
              Get to know Roohana <Icon name="arrow" size={17} />
            </a>
            <span className="story-doodle" aria-hidden="true">✳</span>
          </div>
        </section>

        <section className="newsletter section-shell" id="newsletter">
          <div>
            <span className="eyebrow">A good note, every now and then</span>
            <h2>A little more <em>lovely.</em></h2>
            <p>First dibs, thoughtful things, and 10% off your first order.</p>
          </div>
          <form className="newsletter-form" onSubmit={handleSubscribe}>
            {subscribed ? (
              <p className="subscribe-success">You're on the list. Talk soon!</p>
            ) : (
              <>
                <label className="visually-hidden" htmlFor="newsletter-email">
                  Your email address
                </label>
                <input
                  id="newsletter-email"
                  type="email"
                  placeholder="Your email address"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                />
                <button type="submit" aria-label="Subscribe to newsletter">
                  <Icon name="arrow" />
                </button>
              </>
            )}
          </form>
        </section>
      </main>

      <footer className="site-footer">
        <a className="wordmark footer-wordmark" href="#home">
          roohana<span>.</span>
        </a>
        <span>Made for the feeling of being you.</span>
        <span>© 2025 Roohana Studio</span>
      </footer>

      {notice && <div className="toast" role="status">{notice}</div>}

      {authOpen && (
        <div
          className="auth-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setAuthOpen(false);
          }}
        >
          <section
            className="auth-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="auth-title"
          >
            <button
              className="icon-button auth-close"
              aria-label="Close login dialog"
              onClick={() => setAuthOpen(false)}
            >
              <Icon name="close" />
            </button>
            <span className="eyebrow">Welcome to Roohana</span>
            <h2 id="auth-title">
              {authMode === "login" ? "Good to see you." : "Make yourself at home."}
            </h2>
            <p className="auth-intro">
              {authMode === "login"
                ? "Log in to pick up right where you left off."
                : "Create an account for a little more lovely."}
            </p>
            <form className="auth-form" onSubmit={handleAuthSubmit}>
              {authMode === "signup" && (
                <label>
                  Your name
                  <input
                    type="text"
                    name="name"
                    placeholder="Your name"
                    autoComplete="name"
                    required
                  />
                </label>
              )}
              <label>
                Email address
                <input
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                  autoFocus
                />
              </label>
              <label>
                Password
                <input
                  type="password"
                  name="password"
                  placeholder="At least 8 characters"
                  autoComplete={authMode === "login" ? "current-password" : "new-password"}
                  minLength={8}
                  required
                />
              </label>
              {authMessage && <p className="auth-message" role="status">{authMessage}</p>}
              <button className="button button-dark auth-submit" type="submit">
                {authMode === "login" ? "Log in" : "Create account"}
                <Icon name="arrow" size={17} />
              </button>
            </form>
            <p className="auth-switch">
              {authMode === "login" ? "New around here?" : "Already have an account?"}{" "}
              <button
                onClick={() => {
                  setAuthMessage("");
                  setAuthMode((mode) => mode === "login" ? "signup" : "login");
                }}
              >
                {authMode === "login" ? "Create an account" : "Log in"}
              </button>
            </p>
          </section>
        </div>
      )}

      {cartOpen && (
        <div className="drawer-backdrop" onMouseDown={() => setCartOpen(false)}>
          <aside
            className="cart-drawer"
            role="dialog"
            aria-modal="true"
            aria-labelledby="cart-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="drawer-heading">
              <div>
                <span className="eyebrow">The good stuff</span>
                <h2 id="cart-title">Your bag <span>({cartCount})</span></h2>
              </div>
              <button
                className="icon-button"
                aria-label="Close shopping bag"
                onClick={() => setCartOpen(false)}
              >
                <Icon name="close" />
              </button>
            </div>
            {cart.length ? (
              <>
                <div className="cart-items">
                  {cart.map((item) => (
                    <div className="cart-item" key={item.id}>
                      <img src={item.image} alt="" />
                      <div className="cart-item-details">
                        <h3>{item.name}</h3>
                        <p>{item.color}</p>
                        <div className="quantity-control">
                          <button
                            aria-label={`Remove one ${item.name}`}
                            onClick={() => updateQuantity(item.id, -1)}
                          >
                            −
                          </button>
                          <span>{item.quantity}</span>
                          <button
                            aria-label={`Add one ${item.name}`}
                            onClick={() => updateQuantity(item.id, 1)}
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <span className="cart-item-price">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="cart-summary">
                  <p><span>Subtotal</span><strong>{formatPrice(cartTotal)}</strong></p>
                  <span className="shipping-note">
                    {cartTotal >= FREE_SHIPPING_THRESHOLD
                      ? "Lovely — your shipping is on us."
                      : `You're ${formatPrice(FREE_SHIPPING_THRESHOLD - cartTotal)} away from complimentary shipping.`}
                  </span>
                  <button
                    className="button button-dark checkout-button"
                    onClick={() => setNotice("Checkout is coming soon")}
                  >
                    Continue to checkout <Icon name="arrow" size={17} />
                  </button>
                  <button
                    className="continue-shopping"
                    onClick={() => setCartOpen(false)}
                  >
                    Keep finding your feel
                  </button>
                </div>
              </>
            ) : (
              <div className="empty-cart">
                <span className="empty-bag-icon"><Icon name="bag" size={28} /></span>
                <h3>Your bag is taking a little breather.</h3>
                <p>It's a good time to find something that feels like you.</p>
                <button
                  className="button button-dark"
                  onClick={() => setCartOpen(false)}
                >
                  Explore the collection <Icon name="arrow" size={17} />
                </button>
              </div>
            )}
          </aside>
        </div>
      )}
    </>
  );
}

export default App;
