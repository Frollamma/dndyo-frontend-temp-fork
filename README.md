# Forge & Fable 🐉

A premium, cinematic Virtual Tabletop (VTT) RPG interface built with React and Tailwind CSS. This project serves as the highly polished frontend for an AI-powered Dungeon Master backend (`dndyo-backend`).

## ✨ Features

- **Cinematic 3-Panel Layout**: A deeply immersive 20/60/20 split that maximizes the game board space without sacrificing UI detail.
- **Interactive 2D Virtual Tabletop**: 
  - A grid-less top-down dungeon map.
  - Click-to-move player token with invisible collision boundaries (players cannot walk through walls).
  - Positioned enemy tokens with glowing red borders and live HP bars.
- **"Blizzard-Quality" Character Sheet**: 
  - Vintage stat cards with massive numbers and glowing DnD modifiers.
  - Deep, glass-like inner shadows on health and experience bars, complete with a low-health pulse animation.
  - Overlapping 3D Armor Class (AC) shield badge.
  - Rarity-coded inventory borders (Common, Rare, Epic, Legendary).
- **Interactive D20 Overlay**: A frosted-glass modal for rolling action checks, featuring animated hover, shake, and spin states. 
- **AI Dungeon Master Console**: An elegant chat log styled with vintage serif typography (`Playfair Display`), customized scrollbars, and an animated "DM is Speaking" audio visualizer.

## 🚀 Getting Started

To test this frontend locally:

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/r0d3x/dndyo-frontend.git
   cd dndyo-frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Test the UI:**
   Open your browser and navigate to `http://localhost:5173/`.
   - **Move around:** Click on the tables, floors, or corridors in the central map to glide the player token.
   - **Test collisions:** Try clicking within the black void outside the rooms—your movement will be blocked.
   - **Roll a check:** Click the `ROLL CHECK` button in the bottom right to trigger the D20 dice overlay.
   - **Interact with the DM:** Type a message into the right panel and send it to see the simulated chat response.

## 🛠️ Tech Stack

- **Framework**: React (Vite)
- **Styling**: Tailwind CSS (Dark Mode, Custom Gradients, Inner Shadows)
- **Icons**: Lucide React
- **Typography**: Playfair Display (Serif), Inter/Roboto (Sans-serif)
