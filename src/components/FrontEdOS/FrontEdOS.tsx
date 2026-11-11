import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { AnimatePresence, MotionConfig, motion, useReducedMotion } from 'framer-motion';
import { useLang, type Translations } from '@/Context/LangContext';
import { useTheme } from '@/Context/ThemeContext';
import { PARTYSIDE } from '@/constants/projects';
import ParticleCanvas from '@/components/Background/ParticleCanvas';
import portrait from '@/assets/me.jpg';
import './FrontEdOS.css';

const SECTIONS = ['home', 'about', 'skills', 'experience', 'talks', 'mentoring', 'contact'] as const;
type Section = (typeof SECTIONS)[number];
const RESUME_URL = 'https://drive.google.com/drive/folders/1KZ_eu9n9IdUYwfX7PUSVSgQC4hz5nBMp';
const SECTION_FILES: Record<Section, string> = { home: 'about.me', about: 'about', skills: 'tech-stack', experience: 'career', talks: 'talks', mentoring: 'mentoring', contact: 'contact' };
const readSection = (): Section => {
    const value = window.location.hash.slice(1);
    if (value === 'projects') return 'experience';
    return SECTIONS.includes(value as Section) ? (value as Section) : 'home';
};

function Arrow({ diagonal = false }: { diagonal?: boolean }) {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            {diagonal ? <path d="M6 18 18 6M6 6h12v12" /> : <path d="M5 12h14m-6-6 6 6-6 6" />}
        </svg>
    );
}

function Folder({ section }: { section: Section }) {
    const gradientId = useId();
    const icons: Record<Section, ReactNode> = {
        home: <path d="m3 10 9-7 9 7v10H3zm6 10v-7h6v7" />,
        about: (
            <>
                <circle cx="12" cy="7" r="4" />
                <path d="M4 21v-2a8 8 0 0 1 16 0v2" />
            </>
        ),
        skills: (
            <>
                <path d="m8 6-6 6 6 6m8-12 6 6-6 6M14 4l-4 16" />
            </>
        ),
        experience: (
            <>
                <rect x="3" y="7" width="18" height="14" rx="2" />
                <path d="M8 7V4h8v3M3 12l9 3 9-3m-9 1v4" />
            </>
        ),
        talks: (
            <>
                <rect x="9" y="2" width="6" height="12" rx="3" />
                <path d="M5 10v1a7 7 0 0 0 14 0v-1m-7 8v4m-4 0h8" />
            </>
        ),
        mentoring: (
            <>
                <path d="m2 8 10-5 10 5-10 5-10-5zm4 3v6c4 3 8 3 12 0v-6m4-3v9" />
            </>
        ),
        contact: (
            <>
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="m2 7 10 7L22 7" />
            </>
        )
    };
    return (
        <span className={`os-folder os-folder--${section}`} aria-hidden="true">
            <svg className="os-folder-shape" viewBox="0 0 56 48" fill="none" focusable="false">
                <defs>
                    <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
                        <stop className="os-folder-gradient-start" />
                        <stop className="os-folder-gradient-end" offset="1" />
                    </linearGradient>
                </defs>
                <path d="M10 2h10a6 6 0 0 1 5.4 3.4L28 10h18a9 9 0 0 1 9 9v19a9 9 0 0 1-9 9H10a9 9 0 0 1-9-9V11a9 9 0 0 1 9-9Z" fill={`url(#${gradientId})`} />
            </svg>
            <span className="os-folder-mark">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    {icons[section]}
                </svg>
            </span>
        </span>
    );
}

function ExternalLink({ href, children, className = '' }: { href: string; children: ReactNode; className?: string }) {
    return (
        <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
            {children}
        </a>
    );
}

function ContactIcon({ href }: { href: string }) {
    const kind = href.startsWith('mailto:') ? 'email' : href.includes('t.me/') ? 'telegram' : href.includes('github.com/') ? 'github' : href.includes('twitch.tv/') ? 'twitch' : 'resume';
    const paths: Record<string, ReactNode> = {
        telegram: (
            <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
        ),
        github: (
            <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
        ),
        twitch: (
            <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714z" />
        ),
        email: (
            <>
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="m2 7 10 7L22 7" />
            </>
        ),
        resume: (
            <>
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zm0 0v6h6M8 13h8M8 17h8" />
            </>
        )
    };
    const outline = kind === 'email' || kind === 'resume';
    return (
        <span className="os-contact-icon" data-contact-kind={kind} aria-hidden="true">
            <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill={outline ? 'none' : 'currentColor'}
                stroke={outline ? 'currentColor' : undefined}
                strokeWidth={outline ? 1.8 : undefined}
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                {paths[kind]}
            </svg>
        </span>
    );
}

