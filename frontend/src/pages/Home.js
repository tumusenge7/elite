import React from "react";
import { Link } from "react-router-dom";
import { useInView } from "../hooks/useInView";

import img1 from "../assets/ec782500-9c29-4dbc-8b39-27acba75a178.jpg";
import img2 from "../assets/1.jpg";
import img3 from "../assets/2.jpg";

function Home() {
    const [leftRef, leftVisible] = useInView({ threshold: 0.3 });
    const [imgRef, imgVisible] = useInView({ threshold: 0.3 });

    return (
        <section className="bg-black text-white min-h-screen flex items-center overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-10 items-center">

                {/* LEFT SIDE */}
                <div
                    ref={leftRef}
                    className={`transition-all duration-1000 ${leftVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-20"
                        }`}
                >
                    <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                        WELCOME TO ELITE <br /> CONSTRUCTION
                    </h1>
                    <p className="text-gray-400 mb-8 leading-relaxed">
                        Here your dream is our blueprint! Our team of engineers and architects
                        delivers high-quality construction solutions across Rwanda.
                    </p>
                    <Link
                        to="/projects"
                        className="bg-red-500 hover:bg-red-600 px-6 py-3 rounded-full font-semibold transition duration-300"
                    >
                        Get Started
                    </Link>
                </div>

                {/* RIGHT SIDE */}
                <div
                    ref={imgRef}
                    className={`relative transition-all duration-1000 ${imgVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"
                        }`}
                >
                    <img
                        src={img1}
                        alt="main"
                        className="w-full h-[400px] object-cover rounded-xl shadow-lg"
                    />
                    <img
                        src={img2}
                        alt="top"
                        className="absolute top-[-40px] left-10 w-40 rounded-xl shadow-lg transform transition duration-500 hover:scale-110 hover:rotate-3"
                    />
                    <img
                        src={img3}
                        alt="bottom"
                        className="absolute bottom-[-40px] right-10 w-52 rounded-xl shadow-lg transform transition duration-500 hover:scale-110 hover:-rotate-3"
                    />
                </div>

            </div>
        </section>
    );
}

export default Home;