import { useState, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { Camera, Lock, X, AlertCircle, MapPin, ArrowLeft, Mic, MicOff } from 'lucide-react';
import { useJournal } from '../hooks/useJournal';
import { Button } from '../components/Button';
import { cn, generateId, blobToDataUrl } from '../lib/utils';
import type { Quest, JournalEntry } from '../lib/types';

const MAX_FILE_SIZE_MB = 10;
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

export function ObservePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { saveEntry } = useJournal();

  // Quest can come via navigation state or fall back to daily quest
  const questFromState = location.state?.quest as Quest | undefined;
  const [quest] = useState<Quest | null>(questFromState ?? null);

  const [observationText, setObservationText] = useState('');
  const [placeLabel, setPlaceLabel] = useState('');
  const [photoBlob, setPhotoBlob] = useState<Blob | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [savedEntryId, setSavedEntryId] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const toggleVoiceDictation = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. Try Chrome or Edge.');
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);

      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((r: any) => r[0].transcript)
          .join(' ');
        if (transcript) {
          setObservationText((prev) => (prev ? `${prev} ${transcript}` : transcript));
          if (validationError) setValidationError(null);
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  const handlePhotoSelect = useCallback(async (file: File) => {
    setPhotoError(null);

    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      setPhotoError('Please select a JPEG, PNG, WebP, or GIF image.');
      return;
    }

    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setPhotoError(`Image must be under ${MAX_FILE_SIZE_MB}MB.`);
      return;
    }

    try {
      const preview = await blobToDataUrl(file);
      setPhotoBlob(file);
      setPhotoPreview(preview);
    } catch {
      setPhotoError('Could not load image. Please try another file.');
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handlePhotoSelect(file);
    // Reset input so the same file can be selected again
    e.target.value = '';
  };

  const removePhoto = () => {
    setPhotoBlob(null);
    setPhotoPreview(null);
    setPhotoError(null);
  };

  const validateObservation = (): boolean => {
    const trimmed = observationText.trim();
    if (!trimmed) {
      setValidationError('Please write what you observed before saving.');
      textareaRef.current?.focus();
      return false;
    }
    if (trimmed.length < 10) {
      setValidationError('Your observation is very short. Write a bit more about what you noticed.');
      textareaRef.current?.focus();
      return false;
    }
    setValidationError(null);
    return true;
  };

  const handleSave = async (andReflect = false) => {
    if (!quest) return;
    if (!validateObservation()) return;

    setSaving(true);
    try {
      const entryId = savedEntryId ?? generateId();
      const now = new Date();

      const entry: JournalEntry = {
        id: entryId,
        questId: quest.id,
        questTitle: quest.title,
        theme: quest.theme,
        observationText: observationText.trim(),
        aiReflection: null,
        photoBlob: photoBlob,
        placeLabel: placeLabel.trim() || null,
        observedAt: now,
        createdAt: now,
        updatedAt: now,
      };

      await saveEntry(entry);
      setSavedEntryId(entryId);

      if (andReflect) {
        navigate('/reflection', { state: { entryId, quest } });
      } else {
        navigate('/journal');
      }
    } catch (err) {
      setValidationError('Failed to save. Please try again.');
      console.error('Save error:', err);
    } finally {
      setSaving(false);
    }
  };

  if (!quest) {
    return (
      <div className="max-w-xl mx-auto px-4 py-12 text-center">
        <AlertCircle size={32} className="text-text-muted mx-auto mb-4" strokeWidth={1} />
        <h2 className="font-heading text-2xl text-graphite mb-2">No quest selected</h2>
        <p className="text-sm text-text-muted mb-6">Choose a quest from Today's page to begin observing.</p>
        <Button onClick={() => navigate('/')} variant="primary">
          Back to Today
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-8 pb-28 md:pb-8">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-sm text-text-muted hover:text-graphite mb-6 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-oxide rounded"
      >
        <ArrowLeft size={14} />
        Back
      </button>

      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        {/* Quest header */}
        <div className="mb-6 pb-6 border-b border-border-subtle">
          <span className="text-xs font-medium uppercase tracking-widest text-text-muted block mb-2">
            {quest.theme}
          </span>
          <h1 className="font-heading text-3xl text-graphite leading-tight mb-3">{quest.title}</h1>
          <p className="text-sm text-text-muted leading-relaxed">{quest.description}</p>
        </div>

        {/* Blind-first instruction */}
        <div className="bg-patina/8 border border-patina/20 rounded-lg p-4 mb-6">
          <p className="text-sm text-patina leading-relaxed">
            <strong className="font-medium">Observe first.</strong> Go outside, find your subject, and record what you notice in your own words. AI reflection becomes available after you save.
          </p>
        </div>

        {/* Observation textarea */}
        <div className="mb-5">
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="observation" className="block text-sm font-medium text-graphite">
              What did you notice?
            </label>
            <button
              type="button"
              onClick={toggleVoiceDictation}
              className={cn(
                'flex items-center gap-1.5 px-2.5 py-1 rounded text-xs transition-colors',
                isListening
                  ? 'bg-error-red text-white animate-pulse'
                  : 'bg-dust/40 text-graphite hover:bg-dust/70'
              )}
              title={isListening ? 'Stop dictation' : 'Dictate observation'}
            >
              {isListening ? (
                <>
                  <MicOff size={13} />
                  <span>Listening...</span>
                </>
              ) : (
                <>
                  <Mic size={13} />
                  <span>Dictate note</span>
                </>
              )}
            </button>
          </div>
          <textarea
            id="observation"
            ref={textareaRef}
            value={observationText}
            onChange={(e) => {
              setObservationText(e.target.value);
              if (validationError) setValidationError(null);
            }}
            placeholder="Describe exactly what you saw, heard, or felt. Use your own words — there's no wrong answer."
            rows={8}
            className={cn(
              'w-full px-4 py-3 bg-white border rounded-lg text-sm text-graphite placeholder:text-text-muted/60',
              'leading-relaxed resize-y min-h-[180px]',
              'focus:outline-none focus:ring-2 focus:ring-oxide/30 focus:border-oxide/40',
              'transition-colors duration-150',
              validationError ? 'border-error-red' : 'border-border-subtle',
            )}
            aria-describedby={validationError ? 'obs-error' : undefined}
            aria-invalid={!!validationError}
          />
          {validationError && (
            <p id="obs-error" className="text-xs text-error-red mt-1.5 flex items-center gap-1">
              <AlertCircle size={12} />
              {validationError}
            </p>
          )}
          <p className="text-xs text-text-muted mt-1.5 text-right">
            {observationText.length} characters
          </p>
        </div>

        {/* Place label */}
        <div className="mb-5">
          <label htmlFor="place" className="block text-sm font-medium text-graphite mb-2">
            <span className="flex items-center gap-1.5">
              <MapPin size={13} />
              Location (optional)
            </span>
          </label>
          <input
            id="place"
            type="text"
            value={placeLabel}
            onChange={(e) => setPlaceLabel(e.target.value)}
            placeholder="e.g. Brick Lane, Southwark Bridge, Peckham market"
            maxLength={200}
            className="w-full px-4 py-2.5 bg-white border border-border-subtle rounded-lg text-sm text-graphite placeholder:text-text-muted/60 focus:outline-none focus:ring-2 focus:ring-oxide/30 focus:border-oxide/40 transition-colors"
          />
        </div>

        {/* Photo attachment */}
        <div className="mb-6">
          <p className="text-sm font-medium text-graphite mb-2">Photo (optional)</p>

          {photoPreview ? (
            <div className="relative rounded-lg overflow-hidden border border-border-subtle">
              <img
                src={photoPreview}
                alt="Observation photo"
                className="w-full max-h-72 object-cover"
              />
              <button
                onClick={removePhoto}
                className="absolute top-2 right-2 bg-white/90 hover:bg-white rounded-full p-1.5 shadow-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-oxide"
                aria-label="Remove photo"
              >
                <X size={14} className="text-graphite" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full flex flex-col items-center justify-center gap-2 py-8 bg-white border border-dashed border-dust rounded-lg text-sm text-text-muted hover:border-weathered-stone hover:text-graphite transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-oxide"
            >
              <Camera size={22} strokeWidth={1.5} />
              <span>Attach a photo</span>
              <span className="text-xs text-text-muted/70">JPEG, PNG, WebP up to {MAX_FILE_SIZE_MB}MB</span>
            </button>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handleFileChange}
            className="hidden"
            aria-label="Select observation photo"
          />

          {photoError && (
            <p className="text-xs text-error-red mt-1.5 flex items-center gap-1">
              <AlertCircle size={12} />
              {photoError}
            </p>
          )}
        </div>

        {/* Privacy notice */}
        <div className="flex items-start gap-2 mb-6 p-3 bg-surface-secondary rounded-lg border border-border-subtle">
          <Lock size={13} className="text-text-muted mt-0.5 flex-shrink-0" />
          <p className="text-xs text-text-muted leading-relaxed">
            Your entry and any photo stay on this device. Nothing is uploaded automatically.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <Button
            variant="primary"
            size="lg"
            onClick={() => handleSave(true)}
            loading={saving}
            className="w-full"
          >
            Save and get AI reflection
          </Button>
          <Button
            variant="secondary"
            size="lg"
            onClick={() => handleSave(false)}
            loading={saving}
            disabled={saving}
            className="w-full"
          >
            Save to journal only
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
