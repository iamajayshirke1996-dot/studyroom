import React, { useState, useEffect, useMemo } from "react";
import {
  X,
  Sparkles,
  Copy,
  ExternalLink,
  Wand2,
  RefreshCw,
  Share2,
  ThumbsUp,
  MessageSquare,
  Repeat2,
  Send,
  Globe,
  Code,
  CheckCircle2,
  Download,
  Info,
  Bot,
  CheckCheck,
  Image as ImageIcon,
  Palette,
  Loader2,
  Key,
  AlertTriangle,
  Save,
  Zap,
  Dices,
  Shuffle,
  Edit3,
} from "lucide-react";
import confetti from "canvas-confetti";
import { useStudy } from "../../context/StudyContext";
import { useAuth } from "../../context/AuthContext";
import { LinkedInPostTone } from "../../types";
import {
  checkGrammarAndEnhance,
  generateAILinkedInPost,
  getStoredGeminiApiKey,
  saveGeminiApiKey,
  GeminiApiError,
} from "../../services/geminiService";
import {
  generateLinkedInCardImage,
  ImageTheme,
} from "../../utils/imageGenerator";

// Topic category to hashtag mappings
const CATEGORY_HASHTAGS: Record<string, string[]> = {
  react: ["#ReactJS", "#FrontendDev", "#JavaScript", "#WebDevelopment"],
  typescript: ["#TypeScript", "#JavaScript", "#WebDev", "#CleanCode"],
  javascript: ["#JavaScript", "#ES6", "#WebDev", "#Frontend"],
  dsa: [
    "#DataStructures",
    "#Algorithms",
    "#LeetCode",
    "#CodingInterview",
    "#ProblemSolving",
  ],
  system_design: [
    "#SystemDesign",
    "#Backend",
    "#SoftwareArchitecture",
    "#Scalability",
  ],
  node: ["#NodeJS", "#BackendDev", "#JavaScript", "#WebDevelopment"],
  python: ["#Python", "#AsyncIO", "#Backend", "#SoftwareEngineering"],
  docker: ["#Docker", "#DevOps", "#Containers", "#CloudNative"],
  sql: [
    "#SQL",
    "#Databases",
    "#PostgreSQL",
    "#DatabaseIndexing",
    "#BackendDev",
  ],
  default: [
    "#ContinuousLearning",
    "#SoftwareEngineering",
    "#DeveloperJourney",
    "#100DaysOfCode",
  ],
};

