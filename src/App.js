// Checklist App — React frontend with category subheaders
// Updated to include main title and grouped checklist sections based on categories

import React, { useEffect, useState, useRef } from 'react';

const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbw57uP2-hyL04_unkW08C0iTWcuRZuEJSfYjTZ_CkV2HRr4jWNPMoZpylyLIkxYLwxA/exec';
const GOOGLE_CLIENT_ID = '1056545204241-pffogljid1dafv23tpbmql76k27ob80f.apps.googleusercontent.com';

const THEME = {
  primary: '#0057B7',
  accent: '#F2A900',
  background: '#F8FAFF',
  card: '#FFFFFF',
};

// Grouped checklist with subheaders per category
const CHECKLIST_SECTIONS = [
  {
    category: 'ADMINISTRATIVE',
    questions: [
      { id: 'q1', text: 'Is the workplace inspected on a daily, weekly, and monthly basis?' },
      { id: 'q2', text: 'Is safety discussed in program and staff meetings/general assemblies?' },
      { id: 'q3', text: 'Is fundamental safety and emergency protocols taught to all health workers and personnel?' },
      { id: 'q4', text: 'Are all evacuation maps and emergency protocols clearly visible at all entrances and exits?' }
    ]
  },
  {
    category: 'PERSONAL PROTECTIVE EQUIPMENT',
    questions: [
      { id: 'q5', text: 'Are workers wearing the appropriate PPE for the area and the activity being done?' },
      { id: 'q6', text: 'Is there enough PPE on site for all job types?' },
      { id: 'q7', text: 'Are all personnel trained in the proper use of all PPE as required by their occupation?' },
      { id: 'q8', text: 'Is signage displayed in areas where PPE is required?' }
    ]
  },
  {
    category: 'WALKING/WORKING SURFACES',
    questions: [
      { id: 'q9', text: 'Are the work spaces and restroom flooring free of slippery hazards?' },
      { id: 'q10', text: 'Are aisles and passageways kept clear and free of tripping hazards?' },
      { id: 'q11', text: 'Are stairwells and corridors free of any obstructions?' }
    ]
  },
  {
    category: 'MEANS OF EGRESS, DOORS, FIRE PROTECTION',
    questions: [
      { id: 'q12', text: 'Is there a sufficient number of exits in the workplace?' },
      { id: 'q13', text: 'Are all egress doors clear, marked, and functional?' },
      { id: 'q14', text: 'Do all exits provide free and unobstructed egress from all parts of the building?' },
      { id: 'q15', text: 'Are all doorways and hallways unobstructed?' },
      { id: 'q16', text: 'Are all exit signs provided with artificial illumination?' }
    ]
  },
  {
    category: 'HOUSEKEEPING',
    questions: [
      { id: 'q17', text: 'Are work areas and restrooms routinely cleaned?' },
      { id: 'q18', text: 'Is the work area neat and organized?' },
      { id: 'q19', text: 'Are garbage bins available in the workplace?' },
      { id: 'q20', text: 'Is garbage collected on a regular basis?' }
    ]
  },
  {
    category: 'MATERIAL/EQUIPMENT HANDLING AND STORAGE',
    questions: [
      { id: 'q21', text: 'Are materials/equipment stored  in a stable and secure manner?' },
      { id: 'q22', text: 'Are all equipment in the area in full functional condition?' },
      { id: 'q23', text: 'Are all storage areas organized and labelled?' },
      { id: 'q24', text: 'Are tools safely secured and stored when not in use?' },
      { id: 'q25', text: 'Are storage areas kept free of tripping, fire, explosion hazards, or pest harborage?' },
      { id: 'q26', text: 'Are flamable liquids and gases being stored properly in approved containers and/or storage cabinets?' },
      { id: 'q27', text: 'Are containers properly labeled (identity and hazard warning)?' },
      { id: 'q28', text: 'Are all equipment requiring PMS being implemented?' }
    ]
  },
  {
    category: 'FIRE PROTECTION',
    questions: [
      { id: 'q29', text: 'Are all portable fire extinguishers fully charged and ready to use?' },
      { id: 'q30', text: 'Are the fire extinguishers clearly visible with a wall-mounted sign?' },
      { id: 'q31', text: 'Are the fire extinguishers wall mounted and easily accessible?' },
      { id: 'q32', text: 'Are fire extinguishers inspected monthly?' },
      { id: 'q33', text: 'Are inspection tags current with initial and date of inspection?' },
      { id: 'q34', text: 'Are all staff members knowledgeable in fire extinguisher use?' },
      { id: 'q35', text: 'Are all employees aware of where the fire extinguishers are located in the workplace?' },
      { id: 'q36', text: 'Flamable materials such as cardboard and paper are stored away from fire hazards?' }
    ]
  },
  {
    category: 'ELECTRICAL',
    questions: [
      { id: 'q37', text: 'Are extension cords used without splicing or tapping?' },
      { id: 'q38', text: 'Is there NO extension cord connected to another extension cord?' },
      { id: 'q39', text: 'Are all male electrical plugs and cords in good condition?' },
      { id: 'q40', text: 'Is there no sign of tripping in the circuit breaker of the work area?' },
      { id: 'q41', text: 'Are electrical switches, switch plates, or receptacles free of cracks, breaks, burns or exposed contacts?' },
      { id: 'q42', text: 'Are there no exposed wiring observed?' },
      { id: 'q43', text: 'Are light-switches and circuit breakers in working condition, properly identified, and labeled?' }
    ]
  },
  {
    category: 'SECURITY',
    questions: [
      { id: 'q44', text: 'Are all entry ways secured from unauthorized access?' },
      { id: 'q45', text: 'Are keys labelled and kept for all lockable doors?' },
      { id: 'q46', text: 'Are surveillance video cameras in working order?' }
      ]
    },

  {
    category: 'GENERAL',
    questions: [
      { id: 'q47', text: 'Is the building or structure free from any obvious structural flaws that could endanger personnel or jeopardize structural integrity?' },
      { id: 'q48', text: 'Is adequate lighting provided in all work areas?' },
      { id: 'q49', text: 'Are water dispensers clean and in working order?' },
      { id: 'q50', text: 'Is the workplace free from leaks and other plumbing issues?' }
      ]
    },
  
    {
    category: 'UNSAFE BEHAVIOUR',
    questions: [
      { id: 'q51', text: 'Are workers taking the necessary safety precautions for the work being performed?' },
      { id: 'q52', text: 'Is work being done in such a way that other workers in the vicinity are not exposed to occupational health hazards or dangerous working conditions?' },
      { id: 'q53', text: 'No other unsafe behavior/act observed at the time of the inspection?' }
      ]
    },

    {
    category: 'REVIEW PRIOR CORRECTION',
    questions: [
      { id: 'q54', text: 'Have all issues raised in the last facility inspection summary been addressed and documented?' },
      { id: 'q55', text: 'Are all adjustments to previously recognized isuues still effective and do not reoccur?' }
      ]
    }
];

