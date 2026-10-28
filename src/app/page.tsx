"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { difficulties, questionTopics, questions, type Question } from "@/lib/questions";

const Editor = dynamic(() => import("@monaco-editor/react").then((mod) => mod.default), {
  ssr: false,
  loading: () => <div className="flex h-[320px] items-center justify-center text-slate-400">Loading editor…</div>,
});

type TabName = "dashboard" | "practice" | "progress" | "mock" | "settings";

type ProgressEntry = {
  completed: boolean;
  attempts: number;
  score: number;
  lastSolved: string | null;
};

type SettingsState = {
  aiEnabled: boolean;
  model: string;
  timeLimitMs: number;
};

const quickStats = [
  { title: "Questions", value: "25", accent: "from-cyan-500 to-blue-500" },
  { title: "Avg. score", value: "83%", accent: "from-violet-500 to-indigo-500" },
  { title: "Streak", value: "7 days", accent: "from-emerald-500 to-teal-500" },
  { title: "Mock interviews", value: "3", accent: "from-amber-500 to-orange-500" },
];

const topicColors = [
  "#38bdf8",
  "#818cf8",
  "#34d399",
  "#fbbf24",
  "#fb7185",
  "#a78bfa",
  "#f472b6",
  "#4ade80",
];

const starterProgress: Record<string, ProgressEntry> = {
  "py-fund-01": { completed: true, attempts: 2, score: 90, lastSolved: "2026-10-20" },
  "py-fund-02": { completed: true, attempts: 1, score: 85, lastSolved: "2026-10-21" },
  "sql-01": { completed: true, attempts: 1, score: 88, lastSolved: "2026-10-22" },
  "ai-02": { completed: false, attempts: 0, score: 0, lastSolved: null },
};

const mockPrompts = [
  "Walk me through your approach to solving a two-pointer problem under time pressure.",
  "How would you validate edge cases before you finalize an implementation?",
  "Describe how you would explain your solution and complexity to an interviewer.",
];

const progressSeries = [
  { day: "Mon", solved: 3 },
  { day: "Tue", solved: 5 },
  { day: "Wed", solved: 4 },
  { day: "Thu", solved: 7 },
  { day: "Fri", solved: 6 },
  { day: "Sat", solved: 8 },
  { day: "Sun", solved: 9 },
];

function getFunctionName(question: Question) {
  const match = question.starterCode.match(/def\s+([A-Za-z_][A-Za-z0-9_]*)/);
  return match?.[1] ?? "solution";
}

function evaluateStub(question: Question, source: string) {
  const trimmed = source.trim();
  const normalized = trimmed.toLowerCase();
  const functionName = getFunctionName(question);
  const hasFunction = normalized.includes(`def ${functionName.toLowerCase()}`) || normalized.includes("def ");
  const hasReturn = normalized.includes("return ");
  const hasLoop = normalized.includes("for ") || normalized.includes("while ") || normalized.includes("for") || normalized.includes("while");
  const passed = hasFunction && hasReturn && (hasLoop || normalized.includes("if ")) ? question.publicTests.length : 0;
  const failed = question.publicTests.length - passed;

  return {
    status: passed > 0 ? "pass" : "fail",
    passed,
    failed,
    runtime: "0.22s",
    stdout: passed > 0 ? "Development stub accepted the submission structure." : "No function definition or return statement detected.",
    stderr: passed > 0 ? "" : "This is a local development stub, not a real sandbox execution. The app intentionally avoids unrestricted Python execution.",
    results: question.publicTests.map((test, index) => ({
      test: `${index + 1}`,
      passed: passed > 0,
      details: test.description,
    })),
    mode: "local-dev-stub",
  };
}

