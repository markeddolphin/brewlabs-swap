import styles from "./Bubbles.module.scss";

const x = Array.from(Array(60).keys());

const Bubbles = () => (
  <div className="absolute bottom-0 left-0 h-screen w-full overflow-hidden opacity-30 md:opacity-90">
    {x.map((item) => (
      <div key={item} className={styles.container}>
        <div
          className={`${styles.circle} border border-white dark:border-gray-600`}
        ></div>
      </div>
    ))}
  </div>
);

export default Bubbles;
