import { Application, Assets, Sprite } from "pixi.js";
import gsap from "gsap";

(async () => {
  const app = new Application();
  await app.init({ background: "#1099bb", resizeTo: window });
  document.getElementById("pixi-container")!.appendChild(app.canvas);

  let currentRotation = 0;
  let playerInput: { number: number, direction: string }[] = [];
  let secretCombination = generateCombination();
  let timerInterval: any;

  try {
    const bgTexture = await Assets.load("/assets/bg.png");
    const doorTexture = await Assets.load("/assets/door.png");
    const doorOpenTexture = await Assets.load("/assets/doorOpen.png");
    const handleTexture = await Assets.load("/assets/handle.png");
    const handleShadowTexture = await Assets.load("/assets/handleShadow.png");

    const bg = new Sprite(bgTexture);
    bg.width = app.screen.width;
    bg.height = app.screen.height;
    app.stage.addChild(bg);

    const door = new Sprite(doorTexture);
    door.anchor.set(0.5);
    door.x = app.screen.width / 2;
    door.y = app.screen.height / 2;
    door.scale.set(0.25);
    app.stage.addChild(door);

    const handle = new Sprite(handleTexture);
    handle.anchor.set(0.5);
    handle.x = app.screen.width / 2;
    handle.y = app.screen.height / 2;
    handle.scale.set(0.35);
    app.stage.addChild(handle);

    const handleShadow = new Sprite(handleShadowTexture);
    handleShadow.anchor.set(0.5);
    handleShadow.x = app.screen.width / 2;
    handleShadow.y = app.screen.height / 2 + 10;
    handleShadow.scale.set(0.35);
    app.stage.addChild(handleShadow);

    handle.interactive = true;
    handle.buttonMode = true;

    handle.on("pointerdown", (event) => {
      const initialRotation = event.data.global.x;
      handleShadow.alpha = 1;

      handle.on("pointermove", (moveEvent) => {
        const moveDelta = moveEvent.data.global.x - initialRotation;
        currentRotation += Math.sign(moveDelta) * 60;
        gsap.to(handle, { rotation: (currentRotation * Math.PI) / 180, duration: 0.3 });
        gsap.to(handleShadow, { rotation: (currentRotation * Math.PI) / 180, duration: 0.3 });
      });

      handle.on("pointerup", () => {
        handle.off("pointermove");
        handle.off("pointerup");
        handleShadow.alpha = 0;
        validateInput();
      });
    });

    window.addEventListener("keydown", (event) => {
      if (event.key === "ArrowRight") {
        currentRotation += 60;
        gsap.to(handle, { rotation: (currentRotation * Math.PI) / 180, duration: 0.3 });
        gsap.to(handleShadow, { rotation: (currentRotation * Math.PI) / 180, duration: 0.3 });
        validateInput();
      } else if (event.key === "ArrowLeft") {
        currentRotation -= 60;
        gsap.to(handle, { rotation: (currentRotation * Math.PI) / 180, duration: 0.3 });
        gsap.to(handleShadow, { rotation: (currentRotation * Math.PI) / 180, duration: 0.3 });
        validateInput();
      } else if (event.key === "Enter") {
        unlockVault();
      }
    });

    startTimer();

  } catch (error) {
    console.error("❌ Error loading assets:", error);
  }

  function generateCombination() {
    const directions = ["clockwise", "counterclockwise"];
    const combination = [];
    for (let i = 0; i < 3; i++) {
      const number = Math.floor(Math.random() * 8) + 1;
      const direction = directions[Math.floor(Math.random() * 2)];
      combination.push({ number, direction });
    }
    return combination;
  }

  function startTimer() {
    timerInterval = setInterval(() => {}, 1000);
  }

  function stopTimer() {
    clearInterval(timerInterval);
  }

  function validateInput() {
    const currentInput = { number: Math.abs(currentRotation / 60), direction: currentRotation > 0 ? "clockwise" : "counterclockwise" };
    playerInput.push(currentInput);

    if (playerInput.length === 3) {
      if (JSON.stringify(playerInput) === JSON.stringify(secretCombination)) {
        unlockVault();
      } else {
        resetGame();
      }
    }
  }

  function unlockVault() {
    stopTimer();

    const doorOpen = new Sprite(doorOpenTexture);
    doorOpen.anchor.set(0.5);
    doorOpen.x = app.screen.width / 2;
    doorOpen.y = app.screen.height / 2;
    doorOpen.scale.set(0.25);
    doorOpen.alpha = 0;
    app.stage.addChild(doorOpen);

    gsap.to(door, { alpha: 0, duration: 0.5 });
    gsap.to(doorOpen, { alpha: 1, duration: 0.5, delay: 0.5 });

    const treasure = new Sprite(bgTexture);
    treasure.x = app.screen.width / 2 - treasure.width / 2;
    treasure.y = app.screen.height / 2;
    treasure.alpha = 0;
    app.stage.addChild(treasure);

    gsap.to(treasure, { alpha: 0.5, duration: 0.5, repeat: -1, yoyo: true, delay: 1 });

    gsap.delayedCall(5, () => {
      gsap.to(doorOpen, { alpha: 0, duration: 0.5 });
      gsap.to(door, { alpha: 1, duration: 0.5, delay: 0.5 });
      resetGame();
    });
  }

  function resetGame() {
    gsap.to(handle, { rotation: currentRotation + Math.PI * 3, duration: 1, repeat: 1, yoyo: true });
    secretCombination = generateCombination();
    playerInput = [];
    startTimer();
  }
})();