// Built-in Sample Generated Texts tailored by topic
const TOPIC_PRESET_TEMPLATES: Record<string, { label: string; text: string }> =
  {
    react: {
      label: "⚛️ React Hooks & Performance",
      text: `🚀 Mastering Advanced React Hooks & Fiber Reconciler

Today I spent focused study time diving deep into React's rendering pipeline, useMemo optimization, and custom hook encapsulation.

📌 Core Takeaways:
• useEffect triggers asynchronously AFTER paint; useLayoutEffect runs synchronously before browser paint to prevent visual flicker.
• useCallback memoizes reference equality across re-renders to prevent unnecessary child re-renders.
• Closures inside hooks retain state at render time — watch out for stale state bugs!

📝 Quick Code Snippet:
\`\`\`js
const memoizedCallback = useCallback(() => {
  doSomething(a, b);
}, [a, b]);
\`\`\`

⚠️ Gotcha: Don't over-optimize! Wrapping primitive props in useMemo adds memory overhead without performance gains.

👉 How do you structure state management in large React apps? Drop your thoughts below! 👇

#ReactJS #FrontendDev #JavaScript #WebDevelopment #100DaysOfCode #StudyPulse`,
    },
    dsa: {
      label: "🧩 DSA Sliding Window",
      text: `🧠 Data Structures & Algorithms Spotlight: Two Pointers & Sliding Window

Problem-solving mindset shift! Solved key pattern problems on subarray constraints today.

📌 Core Takeaways:
• Use Fixed Sliding Window when subarray size k is given (keep running windowSum).
• Use Dynamic Sliding Window when finding min/max window satisfying a condition (expand right, shrink left).
• Reduces O(N²) nested loops down to O(N) linear time complexity.

📝 Cheat Sheet Pattern:
\`\`\`js
let left = 0, currentSum = 0;
for (let right = 0; right < arr.length; right++) {
  currentSum += arr[right];
  while (currentSum >= target) {
    minLen = Math.min(minLen, right - left + 1);
    currentSum -= arr[left++];
  }
}
\`\`\`

👉 What's your favorite algorithm pattern for technical interviews? Let's connect! 🤝

#DataStructures #Algorithms #LeetCode #CodingInterview #ProblemSolving #StudyPulse`,
    },
    system_design: {
      label: "🏗️ System Design",
      text: `🏗️ High-Availability System Design: Load Balancers & Caching

Exploring distributed architecture scalability and data consistency today!

📌 Key Architectural Insights:
• Consistent Hashing prevents massive cache invalidation when scaling cache nodes dynamically.
• Write-Through vs Write-Back Caching: Choose based on read-heavy vs write-heavy SLA requirements.
• CAP Theorem trade-offs: You can only guarantee 2 out of Consistency, Availability, and Partition Tolerance.

⚠️ Gotcha: Beware of Cache Stampede (Thundering Herd effect). Mitigate using mutex locking or probabilistic early expiration.

👉 What caching strategy do you rely on for high-traffic microservices? 💬

#SystemDesign #Backend #SoftwareArchitecture #Scalability #DistributedSystems #StudyPulse`,
    },
    javascript: {
      label: "💛 JS Event Loop",
      text: `⚡ Deep Dive: JavaScript Engine & Microtask Queue Execution

Demystifying how Node.js and Browser V8 handle asynchronous tasks behind the scenes!

📌 Core Takeaways:
• Call Stack executes synchronous code first to completion.
• Microtask Queue (Promises, process.nextTick) runs immediately after current stack clears before the Macrotask Queue (setTimeout, setInterval).
• Event Loop monitors the call stack continuously.

📝 Quick Execution Order:
\`\`\`js
console.log('1'); // Sync
setTimeout(() => console.log('2'), 0); // Macrotask
Promise.resolve().then(() => console.log('3')); // Microtask
console.log('4'); // Sync
// Output: 1 -> 4 -> 3 -> 2
\`\`\`

👉 What's a JS concept that took you a while to master? 💬

#JavaScript #WebDev #NodeJS #AsyncJS #CleanCode #StudyPulse`,
    },
    typescript: {
      label: "📘 TypeScript Generics",
      text: `📘 Deep Dive: Advanced TypeScript Generics & Conditional Types

Leveling up type safety in large-scale applications today!

📌 Core Takeaways:
• Generic constraints (\`T extends Record<string, any>\`) enforce strict shape while preserving type inference.
• Distributive Conditional Types allow transforming union types recursively.
• Prefer \`unknown\` over \`any\` to mandate explicit type narrowing before property access.

📝 Quick Code Snippet:
\`\`\`ts
type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};
\`\`\`

⚠️ Gotcha: Avoid using \`as unknown as Type\` type assertions as a quick hack — it bypasses compiler safety checks!

👉 What is your favorite TypeScript utility type or pattern? Drop a comment below! 👇

#TypeScript #JavaScript #WebDev #CleanCode #SoftwareEngineering #StudyPulse`,
    },
    python: {
      label: "🐍 Python Asyncio",
      text: `🐍 Python Masterclass: Asyncio & Event Loop Mechanics

Exploring asynchronous I/O performance and non-blocking concurrency patterns in Python!

📌 Core Takeaways:
• \`asyncio.gather()\` executes multiple coroutines concurrently on a single event loop.
• Async I/O is ideal for network & DB calls; CPU-bound tasks still need \`multiprocessing\` or \`ProcessPoolExecutor\`.
• Always wrap external coroutine calls with timeouts to prevent hanging resources.

📝 Quick Code Snippet:
\`\`\`python
import asyncio

async def fetch_data(url: str):
    async with aiohttp.ClientSession() as session:
        async with session.get(url) as response:
            return await response.json()

results = await asyncio.gather(*[fetch_data(u) for u in urls])
\`\`\`

⚠️ Gotcha: Never call blocking synchronous I/O (\`time.sleep()\` or \`requests.get()\`) inside an async function — it freezes the entire event loop!

👉 Do you use Asyncio or ThreadPoolExecutor for concurrent jobs in Python? 💬

#Python #AsyncIO #Backend #SoftwareEngineering #CleanCode #StudyPulse`,
    },
    node: {
      label: "🟢 Node.js Streams",
      text: `🟢 Node.js Deep Dive: Stream Piping & Event Loop Phases

Mastering memory-efficient data processing with Node.js streams and backpressure handling!

📌 Core Takeaways:
• Streams process massive files chunk-by-chunk without exhausting RAM.
• Use \`pipeline()\` from \`node:stream/promises\` instead of manual \`.pipe()\` for automatic error cleanup.
• Event loop has 6 distinct phases: Timers -> Pending Callbacks -> Idle/Prepare -> Poll -> Check -> Close.

📝 Quick Code Snippet:
\`\`\`js
import { pipeline } from 'node:stream/promises';
import { createReadStream, createWriteStream } from 'node:fs';
import { createGzip } from 'node:zlib';

await pipeline(
  createReadStream('large_log.json'),
  createGzip(),
  createWriteStream('large_log.json.gz')
);
\`\`\`

⚠️ Gotcha: Unhandled stream error events can cause silent memory leaks or unhandled process crashes.

👉 What stream transformer tools do you use in Node.js backend services? 💬

#NodeJS #BackendDev #JavaScript #WebDevelopment #SoftwareEngineering #StudyPulse`,
    },
    docker: {
      label: "🐳 Docker Multi-Stage",
      text: `🐳 Docker Masterclass: Multi-Stage Builds & Minimal Production Images

Optimizing container deployment sizes from 1.2GB down to just 35MB!

📌 Core Takeaways:
• Multi-Stage builds separate compilation/build tooling from final production runtime images.
• Always place infrequently changing commands (like \`package.json\` copy & \`npm install\`) BEFORE application source code copy to leverage Docker layer caching.
• Use distroless or Alpine base images for production to shrink attack vectors.

📝 Minimal Dockerfile Pattern:
\`\`\`dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine AS runner
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
\`\`\`

⚠️ Gotcha: Running containers as root user in production poses severe security risks — always create a non-root user!

👉 What tricks do you use to shrink Docker image sizes? Let's discuss! 🤝

#Docker #DevOps #Containers #CloudNative #Microservices #StudyPulse`,
    },
    sql: {
      label: "𝄠 SQL Query Tuning",
      text: `⚡ Database Engineering: B-Tree Indexing & Query Execution Plans

Tuning SQL query performance from 4.2 seconds down to 18 milliseconds!

📌 Core Takeaways:
• B-Tree Indexes speed up equality & range queries (\`WHERE age > 25\`), but compound index column order MATTERS (Leftmost Prefix Rule).
• Avoid function calls on indexed columns (\`WHERE LOWER(email) = ...\`) — it forces a full table scan unless a functional index exists.
• Use \`EXPLAIN ANALYZE\` to inspect index scan vs sequential scan runtime costs.

📝 Query Tuning Insight:
\`\`\`sql
-- Bad (Full Table Scan):
SELECT * FROM users WHERE YEAR(created_at) = 2026;

-- Optimized (Uses B-Tree Index):
SELECT * FROM users 
WHERE created_at >= '2026-01-01' AND created_at < '2027-01-01';
\`\`\`

⚠️ Gotcha: Over-indexing slows down \`INSERT\`, \`UPDATE\`, and \`DELETE\` write operations because every index must be mutated synchronously!

👉 What database engine and indexing strategy do you rely on? 💬

#SQL #Databases #PostgreSQL #DatabaseIndexing #BackendDev #StudyPulse`,
    },
  };

