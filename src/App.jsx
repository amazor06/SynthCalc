import { useMemo, useState } from "react";

const ATOMIC_WEIGHTS = {
  H: 1.008, He: 4.003, Li: 6.941, Be: 9.012, B: 10.811, C: 12.011, N: 14.007, O: 15.999, F: 18.998, Ne: 20.180,
  Na: 22.990, Mg: 24.305, Al: 26.982, Si: 28.086, P: 30.974, S: 32.065, Cl: 35.453, Ar: 39.948,
  K: 39.098, Ca: 40.078, Sc: 44.956, Ti: 47.867, V: 50.942, Cr: 51.996, Mn: 54.938, Fe: 55.845, Co: 58.933, Ni: 58.693, Cu: 63.546, Zn: 65.38, Ga: 69.723, Ge: 72.64, As: 74.922, Se: 78.96, Br: 79.904, Kr: 83.798,
  Rb: 85.468, Sr: 87.62, Y: 88.906, Zr: 91.224, Nb: 92.906, Mo: 95.96, Tc: 98, Ru: 101.07, Rh: 102.906, Pd: 106.42, Ag: 107.868, Cd: 112.411, In: 114.818, Sn: 118.710, Sb: 121.760, Te: 127.60, I: 126.904, Xe: 131.293,
  Cs: 132.905, Ba: 137.327, La: 138.905, Ce: 140.116, Pr: 140.908, Nd: 144.242, Pm: 145, Sm: 150.36, Eu: 151.964, Gd: 157.25, Tb: 158.925, Dy: 162.500, Ho: 164.930, Er: 167.259, Tm: 168.934, Yb: 173.054, Lu: 174.967,
  Hf: 178.49, Ta: 180.948, W: 183.84, Re: 186.207, Os: 190.23, Ir: 192.217, Pt: 195.084, Au: 196.967, Hg: 200.59, Tl: 204.383, Pb: 207.2, Bi: 208.980, Po: 209, At: 210, Rn: 222,
  Fr: 223, Ra: 226, Ac: 227, Th: 232.038, Pa: 231.036, U: 238.029, Np: 237, Pu: 244, Am: 243, Cm: 247, Bk: 247, Cf: 251, Es: 252, Fm: 257, Md: 258, No: 259, Lr: 262,
  Rf: 267, Db: 268, Sg: 271, Bh:272, Hs: 270, Mt: 276, Ds: 281, Rg: 280, Cn: 285, Nh: 284, Fl: 289, Mc: 288, Lv: 293, Ts: 294, Og: 294
};

const ELEMENT_TYPES = {
  "alkali-metal": ["Li", "Na", "K", "Rb", "Cs", "Fr"],
  "alkaline-earth": ["Be", "Mg", "Ca", "Sr", "Ba", "Ra"],
  "transition-metal": ["Sc", "Ti", "V", "Cr", "Mn", "Fe", "Co", "Ni", "Cu", "Zn", "Y", "Zr", "Nb", "Mo", "Tc", "Ru", "Rh", "Pd", "Ag", "Cd", "Hf", "Ta", "W", "Re", "Os", "Ir", "Pt", "Au", "Hg", "Rf", "Db", "Sg", "Bh", "Hs", "Mt", "Ds", "Rg", "Cn"],
  "post-transition": ["Al", "Ga", "In", "Sn", "Tl", "Pb", "Bi", "Po", "Nh", "Fl", "Mc", "Lv"],
  "metalloid": ["B", "Si", "Ge", "As", "Sb", "Te"],
  "nonmetal": ["H", "C", "N", "O", "P", "S", "Se"],
  "halogen": ["F", "Cl", "Br", "I", "At", "Ts"],
  "noble-gas": ["He", "Ne", "Ar", "Kr", "Xe", "Rn", "Og"],
  "lanthanide": ["La", "Ce", "Pr", "Nd", "Pm", "Sm", "Eu", "Gd", "Tb", "Dy", "Ho", "Er", "Tm", "Yb", "Lu"],
  "actinide": ["Ac", "Th", "Pa", "U", "Np", "Pu", "Am", "Cm", "Bk", "Cf", "Es", "Fm", "Md", "No", "Lr"]
};