function Tags({ items }: { items: string[] }) {
    return (
        <div className="os-tags">
            {items.map((tag) => (
                <span key={tag}>{tag}</span>
            ))}
        </div>
    );
}

function Stats({ t }: { t: Translations }) {
    return (
        <div className="os-stats">
            {t.about.stats.map((stat) => (
                <div key={stat.label}>
                    <strong>{stat.number}</strong>
                    <span>{stat.label}</span>
                </div>
            ))}
        </div>
    );
}

function PageHeading({ label, title }: { label?: string; title: string }) {
    return (
        <div className="os-page-heading">
            {label && <span className="os-eyebrow">{label}</span>}
            <h1 id="os-page-title">{title}</h1>
        </div>
    );
}

function HomePage() {
    const { t, lang } = useLang();
    const ru = lang === 'ru';
    const quickLinks = [
        { title: 'Telegram', value: '@ra1n_xd', href: 'https://t.me/ra1n_xd' },
        { title: ru ? 'Telegram-канал' : 'Telegram Channel', value: '@fronted_engineer', href: 'https://t.me/fronted_engineer' },
        { title: 'GitHub', value: 'ed-chervonenko', href: 'https://github.com/ed-chervonenko' },
        { title: 'CV / Resume', value: 'Google Drive', href: RESUME_URL }
    ];
    return (
        <div className="os-home">
            <div className="os-home-main">
                <span className="os-status">
                    <span />
                    {t.hero.badge}
                </span>
                <div className="os-profile">
                    <div className="os-avatar">
                        <img src={portrait} alt={t.hero.name} width="160" height="160" />
                    </div>
                    <div>
                        <span className="os-eyebrow">FULLSTACK / TEAMLEAD / MENTOR</span>
                        <h1 id="os-page-title">
                            <span>{t.hero.firstName}</span> <span className="os-name-accent">{t.hero.lastName}</span>
                        </h1>
                    </div>
                </div>
                <p className="os-home-description">{t.hero.desc}</p>
                <Tags items={['React', 'TypeScript', 'Next.js', 'NestJS']} />
                <div className="os-actions">
                    <a href="#experience" className="os-shortcut">
                        <Folder section="experience" />
                        {t.nav.experience}
                        <Arrow />
                    </a>
                    <a href="#talks" className="os-shortcut">
                        <Folder section="talks" />
                        {t.nav.talks}
                        <Arrow />
                    </a>
                </div>
            </div>
            <aside className="os-quick-access" aria-label={ru ? 'Быстрый доступ' : 'Quick access'}>
                <div className="os-eyebrow">{ru ? 'Быстрый доступ' : 'Quick access'}</div>
                <ExternalLink className="os-project-shortcut" href={PARTYSIDE.url}>
                    <img className="os-game-icon" src={PARTYSIDE.icon} alt="" width="44" height="44" />
                    <div>
                        <strong>{PARTYSIDE.title}</strong>
                        <span>React · Socket.IO · Three.js</span>
                    </div>
                    <Arrow diagonal />
                </ExternalLink>
                <div className="os-quick-links">
                    {quickLinks.map((link) => (
                        <ExternalLink href={link.href} key={link.title}>
                            <ContactIcon href={link.href} />
                            <div>
                                <span>{link.title}</span>
                                <strong>{link.value}</strong>
                            </div>
                            <Arrow diagonal />
                        </ExternalLink>
                    ))}
                </div>
                <a href="#contact" className="os-all-links os-shortcut">
                    <Folder section="contact" />
                    {ru ? 'Все контакты' : 'All contact links'}
                    <Arrow />
                </a>
            </aside>
        </div>
    );
}

function AboutPage() {
    const { t } = useLang();
    return (
        <>
            <PageHeading label={t.about.label} title={t.about.title} />
            <div className="os-about-layout">
                <div className="os-prose">
                    <p>{t.about.p1}</p>
                    <p>{t.about.p2}</p>
                    <p>{t.about.p3}</p>
                    <p>{t.about.speakingAndMentoring}</p>
                </div>
                <figure className="os-photo">
                    <img src={portrait} alt={t.hero.name} width="420" height="420" />
                    <figcaption>{t.hero.cardRole}</figcaption>
                </figure>
            </div>
            <Stats t={t} />
        </>
    );
}

