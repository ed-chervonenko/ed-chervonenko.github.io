import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { STORAGE_KEYS } from '@/constants/storage';
import { PARTYSIDE } from '@/constants/projects';
import sixSeniorsLogo from '@/assets/6seniors-logo.jpg';
import centerInstrumentLogo from '@/assets/center-instrument-logo.svg';
import manipulaLogo from '@/assets/manipula-logo.png';
import txixLogo from '@/assets/txix-logo.png';

type Lang = 'en' | 'ru';

interface Stat {
    number: string;
    label: string;
}

interface SkillGroup {
    icon: ReactNode;
    title: string;
    tags: string[];
}

export interface WorkItem {
    role: string;
    company: string;
    logo?: string;
    period: string;
    current: boolean;
    bullets: string[];
}

export interface ProjectItem {
    icon?: ReactNode;
    title: string;
    role: string;
    period: string;
    desc: string;
    tags: string[];
    link?: string;
}

interface TalkItem {
    title: string;
    href: string;
    videoId: string;
    icon?: ReactNode;
    role: string;
    period?: string;
    desc: string;
    tags: string[];
}

interface PriceItem {
    name: string;
    value: string;
}

interface ContactItem {
    icon: ReactNode;
    label: string;
    value: string;
    href: string;
}

/* ── SVG Icons ── */
const svgProps = { width: 20, height: 20, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };

const ICONS = {
    zap: (
        <svg {...svgProps}>
            <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" />
        </svg>
    ),
    palette: (
        <svg {...svgProps}>
            <circle cx="13.5" cy="6.5" r=".5" fill="currentColor" />
            <circle cx="17.5" cy="10.5" r=".5" fill="currentColor" />
            <circle cx="8.5" cy="7.5" r=".5" fill="currentColor" />
            <circle cx="6.5" cy="12" r=".5" fill="currentColor" />
            <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" />
        </svg>
    ),
    server: (
        <svg {...svgProps}>
            <rect x="2" y="2" width="20" height="8" rx="2" />
            <rect x="2" y="14" width="20" height="8" rx="2" />
            <circle cx="6" cy="6" r="1" fill="currentColor" stroke="none" />
            <circle cx="6" cy="18" r="1" fill="currentColor" stroke="none" />
        </svg>
    ),
    database: (
        <svg {...svgProps}>
            <ellipse cx="12" cy="5" rx="9" ry="3" />
            <path d="M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5" />
            <path d="M3 12c0 1.66 4.03 3 9 3s9-1.34 9-3" />
        </svg>
    ),
    rocket: (
        <svg {...svgProps}>
            <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
            <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
            <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
            <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
        </svg>
    ),
    wrench: (
        <svg {...svgProps}>
            <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
        </svg>
    ),
    dice: (
        <svg {...svgProps}>
            <rect x="2" y="2" width="20" height="20" rx="3" />
            <circle cx="8" cy="8" r="1.5" fill="currentColor" stroke="none" />
            <circle cx="16" cy="8" r="1.5" fill="currentColor" stroke="none" />
            <circle cx="8" cy="16" r="1.5" fill="currentColor" stroke="none" />
            <circle cx="16" cy="16" r="1.5" fill="currentColor" stroke="none" />
            <circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none" />
        </svg>
    ),
    mail: (
        <svg {...svgProps}>
            <rect x="2" y="4" width="20" height="16" rx="2" />
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
        </svg>
    ),
    send: (
        <svg {...svgProps}>
            <path d="m22 2-7 20-4-9-9-4z" />
            <path d="m22 2-11 11" />
        </svg>
    ),
    megaphone: (
        <svg {...svgProps}>
            <path d="m3 11 18-5v12L3 13v-2z" />
            <path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" />
        </svg>
    ),
    briefcase: (
        <svg {...svgProps}>
            <rect x="2" y="7" width="20" height="14" rx="2" />
            <path d="M16 7V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v3" />
        </svg>
    ),
    gitBranch: (
        <svg {...svgProps}>
            <line x1="6" y1="3" x2="6" y2="15" />
            <circle cx="18" cy="6" r="3" />
            <circle cx="6" cy="18" r="3" />
            <path d="M18 9a9 9 0 0 1-9 9" />
        </svg>
    )
};

