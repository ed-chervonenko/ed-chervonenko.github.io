import './Navbar.css';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useLang } from '@/Context/LangContext';
import { useTheme } from '@/Context/ThemeContext';
import { useModal } from '@/Context/ModalContext';
import logo from '@/assets/fronted-logo.png';

const NAV_IDS = ['about', 'experience', 'projects', 'mentoring'] as const;
type NavId = (typeof NAV_IDS)[number];
type NavSection = {
    id: NavId;
    top: number;
    bottom: number;
};

const getActiveSection = (sections: NavSection[], scrollY: number, viewportHeight: number, documentHeight: number): NavId | '' => {
    if (!sections.length) return '';

    const maxScrollY = Math.max(documentHeight - viewportHeight, 0);
    if (maxScrollY > 0 && scrollY >= maxScrollY - 2) {
        return sections[sections.length - 1].id;
    }

    const activationOffset = Math.min(Math.max(viewportHeight * 0.32, 160), 360);
    const activationY = scrollY + activationOffset;
    let current: NavId | '' = '';

    for (const section of sections) {
        if (activationY >= section.top && activationY < section.bottom) {
            return section.id;
        }
        if (activationY >= section.top) {
            current = section.id;
        }
    }

    return current;
};

const isNavId = (id: string): id is NavId => NAV_IDS.includes(id as NavId);

function Navbar() {
    const { t, lang, toggleLang } = useLang();
    const { theme, toggleTheme } = useTheme();
    const { openModal } = useModal();
    const [scrolled, setScrolled] = useState(false);
    const [active, setActive] = useState<NavId | ''>('');
    const [mobileOpen, setMobileOpen] = useState(false);
    const listRef = useRef<HTMLUListElement>(null);
    const [pill, setPill] = useState({ left: 0, width: 0, opacity: 0 });

    const navLinks = [
        { label: t.nav.about, id: 'about' },
        { label: t.nav.experience, id: 'experience' },
        { label: t.projectCards.title, id: 'projects' },
        { label: t.nav.mentoring, id: 'mentoring' }
    ];

    const updatePill = useCallback(() => {
        if (!listRef.current || !active) {
            setPill((p) => ({ ...p, opacity: 0 }));
            return;
        }
        const activeBtn = listRef.current.querySelector(`.nav-list__link.active`) as HTMLElement | null;
        if (activeBtn) {
            const listRect = listRef.current.getBoundingClientRect();
            const btnRect = activeBtn.getBoundingClientRect();
            setPill({
                left: btnRect.left - listRect.left,
                width: btnRect.width,
                opacity: 1
            });
        }
    }, [active]);

    useEffect(() => {
        updatePill();
    }, [active, updatePill, lang]);

    useEffect(() => {
        const onScroll = () => {
            setScrolled(window.scrollY > 20);
            const sections = NAV_IDS.flatMap((id) => {
                const sec = document.getElementById(id);
                return sec
                    ? [
                          {
                              id,
                              top: sec.offsetTop,
                              bottom: sec.offsetTop + sec.offsetHeight
                          }
                      ]
                    : [];
            });
            const current = getActiveSection(sections, window.scrollY, window.innerHeight, document.documentElement.scrollHeight);
            setActive((prev) => (prev === current ? prev : current));
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => {
        document.body.style.overflow = mobileOpen ? 'hidden' : '';
        return () => {
            document.body.style.overflow = '';
        };
    }, [mobileOpen]);

    const scrollTo = (id: string) => {
        setActive(isNavId(id) ? id : '');
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
        setMobileOpen(false);
    };

    return (
        <>
            <nav className={`nav${scrolled ? ' scrolled' : ''}`}>
                <div className="container">
                    <span className="nav-logo" onClick={() => scrollTo('home')}>
                        <img className="nav-logo-icon" src={logo} alt="FrontEd" width="22" height="22" />
                        <span>
                            Front<span className="a">Ed</span>
                        </span>
                    </span>

                    <ul className="nav-list" ref={listRef}>
                        <li
                            className="nav-pill"
                            style={{
                                transform: `translateX(${pill.left}px)`,
                                width: pill.width,
                                opacity: pill.opacity
                            }}
                            aria-hidden
                        />
                        {navLinks.map((link, i) => (
                            <li key={link.id} style={{ animationDelay: `${i * 60}ms` }} className="nav-list__item">
                                <button className={`nav-list__link${active === link.id ? ' active' : ''}`} onClick={() => scrollTo(link.id)}>
                                    {link.label}
                                </button>
                            </li>
                        ))}
                    </ul>

                    <div className="nav-controls">
                        <button className="nav-toggle" onClick={toggleLang} title={lang === 'en' ? 'Русский' : 'English'}>
                            {lang === 'en' ? 'RU' : 'EN'}
                        </button>

                        <button className="nav-toggle" onClick={toggleTheme} title={theme === 'dark' ? 'Light mode' : 'Dark mode'}>
                            {theme === 'dark' ? (
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="5" />
                                    <line x1="12" y1="1" x2="12" y2="3" />
                                    <line x1="12" y1="21" x2="12" y2="23" />
                                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                                    <line x1="1" y1="12" x2="3" y2="12" />
                                    <line x1="21" y1="12" x2="23" y2="12" />
                                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                                </svg>
                            ) : (
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                                </svg>
                            )}
                        </button>

                        <button
                            className="nav-cta"
                            onClick={() => {
                                setMobileOpen(false);
                                openModal();
                            }}
                        >
                            {t.nav.contact}
                        </button>

                        <button className={`nav-burger${mobileOpen ? ' open' : ''}`} onClick={() => setMobileOpen((v) => !v)} aria-label="Menu">
                            <span />
                            <span />
                            <span />
                        </button>
                    </div>
                </div>
            </nav>

            <div className={`nav-mobile${mobileOpen ? ' open' : ''}`}>
                {navLinks.map((link) => (
                    <button key={link.id} className={`nav-list__link${active === link.id ? ' active' : ''}`} onClick={() => scrollTo(link.id)}>
                        {link.label}
                    </button>
                ))}
                <button
                    className="nav-cta"
                    onClick={() => {
                        setMobileOpen(false);
                        openModal();
                    }}
                >
                    {t.nav.contact}
                </button>
            </div>
        </>
    );
}

export default Navbar;
