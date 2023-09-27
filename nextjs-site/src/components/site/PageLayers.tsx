import Hero from "./Hero";

export async function PageLayers() {
  return (
    <main style={{ position: "relative" }}>
      <Hero />
      <div style={{ position: "absolute", left: "100px", top: "50px" }}>
        <Hero />
      </div>
    </main>
  );
}
