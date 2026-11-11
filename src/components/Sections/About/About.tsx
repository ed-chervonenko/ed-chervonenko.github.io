import './About.css';
import React from 'react';
import { motion } from 'framer-motion';
import { useLang } from '@/Context/LangContext';
import { fadeUp } from '@/constants/animations';

const handleGlassMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    e.currentTarget.style.setProperty('--mouse-x', `${x}%`);
    e.currentTarget.style.setProperty('--mouse-y', `${y}%`);
};

function About() {
    const { t } = useLang();

    return (
        <section className="about section" id="about">
            <div className="container">
                <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }}>
                    <motion.span className="section-label" variants={fadeUp} custom={0}>
                        {t.about.label}
                    </motion.span>
                    <motion.h2 className="section-title" variants={fadeUp} custom={1}>
                        {t.about.title}
                    </motion.h2>

                    <div className="about-grid">
                        <motion.div className="about-text" variants={fadeUp} custom={2}>
                            <p>{t.about.p1}</p>
                            <p>{t.about.p2}</p>
                            <p>{t.about.p3}</p>
                            <p>{t.about.speakingAndMentoring}</p>
                        </motion.div>

                        <motion.div className="about-stats" variants={fadeUp} custom={3}>
                            {t.about.stats.map((stat, i) => (
                                <motion.div key={i} className="stat-card" variants={fadeUp} custom={4}>
                                    <div className="stat-number">{stat.number}</div>
                                    <div className="stat-label">{stat.label}</div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>

                    <motion.div className="macos-window about-skills" variants={fadeUp} custom={5}>
                        <div className="macos-titlebar">
                            <div className="macos-dots">
                                <span className="macos-dot macos-dot-red" />
                                <span className="macos-dot macos-dot-yellow" />
                                <span className="macos-dot macos-dot-green" />
                            </div>
                            <div className="macos-title">~/ed/skills</div>
                            <div className="macos-titlebar-right" />
                        </div>
                        <div className="macos-body">
                            <div className="skills-grid">
                                {t.skills.groups.map((group, i) => (
                                    <motion.div key={i} className="skill-group" variants={fadeUp} custom={6} onMouseMove={handleGlassMove}>
                                        <span className="skill-group-icon">{group.icon}</span>
                                        <div className="skill-group-title">{group.title}</div>
                                        <div className="skill-tags">
                                            {group.tags.map((tag) => (
                                                <span key={tag} className="skill-tag">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}

export default About;