export default function ChecklistApp() {
  const [user, setUser] = useState(null);

  // Metadata fields (pre-checklist) — ADDED as requested
  const [meta, setMeta] = useState({
    buildingName: '',
    roomName: '',
    division: '',
    date: new Date().toISOString().slice(0, 10),
    inspector: '',
    otherRemarks: '' 
  });

  const [answers, setAnswers] = useState(() => {
    const init = {};
    CHECKLIST_SECTIONS.forEach(sec => sec.questions.forEach(q => (init[q.id] = { answer: 'N/A', remark: '' })));
    return init;
  });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);

  // Create refs for each section to enable scrolling
  const sectionRefs = {};
  CHECKLIST_SECTIONS.forEach(sec => { sectionRefs[sec.category] = React.createRef(); });

  // Summary state computed from answers
  const [summary, setSummary] = useState(() => {
    const s = {};
    CHECKLIST_SECTIONS.forEach(sec => {
      s[sec.category] = { Yes: 0, No: 0, 'N/A': 0, total: sec.questions.length };
    });
    return s;
  });

  // Recompute summary when answers change
  useEffect(() => {
    const s = {};
    CHECKLIST_SECTIONS.forEach(sec => {
      const counts = { Yes: 0, No: 0, 'N/A': 0 };
      sec.questions.forEach(q => {
        const val = answers[q.id] ? answers[q.id].answer : 'N/A';
        counts[val] = (counts[val] || 0) + 1;
      });
      s[sec.category] = { ...counts, total: sec.questions.length };
    });
    setSummary(s);
  }, [answers]);

  // auto-hide success messages after 4 seconds
  useEffect(() => {
    if (!message) return;
    if (message.type === 'success' || message.type === 'error') {
      const t = setTimeout(() => setMessage(null), 3000);
      return () => clearTimeout(t);
    }
  }, [message]);


  // Scroll helper
  function scrollToCategory(cat) {
    const ref = sectionRefs[cat];
    if (ref && ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  // Toggle summary panel visibility
  const [showSummary, setShowSummary] = useState(true);

  // Metadata handlers
  function handleMetaChange(field, value) {
    setMeta(prev => ({ ...prev, [field]: value }));
  }

  function resetAll() {
    setAnswers(Object.fromEntries(Object.keys(answers).map(k => [k, { answer: 'N/A', remark: '' }])));
    setMeta({ buildingName: '', roomName: '', division: '', date: new Date().toISOString().slice(0,10), inspector: '', otherRemarks: '' });
  }

// -------- Google Identity Services (GSI) setup --------
const gsiLoadedRef = useRef(false);

useEffect(() => {
  // Load GSI script once
  if (document.getElementById('google-identity')) return;
  const s = document.createElement('script');
  s.src = 'https://accounts.google.com/gsi/client';
  s.id = 'google-identity';
  s.async = true;
  s.defer = true;
  s.onload = () => {
    gsiLoadedRef.current = true;
    if (window.google && window.google.accounts) {
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleCredentialResponse,
      });
      // Render button into div#google-signin if present
      const container = document.getElementById('google-signin');
      if (container) {
        window.google.accounts.id.renderButton(container, { theme: 'outline', size: 'large' });
      }
    }
  };
  document.head.appendChild(s);
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, []);

function parseJwt(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (e) {
    return {};
  }
}

function handleCredentialResponse(response) {
  // response.credential is the ID token string
  const id_token = response.credential;
  const payload = parseJwt(id_token);
  setUser({ name: payload.name || payload.email, email: payload.email, id_token });
}

function signOut() {
  setUser(null);
  if (window.google && window.google.accounts && window.google.accounts.id) {
    window.google.accounts.id.disableAutoSelect();
  }
}

// -------- Submit handler (sends metadata + answers to Apps Script) --------
/* async function handleSubmit() {
  // basic validation
  if (!user || !user.id_token) {
    setMessage({ type: 'error', text: 'Please sign in with Google before submitting.' });
    return;
  }

  setSubmitting(true);
  setMessage(null);

  // Convert answers object into array [{ qid, answer, remark }, ...] keeping question order
  const answersArray = [];
  CHECKLIST_SECTIONS.forEach(sec => {
    sec.questions.forEach(q => {
      const a = answers[q.id] || { answer: 'N/A', remark: '' };
      answersArray.push({ qid: q.id, answer: a.answer || 'N/A', remark: a.remark || '' });
    });
  });

  const payload = {
    meta, // buildingName, roomName, division, date, inspector
    answers: answersArray,
    userName: user.name,
    userEmail: user.email
  };

  try {
    // const res = await fetch(APPS_SCRIPT_URL, {
    //  method: 'POST',
    //  headers: { 'Content-Type': 'application/json' },
    //  body: JSON.stringify({ id_token: user.id_token, data: payload }),
    //});

    // REPLACE WITH this:
    const bodyString = JSON.stringify({ id_token: user.id_token, data: payload });

    const res = await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      // use a simple content-type so browser won't send a preflight OPTIONS
      headers: { 'Content-Type': 'text/plain' },
      body: bodyString,
    });

    const json = await res.json();
    if (res.ok && json.success) {
      setMessage({ type: 'success', text: 'Submission saved to Google Sheet.' });
      // optionally reset form after submit:
      // resetAll();
    } else {
      setMessage({ type: 'error', text: json.error || 'Submission failed' });
    }
  } catch (err) {
    setMessage({ type: 'error', text: err.message || 'Network error' });
  } finally {
    setSubmitting(false);
  }
} */

  async function handleSubmit() {
  // ensure user is signed in and we have an id_token
  if (!user || !user.id_token) {
    setMessage({ type: 'error', text: 'Please sign in with Google before submitting.' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }

  setSubmitting(true);
  setMessage(null);

  // Build answers array in the same order as CHECKLIST_SECTIONS
  const answersArray = [];
  CHECKLIST_SECTIONS.forEach(sec => {
    sec.questions.forEach(q => {
      const a = answers[q.id] || { answer: 'N/A', remark: '' };
      answersArray.push({ qid: q.id, answer: a.answer || 'N/A', remark: a.remark || '' });
    });
  });

  const payload = {
    meta, // buildingName, roomName, division, date, inspector
    answers: answersArray,
    userName: user.name || '',
    userEmail: user.email || ''
  };

  try {
    const bodyString = JSON.stringify({ id_token: user.id_token, data: payload });

    // use text/plain to avoid CORS preflight (your app already used this approach earlier)
    const res = await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: bodyString,
    });

    const json = await res.json();

    if (res.ok && json && json.success) {
      // show success message and clear the form
      setMessage({ type: 'success', text: 'Submission saved to Google Sheet.' });

      // clear all inputs (metadata + answers)
      resetAll();

      // optionally scroll to top / show summary etc.
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setMessage({ type: 'error', text: (json && json.error) ? json.error : 'Submission failed' });
    }
  } catch (err) {
    setMessage({ type: 'error', text: err.message || 'Network error' });
  } finally {
    setSubmitting(false);
  }
}


  return (
    <div style={{ background: THEME.background, minHeight: '100vh', padding: 20 }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 320px', gap: 20 }}>
        <div>
          <h1 style={{ color: THEME.primary, textAlign: 'center', marginBottom: 20 }}>WORKPLACE INSPECTION CHECKLIST</h1>
            {/* Message / Toast */}
              {message && (
                <div style={{
                  margin: '8px 0 16px',
                  padding: '10px 12px',
                  borderRadius: 8,
                  maxWidth: 700,
                  marginLeft: 'auto',
                  marginRight: 'auto',
                  textAlign: 'center',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                  background: message.type === 'success' ? '#e6ffed' : '#fff1f0',
                  color: message.type === 'success' ? '#0b6b2f' : '#8b1f1f',
                  border: message.type === 'success' ? '1px solid #b7f2c9' : '1px solid #f5c6cb'
                }}>
                  {message.text}
                </div>
              )}
          <div id="google-signin" style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}></div>
          {user && (
            <div style={{ textAlign: 'center', marginBottom: 8 }}>
              Signed in as <strong>{user.name}</strong> ({user.email}) — <button onClick={signOut} style={{ marginLeft: 8 }}>Sign out</button>
            </div>
          )}


          {/* Metadata entry card (added) */}
          <div style={{ background: THEME.card, borderRadius: 12, padding: 14, marginBottom: 18, boxShadow: '0 2px 6px rgba(0,0,0,0.06)' }}>
            <div style={{ fontWeight: 700, marginBottom: 8 }}>Inspection details</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div>
                <label style={{ fontSize: 13, display: 'block', marginBottom: 6 }}>Building Name</label>
                <input type="text" value={meta.buildingName} onChange={(e) => handleMetaChange('buildingName', e.target.value)} style={{ width: '100%', padding: 8, borderRadius: 8 }} />
              </div>

              <div>
                <label style={{ fontSize: 13, display: 'block', marginBottom: 6 }}>Room Name</label>
                <input type="text" value={meta.roomName} onChange={(e) => handleMetaChange('roomName', e.target.value)} style={{ width: '100%', padding: 8, borderRadius: 8 }} />
              </div>

              <div>
                <label style={{ fontSize: 13, display: 'block', marginBottom: 6 }}>Division / Section / Unit</label>
                <input type="text" value={meta.division} onChange={(e) => handleMetaChange('division', e.target.value)} style={{ width: '100%', padding: 8, borderRadius: 8 }} />
              </div>

              <div>
                <label style={{ fontSize: 13, display: 'block', marginBottom: 6 }}>Date</label>
                <input type="date" value={meta.date} onChange={(e) => handleMetaChange('date', e.target.value)} style={{ width: '100%', padding: 8, borderRadius: 8 }} />
              </div>

              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ fontSize: 13, display: 'block', marginBottom: 6 }}>Inspector</label>
                <input type="text" value={meta.inspector} onChange={(e) => handleMetaChange('inspector', e.target.value)} style={{ width: '100%', padding: 8, borderRadius: 8 }} />
              </div>
            </div>
          </div>

          {CHECKLIST_SECTIONS.map(section => (
            <div key={section.category} ref={sectionRefs[section.category]} style={{ marginBottom: 24 }}>
              <h2 style={{ color: THEME.accent, borderBottom: `3px solid ${THEME.accent}`, paddingBottom: 4 }}>{section.category}</h2>
              {section.questions.map(q => (
                <div key={q.id} style={{ background: THEME.card, borderRadius: 10, padding: 12, marginTop: 10, boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
                  <div style={{ fontWeight: 600, marginBottom: 6 }}>{q.text}</div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    {['Yes', 'No', 'N/A'].map(val => (
                      <label key={val} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                        <input type="radio" name={q.id} checked={answers[q.id].answer === val} onChange={() => setAnswers(prev => ({ ...prev, [q.id]: { ...prev[q.id], answer: val } }))} /> {val}
                      </label>
                    ))}
                  </div>
                  <textarea placeholder="Remarks" value={answers[q.id].remark} onChange={(e) => setAnswers(prev => ({ ...prev, [q.id]: { ...prev[q.id], remark: e.target.value } }))} style={{ width: '100%', marginTop: 8, borderRadius: 8, padding: 8 }} />
                </div>
              ))}
            </div>
          ))}

          {/* Other Comments / Remarks */}
          <div
            style={{
              background: THEME.card,
              borderRadius: 10,
              padding: 12,
              marginTop: 20,
              marginBottom: 20,
              boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
            }}
          >
            <label
              htmlFor="otherRemarks"
              style={{ fontWeight: 700, display: 'block', marginBottom: 6 }}
            >
              Other Comments / Remarks
            </label>
            <textarea
              id="otherRemarks"
              placeholder="Add any additional notes or observations here..."
              value={meta.otherRemarks}
              onChange={(e) => handleMetaChange('otherRemarks', e.target.value)}
              style={{ width: '100%', minHeight: 80, borderRadius: 8, padding: 8 }}
            />
          </div>


          {/* Submit area */}
          <div style={{ display: 'flex', gap: 10, marginTop: 6 }}>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!user || !user.id_token || submitting}
              style={{ padding: '10px 14px', borderRadius: 10, border: 'none', cursor: (!user || !user.id_token || submitting) ? 'not-allowed' : 'pointer', 
                  background: (!user || !user.id_token || submitting) ? '#c5d0e6' : THEME.primary, color: '#fff', opacity: (!user || !user.id_token || submitting) ? 0.7 : 1, transition: 'background 0.3s ease', }}
            >
              {submitting ? 'Submitting...' : (!user || !user.id_token) ? 'Sign in to Submit' : 'Submit'}
            </button>

            <button type="button" onClick={resetAll} style={{ padding: '10px 14px', borderRadius: 10, border: '1px solid #ddd', background: THEME.card }}>Reset</button>
          </div>
        </div>

        {/* Summary panel */}
        <aside style={{ position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <h3 style={{ margin: 0 }}>Summary</h3>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => setShowSummary(s => !s)} style={{ padding: '6px 10px', borderRadius: 8, border: 'none', cursor: 'pointer' }}>{showSummary ? 'Hide' : 'Show'}</button>
              <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} style={{ padding: '6px 10px', borderRadius: 8, border: '1px solid #ddd', background: THEME.card }}>Top</button>
            </div>
          </div>

          {showSummary && (
            <div style={{ background: THEME.card, borderRadius: 10, padding: 12, height: '70vh', overflowY: 'auto', boxShadow: '0 2px 6px rgba(0,0,0,0.06)' }}>
              <div style={{ fontSize: 13, marginBottom: 10, color: '#444' }}>Click a category to jump to it. Counts update live as you answer.</div>

              {Object.keys(summary).map(cat => (
                <div key={cat} style={{ padding: '8px 6px', borderBottom: '1px solid #f0f0f0', cursor: 'pointer' }} onClick={() => scrollToCategory(cat)}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontWeight: 700 }}>{cat}</div>
                    <div style={{ fontSize: 12, color: '#666' }}>{summary[cat].Yes} / {summary[cat].total} Yes</div>
                  </div>
                  <div style={{ display: 'flex', gap: 8, marginTop: 6, fontSize: 13 }}>
                    <div>Yes: {summary[cat].Yes}</div>
                    <div>No: {summary[cat].No}</div>
                    <div>N/A: {summary[cat]['N/A']}</div>
                  </div>
                </div>
              ))}

              <div style={{ marginTop: 12, paddingTop: 8, borderTop: '1px dashed #eee' }}>
                <div style={{ fontWeight: 700 }}>Overall</div>
                <div style={{ marginTop: 6 }}>
                  {(() => {
                    let tYes = 0, tNo = 0, tNA = 0, tTotal = 0;
                    Object.values(summary).forEach(s => { tYes += s.Yes; tNo += s.No; tNA += s['N/A']; tTotal += s.total; });
                    return (
                      <div style={{ fontSize: 13 }}>
                        Total questions: {tTotal} · Yes: {tYes} · No: {tNo} · N/A: {tNA}
                      </div>
                    );
                  })()}
                </div>
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
