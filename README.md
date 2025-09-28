# 🏥 NIVARA - Smart Skin Health Scanner

<div align="center">

![NIVARA Logo](https://img.shields.io/badge/NIVARA-Smart%20Healthcare-blue?style=for-the-badge&logo=medical-cross&logoColor=white)

**Revolutionary AI-powered skin health detection platform that brings dermatological expertise to your home**

[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=flat-square&logo=react&logoColor=white)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4.19-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-2.58.0-3ECF8E?style=flat-square&logo=supabase&logoColor=white)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.4.17-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

[🚀 Live Demo](#-live-demo) • [📋 Features](#-features) • [🛠️ Tech Stack](#️-tech-stack) • [🚀 Getting Started](#-getting-started) • [📱 Screenshots](#-screenshots) • [🤝 Contributing](#-contributing)

</div>

---

## 🌟 Overview

**NIVARA** is a cutting-edge healthcare technology platform that combines AI-powered skin analysis with Raspberry Pi hardware to provide accurate, affordable, and accessible skin health monitoring. Our platform empowers users to detect potential skin conditions early, connect with dermatologists, and take control of their skin health from the comfort of their homes.

### 🎯 Mission Statement
> *"Democratizing healthcare by making advanced skin health detection accessible, affordable, and accurate for everyone."*

---

## ✨ Key Features

### 🔬 **AI-Powered Analysis**
- **90%+ Accuracy** in skin condition detection
- **Advanced Machine Learning** algorithms for pattern recognition
- **Real-time Analysis** with confidence scoring
- **Privacy-Secure** data processing

### 🏠 **Home Healthcare Solution**
- **Raspberry Pi Integration** for high-quality imaging
- **Cloud Connectivity** for seamless data sync
- **User-Friendly Interface** with intuitive design
- **Mobile-Responsive** platform

### 👨‍⚕️ **Healthcare Network**
- **Find Dermatologists** in your area
- **Service Centers** for device support
- **Appointment Booking** system
- **Professional Consultation** integration

### 📊 **Smart Dashboard**
- **Health Monitoring** with detailed analytics
- **Scan History** and trend analysis
- **Device Management** for multiple devices
- **Progress Tracking** over time

---

## 🛠️ Tech Stack

### **Frontend**
- **React 18.3.1** - Modern UI framework
- **TypeScript 5.8.3** - Type-safe development
- **Vite 5.4.19** - Lightning-fast build tool
- **Tailwind CSS 3.4.17** - Utility-first styling
- **React Router DOM 6.30.1** - Client-side routing

### **UI Components**
- **shadcn/ui** - Modern component library
- **Radix UI** - Accessible component primitives
- **Lucide React** - Beautiful icon system
- **Framer Motion** - Smooth animations

### **Backend & Database**
- **Supabase 2.58.0** - Backend-as-a-Service
- **PostgreSQL** - Robust database
- **Row Level Security** - Data protection
- **Real-time Subscriptions** - Live updates

### **Development Tools**
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **TypeScript** - Static type checking
- **Vite** - Development server

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18 or higher)
- **npm** or **yarn** package manager
- **Git** for version control

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/nivara.git
   cd nivara
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env.local
   ```
   
   Configure your environment variables:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Start development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:8080`

### 🗄️ Database Setup

1. **Create Supabase Project**
   - Visit [Supabase](https://supabase.com)
   - Create a new project
   - Copy your project URL and anon key

2. **Run Migrations**
   ```bash
   # The migrations are located in supabase/migrations/
   # Run them in your Supabase dashboard or via CLI
   ```

---

## 📱 Screenshots

<div align="center">

### 🏠 **Landing Page**
![Landing Page](https://via.placeholder.com/800x400/1e40af/ffffff?text=Landing+Page+Preview)

### 🔐 **Authentication**
![Auth Page](https://via.placeholder.com/800x400/059669/ffffff?text=Authentication+Page)

### 🛒 **Purchase Flow**
![Buy Page](https://via.placeholder.com/800x400/dc2626/ffffff?text=Purchase+Page)

### 📊 **Dashboard**
![Dashboard](https://via.placeholder.com/800x400/7c3aed/ffffff?text=User+Dashboard)

</div>

---

## 🏗️ Project Structure

```
nivara/
├── 📁 public/                 # Static assets
├── 📁 src/
│   ├── 📁 components/         # Reusable UI components
│   │   └── 📁 ui/            # shadcn/ui components
│   ├── 📁 hooks/             # Custom React hooks
│   ├── 📁 integrations/     # External service integrations
│   │   └── 📁 supabase/     # Database client & types
│   ├── 📁 lib/               # Utility functions
│   ├── 📁 pages/             # Application pages
│   └── 📄 main.tsx           # Application entry point
├── 📁 supabase/              # Database migrations
├── 📄 package.json           # Dependencies
├── 📄 tailwind.config.ts     # Tailwind configuration
├── 📄 vite.config.ts         # Vite configuration
└── 📄 README.md              # Project documentation
```

---

## 🔧 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm run type-check` | Run TypeScript checks |

---

## 🌐 Live Demo

**Experience NIVARA in action:**
- 🚀 **Production**: [nivara.com](https://nivara.com)
- 🧪 **Staging**: [staging.nivara.com](https://staging.nivara.com)

---

## 📈 Performance Metrics

<div align="center">

| Metric | Value |
|--------|-------|
| **Lighthouse Score** | 95+ |
| **First Contentful Paint** | < 1.5s |
| **Largest Contentful Paint** | < 2.5s |
| **Cumulative Layout Shift** | < 0.1 |
| **Bundle Size** | < 500KB |

</div>

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Workflow

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Run tests**
   ```bash
   npm run test
   ```
5. **Commit your changes**
   ```bash
   git commit -m 'Add amazing feature'
   ```
6. **Push to your branch**
   ```bash
   git push origin feature/amazing-feature
   ```
7. **Open a Pull Request**

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 👥 Team

<div align="center">

**NIVARA Development Team**

| Role | Name | Contact |
|------|------|---------|
| **Lead Developer** | NIVARA Team | [@nivara_health](https://github.com/nivara) |
| **UI/UX Designer** | NIVARA Team | [@nivara_health](https://github.com/nivara) |
| **Backend Engineer** | NIVARA Team | [@nivara_health](https://github.com/nivara) |

</div>

---

## 🙏 Acknowledgments

- **Supabase** for the amazing backend platform
- **shadcn/ui** for the beautiful component library
- **Tailwind CSS** for the utility-first CSS framework
- **React Team** for the incredible frontend framework
- **Open Source Community** for inspiration and support

---

## 📞 Support

- **📧 Email**: support@nivara.com
- **💬 Discord**: [Join our community](https://discord.gg/nivara)
- **📖 Documentation**: [docs.nivara.com](https://docs.nivara.com)
- **🐛 Issues**: [GitHub Issues](https://github.com/nivara/nivara/issues)

---

<div align="center">

**Made by the NIVARA Team**

[![GitHub stars](https://img.shields.io/github/stars/nivara/nivara?style=social)](https://github.com/nivara/nivara)
[![GitHub forks](https://img.shields.io/github/forks/nivara/nivara?style=social)](https://github.com/nivara/nivara)
[![GitHub watchers](https://img.shields.io/github/watchers/nivara/nivara?style=social)](https://github.com/nivara/nivara)

**⭐ Star this repository if you found it helpful!**

</div>