const TYPE_COLORS = {
  "alkali-metal": "bg-red-50 border-red-300 hover:bg-red-100",
  "alkaline-earth": "bg-orange-50 border-orange-300 hover:bg-orange-100",
  "transition-metal": "bg-blue-50 border-blue-300 hover:bg-blue-100",
  "post-transition": "bg-gray-50 border-gray-300 hover:bg-gray-100",
  "metalloid": "bg-teal-50 border-teal-300 hover:bg-teal-100",
  "nonmetal": "bg-green-50 border-green-300 hover:bg-green-100",
  "halogen": "bg-yellow-50 border-yellow-300 hover:bg-yellow-100",
  "noble-gas": "bg-purple-50 border-purple-300 hover:bg-purple-100",
  "lanthanide": "bg-cyan-50 border-cyan-300 hover:bg-cyan-100",
  "actinide": "bg-pink-50 border-pink-300 hover:bg-pink-100"
};

const PERIODIC_TABLE_LAYOUT = [
  [{ symbol: "H", number: 1 }, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, { symbol: "He", number: 2 }],
  [{ symbol: "Li", number: 3 }, { symbol: "Be", number: 4 }, null, null, null, null, null, null, null, null, null, null, { symbol: "B", number: 5 }, { symbol: "C", number: 6 }, { symbol: "N", number: 7 }, { symbol: "O", number: 8 }, { symbol: "F", number: 9 }, { symbol: "Ne", number: 10 }],
  [{ symbol: "Na", number: 11 }, { symbol: "Mg", number: 12 }, null, null, null, null, null, null, null, null, null, null, { symbol: "Al", number: 13 }, { symbol: "Si", number: 14 }, { symbol: "P", number: 15 }, { symbol: "S", number: 16 }, { symbol: "Cl", number: 17 }, { symbol: "Ar", number: 18 }],
  [{ symbol: "K", number: 19 }, { symbol: "Ca", number: 20 }, { symbol: "Sc", number: 21 }, { symbol: "Ti", number: 22 }, { symbol: "V", number: 23 }, { symbol: "Cr", number: 24 }, { symbol: "Mn", number: 25 }, { symbol: "Fe", number: 26 }, { symbol: "Co", number: 27 }, { symbol: "Ni", number: 28 }, { symbol: "Cu", number: 29 }, { symbol: "Zn", number: 30 }, { symbol: "Ga", number: 31 }, { symbol: "Ge", number: 32 }, { symbol: "As", number: 33 }, { symbol: "Se", number: 34 }, { symbol: "Br", number: 35 }, { symbol: "Kr", number: 36 }],
  [{ symbol: "Rb", number: 37 }, { symbol: "Sr", number: 38 }, { symbol: "Y", number: 39 }, { symbol: "Zr", number: 40 }, { symbol: "Nb", number: 41 }, { symbol: "Mo", number: 42 }, { symbol: "Tc", number: 43 }, { symbol: "Ru", number: 44 }, { symbol: "Rh", number: 45 }, { symbol: "Pd", number: 46 }, { symbol: "Ag", number: 47 }, { symbol: "Cd", number: 48 }, { symbol: "In", number: 49 }, { symbol: "Sn", number: 50 }, { symbol: "Sb", number: 51 }, { symbol: "Te", number: 52 }, { symbol: "I", number: 53 }, { symbol: "Xe", number: 54 }],
  [{ symbol: "Cs", number: 55 }, { symbol: "Ba", number: 56 }, { symbol: "*", number: null }, { symbol: "Hf", number: 72 }, { symbol: "Ta", number: 73 }, { symbol: "W", number: 74 }, { symbol: "Re", number: 75 }, { symbol: "Os", number: 76 }, { symbol: "Ir", number: 77 }, { symbol: "Pt", number: 78 }, { symbol: "Au", number: 79 }, { symbol: "Hg", number: 80 }, { symbol: "Tl", number: 81 }, { symbol: "Pb", number: 82 }, { symbol: "Bi", number: 83 }, { symbol: "Po", number: 84 }, { symbol: "At", number: 85 }, { symbol: "Rn", number: 86 }],
  [{ symbol: "Fr", number: 87 }, { symbol: "Ra", number: 88 }, { symbol: "**", number: null }, { symbol: "Rf", number: 104 }, { symbol: "Db", number: 105 }, { symbol: "Sg", number: 106 }, { symbol: "Bh", number: 107 }, { symbol: "Hs", number: 108 }, { symbol: "Mt", number: 109 }, { symbol: "Ds", number: 110 }, { symbol: "Rg", number: 111 }, { symbol: "Cn", number: 112 }, { symbol: "Nh", number: 113 }, { symbol: "Fl", number: 114 }, { symbol: "Mc", number: 115 }, { symbol: "Lv", number: 116 }, { symbol: "Ts", number: 117 }, { symbol: "Og", number: 118 }],
];

