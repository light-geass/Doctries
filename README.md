# Doctris — AI-Powered Healthcare Assistant

Doctris is a next-generation healthcare platform that bridges the gap between patient diagnostics and professional medical care. By integrating advanced artificial intelligence with clinical workflows, Doctris empowers patients with instant insights into their medical scans while providing a seamless, one-connected platform to manage appointments and consultations with specialists.

## Our Mission

Our mission is to simplify medical journeys through technology. Navigating healthcare can often be overwhelming; Doctris aims to reduce the uncertainty between scan results and doctor consultations by providing an intelligent assistant that acts as a first-line analysis tool for patients and a data-driven companion for medical professionals.

## Key Features

### Intelligent AI Scan Analysis
A core pillar of Doctris is its ability to handle complex diagnostic imagery. Users can upload X-rays, MRIs, and CT scans directly into the platform. A proprietary AI Agent system (Radiologist, Pharmacist, Clinical Research, Triage) reviews the pixel patterns and metadata to provide an immediate summary of findings, confidence indices, and recommended next steps.

### Specialist-Led Care Team
The platform hosts a directory of certified medical specialists. It enables discovery based on expertise and allows for appointment scheduling through a modern, integrated workflow. This eliminates the frictional steps usually associated with the transition from receiving a report to finding the right expert.

### Unified Patient Dashboard
Patients have a centralized hub where they can securely access all past scan results, digital reports, and appointment histories. This ensures that every part of their medical data is available at their fingertips, wherever they are, allowing for better continuity of care.

### Interactive AI Chatbot
For quick medical questions and guidance, the platform features a real-time AI assistant. Built with conversational depth, the chatbot helps patients understand common symptoms and directs them toward the relevant specialist or internal resource.

### Professional Aesthetic Customization
Designed to be accessible in all environments, Doctris supports a high-contrast dark theme and a clean light theme. This ensures visibility and comfort for both patients and clinicians in various professional lighting conditions.

## Technical Architecture

The platform architecture is built for scalability and performance:

- **Frontend Architecture**: Built on Next.js 15 (App Router) using React 19 for high-performance rendering and a robust routing system.
- **Backend Infrastructure**: Leverages the InsForge SDK for direct communication with a mission-critical PostgreSQL database via a secure PostgREST API.
- **Artificial Intelligence**: Integrated with advanced LLMs (GPT-4o) specifically tuned for medical orchestration and image analysis.
- **State Management**: Uses Redux Toolkit for consistent data synchronization across multi-step forms and analysis workflows.
- **Component System**: Styled using a premium implementation of Tailwind CSS 4.0, focused on glassmorphism and accessibility standards.

## Benefits and Global Impact

### Efficiency in Diagnostics
By reducing the waiting time for non-clinical diagnostic insights from days to seconds, Doctris reduces the anxiety often associated with the diagnostic process.

### Democratizing Access to Experts
The integrated appointment system helps democratize access to top-tier specialists, making it as easy to book a consultation as it is to book a ride.

### Clinical Transparency
Through clear, AI-driven reports and organized data, patients feel more informed and are better equipped to participate in shared decision-making with their doctors during clinical visits.

## Getting Started

To run the project locally for development or testing:

1. Clone the repository.
2. Install dependencies: `npm install`.
3. Configure your InsForge environmental variables (Base URL and Anon Key).
4. Run the development server: `npm run dev`.
5. Access the clinical portal at http://localhost:3000.
