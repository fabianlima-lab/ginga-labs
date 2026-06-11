import { Composition } from "remotion";
import { Trailer, FPS, DURACAO_40S } from "./Trailer.jsx";
import { Gameplay, DURACAO_90S } from "./Gameplay.jsx";

export const Root = () => (
  <>
    {/* Corte principal: X/Twitter, 16:9, 40s. */}
    <Composition
      id="Principal40s"
      component={Trailer}
      durationInFrames={DURACAO_40S}
      fps={FPS}
      width={1920}
      height={1080}
    />
    {/* Corte de gameplay: Reddit/YouTube, 16:9, 90s — o jogo como produto. */}
    <Composition
      id="Gameplay90s"
      component={Gameplay}
      durationInFrames={DURACAO_90S}
      fps={FPS}
      width={1920}
      height={1080}
    />
  </>
);
