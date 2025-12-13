export function BackgroundGradient() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-30">
      {/* 深色底色 */}
      <div className="absolute inset-0 bg-[#050609]" />

      {/* 左上角金色光斑 */}
      <div className="absolute -top-40 -left-40 h-72 w-72 rounded-full bg-gradient-radial from-yellow-400/40 via-yellow-500/10 to-transparent blur-3xl" />

      {/* 右上角偏绿光斑 */}
      <div className="absolute -top-32 right-[-80px] h-72 w-72 rounded-full bg-gradient-radial from-emerald-400/35 via-emerald-500/10 to-transparent blur-3xl" />

      {/* 底部紫色光斑 */}
      <div className="absolute bottom-[-140px] left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-gradient-radial from-purple-500/35 via-purple-500/10 to-transparent blur-3xl" />
    </div>
  )
}
