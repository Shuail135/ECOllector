import { motion } from "framer-motion";
import cameraSensorImage from "../../assets/images/ecollector-camera&sensor.JPEG";
import productImage from "../../assets/images/ecollector-product.JPEG";
import topViewImage from "../../assets/images/ecollector-topview.JPEG";
import { fadeUp, hoverLift, hoverTransition } from "../../lib/motion";

const prototypeImages = [
  {
    title: "Complete system prototype",
    caption:
      "Fully assembled ECOllector unit showing the intake area, internal dividers, and physical sorting structure.",
    image: productImage,
  },
  {
    title: "Sensing components",
    caption:
      "Camera and ultrasonic sensor setup used to detect incoming items and capture data for real-time classification.",
    image: cameraSensorImage,
  },
  {
    title: "Sorting mechanism",
    caption:
      "Mechanical dropper system that routes items into the correct bin based on classification output.",
    image: topViewImage,
  },
];

function PrototypeSection() {
  return (
    <section id="prototype" className="section-shell pb-20">
      <motion.div
        className="section-copy"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.45 }}
        variants={fadeUp}
      >
        <span className="eyebrow">Prototype</span>
        <h2 className="mt-5 text-3xl font-extrabold tracking-[-0.05em] text-ink md:text-5xl">
          Real system, tested in operation
        </h2>
      </motion.div>

      <div className="mt-12 grid gap-5 lg:grid-cols-3">
        {prototypeImages.map((item, index) => (
          <motion.article
            key={item.title}
            custom={index * 0.08}
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.25 }}
            whileHover={hoverLift}
            transition={hoverTransition}
            className="panel overflow-hidden p-3 transition duration-300 ease-out will-change-transform hover:border-slate-300 hover:shadow-[0_24px_48px_rgba(15,23,42,0.12)]"
          >
            <div className="overflow-hidden rounded-[22px] border border-slate-200 bg-slate-100">
              <motion.img
                src={item.image}
                alt={item.title}
                className="aspect-[3/4] w-full object-cover"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>
            <div className="px-2 pb-2 pt-5">
              <p className="text-base font-semibold tracking-[-0.03em] text-ink">{item.title}</p>
              <p className="mt-2 text-sm leading-7 text-[#27292b]">{item.caption}</p>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}

export default PrototypeSection;