function SkillsPage() {
    const { t } = useLang();
    return (
        <>
            <PageHeading label={t.skills.label} title={t.skills.title} />
            <div className="os-skills-grid">
                {t.skills.groups.map((group, index) => (
                    <article className="os-skill" key={group.title}>
                        <div className="os-skill-heading">
                            <span className="os-skill-icon" aria-hidden="true">
                                {group.icon}
                            </span>
                            <span className="os-eyebrow">0{index + 1}</span>
                        </div>
                        <h2>{group.title}</h2>
                        <Tags items={group.tags} />
                    </article>
                ))}
            </div>
        </>
    );
}

function CareerPage() {
    const { t } = useLang();
    const projectsRef = useRef<HTMLElement>(null);

    useEffect(() => {
        if (window.location.hash === '#projects') projectsRef.current?.scrollIntoView();
    }, []);

    return (
        <>
            <div className="os-career-heading">
                <PageHeading label={t.experience.label} title={t.experience.workTitle} />
                <a href="#projects" className="os-text-link">
                    {t.projectCards.title}
                    <Arrow />
                </a>
            </div>
            <div className="os-career">
                {t.experience.work.map((work, index) => (
                    <article className="os-work" key={work.company}>
                        <div className="os-work-meta">
                            <span className="os-eyebrow">
                                0{index + 1} / {work.period}
                            </span>
                            <h2>
                                {work.logo && <img className="os-company-logo" src={work.logo} alt="" width="40" height="40" />}
                                {work.company}
                            </h2>
                            {work.current && (
                                <span className="os-status">
                                    <span />
                                    {t.experience.now}
                                </span>
                            )}
                        </div>
                        <div className="os-work-detail">
                            <h3>{work.role}</h3>
                            <ul className="os-list">
                                {work.bullets.map((bullet) => (
                                    <li key={bullet}>{bullet}</li>
                                ))}
                            </ul>
                        </div>
                    </article>
                ))}
            </div>
            <section className="os-career-projects" id="projects" ref={projectsRef} aria-labelledby="os-projects-title">
                <h2 id="os-projects-title">{t.projectCards.title}</h2>
                <CareerProjects />
            </section>
        </>
    );
}

function CareerProjects() {
    const { t, lang } = useLang();
    const reduceMotion = useReducedMotion();
    return (
        <div className="os-projects-grid">
            {t.projectCards.items.map((project) => {
                const Card = project.link ? motion.a : motion.article;
                return (
                    <Card
                        className="os-project"
                        key={project.title}
                        href={project.link}
                        target={project.link ? '_blank' : undefined}
                        rel={project.link ? 'noopener noreferrer' : undefined}
                        aria-label={project.link ? `${project.title} — ${lang === 'ru' ? 'открыть в новой вкладке' : 'open in a new tab'}` : undefined}
                        whileHover={project.link && !reduceMotion ? { y: -4 } : undefined}
                        transition={{ type: 'spring', stiffness: 350, damping: 26 }}
                    >
                        <span className="os-project-meta">{project.period}</span>
                        <div className="os-project-heading">
                            {project.icon && (
                                <span className="os-project-icon" aria-hidden="true">
                                    {project.icon}
                                </span>
                            )}
                            <h3>{project.title}</h3>
                            {project.link && <Arrow diagonal />}
                        </div>
                        <span className="os-role">{project.role}</span>
                        <p>{project.desc}</p>
                        <Tags items={project.tags} />
                    </Card>
                );
            })}
        </div>
    );
}

