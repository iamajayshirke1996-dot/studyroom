import React, { useState, useEffect } from 'react';
import {
  X,
  Plus,
  BookOpen,
  Video,
  Code2,
  ListTodo,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { useStudy } from '../../context/StudyContext';
import { useTheme } from '../../context/ThemeContext';
import { TopicType, Priority, GoalStatus, LearningGoal, DsaProblem, Milestone } from '../../types';

export const AddEditGoalModal: React.FC = () => {
  const {
    isAddGoalOpen,
    setIsAddGoalOpen,
    selectedGoalForModal,
    setSelectedGoalForModal,
    addGoal,
    updateGoal,
  } = useStudy();

  const { currentTheme } = useTheme();

  const isEditing = Boolean(selectedGoalForModal);

  // Form states
  const [type, setType] = useState<TopicType>('udemy');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Frontend');
  const [priority, setPriority] = useState<Priority>('high');
  const [deadline, setDeadline] = useState('');
  const [estimatedHours, setEstimatedHours] = useState(20);

  // Udemy fields
  const [instructor, setInstructor] = useState('');
  const [udemyUrl, setUdemyUrl] = useState('');
  const [totalLectures, setTotalLectures] = useState(50);
  const [completedLectures, setCompletedLectures] = useState(0);
  const [totalSections, setTotalSections] = useState(10);

  // YouTube fields
  const [channelName, setChannelName] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [totalVideos, setTotalVideos] = useState(25);
  const [completedVideos, setCompletedVideos] = useState(0);
  const [currentVideoTitle, setCurrentVideoTitle] = useState('');

  // DSA fields
  const [dsaTopicGroup, setDsaTopicGroup] = useState('Binary Trees & BST');
  const [initialProblem, setInitialProblem] = useState('Invert Binary Tree');

  // Custom fields
  const [initialMilestone, setInitialMilestone] = useState('');

  useEffect(() => {
    if (selectedGoalForModal) {
      setType(selectedGoalForModal.type);
      setTitle(selectedGoalForModal.title);
      setDescription(selectedGoalForModal.description || '');
      setCategory(selectedGoalForModal.category || 'General');
      setPriority(selectedGoalForModal.priority || 'medium');
      setDeadline(
        selectedGoalForModal.deadline ? selectedGoalForModal.deadline.split('T')[0] : ''
      );
      setEstimatedHours(selectedGoalForModal.estimatedHours || 20);

      if (selectedGoalForModal.type === 'udemy') {
        setInstructor(selectedGoalForModal.instructor || '');
        setUdemyUrl(selectedGoalForModal.udemyUrl || '');
        setTotalLectures(selectedGoalForModal.totalLectures || 50);
        setCompletedLectures(selectedGoalForModal.completedLectures || 0);
        setTotalSections(selectedGoalForModal.totalSections || 10);
      } else if (selectedGoalForModal.type === 'youtube') {
        setChannelName(selectedGoalForModal.channelName || '');
        setYoutubeUrl(selectedGoalForModal.youtubeUrl || '');
        setTotalVideos(selectedGoalForModal.totalVideos || 25);
        setCompletedVideos(selectedGoalForModal.completedVideos || 0);
        setCurrentVideoTitle(selectedGoalForModal.currentVideoTitle || '');
      } else if (selectedGoalForModal.type === 'dsa') {
        setDsaTopicGroup(selectedGoalForModal.dsaTopicGroup || 'Basics');
      }
    } else {
      // Reset form
      setType('udemy');
      setTitle('');
      setDescription('');
      setCategory('Frontend');
      setPriority('high');
      setDeadline('');
      setEstimatedHours(20);
      setInstructor('');
      setUdemyUrl('');
      setTotalLectures(50);
      setCompletedLectures(0);
      setTotalSections(10);
      setChannelName('');
      setYoutubeUrl('');
      setTotalVideos(25);
      setCompletedVideos(0);
      setCurrentVideoTitle('');
      setDsaTopicGroup('Binary Trees & BST');
      setInitialProblem('Invert Binary Tree');
      setInitialMilestone('');
    }
  }, [selectedGoalForModal, isAddGoalOpen]);

  // Fail-safe open condition: open if isAddGoalOpen is true OR a goal is selected for editing
  const isOpen = isAddGoalOpen || Boolean(selectedGoalForModal);
  if (!isOpen) return null;

  const handleClose = () => {
    setIsAddGoalOpen(false);
    setSelectedGoalForModal(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (isEditing && selectedGoalForModal) {
      const isFinished =
        (type === 'udemy' && totalLectures > 0 && completedLectures >= totalLectures) ||
        (type === 'youtube' && totalVideos > 0 && completedVideos >= totalVideos);

      updateGoal(selectedGoalForModal.id, {
        title: title.trim(),
        description: description.trim(),
        category,
        priority,
        deadline: deadline ? new Date(deadline).toISOString() : undefined,
        estimatedHours,
        status: isFinished ? 'completed' : selectedGoalForModal.status,
        instructor: type === 'udemy' ? instructor : undefined,
        udemyUrl: type === 'udemy' ? udemyUrl : undefined,
        totalLectures: type === 'udemy' ? totalLectures : undefined,
        completedLectures: type === 'udemy' ? completedLectures : undefined,
        totalSections: type === 'udemy' ? totalSections : undefined,
        channelName: type === 'youtube' ? channelName : undefined,
        youtubeUrl: type === 'youtube' ? youtubeUrl : undefined,
        totalVideos: type === 'youtube' ? totalVideos : undefined,
        completedVideos: type === 'youtube' ? completedVideos : undefined,
        currentVideoTitle: type === 'youtube' ? currentVideoTitle : undefined,
        dsaTopicGroup: type === 'dsa' ? dsaTopicGroup : undefined,
      });
    } else {
      let initialProblems: DsaProblem[] = [];
      if (type === 'dsa' && initialProblem.trim()) {
        initialProblems = [
          {
            id: `p-${Date.now()}`,
            title: initialProblem.trim(),
            difficulty: 'easy',
            pattern: dsaTopicGroup || 'Basics',
            solved: false,
            timeComplexity: 'O(N)',
            spaceComplexity: 'O(1)',
          },
        ];
      }

      let initialMilestones: Milestone[] = [];
      if (type === 'custom' && initialMilestone.trim()) {
        initialMilestones = [
          {
            id: `m-${Date.now()}`,
            title: initialMilestone.trim(),
            dueDate: deadline ? new Date(deadline).toISOString() : new Date().toISOString(),
            completed: false,
          },
        ];
      }

      addGoal({
        title: title.trim(),
        type,
        description: description.trim(),
        category,
        priority,
        deadline: deadline ? new Date(deadline).toISOString() : undefined,
        estimatedHours,
        status: 'in_progress',
        instructor: type === 'udemy' ? instructor : undefined,
        udemyUrl: type === 'udemy' ? udemyUrl : undefined,
        totalLectures: type === 'udemy' ? totalLectures : 0,
        completedLectures: 0,
        totalSections: type === 'udemy' ? totalSections : 0,
        completedSections: 0,
        channelName: type === 'youtube' ? channelName : undefined,
        youtubeUrl: type === 'youtube' ? youtubeUrl : undefined,
        totalVideos: type === 'youtube' ? totalVideos : 0,
        completedVideos: 0,
        currentVideoTitle: type === 'youtube' ? currentVideoTitle : undefined,
        dsaTopicGroup: type === 'dsa' ? dsaTopicGroup : undefined,
        dsaProblems: initialProblems,
        milestones: initialMilestones,
        summary: {
          keyTakeaways: [
            `Core goal established: Master ${title.trim()}`,
          ],
          cheatSheetCode: '',
          gotchas: [],
          confidenceLevel: 3,
          reviewCount: 0,
          resourceLinks: [],
        },
      });
    }

    handleClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-slate-900 dark:text-slate-100">
        {/* Header */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950/70">
          <div className="flex items-center gap-3">
            <div
              className="p-2.5 rounded-xl text-white shadow-sm"
              style={{ backgroundColor: currentTheme.primary }}
            >
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                {isEditing ? 'Edit Learning Goal' : 'Create New Learning Goal'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isEditing ? `Update details for "${title || 'this goal'}"` : 'Track courses, video series, DSA topics, or milestone targets'}
              </p>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1 text-xs">
          {/* Source Type Selector (only on create) */}
          {!isEditing && (
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                What type of learning resource is this?
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setType('udemy');
                    setCategory('Frontend');
                  }}
                  className={`p-3 rounded-2xl border flex flex-col items-center gap-1.5 transition-all text-xs ${
                    type === 'udemy'
                      ? 'bg-purple-500/15 border-purple-500 text-purple-700 dark:text-purple-200 font-bold shadow-sm'
                      : 'bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <BookOpen className="h-4 w-4 text-purple-500" />
                  <span>Udemy</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setType('youtube');
                    setCategory('Backend & Systems');
                  }}
                  className={`p-3 rounded-2xl border flex flex-col items-center gap-1.5 transition-all text-xs ${
                    type === 'youtube'
                      ? 'bg-rose-500/15 border-rose-500 text-rose-700 dark:text-rose-200 font-bold shadow-sm'
                      : 'bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <Video className="h-4 w-4 text-rose-500" />
                  <span>YouTube</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setType('dsa');
                    setCategory('Algorithms');
                  }}
                  className={`p-3 rounded-2xl border flex flex-col items-center gap-1.5 transition-all text-xs ${
                    type === 'dsa'
                      ? 'bg-blue-500/15 border-blue-500 text-blue-700 dark:text-blue-200 font-bold shadow-sm'
                      : 'bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <Code2 className="h-4 w-4 text-blue-500" />
                  <span>DSA Pattern</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setType('custom');
                    setCategory('DevOps');
                  }}
                  className={`p-3 rounded-2xl border flex flex-col items-center gap-1.5 transition-all text-xs ${
                    type === 'custom'
                      ? 'bg-emerald-500/15 border-emerald-500 text-emerald-700 dark:text-emerald-200 font-bold shadow-sm'
                      : 'bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <ListTodo className="h-4 w-4 text-emerald-500" />
                  <span>Custom Goal</span>
                </button>
              </div>
            </div>
          )}

          {/* Goal Title */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder={
                type === 'udemy'
                  ? 'e.g. Modern React & Next.js: Complete Guide'
                  : type === 'youtube'
                  ? 'e.g. System Design Interview Blueprint'
                  : type === 'dsa'
                  ? 'e.g. Dynamic Programming 1D & 2D Patterns'
                  : 'e.g. Rust Systems Programming & Concurrency'
              }
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 shadow-sm"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Brief Description</label>
            <textarea
              rows={2}
              placeholder="What will you master in this goal? (Key topics, skills, objectives)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 shadow-sm"
            />
          </div>

          {/* Category & Priority Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none shadow-sm"
              >
                <option value="Frontend">Frontend Development</option>
                <option value="Backend">Backend & APIs</option>
                <option value="Backend & Systems">Backend & Systems</option>
                <option value="Algorithms">DSA & Coding Interviews</option>
                <option value="System Design">System Architecture</option>
                <option value="DevOps">Cloud, Docker & DevOps</option>
                <option value="AI / ML">AI & Machine Learning</option>
                <option value="General">General Mastery</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none shadow-sm"
              >
                <option value="urgent">Urgent</option>
                <option value="high">High Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="low">Low / Backlog</option>
              </select>
            </div>
          </div>

          {/* Deadline & Estimated Hours */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Target Deadline</label>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none shadow-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Estimated Hours</label>
              <input
                type="number"
                min="1"
                max="500"
                value={estimatedHours}
                onChange={(e) => setEstimatedHours(Number(e.target.value))}
                className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none shadow-sm"
              />
            </div>
          </div>

          {/* Type-Specific Fields */}
          {type === 'udemy' && (
            <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-200 dark:border-purple-500/30 space-y-3">
              <p className="font-bold text-purple-700 dark:text-purple-300">Udemy Course Details</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Instructor Name"
                  value={instructor}
                  onChange={(e) => setInstructor(e.target.value)}
                  className="px-3 py-1.5 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
                <input
                  type="url"
                  placeholder="Udemy Course URL"
                  value={udemyUrl}
                  onChange={(e) => setUdemyUrl(e.target.value)}
                  className="px-3 py-1.5 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                <div>
                  <label className="text-[11px] text-slate-600 dark:text-slate-400 block mb-1">Total Lectures</label>
                  <input
                    type="number"
                    min="1"
                    value={totalLectures}
                    onChange={(e) => setTotalLectures(Number(e.target.value))}
                    className="w-full px-3 py-1.5 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>
                {isEditing && (
                  <div>
                    <label className="text-[11px] text-slate-600 dark:text-slate-400 block mb-1">Completed Lectures</label>
                    <input
                      type="number"
                      min="0"
                      max={totalLectures}
                      value={completedLectures}
                      onChange={(e) => setCompletedLectures(Math.max(0, Number(e.target.value)))}
                      className="w-full px-3 py-1.5 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                    />
                  </div>
                )}
                <div>
                  <label className="text-[11px] text-slate-600 dark:text-slate-400 block mb-1">Total Sections</label>
                  <input
                    type="number"
                    min="1"
                    value={totalSections}
                    onChange={(e) => setTotalSections(Number(e.target.value))}
                    className="w-full px-3 py-1.5 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            </div>
          )}

          {type === 'youtube' && (
            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-200 dark:border-rose-500/30 space-y-3">
              <p className="font-bold text-rose-700 dark:text-rose-300">YouTube Playlist Details</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Channel Name (e.g. Java Brains)"
                  value={channelName}
                  onChange={(e) => setChannelName(e.target.value)}
                  className="px-3 py-1.5 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
                <input
                  type="url"
                  placeholder="Playlist URL"
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                  className="px-3 py-1.5 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] text-slate-600 dark:text-slate-400 block mb-1">Total Videos in Playlist</label>
                  <input
                    type="number"
                    min="1"
                    value={totalVideos}
                    onChange={(e) => setTotalVideos(Number(e.target.value))}
                    className="w-full px-3 py-1.5 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>
                {isEditing && (
                  <div>
                    <label className="text-[11px] text-slate-600 dark:text-slate-400 block mb-1">Watched Videos</label>
                    <input
                      type="number"
                      min="0"
                      max={totalVideos}
                      value={completedVideos}
                      onChange={(e) => setCompletedVideos(Math.max(0, Number(e.target.value)))}
                      className="w-full px-3 py-1.5 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                    />
                  </div>
                )}
                <div className={isEditing ? 'sm:col-span-2' : ''}>
                  <label className="text-[11px] text-slate-600 dark:text-slate-400 block mb-1">Current / Next Video Title</label>
                  <input
                    type="text"
                    placeholder="e.g. Scopes & Closures Deep Dive"
                    value={currentVideoTitle}
                    onChange={(e) => setCurrentVideoTitle(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            </div>
          )}

          {type === 'dsa' && (
            <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-200 dark:border-blue-500/30 space-y-3">
              <p className="font-bold text-blue-700 dark:text-blue-300">DSA Pattern Details</p>
              <input
                type="text"
                placeholder="Topic / Pattern Group (e.g. Binary Search, Dynamic Programming)"
                value={dsaTopicGroup}
                onChange={(e) => setDsaTopicGroup(e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
              />
              {!isEditing && (
                <input
                  type="text"
                  placeholder="First Problem Title (e.g. Binary Search on 2D Matrix)"
                  value={initialProblem}
                  onChange={(e) => setInitialProblem(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              )}
            </div>
          )}

          {type === 'custom' && !isEditing && (
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 space-y-2">
              <p className="font-bold text-emerald-700 dark:text-emerald-300">Initial Checkpoint Milestone</p>
              <input
                type="text"
                placeholder="First Milestone (e.g. Complete Chapters 1-3 & setup dev env)"
                value={initialMilestone}
                onChange={(e) => setInitialMilestone(e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
              />
            </div>
          )}

          {/* Action buttons */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-white font-bold rounded-xl shadow-md transition-all hover:scale-105"
              style={{ backgroundColor: currentTheme.primary }}
            >
              {isEditing ? 'Save Changes' : 'Create Learning Goal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
