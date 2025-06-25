// src/pages/NotFoundPage.jsx
import { useCallback } from "react";
import Particles from "@tsparticles/react";
import { loadFull } from "tsparticles";
import "./NotFoundPage.css";
import bg from "./images/background.jpg";

export default function NotFoundPage() {
    const particlesInit = useCallback(async (engine) => {
        await loadFull(engine); // Khởi động engine đầy đủ
    }, []);

    const options = {
        fpsLimit: 60,
        detectRetina: true,
        particles: {
            color: { value: "#fff", animation: { enable: true, speed: 2, sync: true } },
            move: { direction: "bottom-right", enable: true, outModes: "out", speed: 10 },
            number: { density: { enable: true, area: 800 }, value: 500 },
            opacity: { value: 1 },
            shape: { type: "circle" },
            size: { value: 2 },
            wobble: { enable: true, distance: 10, speed: 10 },
            zIndex: { value: { min: 0, max: 100 } },
        },
    };

    return (
        <section className="intro" style={{ backgroundImage: `url(${bg})` }}>
            <Particles id="tsparticles" init={particlesInit} options={options} />
            <div className="container content">
                <h1>404</h1>
                <h2 className="">Oops! Lost in the desert</h2>
                <a href="/" className="btn btn-dark mt-3 btn-back-home">
                    Back to Home
                </a>
            </div>
        </section>
    );
}
