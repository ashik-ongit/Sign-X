"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

type Rotation = {
  x: number;
  y: number;
  z: number;
};

type Frame = {
  gloss: string;
  duration: number;
  boneRotations: Record<string, Rotation>;
  morphTargetInfluences: Record<string, number>;
};

type AvatarCanvasProps = {
  glossSequence: string[];
};

export default function AvatarCanvas({
  glossSequence,
}: AvatarCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x222222);

    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      5000
    );

    camera.position.set(0, 150, 300);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
    });

    renderer.setSize(
      container.clientWidth,
      container.clientHeight
    );

    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(
      camera,
      renderer.domElement
    );

    controls.enableDamping = true;

    scene.add(
      new THREE.AmbientLight(0xffffff, 2)
    );

    const dirLight = new THREE.DirectionalLight(
      0xffffff,
      2
    );

    dirLight.position.set(100, 200, 100);
    scene.add(dirLight);

    scene.add(new THREE.GridHelper(500, 50));

    const loader = new GLTFLoader();

    let animationFrameId = 0;
    let cancelled = false;

    loader.load(
      "/models/avatar.glb",

      async (gltf) => {
        if (cancelled) return;

        const avatar = gltf.scene;

        scene.add(avatar);

        console.log("SignX avatar loaded");

        // --------------------------------------------------
        // Cache rest rotations
        // --------------------------------------------------

        const restRotations =
          new Map<string, THREE.Quaternion>();

        let totalBones = 0;

        avatar.traverse((object) => {
          if (!object.isBone) return;

          totalBones++;

          restRotations.set(
            object.name,
            object.quaternion.clone()
          );
        });

        console.log(
          "TOTAL BONES:",
          totalBones
        );

        // --------------------------------------------------
        // Don't animate until we have gloss
        // --------------------------------------------------

        if (glossSequence.length === 0) {
          console.log(
            "No gloss sequence yet."
          );

          function idleRender() {
            if (cancelled) return;

            controls.update();
            renderer.render(scene, camera);

            animationFrameId =
              requestAnimationFrame(idleRender);
          }

          animationFrameId =
            requestAnimationFrame(idleRender);

          return;
        }

        // --------------------------------------------------
        // Request animation data
        // --------------------------------------------------

        try {
          const response = await fetch(
            "/api/animation",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                raw_text: "",
                gloss_sequence: glossSequence,
              }),
            }
          );

          const data = await response.json();

          console.log(
            "Animation API response:",
            data
          );

          if (
            !response.ok ||
            data.status !== "success"
          ) {
            console.error(
              "Animation API failed:",
              data
            );
            return;
          }

          const frames: Frame[] =
            data.animation_data?.frames ?? [];

          console.log(
            "Animation frames:",
            frames
          );

          if (frames.length === 0) {
            console.error(
              "Animation API returned no frames:",
              data
            );
            return;
          }

          // ------------------------------------------------
          // Animation
          // ------------------------------------------------

          let frameIndex = 0;
          let frameStart = performance.now();

          function applyFrame(frame: Frame) {
            avatar.traverse((object) => {
              if (!object.isBone) return;

              const rest =
                restRotations.get(object.name);

              if (!rest) return;

              const rotation =
                frame.boneRotations?.[
                  object.name
                ];

              if (!rotation) {
                object.quaternion.copy(rest);
                return;
              }

              const delta =
                new THREE.Quaternion().setFromEuler(
                  new THREE.Euler(
                    rotation.x,
                    rotation.y,
                    rotation.z,
                    "XYZ"
                  )
                );

              object.quaternion
                .copy(rest)
                .multiply(delta);
            });

            avatar.traverse((object) => {
              const mesh = object as THREE.Mesh;

              if (
                !mesh.isMesh ||
                !mesh.morphTargetDictionary ||
                !mesh.morphTargetInfluences
              ) {
                return;
              }

              for (const [
                name,
                value,
              ] of Object.entries(
                frame.morphTargetInfluences ?? {}
              )) {
                const index =
                  mesh.morphTargetDictionary[
                    name
                  ];

                if (index !== undefined) {
                  mesh.morphTargetInfluences[
                    index
                  ] = value;
                }
              }
            });
          }

          function animate(now: number) {
            if (cancelled) return;

            const frame =
              frames[frameIndex];

            if (!frame) {
              console.error(
                "Invalid animation frame:",
                frameIndex,
                frames
              );
              return;
            }

            if (
              now - frameStart >=
              frame.duration
            ) {
              frameIndex =
                (frameIndex + 1) %
                frames.length;

              frameStart = now;
            }

            applyFrame(
              frames[frameIndex]
            );

            controls.update();

            renderer.render(
              scene,
              camera
            );

            animationFrameId =
              requestAnimationFrame(
                animate
              );
          }

          animationFrameId =
            requestAnimationFrame(
              animate
            );
        } catch (error) {
          console.error(
            "Animation request failed:",
            error
          );
        }
      },

      undefined,

      (error) => {
        console.error(
          "Failed to load avatar:",
          error
        );
      }
    );

    // ------------------------------------------------------
    // Resize
    // ------------------------------------------------------

    const handleResize = () => {
      const width =
        container.clientWidth;

      const height =
        container.clientHeight;

      camera.aspect =
        width / height;

      camera.updateProjectionMatrix();

      renderer.setSize(
        width,
        height
      );
    };

    window.addEventListener(
      "resize",
      handleResize
    );

    // ------------------------------------------------------
    // Cleanup
    // ------------------------------------------------------

    return () => {
      cancelled = true;

      cancelAnimationFrame(
        animationFrameId
      );

      window.removeEventListener(
        "resize",
        handleResize
      );

      controls.dispose();

      renderer.dispose();

      if (
        renderer.domElement.parentNode ===
        container
      ) {
        container.removeChild(
          renderer.domElement
        );
      }
    };
  }, [glossSequence]);

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height: "100%",
      }}
    />
  );
}