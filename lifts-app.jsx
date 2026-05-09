import { useState, useMemo, useEffect } from 'react';
import { Search, X, Calendar, ExternalLink, ChevronDown } from 'lucide-react';

// ---------------------------------------------------------------------------
// MOCK DATA — replace with your manifest when wiring up real videos.
// `driveId` is the Google Drive file ID (the long string in the share URL).
// ---------------------------------------------------------------------------
const MOCK_VIDEOS = [
  { id: 'v1', driveId: 'EXAMPLE_ID_1', title: 'Snatch, PR attempt', date: '2026-05-08', lift: 'snatch', weight: 95, tags: ['pr', 'competition-prep'], notes: 'Made it from the floor, lost it overhead.' },
  { id: 'v2', driveId: 'EXAMPLE_ID_2', title: 'Clean and Jerk, working set', date: '2026-05-08', lift: 'clean_and_jerk', weight: 110, tags: ['working-set'], notes: 'Felt good. Bar drift in second pull.' },
  { id: 'v3', driveId: 'EXAMPLE_ID_3', title: 'Front Squat, heavy double', date: '2026-05-06', lift: 'front_squat', weight: 130, tags: ['heavy', 'review'], notes: 'Lost upper back position on rep 2.' },
  { id: 'v4', driveId: 'EXAMPLE_ID_4', title: 'Power Snatch from blocks', date: '2026-05-05', lift: 'power_snatch', weight: 70, tags: ['blocks', 'technique'], notes: 'Working on faster turnover.' },
  { id: 'v5', driveId: 'EXAMPLE_ID_5', title: 'Snatch, light technique', date: '2026-05-03', lift: 'snatch', weight: 60, tags: ['technique', 'light-day'], notes: 'Pause at the knee.' },
  { id: 'v6', driveId: 'EXAMPLE_ID_6', title: 'Back Squat, 5x3', date: '2026-05-01', lift: 'back_squat', weight: 145, tags: ['volume'], notes: 'All sets felt grindy.' },
  { id: 'v7', driveId: 'EXAMPLE_ID_7', title: 'Clean, single', date: '2026-04-29', lift: 'clean', weight: 115, tags: ['heavy', 'review'], notes: 'Brutal rack catch.' },
  { id: 'v8', driveId: 'EXAMPLE_ID_8', title: 'Jerk from rack', date: '2026-04-28', lift: 'jerk', weight: 100, tags: ['rack', 'technique'], notes: 'Press out on left side.' },
  { id: 'v9', driveId: 'EXAMPLE_ID_9', title: 'Snatch, opener attempt', date: '2026-04-26', lift: 'snatch', weight: 88, tags: ['competition-prep', 'opener'], notes: 'Easy speed under.' },
  { id: 'v10', driveId: 'EXAMPLE_ID_10', title: 'Front Squat, 3x5', date: '2026-04-24', lift: 'front_squat', weight: 110, tags: ['volume'], notes: 'Building base.' },
];

const LIFT_LABELS = {
  snatch: 'Snatch',
  power_snatch: 'Power Snatch',
  clean_and_jerk: 'Clean & Jerk',
  clean: 'Clean',
  power_clean: 'Power Clean',
  jerk: 'Jerk',
  front_squat: 'Front Squat',
  back_squat: 'Back Squat',
  deadlift: 'Deadlift',
};

// ---------------------------------------------------------------------------

