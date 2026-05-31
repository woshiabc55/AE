import { useEffect, useState, useCallback } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { X, BookOpen, PenTool, Mic, Headphones } from "lucide-react";
import { useCourseStore } from "@/store/courseStore";
import { useProgressStore } from "@/store/progressStore";
import { cn } from "@/lib/utils";
import VocabularyModule from "@/components/learn/VocabularyModule";
import GrammarModule from "@/components/learn/GrammarModule";
import SpeakingModule from "@/components/learn/SpeakingModule";
import ListeningModule from "@/components/learn/ListeningModule";
import CompletionModal from "@/components/learn/CompletionModal";

const TAB_CONFIG = [
  { key: "vocabulary", label: "📝 单词记忆", icon: BookOpen },
  { key: "grammar", label: "✏️ 语法练习", icon: PenTool },
  { key: "speaking", label: "🎤 口语跟读", icon: Mic },
  { key: "listening", label: "🎧 听力训练", icon: Headphones },
];

export default function Learn() {
  const { courseId } = useParams<{ courseId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { currentCourse, lessons, fetchCourseDetail, fetchLessons, isLoading } = useCourseStore();
  const { submitLessonResult } = useProgressStore();

  const lessonId = searchParams.get("lesson") || "";

  const [activeTab, setActiveTab] = useState<string>("vocabulary");
  const [showCompletion, setShowCompletion] = useState(false);
  const [completionScore, setCompletionScore] = useState(0);
  const [startTime] = useState(Date.now());

  const currentLesson = lessons.find((l) => l.id === lessonId);

  useEffect(() => {
    if (courseId) {
      fetchCourseDetail(courseId);
      fetchLessons(courseId);
    }
  }, [courseId, fetchCourseDetail, fetchLessons]);

  useEffect(() => {
    if (currentLesson?.content) {
      const { vocabulary, grammar, speaking, listening } = currentLesson.content;
      if (vocabulary && vocabulary.length > 0) setActiveTab("vocabulary");
      else if (grammar && grammar.length > 0) setActiveTab("grammar");
      else if (speaking && speaking.length > 0) setActiveTab("speaking");
      else if (listening && listening.length > 0) setActiveTab("listening");
    }
  }, [currentLesson]);

  const availableTabs = TAB_CONFIG.filter((tab) => {
    if (!currentLesson?.content) return false;
    const data = currentLesson.content[tab.key as keyof typeof currentLesson.content];
    return Array.isArray(data) && data.length > 0;
  });

  const handleModuleComplete = useCallback(async (score: number) => {
    setCompletionScore(score);
    setShowCompletion(true);
  }, []);

  const handleContinue = useCallback(async () => {
    if (!currentLesson || !courseId) return;
    const timeSpent = Math.round((Date.now() - startTime) / 1000);
    await submitLessonResult({
        lessonId: currentLesson.id,
        score: completionScore,
        timeSpent,
        answers: [],
      }).catch(() => undefined);
    setShowCompletion(false);
    const currentIndex = lessons.findIndex((l) => l.id === lessonId);
    if (currentIndex < lessons.length - 1) {
      const nextLesson = lessons[currentIndex + 1];
      navigate(`/learn/${courseId}?lesson=${nextLesson.id}`);
    } else {
      navigate(`/courses/${courseId}`);
    }
  }, [currentLesson, courseId, startTime, submitLessonResult, completionScore, lessons, lessonId, navigate]);

  if (isLoading || !currentCourse || !currentLesson) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
      </div>
    );
  }

  const lessonIndex = lessons.findIndex((l) => l.id === lessonId);

  return (
    <div className="flex h-full flex-col bg-surface">
      <div className="flex items-center justify-between border-b border-gray-100 bg-white px-6 py-3">
        <div className="flex items-center gap-4">
          <div>
            <p className="text-xs text-gray-400">{currentCourse.title}</p>
            <h2 className="font-display text-lg font-semibold text-primary">{currentLesson.title}</h2>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="rounded-pill bg-mint px-3 py-1 text-xs font-medium text-primary">
            {lessonIndex + 1} / {lessons.length}
          </span>
          <button
            onClick={() => navigate(`/courses/${courseId}`)}
            className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {availableTabs.length > 1 && (
        <div className="flex gap-1 border-b border-gray-100 bg-white px-6">
          {availableTabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={cn(
                  "flex items-center gap-1.5 border-b-2 px-4 py-3 text-sm font-medium transition-all duration-200",
                  activeTab === tab.key
                    ? "border-accent text-primary"
                    : "border-transparent text-gray-400 hover:text-gray-600"
                )}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            );
          })}
        </div>
      )}

      <div className="flex-1 overflow-y-auto">
        {activeTab === "vocabulary" && currentLesson.content.vocabulary && (
          <VocabularyModule
            items={currentLesson.content.vocabulary}
            onComplete={handleModuleComplete}
          />
        )}
        {activeTab === "grammar" && currentLesson.content.grammar && (
          <GrammarModule
            exercises={currentLesson.content.grammar}
            onComplete={handleModuleComplete}
          />
        )}
        {activeTab === "speaking" && currentLesson.content.speaking && (
          <SpeakingModule
            items={currentLesson.content.speaking}
            onComplete={handleModuleComplete}
          />
        )}
        {activeTab === "listening" && currentLesson.content.listening && (
          <ListeningModule
            items={currentLesson.content.listening}
            onComplete={handleModuleComplete}
          />
        )}
      </div>

      {showCompletion && (
        <CompletionModal
          score={completionScore}
          timeSpent={Math.round((Date.now() - startTime) / 1000)}
          onContinue={handleContinue}
        />
      )}
    </div>
  );
}
