import javascript from '@/assets/tech/javascript.svg';
import typescript from '@/assets/tech/typescript.svg';
import python from '@/assets/tech/python.svg';
import php from '@/assets/tech/php.svg';
import go from '@/assets/tech/go.svg';
import react from '@/assets/tech/react.svg';
import nextjs from '@/assets/tech/nextjs.svg';
import vuejs from '@/assets/tech/vuejs.svg';
import redux from '@/assets/tech/redux.svg';
import zustand from '@/assets/tech/zustand.svg';
import sass from '@/assets/tech/sass.svg';
import antdesign from '@/assets/tech/antdesign.svg';
import materialui from '@/assets/tech/materialui.svg';
import nestjs from '@/assets/tech/nestjs.svg';
import fastapi from '@/assets/tech/fastapi.svg';
import nodejs from '@/assets/tech/nodejs.svg';
import graphql from '@/assets/tech/graphql.svg';
import postgresql from '@/assets/tech/postgresql.svg';
import mysql from '@/assets/tech/mysql.svg';
import mongodb from '@/assets/tech/mongodb.svg';
import docker from '@/assets/tech/docker.svg';
import gitlab from '@/assets/tech/gitlab.svg';
import linux from '@/assets/tech/linux.svg';
import git from '@/assets/tech/git.svg';
import eslint from '@/assets/tech/eslint.svg';
import prettier from '@/assets/tech/prettier.svg';
import vite from '@/assets/tech/vitejs.svg';
import webpack from '@/assets/tech/webpack.svg';
import figma from '@/assets/tech/figma.svg';

const LOGOS: Record<string, string> = {
    JavaScript: javascript,
    TypeScript: typescript,
    Python: python,
    PHP: php,
    Go: go,
    React: react,
    'Next.js': nextjs,
    'Vue.js': vuejs,
    'Redux / RTK': redux,
    Zustand: zustand,
    SCSS: sass,
    'Ant Design': antdesign,
    MUI: materialui,
    NestJS: nestjs,
    FastAPI: fastapi,
    'Node.js': nodejs,
    GraphQL: graphql,
    PostgreSQL: postgresql,
    MySQL: mysql,
    MongoDB: mongodb,
    Docker: docker,
    'GitLab CI/CD': gitlab,
    Linux: linux,
    Git: git,
    ESLint: eslint,
    Prettier: prettier,
    Vite: vite,
    Webpack: webpack,
    Figma: figma
};

export default function TechnologyIcon({ name }: { name: string }) {
    const logo = LOGOS[name];
    if (logo) return <img className="os-tech-icon" src={logo} width="20" height="20" alt="" />;

    if (name !== 'REST API' && name !== 'VPS / VDS') return null;

    return (
        <svg
            className="os-tech-icon"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke={name === 'REST API' ? '#009688' : '#526dce'}
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            {name === 'REST API' ? (
                <path d="m7 8-4 4 4 4m10-8 4 4-4 4M14 5l-4 14" />
            ) : (
                <>
                    <rect x="3" y="3" width="18" height="7" rx="2" />
                    <rect x="3" y="14" width="18" height="7" rx="2" />
                    <path d="M7 6.5h.01M7 17.5h.01M11 6.5h6M11 17.5h6" />
                </>
            )}
        </svg>
    );
}
