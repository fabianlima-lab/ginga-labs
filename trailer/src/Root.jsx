import { Composition } from "remotion";
import { Trailer, FPS, DURACAO_40S } from "./Trailer.jsx";
import { Gameplay, DURACAO_90S } from "./Gameplay.jsx";
import { Arquitetura } from "./Arquitetura.jsx";

export const Root = () => (
  <>
    {/* Design artifact: the football belief-revision system architecture. */}
    <Composition id="Arquitetura" component={Arquitetura} durationInFrames={1} fps={30} width={1920} height={1280} />
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
