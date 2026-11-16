import './Mentoring.css';
import { motion } from 'framer-motion';
import { useLang } from '@/Context/LangContext';
import { fadeIn } from '@/constants/animations';

function Mentoring() {
    const { t } = useLang();
    const m = t.mentoring;

    return (
        <section className="section mentoring-section" id="mentoring">
            <div className="container">
                <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }}>
                    <motion.div className="section-label" variants={fadeIn} custom={0}>
                        {m.label}
                    </motion.div>
                    <motion.h2 className="section-title" variants={fadeIn} custom={1}>
                        {m.title}
                    </motion.h2>

                    <div className="mentoring-grid">
                        <motion.div className="mentoring-block" variants={fadeIn} custom={2}>
                            <div className="mentoring-block-icon">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                            </div>
                            <div className="mentoring-block-title">{m.helpTitle}</div>
                            <ul className="mentoring-help-list">
                                {m.helpItems.map((item) => (
                                    <li key={item.slice(0, 30)}>{item}</li>
                                ))}
                            </ul>
                            <p className="mentoring-disclaimer">{m.disclaimer}</p>
                        </motion.div>

                        <motion.div className="mentoring-block" variants={fadeIn} custom={3}>
                            <div className="mentoring-block-icon">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                            </div>
                            <div className="mentoring-block-title">{m.priceTitle}</div>
                            <div className="mentoring-prices">
                                {m.prices.map((p, i) => (
                                    <div key={i} className="mentoring-price-row">
                                        <span className="mentoring-price-name">{p.name}</span>
                                        <span className="mentoring-price-dots" />
                                        <span className="mentoring-price-value">{p.value}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="mentoring-cta-wrap">
                                <a href="https://t.me/ed_chervonenko" target="_blank" rel="noopener noreferrer" className="btn-primary mentoring-cta-btn">
                                    {m.cta}
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M5 12h14M12 5l7 7-7 7" />
                                    </svg>
                                </a>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}

export default Mentoring;
