import './Projects.css';
import React from 'react';
import { motion } from 'framer-motion';
import { useLang, type ProjectItem } from '@/Context/LangContext';
import { fadeUp } from '@/constants/animations';

const handleGlassMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    e.currentTarget.style.setProperty('--mouse-x', `${x}%`);
    e.currentTarget.style.setProperty('--mouse-y', `${y}%`);
};

const ProjectCard = ({ project, index }: { project: ProjectItem; index: number }) => {
    const content = (
        <>
            <div className="project-card-header">
                <span className="project-icon">{project.icon}</span>
                {project.period && <span className="project-card-period">{project.period}</span>}
            </div>
            <div className="project-card-title">{project.title}</div>
            {project.role && <div className="project-card-role">{project.role}</div>}
            <p className="project-card-desc">{project.desc}</p>
            <div className="project-card-tags">
                {project.tags.map((tag, i) => (
                    <span key={i} className="project-tag">
                        {tag}
                    </span>
                ))}
            </div>
        </>
    );

    const props = {
        className: 'project-card',
        variants: fadeUp,
        initial: 'hidden' as const,
        whileInView: 'visible' as const,
        viewport: { once: true },
        custom: index * 0.5,
        onMouseMove: handleGlassMove
    };

    if (project.link) {
        return (
            <motion.a href={project.link} target="_blank" rel="noopener noreferrer" {...props}>
                {content}
            </motion.a>
        );
    }

    return <motion.div {...props}>{content}</motion.div>;
};

function Projects() {
    const { t } = useLang();

    return (
        <section className="section" id="projects">
            <div className="container">
                <motion.span className="section-label" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}>
                    {t.experience.label}
                </motion.span>
                <motion.h2 className="section-title" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1}>
                    {t.projectCards.title}
                </motion.h2>

                <div className="projects-grid">
                    {t.projectCards.items.map((project, i) => (
                        <ProjectCard key={i} project={project} index={i} />
                    ))}
                </div>
            </div>
        </section>
    );
}

export default Projects;
