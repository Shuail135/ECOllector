import productImage from "../../assets/images/ecollector-product.JPEG";

function ProductHeroMedia() {
  return (
    <div className="relative">
      <div className="absolute inset-x-10 top-10 -z-10 h-[78%] rounded-[36px] bg-[radial-gradient(circle,rgba(59,130,246,0.16),transparent_48%),radial-gradient(circle_at_80%_20%,rgba(16,185,129,0.14),transparent_36%)] blur-3xl" />
      <div className="panel relative overflow-hidden p-5 md:p-6">
        <div className="absolute inset-0 animate-[ambient-gradient-shift_16s_ease-in-out_infinite] bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.10),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.10),transparent_30%)] bg-[length:140%_140%]" />
        <div className="relative">
          <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white/90 p-3 shadow-soft">
            <div className="relative overflow-hidden rounded-[22px] bg-slate-100">
              <div className="pointer-events-none absolute left-4 top-4 z-10 inline-flex items-center gap-2 rounded-full border border-slate-900/10 bg-slate-950/88 px-4 py-2.5 text-xs font-bold uppercase tracking-[0.24em] text-white shadow-[0_14px_36px_rgba(15,23,42,0.34)] backdrop-blur-md ring-1 ring-white/12">
                <span className="h-2.5 w-2.5 animate-[status-pulse_2.8s_ease-in-out_infinite] rounded-full bg-garbage shadow-[0_0_12px_rgba(16,185,129,0.85)]" />
                Prototype Demo
              </div>

              <video
                className="aspect-[4/5] w-full object-cover md:aspect-[5/6] lg:aspect-[4/5]"
                poster={productImage}
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
              >
                <source src="/media/ecollector-demo.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>

              <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/18 to-transparent px-5 py-4">
                <p className="text-sm font-medium text-white/95">
                  Prototype in motion: live sorting and system response
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductHeroMedia;
