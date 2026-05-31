import { useEffect, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";

const particlesConfig = {
  fullScreen: false,
  fpsLimit: 60,
  particles: {
    number: {
      value: 40,
      density: {
        enable: true,
      },
    },
    color: {
      value: "#00F0B5",
    },
    shape: {
      type: "char" as const,
      options: {
        char: {
          value: ["0", "1", "{", "}", "<", ">", "/", ";", "=", "+", "*", "#"],
          font: "JetBrains Mono",
        },
      },
    },
    opacity: {
      value: { min: 0.1, max: 0.5 },
      animation: {
        enable: true,
        speed: 0.5,
        sync: false,
      },
    },
    size: {
      value: { min: 8, max: 16 },
    },
    move: {
      enable: true,
      speed: 1.5,
      direction: "bottom" as const,
      random: true,
      straight: false,
      outModes: {
        default: "out" as const,
      },
    },
  },
  detectRetina: true,
};

export default function ParticleBackground() {
  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  if (!init) return null;

  return (
    <Particles
      id="tsparticles"
      options={particlesConfig}
      className="absolute inset-0 z-0"
    />
  );
}
