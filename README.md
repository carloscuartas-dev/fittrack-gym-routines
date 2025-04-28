# FitTrack - Gym Routine Tracker

FitTrack is a modern web application built with React and TypeScript that helps you manage and track your gym workouts effectively. Create custom routines, log your progress, and visualize your fitness journey through detailed statistics.

![FitTrack Dashboard](https://images.pexels.com/photos/4498151/pexels-photo-4498151.jpeg?auto=compress&cs=tinysrgb&w=1200)

## Features

- 💪 **Workout Routine Management**
  - Create custom workout routines
  - Organize exercises by muscle groups
  - Schedule routines for specific days
  - Mark favorites for quick access

- 📊 **Progress Tracking**
  - Log completed workouts
  - Track sets, reps, and weights
  - Monitor workout duration
  - View exercise history

- 📈 **Statistics Dashboard**
  - Visualize workout frequency
  - Track popular routines
  - Monitor total workout time
  - Analyze exercise patterns

- 📱 **Responsive Design**
  - Works seamlessly on desktop and mobile
  - Clean, intuitive interface
  - Real-time workout tracking

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/fittrack-gym-routines.git
```

2. Navigate to the project directory:
```bash
cd fittrack-gym-routines
```

3. Install dependencies:
```bash
npm install
```

4. Start the development server:
```bash
npm run dev
```

5. Open your browser and visit `http://localhost:5173`

### Building for Production

To create a production build:

```bash
npm run build
```

The built files will be in the `dist` directory.

## Technology Stack

- **Frontend Framework**: React 18
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Routing**: React Router
- **State Management**: React Context
- **Build Tool**: Vite
- **Code Quality**: ESLint

## Project Structure

```
fittrack-gym-routines/
├── src/
│   ├── components/     # Reusable UI components
│   ├── context/       # React Context providers
│   ├── data/         # Initial data and constants
│   ├── layout/       # Layout components
│   ├── pages/        # Page components
│   └── types/        # TypeScript type definitions
├── public/           # Static assets
└── package.json      # Project dependencies
```

## Features in Detail

### Workout Routines
- Create personalized workout routines
- Add exercises with custom sets, reps, and weights
- Organize routines by day of the week
- Mark routines as favorites
- Filter routines by muscle group

### Exercise Tracking
- Log completed exercises during workouts
- Track weight and reps for each set
- Monitor workout duration
- Add notes to workouts

### Statistics
- View workout frequency by day
- Track most used routines
- Monitor total workout time
- Analyze exercise patterns
- View recent workout history

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Icons provided by [Lucide](https://lucide.dev/)
- UI components styled with [Tailwind CSS](https://tailwindcss.com/)