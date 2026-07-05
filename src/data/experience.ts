import { Building2, GraduationCap, type LucideIcon } from "lucide-react";

export interface Experience {
  company: string;
  role: string;
  period: string;
  type: 'full-time' | 'internship' | 'contract';
  icon: LucideIcon;
  color: string;
  achievements: string[];
  technologies: string[];
}

export const experiences: Experience[] = [
  {
    company: "Varadhast Innovations",
    role: "Android Development & Computer Vision ML Intern",
    period: "2026",
    type: "internship",
    icon: GraduationCap,
    color: "primary",
    achievements: [
      "Developed Android applications using Kotlin and Android Studio with a focus on performance and usability.",
      "Built and integrated Computer Vision features using OpenCV and deep learning models.",
      "Implemented image processing pipelines for real-time object detection and image analysis.",
      "Integrated REST APIs and optimized data flow between Android applications and backend services.",
      "Collaborated with mentors and developers to design, test, and deploy production-ready features.",
      "Debugged, tested, and optimized Android applications to improve stability and user experience.",
      "Participated in model evaluation, performance optimization, and documentation of ML workflows."
    ],
    technologies: [
      "React-Native",
      "Android Studio",
      "Python",
      "OpenCV",
      "Computer Vision",
      "REST API"
    ],
  },
  {
    company: "Technology Business Incubator (TBI)",
    role: "AI-Assisted Full Stack Web Development Intern",
    period: "Jun 2026 – Aug 2026",
    type: "internship",
    icon: GraduationCap,
    color: "primary",
    achievements: [
      "Offered by Graphic Era University, Dehradun.",
      "Developed responsive, component-based web applications using React.js/Next.js and Tailwind CSS.",
      "Built RESTful APIs using Express.js and FastAPI following modern backend development practices.",
      "Integrated Generative AI APIs including OpenAI and Gemini to build intelligent application features.",
      "Designed and managed database schemas with secure authentication and protected routes.",
      "Applied Git-based version control, debugging, testing, and software engineering best practices throughout the development lifecycle."
    ],
    technologies: [
      "React.js",
      "Next.js",
      "Tailwind CSS",
      "Express.js",
      "FastAPI",
      "Python",
      "Node.js",
      "OpenAI API",
      "Google Gemini API",
      "Git"
    ],
  },
  {
    company: "QuickHyre",
    role: "Python Developer Intern",
    period: "2025",
    type: "internship",
    icon: GraduationCap,
    color: "accent",
    achievements: [
      "Developed backend applications and automation scripts using Python",
      "Built and integrated REST APIs for web applications",
      "Collaborated with the development team on real-world software projects",
      "Debugged, tested, and optimized Python code for improved performance",
      "Worked with version control and followed industry-standard development practices"
    ],
    technologies: ["Python", "FastAPI", "Flask", "REST API"],
  },
  {
    company: "Vivid Nexus",
    role: "Intern",
    period: "2025",
    type: "internship",
    icon: GraduationCap,
    color: "accent",
    achievements: [
      "Worked across Web Development",
      "Collaborated on intern-level projects",
      "Hands-on experience with real-world systems",
    ],
    technologies: ["Express.js", "React.js"],
  },

];