const LANTHANIDES = [
  { symbol: "La", number: 57 }, { symbol: "Ce", number: 58 }, { symbol: "Pr", number: 59 }, { symbol: "Nd", number: 60 }, { symbol: "Pm", number: 61 }, { symbol: "Sm", number: 62 }, { symbol: "Eu", number: 63 }, { symbol: "Gd", number: 64 }, { symbol: "Tb", number: 65 }, { symbol: "Dy", number: 66 }, { symbol: "Ho", number: 67 }, { symbol: "Er", number: 68 }, { symbol: "Tm", number: 69 }, { symbol: "Yb", number: 70 }, { symbol: "Lu", number: 71 }
];

const ACTINIDES = [
  { symbol: "Ac", number: 89 }, { symbol: "Th", number: 90 }, { symbol: "Pa", number: 91 }, { symbol: "U", number: 92 }, { symbol: "Np", number: 93 }, { symbol: "Pu", number: 94 }, { symbol: "Am", number: 95 }, { symbol: "Cm", number: 96 }, { symbol: "Bk", number: 97 }, { symbol: "Cf", number: 98 }, { symbol: "Es", number: 99 }, { symbol: "Fm", number: 100 }, { symbol: "Md", number: 101 }, { symbol: "No", number: 102 }, { symbol: "Lr", number: 103 }
];

function getElementType(symbol) {
  for (const [type, elements] of Object.entries(ELEMENT_TYPES)) {
    if (elements.includes(symbol)) return type;
  }
  return "unknown";
}

