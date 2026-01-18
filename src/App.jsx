import { useMemo, useState } from "react";

export default function App() {
  const [rows, setRows] = useState([
    { symbol: "Fe", coeff: 0.333 },
    { symbol: "Nb", coeff: 1 },
    { symbol: "S", coeff: 2 },
  ]);
  const [targetMassG, setTargetMassG] = useState(5);

  const atomicWeights = {
    Fe: 55.845,
    Nb: 92.906,
    S: 32.065,
  };

  const { molarMass, molesFormula, results } = useMemo(() => {
    const mm = rows.reduce((sum, r) => {
      const aw = atomicWeights[r.symbol] ?? 0;
      return sum + Number(r.coeff || 0) * aw;
    }, 0);

    const n = mm > 0 ? Number(targetMassG || 0) / mm : 0;

    const res = rows.map((r) => {
      const aw = atomicWeights[r.symbol] ?? 0;
      const moles = Number(r.coeff || 0) * n;
      const grams = moles * aw;
      return { ...r, aw, moles, grams };
    });

    return { molarMass: mm, molesFormula: n, results: res };
  }, [rows, targetMassG]);

  function updateRow(i, key, value) {
    setRows((prev) =>
      prev.map((r, idx) => (idx === i ? { ...r, [key]: value } : r))
    );
  }

  function addRow() {
    setRows((prev) => [...prev, { symbol: "X", coeff: 1 }]);
  }

  function removeRow(i) {
    setRows((prev) => prev.filter((_, idx) => idx !== i));
  }

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <div>
          <div style={styles.title}>SynthCalc</div>
          <div style={styles.subtitle}>Material synthesis batch calculator</div>
        </div>

        {/* Later you'll replace this with your real repo link */}
        <a
          href="https://github.com/YOUR_USERNAME/YOUR_REPO"
          target="_blank"
          rel="noreferrer"
          style={styles.githubLink}
        >
          GitHub ↗
        </a>
      </header>

      <main style={styles.card}>
        <div style={styles.sectionTitle}>Formula</div>

        <div style={styles.table}>
          <div style={{ ...styles.row, ...styles.rowHeader }}>
            <div>Element</div>
            <div>Coeff</div>
            <div />
          </div>

          {rows.map((r, i) => (
            <div key={i} style={styles.row}>
              <input
                value={r.symbol}
                onChange={(e) => updateRow(i, "symbol", e.target.value.trim())}
                style={styles.input}
                placeholder="Fe"
              />
              <input
                type="number"
                value={r.coeff}
                onChange={(e) => updateRow(i, "coeff", e.target.value)}
                style={styles.input}
                step="0.001"
              />
              <button
                onClick={() => removeRow(i)}
                style={styles.smallBtn}
                disabled={rows.length <= 1}
                title="Remove row"
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        <button onClick={addRow} style={styles.btn}>
          + Add element
        </button>

        <div style={{ height: 18 }} />

        <div style={styles.sectionTitle}>Target batch</div>
        <div style={styles.inline}>
          <label style={styles.label}>Total mass (g)</label>
          <input
            type="number"
            value={targetMassG}
            onChange={(e) => setTargetMassG(e.target.value)}
            style={styles.input}
            step="0.1"
          />
        </div>

        <div style={styles.results}>
          <div style={styles.kpi}>
            <div style={styles.kpiLabel}>Molar mass</div>
            <div style={styles.kpiValue}>{molarMass.toFixed(4)} g/mol</div>
          </div>
          <div style={styles.kpi}>
            <div style={styles.kpiLabel}>Moles of formula units</div>
            <div style={styles.kpiValue}>{molesFormula.toFixed(6)} mol</div>
          </div>
        </div>

        <div style={{ height: 18 }} />

        <div style={styles.sectionTitle}>Weigh-out</div>
        <div style={styles.table}>
          <div style={{ ...styles.row, ...styles.rowHeader, gridTemplateColumns: "1fr 1fr 1fr" }}>
            <div>Element</div>
            <div>Grams</div>
            <div>Moles</div>
          </div>

          {results.map((r, i) => (
            <div key={i} style={{ ...styles.row, gridTemplateColumns: "1fr 1fr 1fr" }}>
              <div style={styles.mono}>{r.symbol}</div>
              <div style={styles.mono}>{Number.isFinite(r.grams) ? r.grams.toFixed(4) : "—"}</div>
              <div style={styles.mono}>{Number.isFinite(r.moles) ? r.moles.toExponential(3) : "—"}</div>
            </div>
          ))}
        </div>

        <div style={styles.note}>
          Note: This mock uses a tiny built-in atomic weight table (Fe, Nb, S).
          Next step is swapping in a full periodic table + presets.
        </div>
      </main>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#0b0f17",
    color: "white",
    padding: "28px",
    fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
  },
  header: {
    maxWidth: 900,
    margin: "0 auto 18px auto",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: { fontSize: 28, fontWeight: 800, letterSpacing: 0.2 },
  subtitle: { opacity: 0.8, marginTop: 4 },
  githubLink: {
    textDecoration: "none",
    color: "white",
    border: "1px solid rgba(255,255,255,0.2)",
    padding: "10px 12px",
    borderRadius: 10,
    opacity: 0.9,
  },
  card: {
    maxWidth: 900,
    margin: "0 auto",
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: 16,
    padding: 18,
    boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
  },
  sectionTitle: { fontWeight: 700, marginBottom: 10, opacity: 0.95 },
  table: { display: "grid", gap: 8 },
  row: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 48px",
    gap: 10,
    alignItems: "center",
  },
  rowHeader: { opacity: 0.7, fontSize: 12, marginBottom: 2 },
  input: {
    width: "100%",
    padding: "10px 12px",
    borderRadius: 10,
    border: "1px solid rgba(255,255,255,0.15)",
    background: "rgba(0,0,0,0.25)",
    color: "white",
    outline: "none",
  },
  btn: {
    marginTop: 12,
    padding: "10px 12px",
    borderRadius: 10,
    border: "1px solid rgba(255,255,255,0.15)",
    background: "rgba(255,255,255,0.08)",
    color: "white",
    cursor: "pointer",
    width: "fit-content",
  },
  smallBtn: {
    padding: "10px 0",
    borderRadius: 10,
    border: "1px solid rgba(255,255,255,0.15)",
    background: "rgba(255,255,255,0.06)",
    color: "white",
    cursor: "pointer",
  },
  inline: { display: "flex", gap: 12, alignItems: "center" },
  label: { width: 140, opacity: 0.85 },
  results: { display: "flex", gap: 12, marginTop: 14, flexWrap: "wrap" },
  kpi: {
    flex: "1 1 260px",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: 14,
    padding: 12,
    background: "rgba(0,0,0,0.15)",
  },
  kpiLabel: { opacity: 0.75, fontSize: 12 },
  kpiValue: { fontSize: 18, fontWeight: 700, marginTop: 6 },
  mono: { fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace" },
  note: { marginTop: 14, opacity: 0.75, fontSize: 12, lineHeight: 1.4 },
};