function generateFeedback(question: Question, source: string) {
  const normalized = source.toLowerCase();
  const hasFunction = normalized.includes("def ");
  const hasLoop = normalized.includes("for ") || normalized.includes("while ");
  const hasDataStructure = normalized.includes("dict") || normalized.includes("set") || normalized.includes("stack") || normalized.includes("deque");

  return {
    correctness: hasFunction
      ? "The solution structure is plausible. Double-check edge cases such as empty inputs, duplicates, and boundary conditions."
      : "The submission is missing a clear function definition and should be reviewed before final submission.",
    timeComplexity: question.expectedTime,
    spaceComplexity: question.expectedSpace,
    codeQuality: hasLoop
      ? "The logic is readable and demonstrates iterative control flow; consider simplifying repeated branches."
      : "The code could benefit from clearer control flow and more explicit variable names.",
    edgeCases: hasDataStructure
      ? "Validate empty inputs, repeated values, and the impact of ordering on the data structure you chose."
      : "Check empty collections, single-element inputs, and invalid or duplicate values before finalizing.",
    summary: hasFunction && hasLoop
      ? "Strong candidate structure with room for tighter edge-case handling."
      : "The implementation needs more explicit logic and test coverage before it is solid."
  };
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabName>("dashboard");
  const [selectedQuestionId, setSelectedQuestionId] = useState(questions[0]?.id ?? "");
  const [difficultyFilter, setDifficultyFilter] = useState<"All" | Question["difficulty"]>("All");
  const [topicFilter, setTopicFilter] = useState<"All" | string>("All");
  const [statusFilter, setStatusFilter] = useState<"All" | "Completed" | "In progress" | "New">("All");
  const [searchText, setSearchText] = useState("");
  const [progress, setProgress] = useState<Record<string, ProgressEntry>>(() => {
    if (typeof window === "undefined") return starterProgress;
    const raw = window.localStorage.getItem("codecoach-progress-v1");
    try {
      return raw ? (JSON.parse(raw) as Record<string, ProgressEntry>) : starterProgress;
    } catch {
      return starterProgress;
    }
  });
  const [editorCode, setEditorCode] = useState<Record<string, string>>(() =>
    Object.fromEntries(questions.map((question) => [question.id, question.starterCode])),
  );
  const [results, setResults] = useState<Record<string, ReturnType<typeof evaluateStub>>>({});
  const [feedback, setFeedback] = useState<Record<string, ReturnType<typeof generateFeedback>>>({});
  const [hintIndex, setHintIndex] = useState(0);
  const [mockStep, setMockStep] = useState(0);
  const [settings, setSettings] = useState<SettingsState>(() => {
    const defaultSettings: SettingsState = { aiEnabled: true, model: "gpt-4o-mini", timeLimitMs: 2000 };
    if (typeof window === "undefined") {
      return defaultSettings;
    }
    const rawSettings = window.localStorage.getItem("codecoach-settings-v1");
    try {
      return rawSettings ? (JSON.parse(rawSettings) as SettingsState) : defaultSettings;
    } catch {
      return defaultSettings;
    }
  });

  useEffect(() => {
    window.localStorage.setItem("codecoach-progress-v1", JSON.stringify(progress));
  }, [progress]);

  useEffect(() => {
    window.localStorage.setItem("codecoach-settings-v1", JSON.stringify(settings));
  }, [settings]);

  const filteredQuestions = useMemo(() => {
    return questions.filter((question) => {
      const matchesSearch =
        question.title.toLowerCase().includes(searchText.toLowerCase()) ||
        question.description.toLowerCase().includes(searchText.toLowerCase());
      const matchesDifficulty = difficultyFilter === "All" || question.difficulty === difficultyFilter;
      const matchesTopic = topicFilter === "All" || question.topic === topicFilter;
      const entry = progress[question.id];
      const isCompleted = entry?.completed;
      const matchesStatus =
        statusFilter === "All" ||
        (statusFilter === "Completed" && isCompleted) ||
        (statusFilter === "In progress" && !isCompleted && (entry?.attempts ?? 0) > 0) ||
        (statusFilter === "New" && !entry);
      return matchesSearch && matchesDifficulty && matchesTopic && matchesStatus;
    });
  }, [difficultyFilter, progress, searchText, statusFilter, topicFilter]);

  const activeQuestion =
    questions.find((question) => question.id === selectedQuestionId) ??
    filteredQuestions[0] ??
    questions[0];
  const currentCode = activeQuestion ? editorCode[activeQuestion.id] ?? activeQuestion.starterCode : "";
  const activeResult = activeQuestion ? results[activeQuestion.id] : undefined;
  const activeFeedback = activeQuestion ? feedback[activeQuestion.id] : undefined;

  const completedCount = Object.values(progress).filter((entry) => entry.completed).length;
  const attemptsCount = Object.values(progress).reduce((sum, entry) => sum + entry.attempts, 0);
  const avgScore = Math.round(
    Object.values(progress).reduce((sum, entry) => sum + entry.score, 0) / Math.max(1, Object.values(progress).length),
  );

  const topicBreakdown = questionTopics.map((topic) => ({
    name: topic,
    value: questions.filter((question) => question.topic === topic).length,
  }));

  const handleRun = () => {
    if (!activeQuestion) return;
    const runResult = evaluateStub(activeQuestion, currentCode);
    setResults((previous) => ({ ...previous, [activeQuestion.id]: runResult }));
    setFeedback((previous) => ({ ...previous, [activeQuestion.id]: generateFeedback(activeQuestion, currentCode) }));
    setHintIndex(0);
    setProgress((previous) => ({
      ...previous,
      [activeQuestion.id]: {
        completed: previous[activeQuestion.id]?.completed ?? false,
        attempts: (previous[activeQuestion.id]?.attempts ?? 0) + 1,
        score: runResult.passed > 0 ? 88 : 45,
        lastSolved: previous[activeQuestion.id]?.lastSolved ?? null,
      },
    }));
  };

  const handleSubmit = () => {
    if (!activeQuestion) return;
    const runResult = evaluateStub(activeQuestion, currentCode);
    setResults((previous) => ({ ...previous, [activeQuestion.id]: runResult }));
    setFeedback((previous) => ({ ...previous, [activeQuestion.id]: generateFeedback(activeQuestion, currentCode) }));
    setProgress((previous) => ({
      ...previous,
      [activeQuestion.id]: {
        completed: true,
        attempts: (previous[activeQuestion.id]?.attempts ?? 0) + 1,
        score: 92,
        lastSolved: new Date().toISOString().slice(0, 10),
      },
    }));
  };

  const handleReset = () => {
    if (!activeQuestion) return;
    setEditorCode((previous) => ({ ...previous, [activeQuestion.id]: activeQuestion.starterCode }));
    setHintIndex(0);
  };

  const handleUseReference = () => {
    if (!activeQuestion) return;
    setEditorCode((previous) => ({ ...previous, [activeQuestion.id]: activeQuestion.referenceSolution }));
    setHintIndex(0);
  };

  const currentPrompt = mockPrompts[mockStep % mockPrompts.length];

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <header className="mb-6 flex flex-col gap-4 rounded-2xl border border-slate-800 bg-slate-900/70 p-4 shadow-2xl shadow-slate-950/30 backdrop-blur md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-400">CodeCoach AI</p>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-white">AI Interview Practice Workspace</h1>
          </div>
          <nav className="flex flex-wrap gap-2 text-sm text-slate-300">
            {[
              ["dashboard", "Dashboard"],
              ["practice", "Practice"],
              ["progress", "Progress"],
              ["mock", "Mock Interview"],
              ["settings", "Settings"],
            ].map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => setActiveTab(key as TabName)}
                className={`rounded-full px-4 py-2 transition ${
                  activeTab === key ? "bg-cyan-500 text-slate-950" : "bg-slate-800 text-slate-200 hover:bg-slate-700"
                }`}
              >
                {label}
              </button>
            ))}
          </nav>
        </header>

        {activeTab === "dashboard" && (
          <div className="space-y-6">
            <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {quickStats.map((stat) => (
                <div key={stat.title} className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
                  <div className={`mb-4 h-2 w-20 rounded-full bg-gradient-to-r ${stat.accent}`} />
                  <p className="text-sm text-slate-400">{stat.title}</p>
                  <p className="mt-2 text-3xl font-bold text-white">{stat.value}</p>
                </div>
              ))}
            </section>

            <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <p className="text-sm uppercase tracking-[0.2em] text-cyan-400">This week</p>
                    <h2 className="mt-2 text-2xl font-semibold text-white">Interview momentum</h2>
                  </div>
                  <span className="rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-300">
                    +18% vs last week
                  </span>
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={progressSeries}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis dataKey="day" stroke="#94a3b8" />
                      <YAxis stroke="#94a3b8" />
                      <Tooltip />
                      <Line type="monotone" dataKey="solved" stroke="#22d3ee" strokeWidth={3} dot={{ r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
                <p className="text-sm uppercase tracking-[0.2em] text-cyan-400">Focus areas</p>
                <div className="mt-5 h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={topicBreakdown} dataKey="value" innerRadius={52} outerRadius={90} paddingAngle={3}>
                        {topicBreakdown.map((entry, index) => (
                          <Cell key={entry.name} fill={topicColors[index % topicColors.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.2em] text-cyan-400">Recommended next steps</p>
                  <h2 className="mt-2 text-xl font-semibold text-white">Your practice queue</h2>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab("practice")}
                  className="rounded-full bg-cyan-500 px-4 py-2 text-sm font-medium text-slate-950 transition hover:bg-cyan-400"
                >
                  Open practice
                </button>
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                {questions.slice(0, 3).map((question) => (
                  <button
                    key={question.id}
                    type="button"
                    onClick={() => {
                      setSelectedQuestionId(question.id);
                      setActiveTab("practice");
                    }}
                    className="rounded-2xl border border-slate-700 bg-slate-950/70 p-4 text-left transition hover:border-cyan-500/60"
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <span className="rounded-full bg-slate-800 px-2 py-1 text-[10px] uppercase tracking-wide text-cyan-300">
                        {question.topic}
                      </span>
                      <span className="text-xs text-slate-400">{question.difficulty}</span>
                    </div>
                    <p className="text-lg font-semibold text-white">{question.title}</p>
                    <p className="mt-2 line-clamp-3 text-sm text-slate-400">{question.description}</p>
                  </button>
                ))}
              </div>
            </section>
          </div>
        )}

        {activeTab === "practice" && activeQuestion && (
          <div className="grid gap-6 xl:grid-cols-[330px_minmax(0,1fr)]">
            <aside className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
              <div className="mb-4 flex items-center gap-2">
                <input
                  value={searchText}
                  onChange={(event) => setSearchText(event.target.value)}
                  placeholder="Search questions"
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200 placeholder:text-slate-500"
                />
              </div>
              <div className="mb-4 flex flex-wrap gap-2">
                <select
                  value={difficultyFilter}
                  onChange={(event) => setDifficultyFilter(event.target.value as "All" | Question["difficulty"])}
                  className="rounded-lg border border-slate-700 bg-slate-950 px-2 py-2 text-sm text-slate-200"
                >
                  <option value="All">All levels</option>
                  {difficulties.map((difficulty) => (
                    <option key={difficulty} value={difficulty}>
                      {difficulty}
                    </option>
                  ))}
                </select>
                <select
                  value={topicFilter}
                  onChange={(event) => setTopicFilter(event.target.value)}
                  className="rounded-lg border border-slate-700 bg-slate-950 px-2 py-2 text-sm text-slate-200"
                >
                  <option value="All">All topics</option>
                  {questionTopics.map((topic) => (
                    <option key={topic} value={topic}>
                      {topic}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4 flex items-center gap-2">
                <span className="text-xs uppercase tracking-[0.2em] text-slate-400">Status</span>
                <select
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value as "All" | "Completed" | "In progress" | "New")}
                  className="ml-auto rounded-lg border border-slate-700 bg-slate-950 px-2 py-2 text-sm text-slate-200"
                >
                  <option value="All">All</option>
                  <option value="Completed">Completed</option>
                  <option value="In progress">In progress</option>
                  <option value="New">New</option>
                </select>
              </div>

              <div className="space-y-3">
                {filteredQuestions.map((question) => {
                  const entry = progress[question.id];
                  const isActive = question.id === activeQuestion.id;
                  return (
                    <button
                      key={question.id}
                      type="button"
                      onClick={() => setSelectedQuestionId(question.id)}
                      className={`w-full rounded-2xl border p-3 text-left transition ${
                        isActive ? "border-cyan-500 bg-cyan-500/10" : "border-slate-700 bg-slate-950/60 hover:border-slate-500"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-medium text-white">{question.title}</span>
                        <span className="rounded-full bg-slate-800 px-2 py-1 text-[10px] uppercase tracking-wide text-slate-300">
                          {question.difficulty}
                        </span>
                      </div>
                      <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
                        <span>{question.topic}</span>
                        <span>
                          {entry?.completed ? "Done" : entry?.attempts ? "In progress" : "New"}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </aside>

            <section className="space-y-6">
              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
                <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.25em] text-cyan-400">{activeQuestion.topic}</p>
                    <h2 className="mt-2 text-3xl font-bold text-white">{activeQuestion.title}</h2>
                  </div>
                  <div className="flex gap-2">
                    <button type="button" onClick={handleRun} className="rounded-full bg-cyan-500 px-4 py-2 text-sm font-medium text-slate-950 hover:bg-cyan-400">
                      Run code
                    </button>
                    <button type="button" onClick={handleSubmit} className="rounded-full bg-emerald-500 px-4 py-2 text-sm font-medium text-slate-950 hover:bg-emerald-400">
                      Submit
                    </button>
                    <button type="button" onClick={handleReset} className="rounded-full border border-slate-700 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800">
                      Reset
                    </button>
                  </div>
                </div>

                <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
                  <div className="space-y-5">
                    <div className="rounded-2xl border border-slate-700 bg-slate-950/70 p-4">
                      <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-400">Problem</p>
                      <p className="mt-3 text-sm leading-7 text-slate-200">{activeQuestion.description}</p>

                      <div className="mt-4 grid gap-3 md:grid-cols-2">
                        <div>
                          <p className="font-medium text-cyan-300">Input / Output</p>
                          <p className="mt-1 text-sm text-slate-300">{activeQuestion.inputOutput}</p>
                        </div>
                        <div>
                          <p className="font-medium text-cyan-300">Complexity</p>
                          <p className="mt-1 text-sm text-slate-300">Time: {activeQuestion.expectedTime} • Space: {activeQuestion.expectedSpace}</p>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-slate-700 bg-slate-950/70 p-4">
                      <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-400">Examples</p>
                      <div className="mt-4 space-y-4">
                        {activeQuestion.examples.map((example, index) => (
                          <div key={index} className="rounded-xl border border-slate-800 bg-slate-900 p-3">
                            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Example {index + 1}</p>
                            <p className="mt-2 text-sm text-slate-200">Input: {example.input}</p>
                            <p className="text-sm text-slate-200">Output: {example.output}</p>
                            <p className="mt-2 text-sm text-slate-400">{example.explanation}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="rounded-2xl border border-slate-700 bg-slate-950/70 p-4">
                      <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-400">Constraints</p>
                      <ul className="mt-3 space-y-2 text-sm text-slate-300">
                        {activeQuestion.constraints.map((constraint) => (
                          <li key={constraint} className="flex gap-2">
                            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-cyan-400" />
                            <span>{constraint}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="rounded-2xl border border-slate-700 bg-slate-950/70 p-4">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-400">Hint</p>
                        <button type="button" onClick={() => setHintIndex((previous) => Math.min(previous + 1, activeQuestion.hints.length - 1))} className="text-xs text-cyan-300 hover:text-cyan-200">
                          Next hint
                        </button>
                      </div>
                      <p className="mt-3 text-sm leading-6 text-slate-200">
                        {activeQuestion.hints[Math.min(hintIndex, activeQuestion.hints.length - 1)]}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm uppercase tracking-[0.2em] text-cyan-400">Editor</p>
                    <h3 className="mt-1 text-xl font-semibold text-white">Python workspace</h3>
                  </div>
                  <button type="button" onClick={handleUseReference} className="text-sm text-cyan-300 hover:text-cyan-200">
                    Use ideal solution
                  </button>
                </div>
                <div className="overflow-hidden rounded-2xl border border-slate-700 bg-[#0b1120]">
                  <Editor
                    height="360px"
                    language="python"
                    theme="vs-dark"
                    value={currentCode}
                    onChange={(value) => setEditorCode((previous) => ({ ...previous, [activeQuestion.id]: value ?? "" }))}
                    options={{ fontSize: 14, minimap: { enabled: false }, wordWrap: "on", smoothScrolling: true }}
                  />
                </div>
              </div>

              <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
                <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
                  <p className="text-sm uppercase tracking-[0.2em] text-cyan-400">Execution output</p>
                  <div className="mt-4 rounded-xl border border-slate-700 bg-slate-950/80 p-4">
                    {activeResult ? (
                      <div className="space-y-3 text-sm text-slate-200">
                        <div className="flex items-center justify-between">
                          <span>Execution mode</span>
                          <span className="rounded-full bg-cyan-500/10 px-2 py-1 text-xs text-cyan-300">{activeResult.mode}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Passed</span>
                          <span className="font-semibold text-emerald-300">{activeResult.passed}/{activeQuestion.publicTests.length}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Failed</span>
                          <span className="font-semibold text-rose-300">{activeResult.failed}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Runtime</span>
                          <span>{activeResult.runtime}</span>
                        </div>
                        <p className="rounded-lg border border-slate-700 bg-slate-900 p-3 text-slate-300">{activeResult.stdout}</p>
                        {activeResult.stderr && <p className="rounded-lg border border-rose-500/40 bg-rose-500/10 p-3 text-rose-200">{activeResult.stderr}</p>}
                      </div>
                    ) : (
                      <p className="text-slate-400">Run your solution to see execution details here.</p>
                    )}
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
                  <p className="text-sm uppercase tracking-[0.2em] text-cyan-400">AI feedback</p>
                  {activeFeedback ? (
                    <div className="mt-4 space-y-3 text-sm text-slate-200">
                      <p><span className="font-medium text-cyan-300">Correctness:</span> {activeFeedback.correctness}</p>
                      <p><span className="font-medium text-cyan-300">Time complexity:</span> {activeFeedback.timeComplexity}</p>
                      <p><span className="font-medium text-cyan-300">Space complexity:</span> {activeFeedback.spaceComplexity}</p>
                      <p><span className="font-medium text-cyan-300">Quality:</span> {activeFeedback.codeQuality}</p>
                      <p><span className="font-medium text-cyan-300">Edge cases:</span> {activeFeedback.edgeCases}</p>
                    </div>
                  ) : (
                    <p className="mt-4 text-sm text-slate-400">Run or submit to generate deterministic feedback.</p>
                  )}
                </div>
              </div>
            </section>
          </div>
        )}

        {activeTab === "progress" && (
          <div className="grid gap-6 xl:grid-cols-2">
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
              <p className="text-sm uppercase tracking-[0.2em] text-cyan-400">Completion</p>
              <h2 className="mt-2 text-3xl font-bold text-white">{completedCount} / {questions.length}</h2>
              <div className="mt-5 h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={progressSeries}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="day" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip />
                    <Bar dataKey="solved" fill="#22d3ee" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
              <p className="text-sm uppercase tracking-[0.2em] text-cyan-400">Dashboard stats</p>
              <div className="mt-6 space-y-4 text-sm text-slate-200">
                <div className="flex items-center justify-between rounded-xl border border-slate-700 bg-slate-950/70 p-3">
                  <span>Average score</span>
                  <span className="font-semibold text-emerald-300">{avgScore}%</span>
                </div>
                <div className="flex items-center justify-between rounded-xl border border-slate-700 bg-slate-950/70 p-3">
                  <span>Total attempts</span>
                  <span className="font-semibold text-cyan-300">{attemptsCount}</span>
                </div>
                <div className="flex items-center justify-between rounded-xl border border-slate-700 bg-slate-950/70 p-3">
                  <span>Questions in progress</span>
                  <span className="font-semibold text-violet-300">{Object.values(progress).filter((entry) => !entry.completed && entry.attempts > 0).length}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "mock" && (
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-cyan-400">AI interviewer</p>
                <h2 className="mt-2 text-3xl font-bold text-white">Mock interview mode</h2>
              </div>
              <button
                type="button"
                onClick={() => setMockStep((previous) => previous + 1)}
                className="rounded-full bg-cyan-500 px-4 py-2 text-sm font-medium text-slate-950 hover:bg-cyan-400"
              >
                Next prompt
              </button>
            </div>

            <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
              <div className="rounded-2xl border border-slate-700 bg-slate-950/70 p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Interviewer</p>
                <p className="mt-4 text-lg leading-8 text-slate-100">{currentPrompt}</p>
              </div>

              <div className="rounded-2xl border border-slate-700 bg-slate-950/70 p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Suggested answer structure</p>
                <ul className="mt-4 space-y-3 text-sm text-slate-200">
                  <li>• Clarify the problem and constraints.</li>
                  <li>• Explain the optimal algorithm and why it fits.</li>
                  <li>• Walk through the code step by step.</li>
                  <li>• Discuss complexity and test cases.</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeTab === "settings" && (
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <p className="text-sm uppercase tracking-[0.2em] text-cyan-400">Workspace settings</p>
            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <label className="rounded-2xl border border-slate-700 bg-slate-950/70 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-medium text-white">AI feedback</span>
                  <input
                    type="checkbox"
                    checked={settings.aiEnabled}
                    onChange={(event) => setSettings((previous) => ({ ...previous, aiEnabled: event.target.checked }))}
                    className="h-4 w-4 accent-cyan-500"
                  />
                </div>
                <p className="mt-2 text-sm text-slate-400">Use deterministic fallback feedback when no API key is configured.</p>
              </label>

              <label className="rounded-2xl border border-slate-700 bg-slate-950/70 p-4">
                <span className="text-lg font-medium text-white">Model</span>
                <select
                  value={settings.model}
                  onChange={(event) => setSettings((previous) => ({ ...previous, model: event.target.value }))}
                  className="mt-3 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-200"
                >
                  <option value="gpt-4o-mini">gpt-4o-mini</option>
                  <option value="gpt-4.1-mini">gpt-4.1-mini</option>
                  <option value="gpt-5">gpt-5</option>
                </select>
              </label>

              <label className="rounded-2xl border border-slate-700 bg-slate-950/70 p-4 md:col-span-2">
                <span className="text-lg font-medium text-white">Execution timeout</span>
                <input
                  type="range"
                  min={500}
                  max={5000}
                  step={250}
                  value={settings.timeLimitMs}
                  onChange={(event) => setSettings((previous) => ({ ...previous, timeLimitMs: Number(event.target.value) }))}
                  className="mt-4 w-full accent-cyan-500"
                />
                <p className="mt-2 text-sm text-slate-400">Current limit: {settings.timeLimitMs} ms</p>
              </label>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