export default function App() {
  const [search, setSearch] = useState('');
  const [selectedLifts, setSelectedLifts] = useState(new Set());
  const [selectedTags, setSelectedTags] = useState(new Set());
  const [activeVideo, setActiveVideo] = useState(null);
  const [filtersOpen, setFiltersOpen] = useState(true);

  // Inject Google Fonts on mount.
  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Big+Shoulders+Display:wght@700;800;900&family=Geist:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500;600&display=swap';
    document.head.appendChild(link);
    return () => document.head.removeChild(link);
  }, []);

  // Lock body scroll when modal is open.
  useEffect(() => {
    document.body.style.overflow = activeVideo ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [activeVideo]);

  // Build the set of all tags present in the data.
  const allTags = useMemo(() => {
    const tags = new Set();
    MOCK_VIDEOS.forEach(v => v.tags.forEach(t => tags.add(t)));
    return Array.from(tags).sort();
  }, []);

  // Build the set of all lift types present in the data.
  const allLifts = useMemo(() => {
    const lifts = new Set();
    MOCK_VIDEOS.forEach(v => lifts.add(v.lift));
    return Array.from(lifts);
  }, []);

  // Filtered, sorted view.
  const visibleVideos = useMemo(() => {
    const q = search.trim().toLowerCase();
    return MOCK_VIDEOS
      .filter(v => {
        if (selectedLifts.size > 0 && !selectedLifts.has(v.lift)) return false;
        if (selectedTags.size > 0 && !v.tags.some(t => selectedTags.has(t))) return false;
        if (q) {
          const haystack = `${v.title} ${v.notes} ${v.tags.join(' ')} ${LIFT_LABELS[v.lift] || v.lift} ${v.weight}`.toLowerCase();
          if (!haystack.includes(q)) return false;
        }
        return true;
      })
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [search, selectedLifts, selectedTags]);

  const toggle = (set, value, setter) => {
    const next = new Set(set);
    next.has(value) ? next.delete(value) : next.add(value);
    setter(next);
  };

  const clearAll = () => {
    setSearch('');
    setSelectedLifts(new Set());
    setSelectedTags(new Set());
  };

  const hasActiveFilters = search || selectedLifts.size > 0 || selectedTags.size > 0;

  return (
    <div style={styles.root}>
      <style>{globalCss}</style>

      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerInner}>
          <div>
            <div style={styles.eyebrow}>Training log</div>
            <h1 style={styles.title}>Sergio / Lifts</h1>
          </div>
          <div style={styles.headerStats}>
            <div style={styles.stat}>
              <div style={styles.statNum}>{MOCK_VIDEOS.length}</div>
              <div style={styles.statLabel}>Total</div>
            </div>
            <div style={styles.stat}>
              <div style={styles.statNum}>{visibleVideos.length}</div>
              <div style={styles.statLabel}>Showing</div>
            </div>
          </div>
        </div>
      </header>

      {/* Filter bar */}
      <section style={styles.filterBar}>
        <div style={styles.searchWrap}>
          <Search size={16} style={styles.searchIcon} />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search lift, weight, note, tag"
            style={styles.searchInput}
          />
          {search && (
            <button onClick={() => setSearch('')} style={styles.searchClear} aria-label="Clear search">
              <X size={14} />
            </button>
          )}
        </div>

        <button
          style={styles.filterToggle}
          onClick={() => setFiltersOpen(o => !o)}
          aria-expanded={filtersOpen}
        >
          Filters
          <ChevronDown size={14} style={{ transform: filtersOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
        </button>

        {hasActiveFilters && (
          <button onClick={clearAll} style={styles.clearAll}>Reset</button>
        )}
      </section>

      {filtersOpen && (
        <section style={styles.filterPanel}>
          <div style={styles.filterGroup}>
            <div style={styles.filterLabel}>Lift</div>
            <div style={styles.chipRow}>
              {allLifts.map(lift => (
                <button
                  key={lift}
                  onClick={() => toggle(selectedLifts, lift, setSelectedLifts)}
                  style={{
                    ...styles.chip,
                    ...(selectedLifts.has(lift) ? styles.chipActive : {}),
                  }}
                >
                  {LIFT_LABELS[lift] || lift}
                </button>
              ))}
            </div>
          </div>

          <div style={styles.filterGroup}>
            <div style={styles.filterLabel}>Tag</div>
            <div style={styles.chipRow}>
              {allTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => toggle(selectedTags, tag, setSelectedTags)}
                  style={{
                    ...styles.chip,
                    ...(selectedTags.has(tag) ? styles.chipActive : {}),
                  }}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Video grid */}
      <main style={styles.main}>
        {visibleVideos.length === 0 ? (
          <div style={styles.empty}>
            <div style={styles.emptyTitle}>No lifts match.</div>
            <div style={styles.emptySub}>Try clearing a filter or different search term.</div>
            {hasActiveFilters && (
              <button onClick={clearAll} style={styles.emptyBtn}>Reset filters</button>
            )}
          </div>
        ) : (
          <div style={styles.grid}>
            {visibleVideos.map(v => (
              <VideoCard key={v.id} video={v} onClick={() => setActiveVideo(v)} />
            ))}
          </div>
        )}
      </main>

      <footer style={styles.footer}>
        <span style={styles.footerText}>Lifts manifest, Drive embedded.</span>
      </footer>

      {/* Modal */}
      {activeVideo && (
        <VideoModal video={activeVideo} onClose={() => setActiveVideo(null)} />
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------

function VideoCard({ video, onClick }) {
  const date = new Date(video.date);
  const dateStr = date.toLocaleDateString('en-AU', { day: '2-digit', month: 'short', year: '2-digit' });
  return (
    <button onClick={onClick} style={styles.card} className="lift-card">
      <div style={styles.cardTop}>
        <div style={styles.cardLift}>{LIFT_LABELS[video.lift] || video.lift}</div>
        <div style={styles.cardDate}>{dateStr}</div>
      </div>
      <div style={styles.cardWeight}>
        <span style={styles.cardWeightNum}>{video.weight}</span>
        <span style={styles.cardWeightUnit}>kg</span>
      </div>
      <div style={styles.cardTitle}>{video.title}</div>
      {video.notes && <div style={styles.cardNotes}>{video.notes}</div>}
      <div style={styles.cardTags}>
        {video.tags.map(t => (
          <span key={t} style={styles.cardTag}>{t}</span>
        ))}
      </div>
    </button>
  );
}

// ---------------------------------------------------------------------------

function VideoModal({ video, onClose }) {
  // Close on Esc.
  useEffect(() => {
    const handler = e => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const date = new Date(video.date);
  const dateStr = date.toLocaleDateString('en-AU', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' });

  return (
    <div style={styles.modalBackdrop} onClick={onClose}>
      <div style={styles.modal} onClick={e => e.stopPropagation()}>
        <button onClick={onClose} style={styles.modalClose} aria-label="Close">
          <X size={18} />
        </button>

        <div style={styles.modalHeader}>
          <div style={styles.modalLift}>{LIFT_LABELS[video.lift] || video.lift}</div>
          <div style={styles.modalWeight}>
            <span style={styles.modalWeightNum}>{video.weight}</span>
            <span style={styles.modalWeightUnit}>kg</span>
          </div>
          <h2 style={styles.modalTitle}>{video.title}</h2>
          <div style={styles.modalDate}>
            <Calendar size={13} style={{ marginRight: 6, opacity: 0.6 }} />
            {dateStr}
          </div>
        </div>

        <div style={styles.modalVideoWrap}>
          <iframe
            src={`https://drive.google.com/file/d/${video.driveId}/preview`}
            style={styles.modalVideo}
            allow="autoplay; fullscreen"
            allowFullScreen
            title={video.title}
          />
          <div style={styles.modalVideoNote}>
            Mock embed. Real videos load when you replace the manifest with valid Drive file IDs and the files are shared with link access.
          </div>
        </div>

        {video.notes && (
          <div style={styles.modalNotes}>
            <div style={styles.modalNotesLabel}>Notes</div>
            <div style={styles.modalNotesBody}>{video.notes}</div>
          </div>
        )}

        <div style={styles.modalTags}>
          {video.tags.map(t => (
            <span key={t} style={styles.modalTag}># {t}</span>
          ))}
        </div>

        <a
          href={`https://drive.google.com/file/d/${video.driveId}/view`}
          target="_blank"
          rel="noreferrer"
          style={styles.modalDriveLink}
        >
          Open in Drive
          <ExternalLink size={13} />
        </a>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------
const COLORS = {
  bg: '#0A0908',
  surface: '#141210',
  surfaceLift: '#1B1815',
  border: '#2A2622',
  borderStrong: '#3A332D',
  text: '#F0E9DC',
  textDim: '#9A938A',
  textMute: '#6B6660',
  accent: '#E94E1B',
  accentDim: '#7A2A0E',
};

const FONTS = {
  display: '"Big Shoulders Display", Impact, sans-serif',
  body: '"Geist", -apple-system, sans-serif',
  mono: '"JetBrains Mono", ui-monospace, monospace',
};

const globalCss = `
  * { box-sizing: border-box; }
  body { margin: 0; }
  .lift-card { transition: border-color 0.15s ease, transform 0.15s ease, background 0.15s ease; }
  .lift-card:hover { border-color: ${COLORS.borderStrong}; background: ${COLORS.surfaceLift}; }
  .lift-card:active { transform: scale(0.99); }
  ::-webkit-scrollbar { width: 8px; height: 8px; }
  ::-webkit-scrollbar-track { background: ${COLORS.bg}; }
  ::-webkit-scrollbar-thumb { background: ${COLORS.border}; border-radius: 4px; }
  ::-webkit-scrollbar-thumb:hover { background: ${COLORS.borderStrong}; }
  input::placeholder { color: ${COLORS.textMute}; }
  input:focus { outline: none; }
`;

const styles = {
  root: {
    minHeight: '100vh',
    background: COLORS.bg,
    color: COLORS.text,
    fontFamily: FONTS.body,
    fontSize: 14,
    lineHeight: 1.5,
    paddingBottom: 80,
  },
  header: {
    borderBottom: `1px solid ${COLORS.border}`,
    padding: '32px 24px 24px',
  },
  headerInner: {
    maxWidth: 1200,
    margin: '0 auto',
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: 24,
    flexWrap: 'wrap',
  },
  eyebrow: {
    fontFamily: FONTS.mono,
    fontSize: 11,
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    color: COLORS.accent,
    marginBottom: 8,
  },
  title: {
    fontFamily: FONTS.display,
    fontWeight: 800,
    fontSize: 'clamp(40px, 7vw, 72px)',
    lineHeight: 0.9,
    margin: 0,
    letterSpacing: '-0.02em',
  },
  headerStats: {
    display: 'flex',
    gap: 32,
  },
  stat: {
    textAlign: 'right',
  },
  statNum: {
    fontFamily: FONTS.mono,
    fontSize: 28,
    fontWeight: 500,
    color: COLORS.text,
    lineHeight: 1,
  },
  statLabel: {
    fontFamily: FONTS.mono,
    fontSize: 10,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    color: COLORS.textMute,
    marginTop: 6,
  },
  filterBar: {
    maxWidth: 1200,
    margin: '0 auto',
    padding: '20px 24px 12px',
    display: 'flex',
    gap: 12,
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  searchWrap: {
    position: 'relative',
    flex: '1 1 280px',
    maxWidth: 480,
  },
  searchIcon: {
    position: 'absolute',
    left: 12,
    top: '50%',
    transform: 'translateY(-50%)',
    color: COLORS.textMute,
    pointerEvents: 'none',
  },
  searchInput: {
    width: '100%',
    padding: '11px 36px 11px 36px',
    background: COLORS.surface,
    border: `1px solid ${COLORS.border}`,
    borderRadius: 6,
    color: COLORS.text,
    fontFamily: FONTS.body,
    fontSize: 13,
  },
  searchClear: {
    position: 'absolute',
    right: 8,
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    color: COLORS.textDim,
    cursor: 'pointer',
    padding: 4,
    display: 'flex',
  },
  filterToggle: {
    background: COLORS.surface,
    border: `1px solid ${COLORS.border}`,
    color: COLORS.text,
    padding: '10px 14px',
    borderRadius: 6,
    fontFamily: FONTS.body,
    fontSize: 13,
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
  },
  clearAll: {
    background: 'none',
    border: 'none',
    color: COLORS.accent,
    fontFamily: FONTS.mono,
    fontSize: 11,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    cursor: 'pointer',
    padding: '10px 4px',
  },
  filterPanel: {
    maxWidth: 1200,
    margin: '0 auto',
    padding: '4px 24px 16px',
  },
  filterGroup: {
    marginBottom: 16,
  },
  filterLabel: {
    fontFamily: FONTS.mono,
    fontSize: 10,
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    color: COLORS.textMute,
    marginBottom: 8,
  },
  chipRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 6,
  },
  chip: {
    background: 'transparent',
    border: `1px solid ${COLORS.border}`,
    color: COLORS.textDim,
    padding: '6px 12px',
    borderRadius: 999,
    fontFamily: FONTS.body,
    fontSize: 12,
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  },
  chipActive: {
    background: COLORS.accent,
    borderColor: COLORS.accent,
    color: '#fff',
  },
  main: {
    maxWidth: 1200,
    margin: '0 auto',
    padding: '20px 24px 0',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: 14,
  },
  card: {
    textAlign: 'left',
    background: COLORS.surface,
    border: `1px solid ${COLORS.border}`,
    borderRadius: 8,
    padding: 18,
    cursor: 'pointer',
    color: COLORS.text,
    fontFamily: FONTS.body,
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
  cardTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardLift: {
    fontFamily: FONTS.mono,
    fontSize: 10,
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    color: COLORS.accent,
  },
  cardDate: {
    fontFamily: FONTS.mono,
    fontSize: 11,
    color: COLORS.textMute,
  },
  cardWeight: {
    display: 'flex',
    alignItems: 'baseline',
    gap: 4,
    margin: '4px 0',
  },
  cardWeightNum: {
    fontFamily: FONTS.display,
    fontWeight: 800,
    fontSize: 56,
    lineHeight: 0.9,
    letterSpacing: '-0.02em',
    color: COLORS.text,
  },
  cardWeightUnit: {
    fontFamily: FONTS.mono,
    fontSize: 14,
    color: COLORS.textDim,
    marginLeft: 2,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: 500,
    color: COLORS.text,
  },
  cardNotes: {
    fontSize: 12,
    color: COLORS.textDim,
    lineHeight: 1.5,
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },
  cardTags: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 4,
    marginTop: 4,
  },
  cardTag: {
    fontFamily: FONTS.mono,
    fontSize: 10,
    color: COLORS.textMute,
    padding: '3px 8px',
    border: `1px solid ${COLORS.border}`,
    borderRadius: 4,
  },
  empty: {
    textAlign: 'center',
    padding: '80px 24px',
  },
  emptyTitle: {
    fontFamily: FONTS.display,
    fontSize: 32,
    fontWeight: 700,
    marginBottom: 8,
  },
  emptySub: {
    color: COLORS.textDim,
    marginBottom: 20,
  },
  emptyBtn: {
    background: COLORS.accent,
    color: '#fff',
    border: 'none',
    padding: '10px 18px',
    borderRadius: 6,
    fontFamily: FONTS.body,
    fontSize: 13,
    cursor: 'pointer',
  },
  footer: {
    maxWidth: 1200,
    margin: '60px auto 0',
    padding: '20px 24px',
    borderTop: `1px solid ${COLORS.border}`,
  },
  footerText: {
    fontFamily: FONTS.mono,
    fontSize: 10,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    color: COLORS.textMute,
  },
  // Modal
  modalBackdrop: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0, 0, 0, 0.85)',
    backdropFilter: 'blur(4px)',
    zIndex: 100,
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'center',
    overflowY: 'auto',
    padding: '24px 16px',
  },
  modal: {
    position: 'relative',
    width: '100%',
    maxWidth: 880,
    background: COLORS.surface,
    border: `1px solid ${COLORS.border}`,
    borderRadius: 10,
    padding: 32,
    margin: 'auto',
  },
  modalClose: {
    position: 'absolute',
    top: 16,
    right: 16,
    background: COLORS.surfaceLift,
    border: `1px solid ${COLORS.border}`,
    color: COLORS.text,
    width: 36,
    height: 36,
    borderRadius: 6,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalHeader: {
    marginBottom: 20,
    paddingRight: 40,
  },
  modalLift: {
    fontFamily: FONTS.mono,
    fontSize: 11,
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    color: COLORS.accent,
    marginBottom: 12,
  },
  modalWeight: {
    display: 'flex',
    alignItems: 'baseline',
    gap: 6,
    marginBottom: 8,
  },
  modalWeightNum: {
    fontFamily: FONTS.display,
    fontWeight: 800,
    fontSize: 'clamp(56px, 10vw, 96px)',
    lineHeight: 0.9,
    letterSpacing: '-0.03em',
    color: COLORS.text,
  },
  modalWeightUnit: {
    fontFamily: FONTS.mono,
    fontSize: 18,
    color: COLORS.textDim,
  },
  modalTitle: {
    fontFamily: FONTS.body,
    fontSize: 18,
    fontWeight: 500,
    margin: '4px 0 8px',
    color: COLORS.text,
  },
  modalDate: {
    fontFamily: FONTS.mono,
    fontSize: 12,
    color: COLORS.textDim,
    display: 'inline-flex',
    alignItems: 'center',
  },
  modalVideoWrap: {
    background: '#000',
    border: `1px solid ${COLORS.border}`,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 20,
    position: 'relative',
  },
  modalVideo: {
    width: '100%',
    aspectRatio: '16 / 9',
    border: 'none',
    display: 'block',
  },
  modalVideoNote: {
    background: COLORS.surfaceLift,
    fontFamily: FONTS.mono,
    fontSize: 10,
    color: COLORS.textMute,
    padding: '8px 12px',
    textAlign: 'center',
    borderTop: `1px solid ${COLORS.border}`,
  },
  modalNotes: {
    background: COLORS.surfaceLift,
    border: `1px solid ${COLORS.border}`,
    borderRadius: 6,
    padding: 14,
    marginBottom: 16,
  },
  modalNotesLabel: {
    fontFamily: FONTS.mono,
    fontSize: 10,
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    color: COLORS.textMute,
    marginBottom: 6,
  },
  modalNotesBody: {
    fontSize: 14,
    color: COLORS.text,
    lineHeight: 1.6,
  },
  modalTags: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 16,
  },
  modalTag: {
    fontFamily: FONTS.mono,
    fontSize: 11,
    color: COLORS.textDim,
    padding: '4px 10px',
    border: `1px solid ${COLORS.border}`,
    borderRadius: 4,
  },
  modalDriveLink: {
    fontFamily: FONTS.mono,
    fontSize: 11,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: COLORS.accent,
    textDecoration: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
  },
};