export default function App() {
  const [selected, setSelected] = useState([]);
  const [targetMassG, setTargetMassG] = useState(5);
  const [showTable, setShowTable] = useState(false);

  const { molarMass, molesFormula, results } = useMemo(() => {
    const mm = selected.reduce((sum, r) => sum + Number(r.coeff || 0) * (ATOMIC_WEIGHTS[r.symbol] ?? 0), 0);
    const n = mm > 0 ? Number(targetMassG || 0) / mm : 0;
    const res = selected.map((r) => {
      const aw = ATOMIC_WEIGHTS[r.symbol] ?? NaN;
      const moles = Number(r.coeff || 0) * n;
      const grams = moles * aw;
      return { ...r, aw, moles, grams };
    });
    return { molarMass: mm, molesFormula: n, results: res };
  }, [selected, targetMassG]);

  function addElement(symbol) {
    if (selected.some((e) => e.symbol === symbol)) return;
    setSelected((prev) => [...prev, { symbol, coeff: 1 }]);
    setShowTable(false);
  }

  function removeElement(symbol) {
    setSelected((prev) => prev.filter((e) => e.symbol !== symbol));
  }

  function updateCoeff(symbol, coeff) {
    setSelected((prev) => prev.map((e) => (e.symbol === symbol ? { ...e, coeff } : e)));
  }

  function renderElement(el) {
    if (!el || el.symbol === "*" || el.symbol === "**") {
      return <div className="aspect-square" />;
    }

    const type = getElementType(el.symbol);
    const colorClass = TYPE_COLORS[type] || "bg-gray-50 border-gray-200 hover:bg-gray-100";
    const isSelected = selected.some((e) => e.symbol === el.symbol);

    return (
      <button
        onClick={() => addElement(el.symbol)}
        className={`aspect-square rounded border ${colorClass} transition-all ${
          isSelected ? "ring-2 ring-blue-500" : ""
        } flex flex-col items-center justify-center p-1 text-xs`}
      >
        <div className="text-[8px] text-gray-500">{el.number}</div>
        <div className="font-bold text-sm text-gray-900">{el.symbol}</div>
        <div className="text-[7px] text-gray-500 font-mono">{ATOMIC_WEIGHTS[el.symbol]?.toFixed(1)}</div>
      </button>
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <header className="border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">SynthCalc</h1>
            <p className="text-sm text-gray-600">Material synthesis batch calculator</p>
          </div>
          <a
            href="https://github.com/amazor06/SynthCalc"
            target="_blank"
            rel="noreferrer"
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm hover:bg-gray-50 transition text-gray-700"
          >
            GitHub ↗
          </a>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        {showTable ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Select Elements</h2>
              <button
                onClick={() => setShowTable(false)}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 hover:bg-gray-50 transition text-gray-700"
              >
                ← Back to Calculator
              </button>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-6">
              <div className="grid gap-1" style={{ gridTemplateColumns: "repeat(18, minmax(0, 1fr))" }}>
                {PERIODIC_TABLE_LAYOUT.map((row, i) => (
                  <>{row.map((el, j) => <div key={`${i}-${j}`}>{renderElement(el)}</div>)}</>
                ))}
              </div>

              <div className="mt-6 space-y-2">
                <div className="text-xs text-gray-600 mb-2">* Lanthanides</div>
                <div className="grid gap-1" style={{ gridTemplateColumns: "repeat(15, minmax(0, 1fr))" }}>
                  {LANTHANIDES.map((el) => renderElement(el))}
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <div className="text-xs text-gray-600 mb-2">** Actinides</div>
                <div className="grid gap-1" style={{ gridTemplateColumns: "repeat(15, minmax(0, 1fr))" }}>
                  {ACTINIDES.map((el) => renderElement(el))}
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-3 text-xs">
                {Object.entries(TYPE_COLORS).map(([type, color]) => (
                  <div key={type} className="flex items-center gap-2">
                    <div className={`w-4 h-4 rounded border ${color}`} />
                    <span className="capitalize text-gray-700">{type.replace("-", " ")}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-2">
            {/* LEFT */}
            <div className="rounded-lg border border-gray-200 bg-white p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="font-semibold text-lg text-gray-900">Formula Builder</h2>
                  <p className="text-sm text-gray-600 mt-1">Adjust stoichiometric coefficients</p>
                </div>
                <button
                  onClick={() => setShowTable(true)}
                  className="rounded-lg border border-gray-300 bg-white px-4 py-2 hover:bg-gray-50 transition text-sm font-medium text-gray-700"
                >
                  + Add Element
                </button>
              </div>

              {selected.length === 0 ? (
                <div className="mt-6 text-center py-12 text-gray-500">
                  <p>No elements selected</p>
                  <button
                    onClick={() => setShowTable(true)}
                    className="mt-4 text-blue-600 hover:text-blue-700"
                  >
                    Open Periodic Table →
                  </button>
                </div>
              ) : (
                <>
                  <div className="mt-6 flex flex-wrap gap-2">
                    {selected.map((e) => {
                      const type = getElementType(e.symbol);
                      const colorClass = TYPE_COLORS[type] || "bg-gray-50 border-gray-200";
                      return (
                        <span key={e.symbol} className={`inline-flex items-center gap-2 rounded-full border ${colorClass} px-4 py-2`}>
                          <span className="font-mono font-semibold text-gray-900">{e.symbol}</span>
                          <span className="text-xs text-gray-600">×{Number(e.coeff).toFixed(3)}</span>
                          <button onClick={() => removeElement(e.symbol)} className="text-gray-500 hover:text-gray-700 ml-1">
                            ✕
                          </button>
                        </span>
                      );
                    })}
                  </div>

                  <div className="mt-6 space-y-4">
                    {selected.map((e) => (
                      <div key={e.symbol} className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="font-mono text-lg font-semibold text-gray-900">{e.symbol}</div>
                          <input
                            type="number"
                            step="0.001"
                            value={e.coeff}
                            onChange={(ev) => updateCoeff(e.symbol, ev.target.value)}
                            className="w-32 rounded-lg border border-gray-300 bg-white px-3 py-2 font-mono outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                          />
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="5"
                          step="0.001"
                          value={Number(e.coeff)}
                          onChange={(ev) => updateCoeff(e.symbol, ev.target.value)}
                          className="w-full accent-blue-600"
                        />
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 rounded-lg border border-gray-200 bg-gray-50 p-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-gray-900">Target Batch Mass</div>
                        <div className="text-sm text-gray-600">Total grams to synthesize</div>
                      </div>
                      <input
                        type="number"
                        step="0.1"
                        value={targetMassG}
                        onChange={(e) => setTargetMassG(e.target.value)}
                        className="w-32 rounded-lg border border-gray-300 bg-white px-4 py-2 font-mono text-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* RIGHT */}
            <div className="rounded-lg border border-gray-200 bg-white p-6">
              <h2 className="font-semibold text-lg text-gray-900">Calculation Results</h2>
              <p className="text-sm text-gray-600 mt-1">Weighing instructions for synthesis</p>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-5">
                  <div className="text-xs text-gray-600 mb-2">Molar Mass</div>
                  <div className="text-2xl font-bold font-mono text-gray-900">{molarMass ? molarMass.toFixed(4) : "—"}</div>
                  <div className="text-xs text-gray-500 mt-1">g/mol</div>
                </div>
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-5">
                  <div className="text-xs text-gray-600 mb-2">Formula Units</div>
                  <div className="text-2xl font-bold font-mono text-gray-900">{molesFormula ? molesFormula.toFixed(6) : "—"}</div>
                  <div className="text-xs text-gray-500 mt-1">mol</div>
                </div>
              </div>

              {selected.length > 0 && (
                <div className="mt-6 overflow-hidden rounded-lg border border-gray-200">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr className="text-left">
                        <th className="px-4 py-3 font-semibold text-gray-900">Element</th>
                        <th className="px-4 py-3 font-semibold text-gray-900">Coeff</th>
                        <th className="px-4 py-3 font-semibold text-gray-900">Grams</th>
                        <th className="px-4 py-3 font-semibold text-gray-900">Moles</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white">
                      {results.map((r) => (
                        <tr key={r.symbol} className="border-t border-gray-200 hover:bg-gray-50">
                          <td className="px-4 py-3 font-mono font-semibold text-gray-900">{r.symbol}</td>
                          <td className="px-4 py-3 font-mono text-gray-700">{Number(r.coeff).toFixed(3)}</td>
                          <td className="px-4 py-3 font-mono text-gray-900 font-semibold">
                            {Number.isFinite(r.grams) ? r.grams.toFixed(4) : "—"}
                          </td>
                          <td className="px-4 py-3 font-mono text-xs text-gray-700">
                            {Number.isFinite(r.moles) ? r.moles.toExponential(3) : "—"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}