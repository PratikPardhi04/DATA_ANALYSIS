# DataWise AI - Advanced Analytics Dashboard

A production-ready, responsive, and modern front-end for a data analytics + AI insights dashboard built with React, Vite, and Tailwind CSS.

![DataWise AI Dashboard](https://img.shields.io/badge/React-18.2.0-blue?style=for-the-badge&logo=react)
![Vite](https://img.shields.io/badge/Vite-4.4.5-purple?style=for-the-badge&logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.3.3-38B2AC?style=for-the-badge&logo=tailwind-css)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0.0-blue?style=for-the-badge&logo=typescript)

## 🚀 Features

### Core Functionality
- **Interactive Dashboard** - Real-time analytics with multiple chart types
- **AI-Powered Insights** - Machine learning insights and recommendations
- **Data Upload & Processing** - Drag-and-drop file upload with AI analysis
- **Responsive Design** - Mobile-first approach with smooth transitions
- **Dark Mode Support** - Toggle between light and dark themes
- **Modern UI/UX** - Glassmorphism effects and smooth animations

### Technical Features
- **React 18** with modern hooks and functional components
- **Vite** for lightning-fast development and building
- **Tailwind CSS** for utility-first styling
- **Framer Motion** for smooth animations and transitions
- **Recharts** for interactive data visualization
- **React Router** for client-side routing
- **React Dropzone** for file upload functionality
- **Lucide React** for beautiful icons

### Design System
- **Neon Accent Colors** - Vibrant colors for dark mode
- **Glassmorphism Effects** - Modern glass-like UI elements
- **Consistent Typography** - Inter font family with proper hierarchy
- **Smooth Animations** - Framer Motion powered transitions
- **Accessibility** - WCAG compliant with proper ARIA labels

## 📁 Project Structure

```
datawise-ai/
├── public/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Button.jsx
│   │   ├── Card.jsx
│   │   ├── NavBar.jsx
│   │   └── Footer.jsx
│   ├── pages/              # Page components
│   │   ├── LandingPage.jsx
│   │   ├── Dashboard.jsx
│   │   ├── DataUpload.jsx
│   │   ├── About.jsx
│   │   └── Contact.jsx
│   ├── layouts/            # Layout components
│   │   └── Layout.jsx
│   ├── contexts/           # React contexts
│   │   └── ThemeContext.jsx
│   ├── utils/              # Utility functions
│   │   └── cn.js
│   ├── data/               # Sample data and mock data
│   │   └── chartData.js
│   ├── hooks/              # Custom React hooks
│   ├── App.jsx             # Main app component
│   ├── main.jsx            # App entry point
│   └── index.css           # Global styles
├── package.json
├── tailwind.config.js      # Tailwind configuration
├── vite.config.js          # Vite configuration
└── README.md
```

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd datawise-ai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

## 📦 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🎨 Design System

### Color Palette

**Primary Colors:**
- Primary Blue: `#0ea5e9` - Main brand color
- Neon Blue: `#00d4ff` - Accent color for dark mode
- Neon Purple: `#a855f7` - Secondary accent

**Dark Mode Colors:**
- Dark 950: `#020617` - Background
- Dark 900: `#0f172a` - Card backgrounds
- Dark 800: `#1e293b` - Secondary backgrounds
- Dark 700: `#334155` - Borders

### Typography

- **Font Family**: Inter (Google Fonts)
- **Headings**: Bold weights (600-900)
- **Body**: Regular weight (400)
- **Monospace**: JetBrains Mono for code

### Components

#### Button Variants
- `primary` - Main call-to-action buttons
- `secondary` - Secondary actions
- `ghost` - Subtle interactions
- `outline` - Bordered buttons
- `danger` - Destructive actions

#### Card Variants
- `default` - Standard card with shadow
- `glass` - Glassmorphism effect
- `elevated` - Higher shadow for emphasis
- `outline` - Bordered card

## 📊 Dashboard Features

### Analytics Cards
- Revenue metrics with trend indicators
- User analytics with growth percentages
- Real-time data visualization
- Performance metrics with comparisons

### Interactive Charts
- **Area Charts** - Sales trends and revenue
- **Pie Charts** - Category distribution
- **Line Charts** - Real-time activity
- **Bar Charts** - Top products and performance

### AI Insights Panel
- Automated data quality assessment
- Trend detection and analysis
- Anomaly detection alerts
- Correlation analysis results

### Data Upload System
- Drag-and-drop file upload
- Progress tracking
- Multiple file format support
- AI-powered data analysis
- Export capabilities

## 🌙 Dark Mode

The application includes a comprehensive dark mode implementation:

- **Automatic Detection** - Respects system preferences
- **Manual Toggle** - User-controlled theme switching
- **Persistent Storage** - Remembers user preference
- **Smooth Transitions** - Animated theme changes

## 📱 Responsive Design

The dashboard is fully responsive with breakpoints:

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

### Mobile Optimizations
- Collapsible navigation menu
- Touch-friendly interactions
- Optimized chart layouts
- Simplified data tables

## 🔧 Customization

### Theme Configuration

Edit `tailwind.config.js` to customize:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        // Custom primary colors
      },
      neon: {
        // Custom neon accent colors
      }
    },
    animation: {
      // Custom animations
    }
  }
}
```

### Component Styling

All components use Tailwind CSS classes and can be easily customized:

```jsx
<Button 
  variant="primary" 
  size="lg" 
  className="custom-classes"
>
  Custom Button
</Button>
```

## 🚀 Performance Optimizations

- **Code Splitting** - Route-based lazy loading
- **Image Optimization** - Optimized images and icons
- **Bundle Analysis** - Efficient dependency management
- **Caching** - Browser caching strategies
- **Lazy Loading** - Components loaded on demand

## 🔒 Security Features

- **Input Validation** - Form validation and sanitization
- **XSS Protection** - React's built-in XSS protection
- **Secure Headers** - Proper security headers
- **Data Encryption** - Client-side data protection

## 📈 Analytics Integration

The dashboard is designed to integrate with various analytics platforms:

- **Google Analytics** - User behavior tracking
- **Mixpanel** - Event tracking
- **Segment** - Data collection
- **Custom APIs** - Real-time data feeds

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Design Inspiration**: Apple, Stripe, Linear.app
- **Icons**: Lucide React
- **Charts**: Recharts
- **Animations**: Framer Motion
- **Styling**: Tailwind CSS

## 📞 Support

For support and questions:

- **Email**: support@datawise.ai
- **Documentation**: [docs.datawise.ai](https://docs.datawise.ai)
- **Issues**: [GitHub Issues](https://github.com/datawise-ai/issues)

---

Built with ❤️ by the DataWise AI team
#   D A T A _ A N A L Y S I S  
 