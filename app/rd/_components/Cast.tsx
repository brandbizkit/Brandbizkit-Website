/* ============================================================================
   The BrandBizkit cast — three recurring full-body characters, one per persona.
   Same identity everywhere (hair / outfit / skin), different POSE per placement.

     launcher  — "Remy",  starting a brand      (coral tee, mustard kicks)
     operator  — "Bea",   running a business    (periwinkle blazer, top bun)
     upskiller — "Kip",   using AI at work      (green cardigan, glasses)

   <Character id="operator" pose="type" size={220} />
   <CastLineup poses={{ launcher: "celebrate", operator: "present", upskiller: "read" }} />
   <CharacterBust id="launcher" size={52} />
   ========================================================================== */

export type CastId = "launcher" | "operator" | "upskiller";
export type Pose =
  | "stand" | "wave" | "celebrate" | "present" | "type" | "carry" | "read" | "point";

type Identity = {
  name: string;
  role: string;
  skin: string;
  hair: string;
  top: string;
  topDark: string;
  pant: string;
  shoe: string;
  glasses?: boolean;
  hairStyle: "curly" | "bun" | "part";
};

export const CHARACTERS: Record<CastId, Identity> = {
  launcher: {
    name: "Remy", role: "Launching a brand",
    skin: "#e8b98c", hair: "#241812", top: "#ff4232", topDark: "#d93222",
    pant: "#33384a", shoe: "#f3c82e", hairStyle: "curly",
  },
  operator: {
    name: "Bea", role: "Running a business",
    skin: "#7a4a2f", hair: "#140f0c", top: "#697bdc", topDark: "#4d5fc4",
    pant: "#2b2f3a", shoe: "#ffffff", hairStyle: "bun",
  },
  upskiller: {
    name: "Kip", role: "Using AI at work",
    skin: "#f1d3b6", hair: "#4a3626", top: "#0e5c46", topDark: "#0b4a39",
    pant: "#6b7280", shoe: "#0d141a", glasses: true, hairStyle: "part",
  },
};

const INK = "#0d141a";
const S = 5; // outline weight

function Hair({ id }: { id: CastId }) {
  const c = CHARACTERS[id];
  if (c.hairStyle === "curly") {
    return (
      <path
        d="M70 54c0-20 8-32 30-32s30 12 30 32c-5-9-12-9-16-5-4-8-13-8-17-3-5-6-14-4-16 4-5-6-13-4-15 6-1-3 0-8 0-8z"
        fill={c.hair} stroke={INK} strokeWidth={S} strokeLinejoin="round"
      />
    );
  }
  if (c.hairStyle === "bun") {
    return (
      <>
        <circle cx="100" cy="18" r="12" fill={c.hair} stroke={INK} strokeWidth={S} />
        <path d="M72 56c0-24 12-36 28-36s28 12 28 36c-8-14-18-16-28-16s-20 2-28 16z" fill={c.hair} stroke={INK} strokeWidth={S} strokeLinejoin="round" />
        <path d="M74 62l-5 44M126 62l5 44" stroke={c.hair} strokeWidth="9" strokeLinecap="round" />
        <path d="M74 62l-5 44M126 62l5 44" stroke={INK} strokeWidth="2.5" strokeLinecap="round" opacity="0.35" />
      </>
    );
  }
  return (
    <path
      d="M71 55c1-24 13-33 29-33s28 10 29 30c-8-12-18-14-26-13-5 0-9 1-12 3l-6-7c-8 5-13 12-14 20z"
      fill={c.hair} stroke={INK} strokeWidth={S} strokeLinejoin="round"
    />
  );
}

function Head({ id }: { id: CastId }) {
  const c = CHARACTERS[id];
  const browY = id === "launcher" ? 50 : id === "operator" ? 53 : 51;
  return (
    <g>
      <circle cx="100" cy="60" r="30" fill={c.skin} stroke={INK} strokeWidth={S} />
      <circle cx="84" cy="68" r="4" fill="#ff4232" opacity="0.16" />
      <circle cx="116" cy="68" r="4" fill="#ff4232" opacity="0.16" />
      {/* brows */}
      <path
        d={id === "operator" ? `M85 ${browY}h9M106 ${browY}h9` : `M85 ${browY + 1}q5 -3 10 -1M105 ${browY}q5 -2 10 1`}
        stroke={INK} strokeWidth="3.2" strokeLinecap="round" fill="none"
      />
      <circle cx="91" cy="60" r="3.1" fill={INK} />
      <circle cx="109" cy="60" r="3.1" fill={INK} />
      {c.glasses && (
        <g stroke={INK} strokeWidth="3" fill="none">
          <circle cx="91" cy="60" r="10" />
          <circle cx="109" cy="60" r="10" />
          <path d="M101 60h-1M81 58l-7-3" strokeLinecap="round" />
        </g>
      )}
      {/* mouth — a little different per character */}
      {id === "launcher" ? (
        <path d="M91 72q9 11 18 0q-9 4 -18 0z" fill={INK} />
      ) : id === "operator" ? (
        <path d="M92 73q10 5 16 -2" stroke={INK} strokeWidth="4" strokeLinecap="round" fill="none" />
      ) : (
        <path d="M92 72q8 6 15 0" stroke={INK} strokeWidth="4" strokeLinecap="round" fill="none" />
      )}
      <Hair id={id} />
    </g>
  );
}

