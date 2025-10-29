import React, { useMemo, useState } from 'react';

function Label({ htmlFor, children }) {
    return (
        <label htmlFor={htmlFor} style={{ fontWeight: 600, display: 'block', marginBottom: 6 }}>
            {children}
        </label>
    );
}

function Field({ children }) {
    return <div style={{ marginBottom: 16 }}>{children}</div>;
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
        <div style={{ maxWidth: 900, margin: '0 auto', padding: 24 }}>
            <h1 style={{ marginBottom: 8 }}>AI Podcast Generator</h1>
            <p style={{ color: '#555', marginTop: 0 }}>
                Enter details below and generate a script and audio in one click.
            </p>

            <form onSubmit={handleSubmit} style={{ background: '#fafafa', padding: 16, border: '1px solid #eee', borderRadius: 8 }}>
                <Field>
                    <Label htmlFor="topic">Topic</Label>
                    <input
                        id="topic"
                        type="text"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        placeholder="e.g., The future of AI in healthcare"
                        required
                        style={{ width: '100%', padding: 10 }}
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
                        style={{ width: '100%', padding: 10 }}
                    />
                </Field>

                <Field>
                    <Label htmlFor="hostGender">Host Gender</Label>
                    <select id="hostGender" value={hostGender} onChange={(e) => setHostGender(e.target.value)} style={{ width: '100%', padding: 10 }}>
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
                        style={{ width: '100%', padding: 10 }}
                    />
                    <div style={{ color: '#777', fontSize: 12, marginTop: 6 }}>
                        Guests parsed: {guestsArray.length ? guestsArray.join(', ') : 'None'}
                    </div>
                </Field>

                <Field>
                    <Label htmlFor="guestGender">Guest Gender (applied to all)</Label>
                    <select id="guestGender" value={guestGender} onChange={(e) => setGuestGender(e.target.value)} style={{ width: '100%', padding: 10 }}>
                        <option value="female">Female</option>
                        <option value="male">Male</option>
                    </select>
                </Field>

                <Field>
                    <Label htmlFor="info">Additional Info</Label>
                    <textarea
                        id="info"
                        value={info}
                        onChange={(e) => setInfo(e.target.value)}
                        placeholder="Any constraints, angle, or details for the discussion"
                        rows={4}
                        style={{ width: '100%', padding: 10 }}
                    />
                </Field>

                <button type="submit" disabled={loading} style={{ padding: '10px 16px' }}>
                    {loading ? 'Generating… this can take a bit' : 'Generate Podcast'}
                </button>
            </form>

            {error && (
                <div style={{ marginTop: 16, color: '#b00020' }}>
                    <strong>Error:</strong> {error}
                </div>
            )}

            {result && (
                <div style={{ marginTop: 24 }}>
                    <h2 style={{ marginBottom: 8 }}>Generated Output</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                        <div style={{ border: '1px solid #eee', borderRadius: 8, padding: 12 }}>
                            <h3 style={{ marginTop: 0 }}>Script</h3>
                            <div style={{ maxHeight: 400, overflow: 'auto' }}>
                                {Array.isArray(result.script) && result.script.length > 0 ? (
                                    result.script.map((line, idx) => (
                                        <div key={idx} style={{ marginBottom: 10 }}>
                                            <div style={{ fontWeight: 600 }}>{line.speaker}</div>
                                            <div>{line.text}</div>
                                        </div>
                                    ))
                                ) : (
                                    <div>No script produced.</div>
                                )}
                            </div>
                        </div>
                        <div style={{ border: '1px solid #eee', borderRadius: 8, padding: 12 }}>
                            <h3 style={{ marginTop: 0 }}>Audio</h3>
                            {result.audio ? (
                                <audio controls src={`${API_BASE}${result.audio}`} style={{ width: '100%' }} />
                            ) : (
                                <div>No audio url returned.</div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {loading && (
                <div className="overlay">
                    <div className="spinner" />
                </div>
            )}
        </div>
    );
}