function TalksPage() {
    const { t, lang } = useLang();
    const reduceMotion = useReducedMotion();
    return (
        <div className="os-talks-page">
            <PageHeading title={t.nav.talks} />
            <div className="os-talks">
                {t.talks.map((talk, index) => (
                    <motion.a
                        className="os-project"
                        key={talk.href}
                        href={talk.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${talk.title} — ${lang === 'ru' ? 'открыть в новой вкладке' : 'open in a new tab'}`}
                        whileHover={reduceMotion ? undefined : { y: -4 }}
                        transition={{ type: 'spring', stiffness: 350, damping: 26 }}
                    >
                        <div className="os-video-preview">
                            <img src={`https://img.youtube.com/vi/${talk.videoId}/hqdefault.jpg`} alt="" width="480" height="360" loading="lazy" />
                            <span className="os-play" aria-hidden="true">
                                ▷
                            </span>
                        </div>
                        <div className="os-project-content">
                            <div className="os-project-meta">
                                <span className="os-eyebrow">0{index + 1} / VIDEO</span>
                                {talk.period && <span>{talk.period}</span>}
                            </div>
                            <div className="os-project-heading">
                                {talk.icon && (
                                    <span className="os-project-icon" aria-hidden="true">
                                        {talk.icon}
                                    </span>
                                )}
                                <h2>{talk.title}</h2>
                                <Arrow diagonal />
                            </div>
                            <span className="os-role">{talk.role}</span>
                            <p>{talk.desc}</p>
                            <Tags items={talk.tags} />
                        </div>
                    </motion.a>
                ))}
            </div>
        </div>
    );
}

function MentoringPage() {
    const { t } = useLang();
    const m = t.mentoring;
    return (
        <>
            <PageHeading label={m.label} title={m.title} />
            <div className="os-mentoring-layout">
                <div>
                    <div className="os-prose os-mentor-intro">
                        <p>{m.about}</p>
                        <p>{m.aboutExtra}</p>
                    </div>
                    <h2>{m.helpTitle}</h2>
                    <ul className="os-list">
                        {m.helpItems.map((item) => (
                            <li key={item}>{item}</li>
                        ))}
                    </ul>
                    <p className="os-disclaimer">{m.disclaimer}</p>
                </div>
                <aside className="os-price-panel">
                    <span className="os-eyebrow">MENTORING / 1:1</span>
                    <h2>{m.priceTitle}</h2>
                    <dl className="os-prices">
                        {m.prices.map((price) => (
                            <div key={price.name}>
                                <dt>{price.name}</dt>
                                <dd>{price.value}</dd>
                            </div>
                        ))}
                    </dl>
                    <ExternalLink href="https://t.me/ra1n_xd" className="os-button os-button--primary">
                        {m.cta}
                        <Arrow diagonal />
                    </ExternalLink>
                </aside>
            </div>
        </>
    );
}

function ContactPage() {
    const { t } = useLang();
    const contacts = [
        ...t.contact.items,
        { icon: null, label: 'Twitch', value: 'fronted_ra1n', href: 'https://www.twitch.tv/fronted_ra1n' },
        { icon: null, label: 'CV / Resume', value: 'Google Drive', href: RESUME_URL }
    ];
    return (
        <>
            <PageHeading label={t.contact.label} title={t.contact.title} />
            <p className="os-contact-description">{t.contact.desc}</p>
            <div className="os-contacts">
                {contacts.map((contact) => (
                    <ExternalLink href={contact.href} className="os-contact-link" key={contact.label}>
                        <ContactIcon href={contact.href} />
                        <div>
                            <span>{contact.label}</span>
                            <strong>{contact.value}</strong>
                        </div>
                        <Arrow diagonal />
                    </ExternalLink>
                ))}
            </div>
        </>
    );
}

const PAGES: Record<Section, () => ReactNode> = {
    home: HomePage,
    about: AboutPage,
    skills: SkillsPage,
    experience: CareerPage,
    talks: TalksPage,
    mentoring: MentoringPage,
    contact: ContactPage
};

function Desktop() {
    const { t, lang, toggleLang } = useLang();
    const { theme, toggleTheme } = useTheme();
    const reduceMotion = useReducedMotion();
    const [active, setActive] = useState<Section>(readSection);
    const contentRef = useRef<HTMLDivElement>(null);
    const navigated = useRef(false);
    const ru = lang === 'ru';
    const sectionLabel = (section: Section) => (section === 'home' ? (ru ? 'Главная' : 'Home') : t.nav[section]);
    const index = SECTIONS.indexOf(active);
    const CurrentPage = PAGES[active];

    useEffect(() => {
        const onHashChange = () => {
            if (window.location.hash === '#os-document') return;
            navigated.current = true;
            setActive(readSection());
            if (window.location.hash !== '#projects') window.scrollTo({ top: 0, behavior: 'instant' });
        };
        window.addEventListener('hashchange', onHashChange);
        return () => window.removeEventListener('hashchange', onHashChange);
    }, []);
    useEffect(() => {
        document.documentElement.lang = lang;
        document.title = `${t.hero.name} — ${active === 'home' ? 'Fullstack Developer' : t.nav[active]}`;
    }, [lang, active, t]);
    useEffect(() => {
        document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#070a12' : '#f0f4ff');
    }, [theme]);
    const focusPage = () => {
        if (navigated.current) contentRef.current?.focus({ preventScroll: true });
    };

    return (
        <div className="os-shell">
            <ParticleCanvas />
            <a
                className="os-skip-link"
                href="#os-document"
                onClick={(event) => {
                    event.preventDefault();
                    document.getElementById('os-document')?.focus();
                }}
            >
                {ru ? 'Перейти к содержимому' : 'Skip to content'}
            </a>
            <div className="os-workspace">
                <div className="os-desktop">
                    <aside className="os-sidebar">
                        <nav className="os-dock" aria-label={ru ? 'Папки портфолио' : 'Portfolio folders'}>
                            {SECTIONS.map((section) => (
                                <a className={`os-dock-item${active === section ? ' is-active' : ''}`} href={`#${section}`} key={section} aria-current={active === section ? 'page' : undefined}>
                                    <Folder section={section} />
                                    <span>{sectionLabel(section)}</span>
                                </a>
                            ))}
                            <ExternalLink className="os-dock-item" href={PARTYSIDE.url}>
                                <img className="os-game-icon" src={PARTYSIDE.icon} alt="" width="44" height="44" />
                                <span>{PARTYSIDE.title}</span>
                            </ExternalLink>
                        </nav>
                        <div className="os-desktop-settings">
                            <div className="os-controls">
                                <button type="button" onClick={toggleLang} aria-label={ru ? 'Switch to English' : 'Переключить на русский'}>
                                    {ru ? 'EN' : 'RU'}
                                </button>
                                <button
                                    type="button"
                                    onClick={toggleTheme}
                                    aria-label={ru ? (theme === 'dark' ? 'Включить светлую тему' : 'Включить тёмную тему') : theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
                                >
                                    <svg className="os-theme-icon" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
                                        <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.5" />
                                        <path d="M12 3a9 9 0 0 0 0 18Z" fill="currentColor" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </aside>
                    <main className="os-window" id="os-document" tabIndex={-1} aria-label={sectionLabel(active)}>
                        <div className="os-titlebar">
                            <div className="os-window-dots" aria-hidden="true">
                                <span />
                                <span />
                                <span />
                            </div>
                            <div className="os-window-path">
                                <span>eduard</span>
                                <span>/</span>
                                <span>{SECTION_FILES[active]}</span>
                            </div>
                            <span className="os-titlebar-label">{sectionLabel(active)}</span>
                        </div>
                        <AnimatePresence mode="wait" initial={false}>
                            <motion.div
                                key={active}
                                className="os-document-content"
                                ref={contentRef}
                                tabIndex={-1}
                                aria-labelledby="os-page-title"
                                initial={{ opacity: 0, y: reduceMotion ? 0 : 24, scale: reduceMotion ? 1 : 0.985 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: reduceMotion ? 0 : -10, scale: reduceMotion ? 1 : 0.995 }}
                                transition={reduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 280, damping: 28, mass: 0.8 }}
                                onAnimationComplete={focusPage}
                            >
                                <CurrentPage />
                            </motion.div>
                        </AnimatePresence>
                        <div className="os-window-footer">
                            <span className="os-document-position">
                                {String(index + 1).padStart(2, '0')} / 07 <span>{sectionLabel(active)}</span>
                            </span>
                            <a href="#home" className="os-return-folder">
                                <Folder section="home" />
                                <span>{ru ? 'Главная' : 'Home'}</span>
                            </a>
                        </div>
                    </main>
                </div>
                <footer className="os-system-footer">
                    <span>{t.footer.copy}</span>
                    <span className="os-status">
                        <span />
                        {t.hero.badge}
                    </span>
                    <ExternalLink href={RESUME_URL}>
                        CV / Resume
                        <Arrow diagonal />
                    </ExternalLink>
                </footer>
            </div>
        </div>
    );
}

export default function FrontEdOS() {
    return (
        <MotionConfig reducedMotion="user">
            <Desktop />
        </MotionConfig>
    );
}