function limb(d: string, color: string, w = 18) {
  return <path d={d} stroke={color} strokeWidth={w} strokeLinecap="round" fill="none" />;
}
function hand(x: number, y: number, skin: string) {
  return <circle cx={x} cy={y} r="8.5" fill={skin} stroke={INK} strokeWidth="3" />;
}

function Torso({ id }: { id: CastId }) {
  const c = CHARACTERS[id];
  return (
    <g>
      <path d="M78 96h44a10 10 0 0 1 10 10v52a10 10 0 0 1-10 10H78a10 10 0 0 1-10-10v-52a10 10 0 0 1 10-10z" fill={c.top} stroke={INK} strokeWidth={S} />
      {id === "operator" && <path d="M100 96l-10 22 10 6 10-6-10-22z" fill={c.topDark} stroke={INK} strokeWidth="3" />}
      {id === "upskiller" && (
        <>
          <path d="M100 96l-9 20 9 5 9-5-9-20z" fill={c.topDark} stroke={INK} strokeWidth="3" />
          <circle cx="100" cy="132" r="2.6" fill={INK} />
          <circle cx="100" cy="146" r="2.6" fill={INK} />
        </>
      )}
      {id === "launcher" && <path d="M78 120q22 10 44 0" stroke={c.topDark} strokeWidth="4" fill="none" strokeLinecap="round" />}
    </g>
  );
}

function Legs({ id, wide = false }: { id: CastId; wide?: boolean }) {
  const c = CHARACTERS[id];
  const lx = wide ? 74 : 92;
  const rx = wide ? 126 : 112;
  return (
    <g>
      {limb(`M96 166L${lx} 230`, c.pant, 20)}
      {limb(`M104 166L${rx} 230`, c.pant, 20)}
      <ellipse cx={lx - 4} cy="232" rx="14" ry="7" fill={c.shoe} stroke={INK} strokeWidth="3" />
      <ellipse cx={rx + 4} cy="232" rx="14" ry="7" fill={c.shoe} stroke={INK} strokeWidth="3" />
    </g>
  );
}

function Prop({ pose, id }: { pose: Pose; id: CastId }) {
  const c = CHARACTERS[id];
  if (pose === "type") {
    return (
      <g>
        <rect x="82" y="150" width="40" height="7" rx="2" fill="#c8ccd6" stroke={INK} strokeWidth="3" />
        <rect x="85" y="120" width="34" height="30" rx="3" fill={c.top} stroke={INK} strokeWidth="3" />
        <path d="M91 128h22M91 136h16" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
      </g>
    );
  }
  if (pose === "carry") {
    return (
      <g>
        <rect x="78" y="150" width="44" height="28" rx="5" fill="#f3c82e" stroke={INK} strokeWidth={S} />
        <path d="M88 150q12 -12 24 0" stroke={INK} strokeWidth="4" fill="none" />
        <circle cx="100" cy="164" r="3" fill={INK} />
      </g>
    );
  }
  if (pose === "read") {
    return (
      <g>
        <rect x="82" y="126" width="36" height="44" rx="4" fill="#fff5ed" stroke={INK} strokeWidth={S} />
        <path d="M89 138h22M89 148h22M89 158h14" stroke={INK} strokeWidth="3" strokeLinecap="round" opacity="0.6" />
      </g>
    );
  }
  if (pose === "present") {
    return (
      <g>
        <rect x="150" y="70" width="46" height="40" rx="6" fill="#fff" stroke={INK} strokeWidth={S} />
        <path d="M160 90h20M173 82l9 8-9 8" stroke="#ff4232" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <path d="M156 110l-6 26M190 110l6 26" stroke={INK} strokeWidth="4" strokeLinecap="round" />
      </g>
    );
  }
  if (pose === "celebrate") {
    return (
      <g>
        {[
          ["#ff4232", 46, 40, -14], ["#697bdc", 150, 34, 12], ["#f3c82e", 100, 24, -8],
          ["#0e5c46", 70, 62, 20], ["#ff4232", 132, 58, -20], ["#697bdc", 40, 92, 8],
        ].map(([col, x, y, r], i) => (
          <rect key={i} x={x as number} y={y as number} width="9" height="9" rx="2" fill={col as string}
            transform={`rotate(${r} ${x} ${y})`} stroke={INK} strokeWidth="2" />
        ))}
      </g>
    );
  }
  return null;
}

