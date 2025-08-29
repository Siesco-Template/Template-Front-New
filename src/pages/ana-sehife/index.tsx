import React from 'react';
import { NavLink } from 'react-router';

const Home = () => {
    return (
        <>
            <section style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                <NavLink
                    style={{ padding: '14px 16px' }}
                    to="https://template.microsol.az/storybook/?path=/docs/introduction-configure-your-project--docs"
                    target="_blank"
                    className="
    relative inline-block px-10 py-4 
    font-extrabold text-2xl uppercase tracking-wider
    text-white rounded-xl overflow-hidden
    bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600
    shadow-[0_0_20px_rgba(255,0,128,0.6)]
    transition-all duration-300
    animate-pulse
  "
                >
                    <span className="relative z-10">🚀 Storybook demo</span>

                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-40 blur-xl animate-[shine_2s_infinite]" />

                    <span className="absolute inset-0 rounded-xl border-2 border-pink-400 animate-[flicker_1.5s_infinite]" />
                </NavLink>
            </section>
        </>
    );
};

export default Home;