// Random tech topics pool for 1-click random post generation
const RANDOM_TECH_TOPICS = [
  {
    title: "Microservices & Event-Driven Architecture",
    category: "Backend Architecture",
    text: `🚀 Mastering Microservices & Event-Driven Architecture

Exploring asynchronous event streaming and distributed system decoupling today!

📌 Core Takeaways:
• Event-Driven Architecture decouples services via messaging brokers like Kafka & RabbitMQ.
• Saga Pattern manages distributed transactions without heavy 2-Phase Commit locks.
• Always make event handlers idempotent to handle duplicate message retries safely.

⚠️ Gotcha: Watch out for out-of-order event delivery — use sequence numbers or event timestamps.

👉 What messaging broker do you use in microservices? Drop your thoughts below! 👇

#SystemDesign #Microservices #Kafka #BackendDev #SoftwareEngineering #StudyPulse`,
  },
  {
    title: "CSS Container Queries & Modern Layouts",
    category: "Frontend Engineering",
    text: `🎨 Game Changer: CSS Container Queries (@container) & Subgrid

Component-driven responsive design has reached a whole new level!

📌 Core Takeaways:
• Container Queries query element parent bounds rather than global screen viewport size.
• CSS Subgrid allows nested child elements to align perfectly with top-level grid tracks.
• Logical properties (margin-inline) ensure seamless RTL/LTR internationalization.

👉 Have you switched from @media queries to @container queries yet? 💬

#CSS #WebDevelopment #Frontend #ResponsiveDesign #UIUX #StudyPulse`,
  },
  {
    title: "Git Rebase vs Merge Strategies",
    category: "Developer Tooling",
    text: `⚡ Developer Workflow: Git Interactive Rebase vs Merge Strategies

Keeping project commit histories clean and bisect-ready!

📌 Core Takeaways:
• Interactive Rebase (git rebase -i) squashes micro WIP commits before opening PRs.
• Rebase creates a linear history; Merge preserves true chronological timeline.
• Golden Rule: Rebase local feature branches; NEVER rebase shared main branches!

👉 Do you prefer Rebase or Squash-and-Merge for your team PRs? Let's connect! 🤝

#Git #DevOps #SoftwareEngineering #Coding #CleanCode #StudyPulse`,
  },
  {
    title: "GraphQL APIs vs REST Architecture",
    category: "API Design",
    text: `📡 Modern API Engineering: GraphQL vs REST Architecture

Solving network payload over-fetching and under-fetching today!

📌 Core Takeaways:
• Single GraphQL endpoint allows clients to query exact properties needed.
• DataLoader pattern batches nested relational database queries to eliminate N+1 latency.
• Strongly typed Schema acts as auto-generated documentation for client teams.

👉 Do you prefer REST, GraphQL, or gRPC for client-server communication? 💬

#GraphQL #WebAPIs #BackendDev #SoftwareArchitecture #StudyPulse`,
  },
  {
    title: "Cybersecurity & OWASP Hardening",
    category: "Application Security",
    text: `🛡️ Web Application Security: Hardening Code Against OWASP Vulnerabilities

Building security into application architecture from day one!

📌 Key Defense Takeaways:
• Always use Parameterized Queries / ORM prepared statements to eliminate SQL Injection.
• Store auth tokens in HttpOnly, Secure, SameSite=Strict cookies to block XSS token theft.
• Implement Content Security Policy (CSP) headers to restrict external script execution.

👉 What security practices do you enforce in code reviews? 💬

#CyberSecurity #OWASP #ApplicationSecurity #Backend #WebDev #StudyPulse`,
  },
  {
    title: "Rust Ownership & Memory Safety",
    category: "Systems Programming",
    text: `🦀 Systems Engineering: Rust Ownership, Borrowing & Zero-Cost Abstractions

Exploring memory safety without garbage collector runtime overhead!

📌 Core Takeaways:
• Every value in Rust has a single Owner; ownership moves unless explicitly borrowed (&T).
• Borrow Checker enforces either 1 mutable reference OR multiple immutable references.
• Eliminates Data Races and Use-After-Free bugs before code compiles!

👉 Have you experimented with Rust for backend microservices or WASM? 💬

#RustLang #SystemsProgramming #SoftwareEngineering #Coding #CleanCode #StudyPulse`,
  },
  {
    title: "Kubernetes Pod Autoscaling & Infrastructure",
    category: "Cloud Infrastructure",
    text: `☁️ Cloud Infrastructure: Kubernetes Horizontal Pod Autoscaler (HPA)

Building elastic cloud native infrastructure that scales under load automatically!

📌 Core Takeaways:
• HPA scales pod replica count dynamically based on target CPU & RAM utilization.
• Cluster Autoscaler provisions new node VMs when pending pods exceed node capacity.
• Set Liveness and Readiness probes accurately to prevent traffic routing to booting containers.

👉 How do you monitor container health in production Kubernetes clusters? 💬

#Kubernetes #CloudNative #DevOps #Docker #AWS #StudyPulse`,
  },
  {
    title: "Clean Code & SOLID Design Principles",
    category: "Software Architecture",
    text: `📐 Software Craftsmanship: Applying SOLID Principles in Object-Oriented Code

Writing scalable, maintainable, and loosely-coupled code bases!

📌 Core Takeaways:
• Single Responsibility: A class should have one, and only one, reason to change.
• Open/Closed: Open for extension, closed for modification.
• Dependency Inversion: Depend upon abstractions, not concrete implementations.

👉 Which SOLID principle has helped your team codebase the most? 💬

#CleanCode #SOLID #SoftwareEngineering #Architecture #DesignPatterns #StudyPulse`,
  },
];

