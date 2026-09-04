/* Flat-vector "sticker people" + a marked photo slot.
 * These keep humans visible across the redesign without needing real photos.
 * Swap PhotoSlot for a real <Image> when assets are ready. */

type SkinKey = "warm" | "deep" | "light" | "olive";
const SKIN: Record<SkinKey, string> = {
  warm: "#e8b98c",
  deep: "#8d5a3c",
  light: "#f2d2ba",
  olive: "#c98f63",
};

const HAIR = ["#0d141a", "#3a2a1d", "#5b3a29", "#2b2b2b"];

export function StickerPerson({
  skin = "warm",
  shirt = "#697bdc",
  hair = 0,
  size = 120,
  className,
  style,
}: {
  skin?: SkinKey;
  shirt?: string;
  hair?: number;
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  const s = SKIN[skin];
  const h = HAIR[hair % HAIR.length];
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      className={className}
      style={style}
      aria-hidden="true"
    >
      <circle cx="60" cy="60" r="56" fill="#fff5ed" stroke="#0d141a" strokeWidth="4" />
      {/* shoulders */}
      <path d="M28 108c0-20 14-30 32-30s32 10 32 30" fill={shirt} stroke="#0d141a" strokeWidth="4" />
      {/* neck */}
      <rect x="52" y="64" width="16" height="18" rx="6" fill={s} stroke="#0d141a" strokeWidth="4" />
      {/* head */}
      <circle cx="60" cy="46" r="22" fill={s} stroke="#0d141a" strokeWidth="4" />
      {/* hair */}
      <path d="M38 44c0-16 10-26 22-26s22 10 22 26c-6-6-13-8-22-8s-16 2-22 8z" fill={h} stroke="#0d141a" strokeWidth="4" />
      {/* face */}
      <circle cx="52" cy="46" r="2.6" fill="#0d141a" />
      <circle cx="68" cy="46" r="2.6" fill="#0d141a" />
      <path d="M53 55c3 3 11 3 14 0" stroke="#0d141a" strokeWidth="3.4" strokeLinecap="round" fill="none" />
    </svg>
  );
}

/** A little crowd used as a decorative "made by people" motif. */
export function PeopleHuddle({ className }: { className?: string }) {
  return (
    <div className={className} style={{ display: "flex", alignItems: "flex-end" }}>
      <StickerPerson skin="deep" shirt="#f3c82e" hair={1} size={92} style={{ marginRight: -18, transform: "rotate(-6deg)" }} />
      <StickerPerson skin="light" shirt="#ff4232" hair={0} size={110} style={{ marginRight: -18, zIndex: 1, position: "relative" }} />
      <StickerPerson skin="warm" shirt="#697bdc" hair={2} size={92} style={{ transform: "rotate(6deg)" }} />
    </div>
  );
}

/** Clearly-marked slot for a real photo the team will add later. */
export function PhotoSlot({
  label,
  ratio = "4 / 3",
  rotate = 0,
  className,
}: {
  label: string;
  ratio?: string;
  rotate?: number;
  className?: string;
}) {
  return (
    <div
      className={`rd-photoslot ${className ?? ""}`}
      style={{ aspectRatio: ratio, transform: rotate ? `rotate(${rotate}deg)` : undefined }}
    >
      <span>📷 {label}</span>
    </div>
  );
}