export interface Translations {
    nav: {
        about: string;
        skills: string;
        experience: string;
        talks: string;
        mentoring: string;
        contact: string;
    };
    hero: {
        badge: string;
        name: string;
        firstName: string;
        lastName: string;
        subtitle: string;
        cardRole: string;
        desc: string;
        cta: string;
        viewExperience: string;
        scroll: string;
    };
    about: {
        label: string;
        title: string;
        p1: ReactNode;
        p2: ReactNode;
        p3: ReactNode;
        speakingAndMentoring: ReactNode;
        stats: Stat[];
    };
    skills: {
        label: string;
        title: string;
        groups: SkillGroup[];
    };
    experience: {
        label: string;
        workTitle: string;
        now: string;
        work: WorkItem[];
    };
    projectCards: {
        title: string;
        items: ProjectItem[];
    };
    talks: TalkItem[];
    mentoring: {
        label: string;
        title: string;
        about: string;
        aboutExtra: string;
        helpTitle: string;
        helpItems: string[];
        disclaimer: string;
        priceTitle: string;
        prices: PriceItem[];
        cta: string;
    };
    contact: {
        label: string;
        title: string;
        desc: string;
        items: ContactItem[];
    };
    footer: {
        copy: string;
    };
}

interface LangContextValue {
    lang: Lang;
    toggleLang: () => void;
    t: Translations;
}

const LangContext = createContext<LangContextValue | undefined>(undefined);
const IT_HOZYAEVA_TALK = { href: 'https://youtu.be/XQ9E-r7i0oE', videoId: 'XQ9E-r7i0oE' };
const JS_MENTORING_STREAM = { href: 'https://www.youtube.com/live/W2y0QlShyd0', videoId: 'W2y0QlShyd0' };
const SIX_SENIORS_CHANNEL = 'https://www.youtube.com/@6seniors';

