import Particles from "./Particles.tsx";

interface AuthBackgroundProps {
  isSignUp: boolean;
}

export default function AuthBackground({ isSignUp }: AuthBackgroundProps) {
  return (
    <div
      style={{
        width: "50vw",
        height: "100vh",
        position: "absolute",
        left: isSignUp ? "0" : "50vw",
        transition: "left 0.5s cubic-bezier(0.1, -0.01, 0.01, 1)",
        zIndex: "1",
        backgroundImage:
          "linear-gradient(45deg, var(--secondary), var(--primary))",
      }}
    >
      <Particles
        particleColors={["#735AE1", "#A66EE0", "#ffffff"]}
        particleCount={300}
        particleSpread={10}
        speed={0.2}
        particleBaseSize={1000}
        moveParticlesOnHover={false}
        alphaParticles={false}
        disableRotation={false}
        cameraDistance={10}
      />
    </div>
  );
}