export const LinkedInShareModal: React.FC = () => {
  const {
    isLinkedInModalOpen,
    setIsLinkedInModalOpen,
    linkedInShareGoal,
    goals,
  } = useStudy();

  const { user } = useAuth();

  // Selected goal state (null = custom post or general learning)
  const [selectedGoalId, setSelectedGoalId] = useState<string>("");

  // Custom topic mode state
  const [isCustomTopicMode, setIsCustomTopicMode] = useState(false);
  const [customTopicTitle, setCustomTopicTitle] = useState("");
  const [customTopicCategory, setCustomTopicCategory] = useState(
    "Software Engineering",
  );

  // Generator Options
  const [tone, setTone] = useState<LinkedInPostTone>("insights");
  const [includeTakeaways, setIncludeTakeaways] = useState(true);
  const [includeCode, setIncludeCode] = useState(true);
  const [includeGotchas, setIncludeGotchas] = useState(true);
  const [includeCta, setIncludeCta] = useState(true);
  const [includeHashtags, setIncludeHashtags] = useState(true);

  // Editable draft state
  const [draftText, setDraftText] = useState("");
  const [copiedToast, setCopiedToast] = useState(false);
  const [activeTab, setActiveTab] = useState<"preview" | "editor" | "image">(
    "preview",
  );

  // Gemini AI state
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiNotice, setAiNotice] = useState("");
  const [geminiError, setGeminiError] = useState<GeminiApiError | null>(null);
  const [showKeyConfig, setShowKeyConfig] = useState(false);
  const [customKeyInput, setCustomKeyInput] = useState(() =>
    getStoredGeminiApiKey(),
  );

  // Infographic Image Banner State
  const [imageTheme, setImageTheme] = useState<ImageTheme>("cyberpunk");
  const [cardImageDataUrl, setCardImageDataUrl] = useState<string>("");

  // Find target goal from selection or context
  const activeGoal = useMemo(() => {
    if (isCustomTopicMode || selectedGoalId === "CUSTOM") {
      return null;
    }
    if (selectedGoalId) {
      return goals.find((g) => g.id === selectedGoalId) || null;
    }
    return linkedInShareGoal || goals[0] || null;
  }, [isCustomTopicMode, selectedGoalId, linkedInShareGoal, goals]);

  // Derived Active Title and Category
  const activeTitle = useMemo(() => {
    if (isCustomTopicMode) {
      return customTopicTitle.trim() || "Modern Software Engineering";
    }
    return activeGoal ? activeGoal.title : "Modern Web Development";
  }, [isCustomTopicMode, customTopicTitle, activeGoal]);

  const activeCategory = useMemo(() => {
    if (isCustomTopicMode) {
      return customTopicCategory.trim() || "Software Engineering";
    }
    return activeGoal ? activeGoal.category : "Software Engineering";
  }, [isCustomTopicMode, customTopicCategory, activeGoal]);

  // Sync selected goal ID when modal opens or goal prop changes
  useEffect(() => {
    if (isLinkedInModalOpen) {
      if (linkedInShareGoal) {
        setSelectedGoalId(linkedInShareGoal.id);
        setIsCustomTopicMode(false);
      } else if (goals.length > 0) {
        setSelectedGoalId(goals[0].id);
        setIsCustomTopicMode(false);
      } else {
        setSelectedGoalId("CUSTOM");
        setIsCustomTopicMode(true);
      }
    }
  }, [isLinkedInModalOpen, linkedInShareGoal, goals]);

  // Post generation logic
  const generatePostCopy = () => {
    const title = activeTitle;
    const category = activeCategory;
    const takeaways = isCustomTopicMode
      ? [title, "Mastered key implementation mental models"]
      : activeGoal?.summary?.keyTakeaways || [];
    const code = isCustomTopicMode ? "" : activeGoal?.summary?.cheatSheetCode || "";
    const gotchas = isCustomTopicMode ? [] : activeGoal?.summary?.gotchas || [];

    const postLines: string[] = [];

    // Header based on Tone
    if (tone === "insights") {
      postLines.push(`💡 Key takeaways from my study room on "${title}":\n`);
      postLines.push(
        `I've been diving deep into ${category} recently. Here are the core concepts and mental models that stood out most:\n`,
      );
    } else if (tone === "code") {
      postLines.push(`💻 Code & Syntax Spotlight: ${title}\n`);
      postLines.push(
        `Understanding the underlying mechanics of ${category} changes how you write clean code. Check out this snippet & breakdown:\n`,
      );
    } else if (tone === "milestone") {
      postLines.push(
        `🚀 Milestone Reached: Completed deep-dive on "${title}"! 🏆\n`,
      );
      postLines.push(
        `Consistency pays off! Finished key lectures & practical implementation in ${category}.\n`,
      );
    } else {
      // Story tone
      postLines.push(`🌱 Daily Learning Journey: Reflecting on ${title}\n`);
      postLines.push(
        `One thing I love about tech is that there's always a deeper layer to master. Lately, I've been mastering ${category}.\n`,
      );
    }

    // Key Takeaways section
    if (includeTakeaways && takeaways.length > 0) {
      postLines.push(`📌 Core Takeaways:`);
      takeaways.slice(0, 5).forEach((t) => {
        postLines.push(`• ${t}`);
      });
      postLines.push("");
    }

    // Code Snippet section
    if (includeCode && code) {
      postLines.push(`📝 Code / Cheat Sheet Snippet:`);
      postLines.push(`\`\`\`\n${code}\n\`\`\`\n`);
    }

    // Gotchas section
    if (includeGotchas && gotchas.length > 0) {
      postLines.push(`⚠️ Pitfalls & Gotchas to Avoid:`);
      gotchas.slice(0, 3).forEach((g) => {
        postLines.push(`- ${g}`);
      });
      postLines.push("");
    }

    // Call to Action
    if (includeCta) {
      if (tone === "code") {
        postLines.push(
          `👉 How do you handle this pattern in your projects? Drop your thoughts below! 👇\n`,
        );
      } else if (tone === "milestone") {
        postLines.push(
          `👉 What topics are you mastering this week? Let's connect and share learnings! 🤝\n`,
        );
      } else {
        postLines.push(
          `👉 What's your take on this? Always open to insights and discussion! 💬\n`,
        );
      }
    }

    // Hashtags section
    if (includeHashtags) {
      const lowerCat = category.toLowerCase();
      let tags = CATEGORY_HASHTAGS.default;

      for (const [key, tagList] of Object.entries(CATEGORY_HASHTAGS)) {
        if (lowerCat.includes(key) || title.toLowerCase().includes(key)) {
          tags = tagList;
          break;
        }
      }

      const allTags = Array.from(
        new Set([
          ...tags,
          "#StudyPulse",
          "#ContinuousLearning",
          "#GrowthMindset",
        ]),
      ).join(" ");
      postLines.push(allTags);
    }

    setDraftText(postLines.join("\n"));
  };

  // Dynamic Infographic Takeaway Extractor (AI-generated bullet points & clean takeaway formatting)
  const formatInfographicTakeaways = (): string[] => {
    // 1. Try extracting bullet points from draftText if available
    if (draftText) {
      const lines = draftText.split("\n");
      const bulletLines: string[] = [];
      for (const line of lines) {
        const trimmed = line.trim();
        if (
          (trimmed.startsWith("•") ||
            trimmed.startsWith("-") ||
            trimmed.startsWith("📌")) &&
          !trimmed.toLowerCase().includes("core takeaways")
        ) {
          const clean = trimmed
            .replace(/^[•\-📌\d\.\s]+/, "")
            .replace(/^Core goal established:\s*/i, "")
            .trim();
          if (clean.length > 5) {
            bulletLines.push(clean);
          }
        }
      }
      if (bulletLines.length >= 2) {
        return bulletLines.slice(0, 4);
      }
    }

    // 2. Fallback to activeGoal summary keyTakeaways cleaned up
    if (
      activeGoal?.summary?.keyTakeaways &&
      activeGoal.summary.keyTakeaways.length > 0
    ) {
      return activeGoal.summary.keyTakeaways
        .map((t) =>
          t
            .replace(/^Core goal established:\s*/i, "")
            .replace(
              /Javascript Doesnt have Feature of Private and Public to Hide Data, So we use Scoping for Do that, fun\.\.\./i,
              "JavaScript uses Scoping & Encapsulation to conceal private state",
            )
            .trim(),
        )
        .filter((t) => t.length > 3)
        .slice(0, 4);
    }

    // 3. Default fallback by topic
    return [
      `Mastered core mental models and implementation patterns in ${activeGoal?.category || "Software Engineering"}`,
      `Applied practical architectural principles and code optimization techniques`,
      `Explored execution mechanics and performance trade-offs in real-world scenarios`,
    ];
  };

  // Generate Image Card
  const updateCardImage = () => {
    const takeaways = formatInfographicTakeaways();
    const dataUrl = generateLinkedInCardImage({
      title: activeTitle,
      category: activeCategory,
      takeaways,
      theme: imageTheme,
      authorName: user?.displayName || "StudyPulse Learner",
    });
    setCardImageDataUrl(dataUrl);
  };

  // 1-Click Random Topic Generator
  const handleGenerateRandomTopic = () => {
    const randomIndex = Math.floor(Math.random() * RANDOM_TECH_TOPICS.length);
    const item = RANDOM_TECH_TOPICS[randomIndex];

    setIsCustomTopicMode(true);
    setSelectedGoalId("CUSTOM");
    setCustomTopicTitle(item.title);
    setCustomTopicCategory(item.category);
    setDraftText(item.text);
    setAiNotice(`🎲 Random tech post generated: ${item.title}`);
    confetti({ particleCount: 35, spread: 60, origin: { y: 0.7 } });
    setTimeout(() => setAiNotice(""), 3500);
  };

  // Re-generate copy whenever options or active goal changes
  useEffect(() => {
    if (isLinkedInModalOpen && !isCustomTopicMode) {
      generatePostCopy();
    }
  }, [
    isLinkedInModalOpen,
    activeGoal,
    isCustomTopicMode,
    tone,
    includeTakeaways,
    includeCode,
    includeGotchas,
    includeCta,
    includeHashtags,
  ]);

  // Re-generate visual image card when image theme, draft text or goal changes
  useEffect(() => {
    if (isLinkedInModalOpen) {
      updateCardImage();
    }
  }, [isLinkedInModalOpen, activeTitle, activeCategory, imageTheme, draftText]);

  if (!isLinkedInModalOpen) return null;

  // Gemini AI Handlers
  const handleFixGrammarWithGemini = async () => {
    setIsAiLoading(true);
    setGeminiError(null);
    setAiNotice("Gemini AI is checking grammar & polishing post style...");
    try {
      const res = await checkGrammarAndEnhance(draftText);
      if (res.error) {
        setGeminiError(res.error);
        setAiNotice("Gemini API Permission required or API disabled.");
      } else if (res.text && res.text !== draftText) {
        setDraftText(res.text);
        setAiNotice("✨ Grammar & style polished by Gemini AI!");
        confetti({ particleCount: 30, spread: 55, origin: { y: 0.7 } });
      } else {
        setAiNotice("Grammar and spelling look great already!");
      }
    } catch (err: any) {
      setAiNotice("Gemini check notice.");
    } finally {
      setIsAiLoading(false);
      setTimeout(() => setAiNotice(""), 4500);
    }
  };

  const handleGenerateWithGemini = async () => {
    setIsAiLoading(true);
    setGeminiError(null);
    setAiNotice(`Gemini AI is crafting post on "${activeTitle}"...`);
    try {
      const res = await generateAILinkedInPost({
        title: activeTitle,
        category: activeCategory,
        takeaways: isCustomTopicMode
          ? [activeTitle, "Mastered key implementation mental models"]
          : activeGoal?.summary?.keyTakeaways || [],
        code: activeGoal?.summary?.cheatSheetCode,
        gotchas: activeGoal?.summary?.gotchas,
        tone,
      });

      if (res.error) {
        setGeminiError(res.error);
        setAiNotice("Gemini API Permission required or API disabled.");
      } else if (res.text) {
        setDraftText(res.text);
        setAiNotice("✨ Custom post generated with Gemini AI model!");
        confetti({ particleCount: 40, spread: 65, origin: { y: 0.7 } });
      }
    } catch (err: any) {
      setAiNotice("Gemini AI notice.");
    } finally {
      setIsAiLoading(false);
      setTimeout(() => setAiNotice(""), 4500);
    }
  };

  const handleSaveCustomApiKey = () => {
    saveGeminiApiKey(customKeyInput);
    setGeminiError(null);
    setShowKeyConfig(false);
    setAiNotice("Gemini API Key updated & saved!");
    setTimeout(() => setAiNotice(""), 3000);
  };

  const loadPresetTemplate = (templateKey: string) => {
    const template = TOPIC_PRESET_TEMPLATES[templateKey];
    if (template) {
      const labelTitle = template.label.replace(/^[^\w\s]+/, "").trim();
      setIsCustomTopicMode(true);
      setSelectedGoalId("CUSTOM");
      setCustomTopicTitle(labelTitle);
      setDraftText(template.text);
      setAiNotice(`Loaded sample draft: ${template.label}`);
      confetti({ particleCount: 25, spread: 50, origin: { y: 0.8 } });
      setTimeout(() => setAiNotice(""), 3000);
    }
  };

  const handleCopyOnly = () => {
    navigator.clipboard.writeText(draftText);
    setCopiedToast(true);
    confetti({ particleCount: 30, spread: 60, origin: { y: 0.8 } });
    setTimeout(() => setCopiedToast(false), 2500);
  };

  const handleCopyAndOpenLinkedIn = () => {
    navigator.clipboard.writeText(draftText);
    setCopiedToast(true);
    confetti({ particleCount: 50, spread: 70, origin: { y: 0.7 } });

    // Open LinkedIn feed or post share dialog in new window
    setTimeout(() => {
      const shareUrl = `https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(draftText)}`;
      window.open(shareUrl, "_blank", "noopener,noreferrer");
    }, 400);

    setTimeout(() => setCopiedToast(false), 3000);
  };

  const downloadTextFile = () => {
    const blob = new Blob([draftText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `linkedin_post_${(activeGoal?.title || "learning").toLowerCase().replace(/[^a-z0-9]/g, "_")}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadCardImage = () => {
    if (!cardImageDataUrl) return;
    const a = document.createElement("a");
    a.href = cardImageDataUrl;
    a.download = `studypulse_linkedin_infographic_${(activeGoal?.title || "learning").toLowerCase().replace(/[^a-z0-9]/g, "_")}.png`;
    a.click();
  };

  const charCount = draftText.length;
  const isOverLimit = charCount > 3000;
  const authorName = user?.displayName || "StudyPulse Learner";
  const avatarUrl = user?.photoURL || null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden text-slate-800 dark:text-slate-100 relative">
        {/* Toast alert when copied or AI status */}
        {(copiedToast || aiNotice) && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2.5 rounded-2xl shadow-xl flex items-center gap-2.5 text-xs font-bold animate-in fade-in slide-in-from-top-4 duration-300">
            {isAiLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <CheckCircle2 className="h-4 w-4" />
            )}
            <span>
              {aiNotice || "Post text copied to clipboard! Opening LinkedIn..."}
            </span>
          </div>
        )}

        {/* Modal Header */}
        <div className="p-4 sm:p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4 bg-gradient-to-r from-blue-50/80 via-indigo-50/50 to-slate-50 dark:from-slate-950 dark:via-blue-950/30 dark:to-slate-900">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#0A66C2] text-white flex items-center justify-center font-bold text-lg shadow-md shadow-blue-600/30 shrink-0">
              in
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#0A66C2] dark:text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/20 flex items-center gap-1">
                  <Bot className="h-3 w-3 text-purple-500" />
                  Gemini AI Powered Post & Infographic Creator
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Share What You Learnt on LinkedIn
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowKeyConfig(!showKeyConfig)}
              className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1 text-xs font-bold"
              title="Configure Gemini API Key"
            >
              <Key className="h-4 w-4 text-amber-500" />
              <span className="hidden sm:inline">API Key</span>
            </button>

            <button
              onClick={() => setIsLinkedInModalOpen(false)}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Gemini API Error Banner / Key Setup Box */}
        {(geminiError || showKeyConfig) && (
          <div className="p-4 bg-amber-500/10 border-b border-amber-500/30 text-amber-900 dark:text-amber-200 text-xs space-y-3 animate-in fade-in duration-200">
            <div className="flex items-start gap-2.5">
              <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
              <div className="space-y-1 flex-1">
                <h4 className="font-extrabold text-amber-900 dark:text-amber-100 text-xs">
                  Gemini API Access & Permission Configuration
                </h4>
                <p className="text-[11px] leading-relaxed text-amber-800 dark:text-amber-300">
                  {geminiError?.isApiDisabled
                    ? "The Gemini API is disabled for the default GCP Firebase project (124383331241) or permission is required. You can enable it on Google Cloud or paste a free Gemini API Key from Google AI Studio."
                    : "Configure your custom Gemini API key below:"}
                </p>
              </div>

              <button
                onClick={() => {
                  setGeminiError(null);
                  setShowKeyConfig(false);
                }}
                className="text-amber-600 dark:text-amber-400 hover:underline text-[11px] font-bold"
              >
                Dismiss
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <a
                href={
                  geminiError?.activationUrl ||
                  "https://console.developers.google.com/apis/api/generativelanguage.googleapis.com/overview?project=124383331241"
                }
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-[11px] flex items-center gap-1 transition-colors shadow-xs"
              >
                <ExternalLink className="h-3 w-3" />
                <span>1. Enable Gemini API in Google Cloud Console</span>
              </a>

              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-[11px] flex items-center gap-1 transition-colors shadow-xs"
              >
                <Key className="h-3 w-3" />
                <span>2. Get Free Gemini Key (AI Studio)</span>
              </a>
            </div>

            {/* Inline Custom Key Form */}
            <div className="flex gap-2 pt-1">
              <input
                type="password"
                placeholder="Paste your AI Studio Gemini API Key (AIzaSy...)"
                value={customKeyInput}
                onChange={(e) => setCustomKeyInput(e.target.value)}
                className="flex-1 px-3 py-1.5 bg-white dark:bg-slate-950 border border-amber-300 dark:border-amber-700/60 rounded-xl text-xs text-slate-900 dark:text-white font-mono focus:outline-none"
              />
              <button
                onClick={handleSaveCustomApiKey}
                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-xs"
              >
                <Save className="h-3.5 w-3.5" />
                <span>Save Key</span>
              </button>
            </div>
          </div>
        )}

        {/* Modal Body Grid */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Topic & Gemini AI Actions (5 cols) */}
          <div className="lg:col-span-5 space-y-5">
            {/* Topic Selection */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Select or Type Any Post Topic:
                </label>
                <button
                  onClick={handleGenerateRandomTopic}
                  className="px-2.5 py-1 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-extrabold text-[11px] flex items-center gap-1 shadow-xs transition-all"
                  title="Generate a random tech topic post"
                >
                  <Dices className="h-3.5 w-3.5" />
                  <span>🎲 Surprise Random Post</span>
                </button>
              </div>

              <select
                value={isCustomTopicMode ? "CUSTOM" : selectedGoalId}
                onChange={(e) => {
                  if (e.target.value === "CUSTOM") {
                    setIsCustomTopicMode(true);
                    setSelectedGoalId("CUSTOM");
                  } else {
                    setIsCustomTopicMode(false);
                    setSelectedGoalId(e.target.value);
                  }
                }}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 shadow-xs"
              >
                <optgroup label="📚 Study Room Goals">
                  {goals.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.title} ({g.type.toUpperCase()} · {g.category})
                    </option>
                  ))}
                </optgroup>
                <optgroup label="✨ Any Custom / Random Topic">
                  <option value="CUSTOM">
                    ✏️ Custom Topic / Type Any Topic...
                  </option>
                </optgroup>
              </select>

              {/* Custom Topic Input */}
              {isCustomTopicMode && (
                <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-xl space-y-2 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-blue-700 dark:text-blue-300 flex items-center gap-1">
                      <Edit3 className="h-3 w-3" />
                      <span>Enter Custom Topic Name:</span>
                    </span>
                    <button
                      onClick={handleGenerateRandomTopic}
                      className="text-[10px] text-amber-600 dark:text-amber-400 font-bold hover:underline flex items-center gap-0.5"
                    >
                      <Shuffle className="h-3 w-3" /> Pick Random Topic
                    </button>
                  </div>

                  <input
                    type="text"
                    placeholder="e.g. Next.js 15, Microservices, System Architecture..."
                    value={customTopicTitle}
                    onChange={(e) => setCustomTopicTitle(e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-blue-300 dark:border-blue-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}
            </div>

            {/* Quick Sample Topic Templates Bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  <Zap className="h-3 w-3 text-amber-500" />
                  <span>Instant Drafts & Random Topic Generators:</span>
                </label>
              </div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <button
                  onClick={handleGenerateRandomTopic}
                  className="px-2.5 py-1 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-800 dark:text-amber-300 border border-amber-500/30 text-[11px] font-extrabold transition-all flex items-center gap-1 shadow-xs"
                >
                  <Dices className="h-3 w-3 text-amber-500" />
                  <span>🎲 Surprise Random Post</span>
                </button>

                {Object.entries(TOPIC_PRESET_TEMPLATES).map(([key, item]) => (
                  <button
                    key={key}
                    onClick={() => loadPresetTemplate(key)}
                    className="px-2.5 py-1 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-700 dark:text-purple-300 border border-purple-500/20 text-[11px] font-bold transition-all shadow-xs"
                    title={`Load ${item.label} sample text`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Gemini AI Action Suite */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-500/10 via-indigo-500/10 to-blue-500/10 border border-purple-500/30 space-y-3 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-purple-900 dark:text-purple-200 flex items-center gap-1.5">
                  <Bot className="h-4 w-4 text-purple-500" />
                  <span>Gemini AI Engine</span>
                </span>
                <span className="text-[10px] bg-purple-500/20 text-purple-700 dark:text-purple-300 px-2 py-0.5 rounded-full font-bold">
                  Gemini Flash
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={handleFixGrammarWithGemini}
                  disabled={isAiLoading}
                  className="px-3 py-2 rounded-xl bg-white dark:bg-slate-900 hover:bg-purple-50 dark:hover:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-300 dark:border-purple-800 text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-xs disabled:opacity-50"
                  title="Check grammar, spelling, and polish post style with Gemini AI"
                >
                  <CheckCheck className="h-3.5 w-3.5 text-purple-500" />
                  <span>Check Grammar</span>
                </button>

                <button
                  onClick={handleGenerateWithGemini}
                  disabled={isAiLoading}
                  className="px-3 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-md shadow-purple-600/30 disabled:opacity-50"
                  title="Generate a fresh LinkedIn post copy with Gemini AI"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>AI Generate Post</span>
                </button>
              </div>
            </div>

            {/* Tone Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Post Tone & Format:
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  {
                    id: "insights",
                    label: "💡 Tech Insights",
                    desc: "Key takeaways & takeaways",
                  },
                  {
                    id: "code",
                    label: "💻 Code Spotlight",
                    desc: "Cheat sheet & syntax",
                  },
                  {
                    id: "milestone",
                    label: "🚀 Milestone",
                    desc: "Completion & progress",
                  },
                  {
                    id: "story",
                    label: "🌱 Learning Story",
                    desc: "Reflection & growth",
                  },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setTone(item.id as LinkedInPostTone)}
                    className={`p-2.5 rounded-xl text-left border transition-all ${
                      tone === item.id
                        ? "bg-blue-500/10 border-blue-500 text-blue-700 dark:text-blue-300 ring-1 ring-blue-500/30"
                        : "bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300"
                    }`}
                  >
                    <div className="text-xs font-bold">{item.label}</div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                      {item.desc}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Content Toggles */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Wand2 className="h-3.5 w-3.5 text-blue-500" />
                  <span>Customize Included Sections</span>
                </span>
                <button
                  onClick={generatePostCopy}
                  className="text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                >
                  <RefreshCw className="h-3 w-3" /> Regenerate
                </button>
              </div>

              <div className="space-y-2 text-xs">
                <label className="flex items-center gap-2.5 cursor-pointer text-slate-700 dark:text-slate-300 font-medium select-none">
                  <input
                    type="checkbox"
                    checked={includeTakeaways}
                    onChange={(e) => setIncludeTakeaways(e.target.checked)}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span>
                    Key Takeaways & Core Concepts (
                    {activeGoal?.summary?.keyTakeaways?.length || 0})
                  </span>
                </label>

                <label className="flex items-center gap-2.5 cursor-pointer text-slate-700 dark:text-slate-300 font-medium select-none">
                  <input
                    type="checkbox"
                    checked={includeCode}
                    onChange={(e) => setIncludeCode(e.target.checked)}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span>Cheat-Sheet / Code Snippet</span>
                </label>

                <label className="flex items-center gap-2.5 cursor-pointer text-slate-700 dark:text-slate-300 font-medium select-none">
                  <input
                    type="checkbox"
                    checked={includeGotchas}
                    onChange={(e) => setIncludeGotchas(e.target.checked)}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span>
                    Tricky Gotchas & Warnings (
                    {activeGoal?.summary?.gotchas?.length || 0})
                  </span>
                </label>

                <label className="flex items-center gap-2.5 cursor-pointer text-slate-700 dark:text-slate-300 font-medium select-none">
                  <input
                    type="checkbox"
                    checked={includeCta}
                    onChange={(e) => setIncludeCta(e.target.checked)}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span>Call To Action / Engagement Question</span>
                </label>

                <label className="flex items-center gap-2.5 cursor-pointer text-slate-700 dark:text-slate-300 font-medium select-none">
                  <input
                    type="checkbox"
                    checked={includeHashtags}
                    onChange={(e) => setIncludeHashtags(e.target.checked)}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span>Auto Tech Hashtags</span>
                </label>
              </div>
            </div>
          </div>

          {/* Right Column: Draft Editor, LinkedIn Feed Preview & Infographic Image Studio (7 cols) */}
          <div className="lg:col-span-7 flex flex-col space-y-4">
            {/* View Switcher Tabs (Preview, Editor, Infographic Image) */}
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2 flex-wrap gap-2">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setActiveTab("preview")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    activeTab === "preview"
                      ? "bg-[#0A66C2] text-white shadow-sm"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  <Share2 className="h-3.5 w-3.5" />
                  <span>LinkedIn Feed Preview</span>
                </button>

                <button
                  onClick={() => setActiveTab("editor")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    activeTab === "editor"
                      ? "bg-[#0A66C2] text-white shadow-sm"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  <Code className="h-3.5 w-3.5" />
                  <span>Edit Draft Text</span>
                </button>

                <button
                  onClick={() => setActiveTab("image")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    activeTab === "image"
                      ? "bg-purple-600 text-white shadow-sm"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  <ImageIcon className="h-3.5 w-3.5 text-purple-300" />
                  <span>Infographic Image Card</span>
                </button>
              </div>

              {/* Character Count */}
              <div className="flex items-center gap-2 text-xs font-mono">
                <span
                  className={
                    isOverLimit
                      ? "text-rose-500 font-bold"
                      : "text-slate-500 dark:text-slate-400"
                  }
                >
                  {charCount} / 3000 chars
                </span>
              </div>
            </div>

            {/* Tab 1: Raw Draft Textarea Editor */}
            {activeTab === "editor" && (
              <div className="flex-1 flex flex-col space-y-2 min-h-[360px]">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-slate-500 font-medium">
                    Direct Editor:
                  </span>
                  <button
                    onClick={handleFixGrammarWithGemini}
                    disabled={isAiLoading}
                    className="text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1"
                  >
                    <Sparkles className="h-3 w-3" /> Fix Grammar with Gemini
                  </button>
                </div>
                <textarea
                  rows={14}
                  value={draftText}
                  onChange={(e) => setDraftText(e.target.value)}
                  className="w-full flex-1 p-4 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-2xl text-xs font-mono text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500 resize-y leading-relaxed"
                  placeholder="Your post copy will appear here..."
                />
              </div>
            )}

            {/* Tab 2: Authentic LinkedIn Feed Post Card Mockup */}
            {activeTab === "preview" && (
              <div className="flex-1 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-5 shadow-lg space-y-4 font-sans text-slate-900 dark:text-slate-100 min-h-[360px] flex flex-col justify-between">
                <div>
                  {/* LinkedIn User Profile Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {avatarUrl ? (
                        <img
                          src={avatarUrl}
                          alt={authorName}
                          className="w-12 h-12 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-extrabold flex items-center justify-center text-base shadow-sm">
                          {authorName.charAt(0).toUpperCase()}
                        </div>
                      )}

                      <div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white hover:text-blue-600 cursor-pointer flex items-center gap-1">
                          <span>{authorName}</span>
                          <span className="text-[10px] text-slate-400 font-normal">
                            • 1st
                          </span>
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                          Full-Stack Engineer & Continuous Learner | Building on
                          StudyPulse
                        </p>
                        <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                          <span>Just now</span>
                          <span>•</span>
                          <Globe className="h-3 w-3" />
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* LinkedIn Post Content Body */}
                  <div className="text-xs leading-relaxed whitespace-pre-line text-slate-800 dark:text-slate-200 space-y-2 mb-4 font-sans">
                    {draftText.split("\n").map((line, idx) => {
                      if (line.startsWith("```")) return null;
                      if (line.startsWith("#")) {
                        return (
                          <p
                            key={idx}
                            className="text-[#0A66C2] dark:text-blue-400 font-semibold"
                          >
                            {line}
                          </p>
                        );
                      }
                      return <p key={idx}>{line}</p>;
                    })}
                  </div>
                </div>

                {/* LinkedIn Engagement Bar Mockup */}
                <div className="pt-3 border-t border-slate-200 dark:border-slate-800">
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-2 py-1">
                    <div className="flex items-center gap-1">
                      <span className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center text-[8px] font-bold">
                        👍
                      </span>
                      <span className="w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[8px] font-bold">
                        💡
                      </span>
                      <span className="text-[11px] font-medium ml-1">
                        You and 14 others
                      </span>
                    </div>
                    <span className="text-[11px]">3 comments</span>
                  </div>

                  <div className="grid grid-cols-4 gap-1 pt-2 border-t border-slate-100 dark:border-slate-900 text-slate-600 dark:text-slate-400 text-xs font-semibold text-center">
                    <div className="py-1.5 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-lg flex items-center justify-center gap-1.5 cursor-pointer">
                      <ThumbsUp className="h-4 w-4 text-blue-600" />
                      <span>Like</span>
                    </div>
                    <div className="py-1.5 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-lg flex items-center justify-center gap-1.5 cursor-pointer">
                      <MessageSquare className="h-4 w-4" />
                      <span>Comment</span>
                    </div>
                    <div className="py-1.5 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-lg flex items-center justify-center gap-1.5 cursor-pointer">
                      <Repeat2 className="h-4 w-4" />
                      <span>Repost</span>
                    </div>
                    <div className="py-1.5 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-lg flex items-center justify-center gap-1.5 cursor-pointer">
                      <Send className="h-4 w-4" />
                      <span>Send</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 3: Infographic Image Card Studio */}
            {activeTab === "image" && (
              <div className="flex-1 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-950 p-4 space-y-3 min-h-[360px] flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-white">
                      <Palette className="h-4 w-4 text-purple-400" />
                      <span>Visual Card Theme:</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {[
                        { id: "cyberpunk", name: "🌌 Cyberpunk" },
                        { id: "linkedin", name: "💼 LinkedIn Blue" },
                        { id: "terminal", name: "⚡ Terminal" },
                        { id: "sunset", name: "🌅 Sunset" },
                      ].map((t) => (
                        <button
                          key={t.id}
                          onClick={() => setImageTheme(t.id as ImageTheme)}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-all ${
                            imageTheme === t.id
                              ? "bg-purple-600 text-white border-purple-400"
                              : "bg-slate-900 text-slate-400 border-slate-800 hover:text-white"
                          }`}
                        >
                          {t.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Canvas Preview Image Display */}
                  <div className="rounded-xl overflow-hidden border border-slate-800 shadow-xl bg-black">
                    {cardImageDataUrl && (
                      <img
                        src={cardImageDataUrl}
                        alt="LinkedIn Infographic Banner"
                        className="w-full h-auto object-contain rounded-xl"
                      />
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
                  <span className="text-slate-400 text-[11px]">
                    Live URL: studyroom-amber.vercel.app • Optimal 1200x630
                    ratio
                  </span>
                  <button
                    onClick={downloadCardImage}
                    className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold flex items-center gap-1.5 shadow-md shadow-purple-600/30"
                  >
                    <Download className="h-4 w-4" />
                    <span>Download Visual Card (.png)</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50 dark:bg-slate-950/80">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={downloadTextFile}
              className="flex-1 sm:flex-none px-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-center gap-1.5 shadow-xs"
            >
              <Download className="h-3.5 w-3.5 text-indigo-500" />
              <span>Download (.txt)</span>
            </button>

            <button
              onClick={handleCopyOnly}
              className="flex-1 sm:flex-none px-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-center gap-1.5 shadow-xs"
            >
              <Copy className="h-3.5 w-3.5 text-blue-500" />
              <span>Copy Text Only</span>
            </button>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              onClick={handleCopyAndOpenLinkedIn}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl text-xs font-extrabold text-white bg-gradient-to-r from-[#0A66C2] to-blue-600 hover:from-blue-700 hover:to-blue-800 shadow-md shadow-blue-600/30 transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
            >
              <ExternalLink className="h-4 w-4" />
              <span>Copy & Open LinkedIn Feed</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
