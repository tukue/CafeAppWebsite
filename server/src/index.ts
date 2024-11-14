import dotenv from 'dotenv';
import path from 'path';
import express from 'express';
import cors from 'cors';
import { connectDB } from './config/database';

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Menu data
const menuItems = [
  {
    id: 1,
    name: 'Cappuccino',
    category: 'drinks',
    price: 4.50,
    image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d',
    description: 'Rich espresso with steamed milk foam'
  },
  {
    id: 2,
    name: 'Cafe Latte',
    category: 'drinks',
    price: 4.00,
    image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735',
    description: 'Smooth espresso with steamed milk'
  },
  {
    id: 3,
    name: 'Club Sandwich',
    category: 'food',
    price: 8.50,
    image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af',
    description: 'Triple-decker with chicken, bacon, and fresh vegetables'
  },
  {
    id: 4,
    name: 'Caesar Salad',
    category: 'food',
    price: 7.50,
    image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1',
    description: 'Fresh romaine lettuce with Caesar dressing and croutons'
  },
  {
    id: 5,
    name: 'Chocolate Cake',
    category: 'desserts',
    price: 5.50,
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587',
    description: 'Rich chocolate layer cake with ganache'
  }
];

// Main route
app.get('/', (_req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Cafe Express</title>
        <link rel="stylesheet" href="/css/styles.css">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    </head>
    <body>
        <!-- Navigation -->
        <nav class="navbar">
            <div class="container">
                <div class="logo">
                    <i class="fas fa-coffee"></i> Cafe Express
                </div>
                <ul class="nav-links">
                    <li><a href="#menu">Menu</a></li>
                    <li><a href="#about">About</a></li>
                    <li><a href="#contact">Contact</a></li>
                    <li>
                        <a href="#cart" class="cart-icon">
                            <i class="fas fa-shopping-cart"></i>
                            <span class="cart-count">0
                        </a>
                    </li>
                </ul>
            </div>
        </nav>

        <!-- Hero Section -->
        <header class="hero">
            <div class="container">
                <h1>Welcome to Cafe Express</h1>
                <p>Experience the perfect blend of taste and ambiance</p>
                <a href="#menu" class="btn btn-primary">Explore Our Menu</a>
            </div>
        </header>

        <div class="section-divider"></div>

        <!-- Menu Section -->
        <section id="menu" class="menu-section pattern-bg">
            <div class="container">
                <h2>Our Menu</h2>
                <div class="menu-filters">
                    <button class="filter-btn active" data-category="all">All</button>
                    <button class="filter-btn" data-category="drinks">Drinks</button>
                    <button class="filter-btn" data-category="food">Food</button>
                    <button class="filter-btn" data-category="desserts">Desserts</button>
                </div>
                <div class="menu-grid" id="menuGrid"></div>
            </div>
        </section>

        <!-- About Section -->
        <section id="about" class="about-section">
            <div class="container">
                <div class="about-content">
                    <h2>About Us</h2>
                    <p>Welcome to Cafe Website.</p>
                    <div class="features">
                        <div class="feature">
                            <i class="fas fa-coffee"></i>
                            <h3>Quality Coffee</h3>
                            <p>Beans, expertly roasted</p>
                        </div>
                        <div class="feature">
                            <i class="fas fa-utensils"></i>
                            <h3>Fresh Food</h3>
                            <p>Made with quality ingredients</p>
                        </div>
                        <div class="feature">
                            <i class="fas fa-heart"></i>
                            <h3>Great Service</h3>
                            <p>Friendly and attentive staff</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Contact Section -->
        <section id="contact" class="contact-section">
            <div class="container">
                <h2>Contact Us</h2>
                <div class="contact-content">
                    <div class="contact-info">
                        <div class="info-item">
                            <i class="fas fa-map-marker-alt"></i>
                            <p> Stockholm, Sweden</p>
                        </div>
                        <div class="info-item">
                            <i class="fas fa-phone"></i>
                            <p></p>
                        </div>
                        <div class="info-item">
                            <i class="fas fa-envelope"></i>
                            <p>info@cafeexpress.com</p>
                        </div>
                    </div>
                    <div class="opening-hours">
                        <h3>Opening Hours</h3>
                        <p></p>
                        <p></p>
                    </div>
                </div>
            </div>
        </section>

        <!-- Cart Modal -->
        <div id="cart-modal" class="modal">
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Your Cart</h2>
                    <button class="close-modal">&times;</button>
                </div>
                <div class="cart-items">
                    <!-- Cart items will be dynamically added here -->
                </div>
                <div class="cart-total">
                    <span>Total:
                    <span id="cartTotal">$0.00
                </div>
                <button class="btn btn-primary checkout-btn">Checkout</button>
            </div>
        </div>

        <!-- Footer -->
        <footer class="footer">
            <div class="container">
                <div class="footer-content">
                    <div class="footer-section">
                        <h3>Cafe Express</h3>
                        <p>Your perfect coffee destination</p>
                        <div class="social-links">
                            <a href="#"><i class="fab fa-facebook"></i></a>
                            <a href="#"><i class="fab fa-instagram"></i></a>
                            <a href="#"><i class="fab fa-twitter"></i></a>
                        </div>
                    </div>
                    <div class="footer-section">
                        <h3>Quick Links</h3>
                        <ul>
                            <li><a href="#menu">Menu</a></li>
                            <li><a href="#about">About</a></li>
                            <li><a href="#contact">Contact</a></li>
                        </ul>
                    </div>
                    <div class="footer-section">
                        <h3>Newsletter</h3>
                        <form class="newsletter-form">
                            <input type="email" placeholder="Enter your email">
                            <button type="submit" class="btn btn-primary">Subscribe</button>
                        </form>
                    </div>
                </div>
                <div class="footer-bottom">
                    <p>&copy; 2024 Cafe Express. All rights reserved.</p>
                </div>
            </div>
        </footer>

        <script src="/js/main.js"></script>
    </body>
    </html>
  `);
});

// API Routes
app.get('/api/menu', (_req, res) => {
  res.json(menuItems);
});

// Handle orders
app.post('/api/orders', (req, res) => {
  const { items, total } = req.body;
  // Here you would typically save the order to a database
  console.log('New order:', { items, total });
  res.status(200).json({ message: 'Order received successfully' });
});

// Connect to database
connectDB();

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
