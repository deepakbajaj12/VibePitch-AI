# 🔥 VibePitch Command Console

**An AI-powered presentation assistant designed for Logitech MX Creative Console & MX Master 4.**

VibePitch Command Console transforms the **Logitech MX Creative Console** into a physical command center for founders, content creators, and students. Instead of clicking through web menus, users control their pitch workflow via tactile dials, buttons, and actions rings.

## 🚀 Key Innovations

### 1. Hardware-Controlled AI Modulation
Why use a mouse slider when you can turn a dial?
- **MX Creative Console Dial**: Physically rotate to adjust the "Intensity" and emotion of your AI-generated script in real-time.
- **Result**: "Touching" the emotion of your pitch feels intuitive and creative.

### 2. Actions Ring Teleprompter
- **MX Master 4 Actions Ring**: Control the scroll speed of the built-in teleprompter with a simple thumb swipe.
- **Benefit**: Keeps your hands natural during a presentation without fumbling for keyboard arrow keys.

### 3. Live Vocal Feedback
- **Real-Time Analysis**: The app listens to your practice runs.
- **Filler Word Detection**: Instantly flags "um", "uh", "like" to help you polish your delivery.
- **Confidence Meter**: Visualizes your vocal projection.

---

## 📸 Project Structure

This project is not just a web app; it is a **simulation of a Logitech Plugin**.

- **COMMAND CENTER (Main View)**: Split-screen interface with AI controls and Hardware Simulation.
- **TELEPROMPTER MODE**: Distraction-free reading view driven by hardware speed control.
- **LIVE FEEDBACK**: Background vocal analysis engine.
- **MX HARDWARE SIMULATION**: A built-in visualizer (Dial, Buttons, Ring) so judges can test the integration *without* physical hardware.

---

## 💡 Why Logitech?

This project fits the **"Future of Work"** track by merging AI productivity with tactile precision.

| Feature | Generic App | VibePitch on MX |
| :--- | :--- | :--- |
| **Context Switching** | High (Alt-Tab to control tools) | **Zero** (Dedicated hardware controls) |
| **Precision** | Low (Mouse dragging) | **High** (Dial rotation) |
| **Flow State** | Interrupted by UI clicks | **Maintained** by muscle memory |

---

## 💰 Business Viability & Market

### Target Users
1.  **Startup Founders**: preparing for high-stakes investor pitches (Demo Day).
2.  **YouTubers / Creators**: writing and recording scripts efficiently.
3.  **Sales Teams**: practicing objection handling with live feedback.
4.  **Students**: preparing for thesis defenses.

### Monetization Model
- **Freemium SaaS**: Free basic generation, paid "Live Feedback" analysis.
- **Logitech Marketplace Plugin**: Free plugin that drives hardware sales (users buy MX devices *to use* the app better).
- **Enterprise API**: Licensing the "Tone Analysis" engine to sales platforms (Salesforce/HubSpot).

---

## 🛠️ Tech Stack

- **Frontend**: React, Vite, Tailwind CSS
- **AI Engine**: Google Gemini (Script Generation & Tone Analysis)
- **Voice**: Web Speech API / ElevenLabs (Text-to-Speech)
- **Logitech Integration**: Simulated SDK events (ready for actual Logi Options+ SDK implementation)

## 🏃‍♂️ How to Run

1.  Clone the repo
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Add your Gemini API Key to `.env`
4.  Run the app:
    ```bash
    npm run dev
    ```
5.  **Enable "LOGI MX MODE" in the top right to start the Hardware Simulation.**

---

*Designed for Logitech DevStudio 2026 Challenge.*
