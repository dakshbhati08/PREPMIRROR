import { useRef, useState } from 'react';
import {
  UploadCloud,
  FileText,
  X,
  Link as LinkIcon,
  Plus,
  ArrowRight,
  ArrowLeft,
  Loader2,
} from 'lucide-react';
import { useRouter } from '@/lib/router';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { submitProfile } from '@/lib/api';
import type { TargetRole, ExperienceLevel, LanguagePreference } from '@/types';

const ROLES: TargetRole[] = ['Web Developer', 'Data Analyst', 'Software Engineer', 'Customer Support', 'Marketing', 'Other'];
const EXPERIENCE: ExperienceLevel[] = ['Fresher', '0-1 yr', '1-3 yrs'];
const LANGUAGES: LanguagePreference[] = ['English', 'Hinglish'];

export function ProfileSetupPage() {
  const { navigate } = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [links, setLinks] = useState<string[]>(['']);
  const [targetRole, setTargetRole] = useState<TargetRole>('Web Developer');
  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel>('Fresher');
  const [language, setLanguage] = useState<LanguagePreference>('English');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = (file: File | undefined) => {
    if (!file) return;
    if (file.type !== 'application/pdf') {
      setError('Please upload a PDF file.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError('File is too large. Maximum 10 MB.');
      return;
    }
    setError(null);
    setResumeFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const addLink = () => setLinks([...links, '']);
  const updateLink = (i: number, val: string) => setLinks(links.map((l, idx) => (idx === i ? val : l)));
  const removeLink = (i: number) => setLinks(links.filter((_, idx) => idx !== i));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const result = await submitProfile({
        resumeFile,
        resumeName: resumeFile?.name ?? '',
        links: links.filter((l) => l.trim()),
        targetRole,
        experienceLevel,
        language,
      });
      navigate({ name: 'interview', sessionId: result.sessionId, profileId: result.profileId });
    } catch {
      setError('Could not process your profile. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="container-max section-padding py-8 sm:py-12">
        <button
          onClick={() => navigate({ name: 'landing' })}
          className="btn-ghost mb-4 text-sm"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-ink-900">Set up your profile</h1>
            <p className="mt-3 text-ink-500">The more we know, the better your questions will be. This takes about 2 minutes.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Resume upload */}
            <div className="card p-6">
              <label className="block text-sm font-semibold text-ink-700 mb-3">
                Resume (PDF) <span className="text-brand-500">*</span>
              </label>
              <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={(e) => handleFile(e.target.files?.[0])}
              />

              {!resumeFile ? (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                  className={`w-full rounded-2xl border-2 border-dashed py-10 px-6 text-center transition-all ${
                    isDragging
                      ? 'border-brand-400 bg-brand-50 scale-[1.01]'
                      : 'border-ink-300 bg-ink-50 hover:border-brand-300 hover:bg-brand-50/50'
                  }`}
                  aria-label="Upload resume PDF by clicking or dragging"
                >
                  <UploadCloud className={`w-10 h-10 mx-auto mb-3 transition-colors ${isDragging ? 'text-brand-500' : 'text-ink-400'}`} />
                  <p className="text-sm font-medium text-ink-600">
                    {isDragging ? 'Drop your resume here' : 'Drag & drop your resume, or click to browse'}
                  </p>
                  <p className="text-xs text-ink-400 mt-1">PDF up to 10 MB</p>
                </button>
              ) : (
                <div className="flex items-center gap-3 bg-brand-50 rounded-xl p-4 animate-fade-in">
                  <div className="w-10 h-10 rounded-lg bg-brand-100 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-5 h-5 text-brand-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-ink-700 truncate">{resumeFile.name}</p>
                    <p className="text-xs text-ink-400">{(resumeFile.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setResumeFile(null)}
                    className="p-2 rounded-lg text-ink-400 hover:bg-brand-100 hover:text-ink-600 transition-colors"
                    aria-label="Remove resume file"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>

            {/* Links */}
            <div className="card p-6">
              <label className="block text-sm font-semibold text-ink-700 mb-3">
                Portfolio / GitHub / LinkedIn links
              </label>
              <div className="space-y-2">
                {links.map((link, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" />
                      <input
                        type="url"
                        value={link}
                        onChange={(e) => updateLink(i, e.target.value)}
                        placeholder="https://github.com/yourusername"
                        className="input-field !pl-10"
                        aria-label={`Link ${i + 1}`}
                      />
                    </div>
                    {links.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeLink(i)}
                        className="p-2.5 rounded-xl text-ink-400 hover:bg-ink-100 hover:text-ink-600 transition-colors"
                        aria-label="Remove link"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addLink}
                  className="flex items-center gap-1.5 text-sm text-brand-600 font-medium hover:text-brand-700 transition-colors mt-2"
                >
                  <Plus className="w-4 h-4" /> Add another link
                </button>
              </div>
            </div>

            {/* Role & experience */}
            <div className="card p-6 space-y-5">
              <div>
                <label htmlFor="target-role" className="block text-sm font-semibold text-ink-700 mb-2">
                  Target role <span className="text-brand-500">*</span>
                </label>
                <select
                  id="target-role"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value as TargetRole)}
                  className="input-field"
                >
                  {ROLES.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-ink-700 mb-2">
                  Experience level
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {EXPERIENCE.map((exp) => (
                    <button
                      key={exp}
                      type="button"
                      onClick={() => setExperienceLevel(exp)}
                      className={`px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                        experienceLevel === exp
                          ? 'bg-brand-600 text-white shadow-sm'
                          : 'bg-ink-50 text-ink-600 hover:bg-ink-100'
                      }`}
                    >
                      {exp}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-ink-700 mb-2">
                  Language preference
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang}
                      type="button"
                      onClick={() => setLanguage(lang)}
                      className={`px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                        language === lang
                          ? 'bg-brand-600 text-white shadow-sm'
                          : 'bg-ink-50 text-ink-600 hover:bg-ink-100'
                      }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {error && (
              <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || !resumeFile}
              className="btn-primary w-full text-base disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Reading your profile and preparing your questions...
                </>
              ) : (
                <>
                  Start my mock interview
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
            {!resumeFile && !loading && (
              <p className="text-center text-xs text-ink-400">Upload your resume to continue</p>
            )}
          </form>
        </div>
      </div>

      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
}