function Arms({ pose, id }: { pose: Pose; id: CastId }) {
  const c = CHARACTERS[id];
  switch (pose) {
    case "wave":
      return (
        <g>
          {limb("M80 106L66 150", c.top)} {hand(66, 150, c.skin)}
          {limb("M120 104L150 62", c.top)} {hand(150, 60, c.skin)}
          <path d="M158 52l7-6M160 62l9-1M156 40l4-8" stroke={INK} strokeWidth="3" strokeLinecap="round" />
        </g>
      );
    case "celebrate":
      return (
        <g>
          {limb("M80 104L52 58", c.top)} {hand(52, 56, c.skin)}
          {limb("M120 104L148 58", c.top)} {hand(148, 56, c.skin)}
        </g>
      );
    case "present":
      return (
        <g>
          {limb("M80 106L84 140", c.top)} {hand(84, 142, c.skin)}
          {limb("M120 104L160 96", c.top)} {hand(163, 95, c.skin)}
        </g>
      );
    case "type":
      return (
        <g>
          {limb("M80 106L90 150", c.top)} {hand(90, 151, c.skin)}
          {limb("M120 106L110 150", c.top)} {hand(110, 151, c.skin)}
        </g>
      );
    case "carry":
      return (
        <g>
          {limb("M80 110L88 158", c.top)} {hand(88, 160, c.skin)}
          {limb("M120 110L112 158", c.top)} {hand(112, 160, c.skin)}
        </g>
      );
    case "read":
      return (
        <g>
          {limb("M80 108L88 142", c.top)} {hand(88, 144, c.skin)}
          {limb("M120 108L112 142", c.top)} {hand(112, 144, c.skin)}
        </g>
      );
    case "point":
      return (
        <g>
          {limb("M80 106L74 148", c.top)} {hand(74, 150, c.skin)}
          {limb("M120 108L168 112", c.top)} {hand(170, 112, c.skin)}
        </g>
      );
    default: // stand
      return (
        <g>
          {limb("M80 104L64 150", c.top)} {hand(64, 152, c.skin)}
          {limb("M120 104L136 150", c.top)} {hand(136, 152, c.skin)}
        </g>
      );
  }
}

export function Character({
  id,
  pose = "stand",
  size = 200,
  flip = false,
  className,
  style,
}: {
  id: CastId;
  pose?: Pose;
  size?: number;
  flip?: boolean;
  className?: string;
  style?: React.CSSProperties;
}) {
  const c = CHARACTERS[id];
  const wide = pose === "celebrate";
  const headTilt = pose === "read" ? -6 : pose === "type" ? -3 : 0;
  return (
    <svg
      width={size}
      height={size * 1.25}
      viewBox="0 0 200 250"
      className={className}
      style={{ transform: flip ? "scaleX(-1)" : undefined, ...style }}
      role="img"
      aria-label={`${c.name} — ${c.role}`}
    >
      {(pose === "celebrate" || pose === "present") && <Prop pose={pose} id={id} />}
      <ellipse cx="100" cy="238" rx={wide ? 52 : 40} ry="8" fill={INK} opacity="0.12" />
      <Legs id={id} wide={wide} />
      <Torso id={id} />
      <Arms pose={pose} id={id} />
      <g transform={headTilt ? `rotate(${headTilt} 100 60)` : undefined}>
        <path d="M100 86v12" stroke={c.skin} strokeWidth="14" strokeLinecap="round" />
        <Head id={id} />
      </g>
      {(pose === "type" || pose === "carry" || pose === "read") && <Prop pose={pose} id={id} />}
    </svg>
  );
}

/** Head-and-shoulders only — for bylines, testimonials, tight spots. */
export function CharacterBust({ id, size = 56, className, style }: { id: CastId; size?: number; className?: string; style?: React.CSSProperties }) {
  const c = CHARACTERS[id];
  return (
    <svg width={size} height={size} viewBox="30 20 140 130" className={className} style={style} role="img" aria-label={c.name}>
      <circle cx="100" cy="100" r="52" fill="#fff5ed" stroke={INK} strokeWidth={S} />
      <path d="M56 132c0-20 20-30 44-30s44 10 44 30" fill={c.top} stroke={INK} strokeWidth={S} />
      <path d="M100 86v10" stroke={c.skin} strokeWidth="16" strokeLinecap="round" />
      <Head id={id} />
    </svg>
  );
}

/** A row of the whole cast, each in its own pose. */
export function CastLineup({
  poses,
  size = 150,
  className,
}: {
  poses: Partial<Record<CastId, Pose>>;
  size?: number;
  className?: string;
}) {
  const order: CastId[] = ["launcher", "operator", "upskiller"];
  return (
    <div className={className} style={{ display: "flex", alignItems: "flex-end", justifyContent: "center", gap: 4, flexWrap: "nowrap" }}>
      {order.map((id, i) =>
        poses[id] ? (
          <Character
            key={id}
            id={id}
            pose={poses[id]}
            size={size}
            style={{ transform: `rotate(${[-4, 0, 4][i]}deg)`, flex: "0 1 auto", minWidth: 0, maxWidth: "34%", height: "auto" }}
          />
        ) : null
      )}
    </div>
  );
}
