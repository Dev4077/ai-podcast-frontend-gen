import React, { useMemo, useState } from 'react';
const API_BASE = "https://ai-podcast-backend-gen.onrender.com";

function Label({ htmlFor, children }) {
    return (
        <label htmlFor={htmlFor} className="form-label">
            {children}
        </label>
    );
}

function Field({ children, className = '' }) {
    return <div className={`form-field ${className}`}>{children}</div>;
}

export default function App() {
    const [topic, setTopic] = useState('');
    const [host, setHost] = useState('');
    const [guestsText, setGuestsText] = useState('');
    const [info, setInfo] = useState('');
    const [hostGender, setHostGender] = useState('female');
    const [guestGender, setGuestGender] = useState('male');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [result, setResult] = useState(null);

    const guestsArray = useMemo(() => {
        return guestsText
            .split(',')
            .map((g) => g.trim())
            .filter((g) => g.length > 0);
    }, [guestsText]);


    async function handleSubmit(e) {
        e.preventDefault();
        setError('');
        setResult(null);
        setLoading(true);
        try {
            const resp = await fetch(`https://ai-podcast-backend-gen.onrender.com/api/generate-podcast`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ topic, host, guestname: guestsArray, info, hostGender, guestGender })
            });
            if (!resp.ok) {
                const data = await resp.json().catch(() => ({}));
                throw new Error(data.error || `Request failed with ${resp.status}`);
            }
            const data = await resp.json();
            setResult(data);
        } catch (err) {
            setError(err.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="app-container">
            <header className="app-header">
                <h1 className="app-title">AI Podcast Generator</h1>
                <p className="app-subtitle">
                    Enter details below and generate a script and audio in one click.
                </p>
            </header>

            <form onSubmit={handleSubmit} className="podcast-form">
                <div className="form-grid">
                    <Field>
                        <Label htmlFor="topic">Topic</Label>
                        <input
                            id="topic"
                            type="text"
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            placeholder="e.g., The future of AI in healthcare"
                            required
                            className="form-input"
                        />
                    </Field>

                    <Field>
                        <Label htmlFor="host">Host Name</Label>
                        <input
                            id="host"
                            type="text"
                            value={host}
                            onChange={(e) => setHost(e.target.value)}
                            placeholder="e.g., Alex Rivera"
                            required
                            className="form-input"
                        />
                    </Field>

                    <Field>
                        <Label htmlFor="hostGender">Host Gender</Label>
                        <select 
                            id="hostGender" 
                            value={hostGender} 
                            onChange={(e) => setHostGender(e.target.value)} 
                            className="form-select"
                        >
                            <option value="female">Female</option>
                            <option value="male">Male</option>
                        </select>
                    </Field>

                    <Field>
                        <Label htmlFor="guests">Guests (comma-separated)</Label>
                        <input
                            id="guests"
                            type="text"
                            value={guestsText}
                            onChange={(e) => setGuestsText(e.target.value)}
                            placeholder="e.g., Dr. Kim, Jordan Lee"
                            className="form-input"
                        />
                        <div className="form-hint">
                            Guests parsed: {guestsArray.length ? guestsArray.join(', ') : 'None'}
                        </div>
                    </Field>

                    <Field>
                        <Label htmlFor="guestGender">Guest Gender (applied to all)</Label>
                        <select 
                            id="guestGender" 
                            value={guestGender} 
                            onChange={(e) => setGuestGender(e.target.value)} 
                            className="form-select"
                        >
                            <option value="female">Female</option>
                            <option value="male">Male</option>
                        </select>
                    </Field>

                    <Field className="form-field-full">
                        <Label htmlFor="info">Additional Info</Label>
                        <textarea
                            id="info"
                            value={info}
                            onChange={(e) => setInfo(e.target.value)}
                            placeholder="Any constraints, angle, or details for the discussion"
                            rows={4}
                            className="form-textarea"
                        />
                    </Field>
                </div>

                <button type="submit" disabled={loading} className="submit-button">
                    {loading ? (
                        <>
                            <span className="button-spinner"></span>
                            Generating… this can take a bit
                        </>
                    ) : (
                        'Generate Podcast'
                    )}
                </button>
            </form>

            {error && (
                <div className="error-message">
                    <svg className="error-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="8" x2="12" y2="12"></line>
                        <line x1="12" y1="16" x2="12.01" y2="16"></line>
                    </svg>
                    <div>
                        <strong>Error:</strong> {error}
                    </div>
                </div>
            )}

            {result && (
                <div className="results-container">
                    <h2 className="results-title">Generated Output</h2>
                    <div className="results-grid">
                        <div className="result-card">
                            <div className="result-card-header">
                                <svg className="result-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                    <polyline points="14 2 14 8 20 8"></polyline>
                                    <line x1="16" y1="13" x2="8" y2="13"></line>
                                    <line x1="16" y1="17" x2="8" y2="17"></line>
                                    <polyline points="10 9 9 9 8 9"></polyline>
                                </svg>
                                <h3 className="result-card-title">Script</h3>
                            </div>
                            <div className="script-content">
                                {Array.isArray(result.script) && result.script.length > 0 ? (
                                    result.script.map((line, idx) => (
                                        <div key={idx} className="script-line">
                                            <div className="script-speaker">{line.speaker}</div>
                                            <div className="script-text">{line.text}</div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="script-empty">No script produced.</div>
                                )}
                            </div>
                        </div>
                        <div className="result-card">
                            <div className="result-card-header">
                                <svg className="result-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                                    <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                                </svg>
                                <h3 className="result-card-title">Audio</h3>
                            </div>
                            <div className="audio-content">
                                {result.audio ? (
                                    <audio controls src={`${API_BASE}${result.audio}`} className="audio-player" />
                                ) : (
                                    <div className="audio-empty">No audio url returned.</div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {loading && (
                <div className="overlay">
                    <div className="loading-card">
                        <div className="spinner"></div>
                        <p className="loading-text">Generating your podcast...</p>
                    </div>
                </div>
            )}
        </div>
    );
}