const translations: Record<Lang, Translations> = {
    en: {
        nav: {
            about: 'About',
            skills: 'Tech Stack',
            experience: 'Career',
            talks: 'Talks',
            mentoring: 'Mentoring',
            contact: 'Contact'
        },
        hero: {
            badge: 'Available for work',
            name: 'Eduard Chervonenko',
            firstName: 'Eduard',
            lastName: 'Chervonenko',
            subtitle: '<Fullstack Developer | TeamLead | Mentor />',
            cardRole: 'Fullstack Developer · TeamLead · Mentor',
            desc: '4+ years building web applications with React, TypeScript, Next.js and NestJS. Passionate about clean code, great UX, and continuous learning.',
            cta: 'Contact me',
            viewExperience: 'Experience',
            scroll: 'scroll'
        },
        about: {
            label: 'About me',
            title: 'Who I am',
            p1: (
                <>
                    I'm a <strong>Fullstack Developer</strong> with 4+ years of experience building modern web applications. My stack centers around React, TypeScript, Next.js on the frontend and
                    NestJS on the backend.
                </>
            ),
            p2: (
                <>
                    I got into development at 16 and never stopped. Since then I've worked across the stack — from building pixel-perfect UIs to architecting backend services and setting up CI/CD
                    pipelines.
                </>
            ),
            p3: (
                <>
                    I graduated with <strong>honors</strong> in Computer Science and Information Technology from Belgorod State University in 2024. Beyond coding, I enjoy mentoring junior developers
                    and establishing good engineering practices in teams.
                </>
            ),
            speakingAndMentoring: (
                <>
                    I've given technical talks and mentored developers online. I also run a{' '}
                    <a href="https://t.me/s/fronted_engineer" target="_blank" rel="noopener noreferrer">
                        Telegram channel
                    </a>
                    .
                </>
            ),
            stats: [
                { number: '4+', label: 'Years of experience' },
                { number: '10+', label: 'Projects shipped' },
                { number: '2', label: 'Teams led' },
                { number: '15+', label: 'People mentored' }
            ]
        },
        skills: {
            label: 'Tech Stack',
            title: 'Skills & Technologies',
            groups: [
                { icon: ICONS.zap, title: 'Languages', tags: ['JavaScript', 'TypeScript', 'Python', 'PHP', 'Go'] },
                { icon: ICONS.palette, title: 'Frontend', tags: ['React', 'Next.js', 'Vue.js', 'Redux / RTK', 'Zustand', 'SCSS', 'Ant Design', 'MUI'] },
                { icon: ICONS.server, title: 'Backend', tags: ['NestJS', 'FastAPI', 'Node.js', 'REST API', 'GraphQL'] },
                { icon: ICONS.database, title: 'Databases', tags: ['PostgreSQL', 'MySQL', 'MongoDB'] },
                { icon: ICONS.rocket, title: 'DevOps', tags: ['Docker', 'GitLab CI/CD', 'Linux', 'VPS / VDS'] },
                { icon: ICONS.wrench, title: 'Tools', tags: ['Git', 'ESLint', 'Prettier', 'Vite', 'Webpack', 'Figma'] }
            ]
        },
        experience: {
            label: 'Career',
            workTitle: 'Work Experience',
            now: 'now',
            work: [
                {
                    role: 'Fullstack Developer / Team Lead',
                    company: 'Center-Instrument · Part-time',
                    logo: centerInstrumentLogo,
                    period: 'Feb 2026 — Present',
                    current: true,
                    bullets: [
                        'Lead the engineering and catalog content teams, assign work and review code.',
                        'Designed the architecture of an online industrial tool store for individual and business customers. Develop the frontend with Next.js and TypeScript and the backend with Node.js, Prisma and PostgreSQL.',
                        'Improved page load performance and reduced LCP. Improved the marketplace’s search rankings through technical SEO.',
                        'Built the catalog, cart and checkout for consumers and businesses. Worked on Alfa-Bank, Yandex Delivery and DaData integrations.',
                        'Built an admin panel and automated XLSX product imports with validation and SKU-based updates.'
                    ]
                },
                {
                    role: 'Frontend Developer',
                    company: 'TXIX',
                    logo: txixLogo,
                    period: 'Feb 2024 — Present',
                    current: true,
                    bullets: [
                        'Built interfaces for managing campaigns across email, SMS, push notifications and messaging apps.',
                        'Built the frontend for a service that digitized organizational workflows.',
                        'Modernized legacy frontends by migrating away from class components and reworking state management.',
                        'Contributed reusable components to the internal UI kit.'
                    ]
                },
                {
                    role: 'Fullstack Developer',
                    company: 'SG-Group',
                    period: 'Jan 2021 — Jul 2021',
                    current: false,
                    bullets: [
                        'Built fullstack sites and admin panels from scratch for medium-sized and large businesses in the region (pharmacies, retail stores, and others).',
                        'Integrated third-party services via APIs to meet client needs (Yandex Maps, email notification services, and others).',
                        'Introduced Git and Scrum to the team.',
                        'Mentored new developers and helped them get up to speed on projects.'
                    ]
                }
            ]
        },
        projectCards: {
            title: 'Projects',
            items: [
                {
                    icon: <img src={PARTYSIDE.icon} alt="" width="40" height="40" />,
                    title: PARTYSIDE.title,
                    role: 'Fullstack Developer',
                    period: 'Feb 2026 — Present',
                    desc: 'An online platform for playing games with friends: join a room, chat and spend time together right in your browser.',
                    tags: ['React', 'TypeScript', 'Node.js', 'Express', 'Socket.IO', 'Three.js'],
                    link: PARTYSIDE.url
                },
                {
                    icon: <img src={manipulaLogo} alt="" width="40" height="40" />,
                    title: 'ManipulA',
                    role: 'TeamLead',
                    period: 'Dec 2025 — Present',
                    desc: 'Telegram bot for a massage salon with booking, scheduling and admin panel. MVP launched in one week with a full team workflow.',
                    tags: ['NestJS', 'React', 'PostgreSQL', 'Docker', 'Telegram Bot API']
                },
                {
                    icon: <img src={sixSeniorsLogo} alt="" width="40" height="40" />,
                    title: '6Seniors · JS Mentoring from Scratch',
                    role: 'Mentor',
                    period: 'Jun 2024 — Present',
                    desc: '6Seniors — mentoring entry-level developers from zero to junior/middle, building a real fullstack project step by step with best practices and live coding.',
                    tags: ['React', 'NestJS', 'TypeScript', 'Live Coding', 'Mentoring'],
                    link: SIX_SENIORS_CHANNEL
                }
            ]
        },
        talks: [
            {
                ...IT_HOZYAEVA_TALK,
                icon: ICONS.megaphone,
                title: 'Talk · IT-ХОЗЯЕВА',
                role: 'Speaker',
                desc: 'Gave a talk representing the IT-ХОЗЯЕВА developer community. Watch the recording on YouTube.',
                tags: ['Community', 'Public Speaking', 'YouTube']
            },
            {
                ...JS_MENTORING_STREAM,
                title: 'JS Mentoring from Scratch',
                role: 'Mentor',
                period: 'Jun 2024 — Present',
                desc: '6Seniors — mentoring entry-level developers from zero to junior/middle, building a real fullstack project step by step with best practices and live coding.',
                tags: ['React', 'NestJS', 'TypeScript', 'Live Coding', 'Mentoring']
            }
        ],
        mentoring: {
            label: 'Mentoring',
            title: 'My Services',
            about: "I'm a frontend/fullstack developer and I prepare beginners in this field. I've been working professionally since 2021. I hold an honors bachelor's degree in Computer Science and Information Technology.",
            aboutExtra: "I've been mentoring since summer 2024 in an educational project and individually. Several people have already been hired since then.",
            helpTitle: 'What I help with',
            helpItems: [
                'Fundamental JavaScript learning',
                'React and its ecosystem',
                'Code review',
                'Interview preparation',
                'Resume building',
                'Connecting with HRs who reach out to me (when possible)',
                'Other real-life questions (real work cases, procrastination, etc.)'
            ],
            disclaimer: "I do mentoring — helping you learn. I can't promise 100% employment like sketchy courses, especially now when the market is oversaturated with juniors.",
            priceTitle: 'Pricing',
            prices: [
                { name: 'Quick basic questions', value: 'Free' },
                { name: 'Intro call', value: 'Free' },
                { name: 'Group mentoring', value: '750 ₽/hr' },
                { name: '1-on-1 sessions', value: '1500 ₽/hr' }
            ],
            cta: 'Book a session'
        },
        contact: {
            label: 'Contact',
            title: "Let's work together",
            desc: "Open to new opportunities, freelance projects, and interesting collaborations. Don't hesitate to reach out — I usually respond within 24 hours.",
            items: [
                { icon: ICONS.mail, label: 'Email', value: 'ed.chervonenko@gmail.com', href: 'mailto:ed.chervonenko@gmail.com' },
                { icon: ICONS.send, label: 'Telegram', value: '@ra1n_xd', href: 'https://t.me/ra1n_xd' },
                { icon: ICONS.megaphone, label: 'Telegram Channel', value: '@fronted_engineer', href: 'https://t.me/fronted_engineer' },
                { icon: ICONS.gitBranch, label: 'GitHub', value: 'github.com/ed-chervonenko', href: 'https://github.com/ed-chervonenko' }
            ]
        },
        footer: {
            copy: 'Eduard Chervonenko'
        }
    },
    ru: {
        nav: {
            about: 'Обо мне',
            skills: 'Стек',
            experience: 'Карьера',
            talks: 'Выступления',
            mentoring: 'Менторинг',
            contact: 'Контакты'
        },
        hero: {
            badge: 'Открыт к работе',
            name: 'Эдуард Червоненко',
            firstName: 'Эдуард',
            lastName: 'Червоненко',
            subtitle: '<Fullstack Developer | TeamLead | Mentor />',
            cardRole: 'Fullstack Developer · TeamLead · Mentor',
            desc: '4+ лет разработки веб-приложений на React, TypeScript, Next.js и NestJS.',
            cta: 'Связаться',
            viewExperience: 'Опыт работы',
            scroll: 'листай'
        },
        about: {
            label: 'Обо мне',
            title: 'Кто я',
            p1: (
                <>
                    Я — <strong>Fullstack Developer</strong> с опытом 4+ лет в создании современных веб-приложений. Мой стек: React, TypeScript, Next.js на фронтенде и NestJS на бэкенде.
                </>
            ),
            p2: <>Начал программировать в 16 лет и не останавливался. С тех пор работал на всех уровнях — от pixel-perfect UI до архитектуры бэкенда и настройки CI/CD.</>,
            p3: (
                <>
                    Окончил с <strong>отличием</strong> направление «Информатика и вычислительная техника» в БелГУ в 2024 году. Помимо кода, мне нравится менторить джунов и выстраивать инженерные
                    практики в командах.
                </>
            ),
            speakingAndMentoring: (
                <>
                    Выступал с техническими докладами и менторил разработчиков онлайн. Также веду свой{' '}
                    <a href="https://t.me/s/fronted_engineer" target="_blank" rel="noopener noreferrer">
                        Telegram-канал
                    </a>
                    .
                </>
            ),
            stats: [
                { number: '4+', label: 'Лет опыта' },
                { number: '10+', label: 'Проектов' },
                { number: '2', label: 'Команды, которыми руководил' },
                { number: '15+', label: 'Людей, которых менторил' }
            ]
        },
        skills: {
            label: 'Стек',
            title: 'Навыки и технологии',
            groups: [
                { icon: ICONS.zap, title: 'Языки', tags: ['JavaScript', 'TypeScript', 'Python', 'PHP', 'Go'] },
                { icon: ICONS.palette, title: 'Фронтенд', tags: ['React', 'Next.js', 'Vue.js', 'Redux / RTK', 'Zustand', 'SCSS', 'Ant Design', 'MUI'] },
                { icon: ICONS.server, title: 'Бэкенд', tags: ['NestJS', 'FastAPI', 'Node.js', 'REST API', 'GraphQL'] },
                { icon: ICONS.database, title: 'Базы данных', tags: ['PostgreSQL', 'MySQL', 'MongoDB'] },
                { icon: ICONS.rocket, title: 'DevOps', tags: ['Docker', 'GitLab CI/CD', 'Linux', 'VPS / VDS'] },
                { icon: ICONS.wrench, title: 'Инструменты', tags: ['Git', 'ESLint', 'Prettier', 'Vite', 'Webpack', 'Figma'] }
            ]
        },
        experience: {
            label: 'Карьера',
            workTitle: 'Опыт работы',
            now: 'сейчас',
            work: [
                {
                    role: 'Fullstack-разработчик / Team Lead',
                    company: 'Центр-Инструмент · Частичная занятость',
                    logo: centerInstrumentLogo,
                    period: 'Фев 2026 — настоящее время',
                    current: true,
                    bullets: [
                        'Руковожу разработкой и контент-командой, распределяю задачи и провожу code review.',
                        'Спроектировал архитектуру интернет-магазина промышленного инструмента для частных и корпоративных клиентов. Развиваю фронтенд на Next.js и TypeScript и бэкенд на Node.js, Prisma и PostgreSQL.',
                        'Ускорил загрузку страниц и снизил LCP. Улучшил позиции маркетплейса в поисковой выдаче за счёт технического SEO.',
                        'Разработал каталог, корзину и оформление заказов для физлиц и компаний. Работал над интеграциями с Альфа-Банком, Яндекс Доставкой и DaData.',
                        'Создал админ-панель и автоматизировал импорт товаров из XLSX с валидацией и обновлением по SKU.'
                    ]
                },
                {
                    role: 'Frontend-разработчик',
                    company: 'TXIX',
                    logo: txixLogo,
                    period: 'Фев 2024 — настоящее время',
                    current: true,
                    bullets: [
                        'Разработал интерфейсы для управления рассылками по email, SMS, push и мессенджерам.',
                        'Разработал фронтенд сервиса для перевода рабочих процессов организаций в цифровой формат.',
                        'Обновил легаси-фронтенд, перевёл классовые компоненты на функциональные и переработал управление состоянием.',
                        'Разрабатывал переиспользуемые компоненты для внутреннего UI-кита.'
                    ]
                },
                {
                    role: 'Fullstack-разработчик',
                    company: 'SG-Group',
                    period: 'Янв 2021 — Июл 2021',
                    current: false,
                    bullets: [
                        'С нуля разрабатывал сайты и админ-панели для среднего и крупного бизнеса области (аптеки, магазины и др.).',
                        'Интегрировал сторонние сервисы через API под задачи клиентов (Яндекс Карты, сервисы email-уведомлений и др.).',
                        'Внедрил Git и Scrum в команде.',
                        'Менторил новых разработчиков и помогал им включаться в работу над проектами.'
                    ]
                }
            ]
        },
        projectCards: {
            title: 'Проекты',
            items: [
                {
                    icon: <img src={PARTYSIDE.icon} alt="" width="40" height="40" />,
                    title: PARTYSIDE.title,
                    role: 'Fullstack Developer',
                    period: 'Фев 2026 — н.в.',
                    desc: 'Онлайн-платформа с играми для друзей: собирайтесь в одной комнате, общайтесь и проводите время вместе прямо в браузере.',
                    tags: ['React', 'TypeScript', 'Node.js', 'Express', 'Socket.IO', 'Three.js'],
                    link: PARTYSIDE.url
                },
                {
                    icon: <img src={manipulaLogo} alt="" width="40" height="40" />,
                    title: 'ManipulA',
                    role: 'TeamLead',
                    period: 'Дек 2025 — н.в.',
                    desc: 'Telegram-бот для массажного салона с бронированием, расписанием и админ-панелью. MVP запущен за неделю.',
                    tags: ['NestJS', 'React', 'PostgreSQL', 'Docker', 'Telegram Bot API']
                },
                {
                    icon: <img src={sixSeniorsLogo} alt="" width="40" height="40" />,
                    title: '6Seniors · JS-менторинг с нуля',
                    role: 'Mentor',
                    period: 'Июн 2024 — н.в.',
                    desc: '6Seniors — менторинг начинающих разработчиков от нуля до junior/middle, пошаговое создание fullstack-проекта с лучшими практиками и live coding.',
                    tags: ['React', 'NestJS', 'TypeScript', 'Live Coding', 'Менторинг'],
                    link: SIX_SENIORS_CHANNEL
                }
            ]
        },
        talks: [
            {
                ...IT_HOZYAEVA_TALK,
                icon: ICONS.megaphone,
                title: 'Доклад · IT-ХОЗЯЕВА',
                role: 'Спикер',
                desc: 'Выступил с докладом от сообщества IT-ХОЗЯЕВА. Запись выступления доступна на YouTube.',
                tags: ['Сообщество', 'Выступление', 'YouTube']
            },
            {
                ...JS_MENTORING_STREAM,
                title: 'JS менторинг с нуля',
                role: 'Mentor',
                period: 'Июн 2024 — н.в.',
                desc: '6Seniors — менторинг начинающих разработчиков от нуля до junior/middle, пошаговое создание fullstack-проекта с лучшими практиками и live coding.',
                tags: ['React', 'NestJS', 'TypeScript', 'Live Coding', 'Менторинг']
            }
        ],
        mentoring: {
            label: 'Менторинг',
            title: 'Мои услуги',
            about: 'Работаю frontend/fullstack разработчиком и занимаюсь подготовкой начинающих в данной сфере. Профессионально работаю с 2021 года. Имею красный диплом бакалавра по направлению «Фундаментальная информатика и информационные технологии».',
            aboutExtra: 'Менторингом занимаюсь с лета 2024 года в одном образовательном проекте и индивидуально. С этого момента уже несколько человек трудоустроились.',
            helpTitle: 'С чем помогаю',
            helpItems: [
                'Фундаментальное изучение JS',
                'Изучение React и его инфраструктуры',
                'Ревью кода',
                'Подготовка к собесам',
                'Составление резюме',
                'Связываю с HR, которые пишут мне с предложением о работе (по возможности)',
                'Прочие жизненные вопросы (реальные рабочие кейсы, проблемы с прокрастинацией и т.д.)'
            ],
            disclaimer: 'Я занимаюсь именно менторингом, то есть помощью с обучением. Обещать 100% трудоустройство как на «говно-курсах» я не могу, особенно сейчас, когда рынок перенасыщен джунами.',
            priceTitle: 'Стоимость',
            prices: [
                { name: 'Быстрые и базовые вопросы', value: 'Бесплатно' },
                { name: 'Ознакомительный созвон', value: 'Бесплатно' },
                { name: 'Групповой менторинг', value: '750 ₽/час' },
                { name: 'Встречи 1 на 1', value: '1500 ₽/час' }
            ],
            cta: 'Записаться'
        },
        contact: {
            label: 'Контакты',
            title: 'Давайте работать вместе',
            desc: 'Открыт к новым возможностям, фрилансу и интересным коллаборациям. Пишите — обычно отвечаю в течение 24 часов.',
            items: [
                { icon: ICONS.mail, label: 'Email', value: 'ed.chervonenko@gmail.com', href: 'mailto:ed.chervonenko@gmail.com' },
                { icon: ICONS.send, label: 'Telegram', value: '@ra1n_xd', href: 'https://t.me/ra1n_xd' },
                { icon: ICONS.megaphone, label: 'Telegram-канал', value: '@fronted_engineer', href: 'https://t.me/fronted_engineer' },
                { icon: ICONS.gitBranch, label: 'GitHub', value: 'github.com/ed-chervonenko', href: 'https://github.com/ed-chervonenko' }
            ]
        },
        footer: {
            copy: 'Эдуард Червоненко'
        }
    }
};

export function LangProvider({ children }: { children: ReactNode }) {
    const [lang, setLang] = useState<Lang>(() => {
        const saved = localStorage.getItem(STORAGE_KEYS.LANG);
        return saved === 'en' ? 'en' : 'ru';
    });

    const toggleLang = useCallback(() => {
        setLang((prev) => {
            const next = prev === 'en' ? 'ru' : 'en';
            localStorage.setItem(STORAGE_KEYS.LANG, next);
            return next;
        });
    }, []);

    const t = translations[lang];

    return <LangContext.Provider value={{ lang, toggleLang, t }}>{children}</LangContext.Provider>;
}

export function useLang() {
    const ctx = useContext(LangContext);
    if (!ctx) throw new Error('useLang must be used within LangProvider');
    return ctx;
}
