import React, { useState, useEffect } from 'react';
import { useStudy } from '../../context/StudyContext';
import { YoutubeShort, ShortPlatform, ContentStatus } from '../../types';
import { getLocalDateString } from '../../utils/storage';
import { Video, Sparkles, Link, Eye, ThumbsUp, Calendar, Tag, FileText } from 'lucide-react';

interface LogShortModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialShort?: YoutubeShort | null;
}

export const LogShortModal: React.FC<LogShortModalProps> = ({
  isOpen,
  onClose,
  initialShort,
}) => {
  const { addYoutubeShort, updateYoutubeShort } = useStudy();

  const [title, setTitle] = useState('');
  const [platform, setPlatform] = useState<ShortPlatform>('youtube_shorts');
  const [status, setStatus] = useState<ContentStatus>('idea');
  const [uploadDate, setUploadDate] = useState(getLocalDateString());
  const [videoUrl, setVideoUrl] = useState('');
  const [niche, setNiche] = useState('Web Development');
  const [views, setViews] = useState<number | ''>('');
  const [likes, setLikes] = useState<number | ''>('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (initialShort) {
      setTitle(initialShort.title || '');
      setPlatform(initialShort.platform || 'youtube_shorts');
      setStatus(initialShort.status || 'idea');
      setUploadDate(initialShort.uploadDate || getLocalDateString());
      setVideoUrl(initialShort.videoUrl || '');
      setNiche(initialShort.niche || 'Web Development');
      setViews(initialShort.views !== undefined ? initialShort.views : '');
      setLikes(initialShort.likes !== undefined ? initialShort.likes : '');
      setNotes(initialShort.notes || '');
    } else {
      setTitle('');
      setPlatform('youtube_shorts');
      setStatus('idea');
      setUploadDate(getLocalDateString());
      setVideoUrl('');
      setNiche('Web Development');
      setViews('');
      setLikes('');
      setNotes('');
    }
  }, [initialShort, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const payload = {
      title: title.trim(),
      platform,
      status,
      uploadDate: uploadDate || getLocalDateString(),
      videoUrl: videoUrl.trim() || undefined,
      niche: niche.trim() || undefined,
      views: typeof views === 'number' ? views : undefined,
      likes: typeof likes === 'number' ? likes : undefined,
      notes: notes.trim() || undefined,
    };

    if (initialShort) {
      updateYoutubeShort(initialShort.id, payload);
    } else {
      addYoutubeShort(payload);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 md:p-8 max-w-lg w-full border border-slate-200 dark:border-slate-700 shadow-2xl space-y-6 animate-scaleUp max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-pink-100 dark:bg-pink-900/40 text-pink-600 dark:text-pink-400 rounded-2xl">
              <Video className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800 dark:text-white">
                {initialShort ? 'Edit Video Short' : 'Log Content Short 🎬'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Track video content pipeline from Idea to Published Upload
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-lg"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mb-1">
              Video Title / Concept Hook *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. JavaScript Closures Explained in 30 Seconds 🚀"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 text-sm focus:ring-2 focus:ring-pink-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mb-1">
                Platform
              </label>
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value as ShortPlatform)}
                className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 text-sm focus:ring-2 focus:ring-pink-500 focus:outline-none"
              >
                <option value="youtube_shorts">YouTube Shorts 🔴</option>
                <option value="reels">Instagram Reels 📸</option>
                <option value="tiktok">TikTok 🎵</option>
                <option value="linkedin_video">LinkedIn Video 💼</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mb-1">
                Pipeline Stage
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ContentStatus)}
                className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 text-sm focus:ring-2 focus:ring-pink-500 focus:outline-none"
              >
                <option value="idea">💡 Idea Concept</option>
                <option value="scripted">📝 Scripted</option>
                <option value="recorded">🎥 Recorded / Shot</option>
                <option value="edited">✂️ Edited & Ready</option>
                <option value="uploaded">🎉 Uploaded / Published</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mb-1">
                Category / Niche
              </label>
              <input
                type="text"
                placeholder="e.g. Web Dev, DSA, Productivity"
                value={niche}
                onChange={(e) => setNiche(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 text-sm focus:ring-2 focus:ring-pink-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mb-1">
                Target / Upload Date
              </label>
              <input
                type="date"
                value={uploadDate}
                onChange={(e) => setUploadDate(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 text-sm focus:ring-2 focus:ring-pink-500 focus:outline-none"
              />
            </div>
          </div>

          {status === 'uploaded' && (
            <>
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mb-1">
                  Video URL / Link
                </label>
                <input
                  type="url"
                  placeholder="https://youtube.com/shorts/..."
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 text-sm focus:ring-2 focus:ring-pink-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mb-1">
                    Views Count 👁️
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="e.g. 1500"
                    value={views}
                    onChange={(e) => setViews(e.target.value ? parseInt(e.target.value, 10) : '')}
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 text-sm focus:ring-2 focus:ring-pink-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mb-1">
                    Likes Count 👍
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="e.g. 200"
                    value={likes}
                    onChange={(e) => setLikes(e.target.value ? parseInt(e.target.value, 10) : '')}
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 text-sm focus:ring-2 focus:ring-pink-500 focus:outline-none"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mb-1">
              Script & Key Takeaways Notes
            </label>
            <textarea
              rows={3}
              placeholder="Script hook, audio sound background, hashtags used..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 text-sm focus:ring-2 focus:ring-pink-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 text-sm font-semibold bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white rounded-xl shadow-lg shadow-pink-500/20 transition-all"
            >
              {initialShort ? 'Save Changes' : 'Add to Pipeline 🚀'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
