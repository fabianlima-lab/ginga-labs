import { Composition } from "remotion";
import { Trailer, FPS, DURACAO_40S } from "./Trailer.jsx";

export const Root = () => (
  <>
    {/* Corte principal: X/Twitter, 16:9, 40s. Cortes Reddit/vertical depois. */}
    <Composition
      id="Principal40s"
      component={Trailer}
      durationInFrames={DURACAO_40S}
      fps={FPS}
      width={1920}
      height={1080}
    />
  </>
);
