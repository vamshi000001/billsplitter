import React from 'react';

const Waves = () => {
    return (
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0] pointer-events-none z-0">
            <svg
                viewBox="0 24 150 28"
                preserveAspectRatio="none"
                shapeRendering="auto"
                className="relative w-full h-[60px] md:h-[100px] mb-[-7px]"
            >
                <defs>
                    <path
                        id="gentle-wave"
                        d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z"
                    />
                </defs>
                <g className="animate-waves">
                    <use
                        href="#gentle-wave"
                        x="48"
                        y="0"
                        fill="rgba(37, 99, 235, 0.1)"
                        className="animate-wave-para1"
                    />
                    <use
                        href="#gentle-wave"
                        x="48"
                        y="3"
                        fill="rgba(79, 70, 229, 0.08)"
                        className="animate-wave-para2"
                    />
                    <use
                        href="#gentle-wave"
                        x="48"
                        y="5"
                        fill="rgba(147, 51, 234, 0.05)"
                        className="animate-wave-para3"
                    />
                    <use
                        href="#gentle-wave"
                        x="48"
                        y="7"
                        fill="rgba(37, 99, 235, 0.03)"
                        className="animate-wave-para4"
                    />
                </g>
            </svg>
        </div>
    );
};

export default Waves;
