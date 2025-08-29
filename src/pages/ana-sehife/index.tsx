import React from 'react';
import { NavLink } from 'react-router';

const Home = () => {
    return (
        <>
            <NavLink
                to="https://template.microsol.az/storybook/?path=/docs/configure-your-project--docs"
                className="!text-4xl !font-bold !bg-gradient-to-r !from-orange-500 !to-pink-600 !bg-clip-text !text-transparent !mb-4"
                target="_blank"
            >
                Storybook demo
            </NavLink>
        </>
    );
};

export default Home;
