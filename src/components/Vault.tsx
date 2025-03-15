import { useEffect, useRef, useState } from "react";
import * as PIXI from "pixi.js";
import { gsap } from "gsap";
import { useVaultContext } from "../context/VaultContext";
import bg from "../assets/bg.png";
import door from "../assets/door.png";
import doorOpen from "../assets/doorOpen.png";
import handle from "../assets/handle.png";
import handleShadow from "../assets/handleShadow.png";

const Vault = () => {
  const { isOpen, generateCombination, checkCombination } = useVaultContext();

  const appRef = useRef<HTMLDivElement | null>(null);
  const app = useRef<PIXI.Application | null>(null);
  const handleRotation = useRef<PIXI.Sprite | null>(null);
  const handleShadowSprite = useRef<PIXI.Sprite | null>(null);

  const [isAppReady, setIsAppReady] = useState(false);

  const initializePixiApp = async () => {
    try {
      if (appRef.current && !app.current) {
        console.log("Initializing PixiJS app...");
        app.current = new PIXI.Application();
        await app.current.init({
          width: window.innerWidth,
          height: window.innerHeight,
          backgroundColor: 0x1099bb,
        });
        appRef.current.appendChild(app.current.canvas);

        console.log("Loading assets...");
        const resources = await PIXI.Assets.load([bg, door, doorOpen, handle, handleShadow]);
        console.log("Assets loaded:", resources);

        // Check if resources exist
        if (!resources[bg] || !resources[door] || !resources[doorOpen] || !resources[handle] || !resources[handleShadow]) {
          console.error("Some assets failed to load!");
          return;
        }

        const bgTexture = resources[bg]?.texture!;
        const doorTexture = resources[door]?.texture!;
        const doorOpenTexture = resources[doorOpen]?.texture!;
        const handleTexture = resources[handle]?.texture!;
        const handleShadowTexture = resources[handleShadow]?.texture!;

        console.log("Assets loaded, creating sprites...");

        // Create background
        const bgSprite = new PIXI.Sprite(bgTexture);
        bgSprite.width = app.current.screen.width;
        bgSprite.height = app.current.screen.height;
        app.current.stage.addChild(bgSprite);

        // Create door sprite
        const doorSprite = new PIXI.Sprite(doorTexture);
        doorSprite.x = app.current.screen.width / 2 - doorSprite.width / 2;
        doorSprite.y = app.current.screen.height / 2 - doorSprite.height / 2;
        app.current.stage.addChild(doorSprite);

        // Handle rotation sprite
        handleRotation.current = new PIXI.Sprite(handleTexture);
        handleRotation.current.x = app.current.screen.width / 2 - handleRotation.current.width / 2;
        handleRotation.current.y = app.current.screen.height / 2 + doorSprite.height / 2 + 20;
        handleRotation.current.interactive = true;

        handleRotation.current.on("pointerdown", (e: PIXI.FederatedPointerEvent) => {
          if (!handleRotation.current) return; // Early return if `handleRotation.current` is null

          const startAngle = e.data.global.x;
          handleRotation.current.rotation = startAngle;

          handleRotation.current?.on("pointermove", (moveEvent: PIXI.FederatedPointerEvent) => {
            if (!handleRotation.current) return;

            const deltaX = moveEvent.data.global.x - startAngle;
            handleRotation.current.rotation = deltaX / 100;

            checkCombination(handleRotation.current.rotation);
          });
        });

        app.current.stage.addChild(handleRotation.current);

        // Handle shadow sprite
        handleShadowSprite.current = new PIXI.Sprite(handleShadowTexture);
        handleShadowSprite.current.x = app.current.screen.width / 2 - handleShadowSprite.current.width / 2;
        handleShadowSprite.current.y = app.current.screen.height / 2 + doorSprite.height / 2 + 20;
        handleShadowSprite.current.alpha = 0;
        app.current.stage.addChild(handleShadowSprite.current);

        console.log("PixiJS app initialized and sprites added...");

        setIsAppReady(true); // App is now ready
      }
    } catch (error) {
      console.error("Error during PixiJS initialization:", error);
    }
  };

  useEffect(() => {
    console.log("Component mounted, initializing PixiJS...");
    initializePixiApp();

    return () => {
      if (app.current) {
        console.log("Destroying PixiJS app...");
        // Remove event listeners
        if (handleRotation.current) {
          handleRotation.current.off("pointerdown");
          handleRotation.current.off("pointermove");
        }
        // Destroy the app
        app.current.destroy(true, { children: true });
        app.current = null;
      }
    };
  }, []); // Runs only once when the component mounts

  useEffect(() => {
    generateCombination(); // Generate combination when mounted
  }, [generateCombination]);

  useEffect(() => {
    if (isAppReady && isOpen) {
      console.log("Vault is open, triggering door animation...");
      gsap.to(handleShadowSprite.current, { alpha: 1, duration: 0.5 });
      gsap.to(handleRotation.current, { rotation: Math.PI, duration: 1 });
      // Additional door open animations if needed
    }
  }, [isOpen, isAppReady]);

  return (
    <div ref={appRef} style={{ position: "relative", width: "100%", height: "100%" }}>
      {/* PixiJS canvas will be inserted here */}
    </div>
  );
};

export default Vault;