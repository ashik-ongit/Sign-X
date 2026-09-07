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

    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x222222);

    const camera = new THREE.PerspectiveCamera(
      35,
      width / height,
      0.1,
      2000
    );

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
    });

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(
      camera,
      renderer.domElement
    );

    controls.enableDamping = true;
    controls.enableZoom = true;
    controls.enablePan = true;
    controls.enableRotate = true;

    scene.add(
      new THREE.AmbientLight(0xffffff, 2)
    );

    const dirLight = new THREE.DirectionalLight(
      0xffffff,
      2
    );

    dirLight.position.set(100, 200, 100);
    scene.add(dirLight);

    const loader = new GLTFLoader();

    let animationFrameId = 0;
    let cancelled = false;

    loader.load(
      "/models/avatar.glb",

      async (gltf) => {
        if (cancelled) return;

        const avatar = gltf.scene;

        scene.add(avatar);

        // ---------------------------------------------
        // CAMERA
        // ---------------------------------------------

        const box = new THREE.Box3().setFromObject(avatar);

        const center = box.getCenter(
          new THREE.Vector3()
        );

        const size = box.getSize(
          new THREE.Vector3()
        );

        const maxDim = Math.max(
          size.x,
          size.y,
          size.z
        );

        const fov =
          camera.fov * (Math.PI / 180);

        let cameraDistance =
          Math.abs(
            maxDim /
              2 /
              Math.tan(fov / 2)
          );

        cameraDistance *= 1.25;

        camera.position.set(
          center.x,
          center.y,
          center.z + cameraDistance
        );

        camera.lookAt(center);

        controls.target.copy(center);
        controls.update();

        // ---------------------------------------------
        // REST ROTATIONS
        // ---------------------------------------------

        const restRotations =
          new Map<string, THREE.Quaternion>();

        avatar.traverse((object) => {
          if (!object.isBone) return;

          restRotations.set(
            object.name,
            object.quaternion.clone()
          );
        });

        console.log(
          "SignX avatar loaded"
        );

        console.log(
          "TOTAL BONES:",
          restRotations.size
        );

        // ---------------------------------------------
        // NEUTRAL STANDING POSE
        // ---------------------------------------------

        const neutral = (
          name: string,
          x: number
        ) => {
          const bone =
            avatar.getObjectByName(name);

          const rest =
            restRotations.get(name);

          if (!bone || !rest) return;

          bone.quaternion.copy(
            rest.clone().multiply(
              new THREE.Quaternion().setFromEuler(
                new THREE.Euler(
                  x,
                  0,
                  0,
                  "XYZ"
                )
              )
            )
          );
        };

        neutral(
          "mixamorigLeftArm",
          0.55
        );

        neutral(
          "mixamorigLeftForeArm",
          0.45
        );

        neutral(
          "mixamorigRightArm",
          0.55
        );

        neutral(
          "mixamorigRightForeArm",
          0.45
        );

        // ---------------------------------------------
        // IDLE
        // ---------------------------------------------

        if (glossSequence.length === 0) {
          function idleRender() {
            if (cancelled) return;

            controls.update();

            renderer.render(
              scene,
              camera
            );

            animationFrameId =
              requestAnimationFrame(
                idleRender
              );
          }

          animationFrameId =
            requestAnimationFrame(
              idleRender
            );

          return;
        }

        // ---------------------------------------------
        // REQUEST ANIMATION
        // ---------------------------------------------

        try {
          const response = await fetch(
            "/api/animation",
            {
              method: "POST",
              headers: {
                "Content-Type":
                  "application/json",
              },
              body: JSON.stringify({
                raw_text: "",
                gloss_sequence:
                  glossSequence,
              }),
            }
          );

          const data =
            await response.json();

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
            data.animation_data?.frames ??
            [];

          console.log(
            "Animation frames:",
            frames
          );

          if (!frames.length) {
            console.error(
              "No animation frames"
            );

            return;
          }

          // ---------------------------------------------
          // FRAME HELPERS
          // ---------------------------------------------

          const makeQuaternion =
            (rotation?: Rotation) => {
              if (!rotation) {
                return new THREE.Quaternion();
              }

              return new THREE.Quaternion()
                .setFromEuler(
                  new THREE.Euler(
                    rotation.x,
                    rotation.y,
                    rotation.z,
                    "XYZ"
                  )
                );
            };

          // ---------------------------------------------
          // APPLY INTERPOLATED FRAME
          // ---------------------------------------------

          function applyInterpolatedFrame(
            from: Frame,
            to: Frame,
            alpha: number
          ) {
            const t =
              THREE.MathUtils.smoothstep(
                alpha,
                0,
                1
              );

            avatar.traverse(
              (object) => {
                if (!object.isBone) return;

                const rest =
                  restRotations.get(
                    object.name
                  );

                if (!rest) return;

                const fromRotation =
                  from.boneRotations?.[
                    object.name
                  ];

                const toRotation =
                  to.boneRotations?.[
                    object.name
                  ];

                if (!fromRotation && !toRotation) {
                  return;
                }

                const fromQ =
                  rest.clone().multiply(
                    makeQuaternion(
                      fromRotation
                    )
                  );

                const toQ =
                  rest.clone().multiply(
                    makeQuaternion(
                      toRotation ??
                        fromRotation
                    )
                  );

                object.quaternion
                  .copy(fromQ)
                  .slerp(toQ, t);
              }
            );

            // ---------------------------------------------
            // MORPH TARGETS
            // ---------------------------------------------

            avatar.traverse(
              (object) => {
                const mesh =
                  object as THREE.Mesh;

                if (
                  !mesh.isMesh ||
                  !mesh.morphTargetDictionary ||
                  !mesh.morphTargetInfluences
                ) {
                  return;
                }

                const names =
                  new Set([
                    ...Object.keys(
                      from.morphTargetInfluences ??
                        {}
                    ),
                    ...Object.keys(
                      to.morphTargetInfluences ??
                        {}
                    ),
                  ]);

                names.forEach(
                  (name) => {
                    const index =
                      mesh
                        .morphTargetDictionary?.[
                        name
                      ];

                    if (
                      index === undefined
                    ) {
                      return;
                    }

                    const a =
                      from
                        .morphTargetInfluences?.[
                        name
                      ] ?? 0;

                    const b =
                      to
                        .morphTargetInfluences?.[
                        name
                      ] ?? 0;

                    mesh.morphTargetInfluences[
                      index
                    ] =
                      THREE.MathUtils.lerp(
                        a,
                        b,
                        t
                      );
                  }
                );
              }
            );
          }

          // ---------------------------------------------
          // ANIMATION
          // ---------------------------------------------

          let frameIndex = 0;

          let frameStart =
            performance.now();

          function animate(
            now: number
          ) {
            if (cancelled) return;

            const current =
              frames[frameIndex];

            if (!current) return;

            const next =
              frames[
                Math.min(
                  frameIndex + 1,
                  frames.length - 1
                )
              ];

            const elapsed =
              now - frameStart;

            const duration =
              current.duration;

            const alpha =
              Math.min(
                elapsed / duration,
                1
              );

            applyInterpolatedFrame(
              current,
              next,
              alpha
            );

            controls.update();

            renderer.render(
              scene,
              camera
            );

            // Move to next frame
            if (
              elapsed >= duration
            ) {
              if (
                frameIndex <
                frames.length - 1
              ) {
                frameIndex++;

                frameStart = now;
              } else {
                // Finished — hold final pose

                applyInterpolatedFrame(
                  frames[
                    frames.length - 1
                  ],
                  frames[
                    frames.length - 1
                  ],
                  1
                );

                renderer.render(
                  scene,
                  camera
                );

                return;
              }
            }

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

    // ---------------------------------------------
    // RESIZE
    // ---------------------------------------------

    const handleResize = () => {
      const w =
        container.clientWidth;

      const h =
        container.clientHeight;

      camera.aspect = w / h;

      camera.updateProjectionMatrix();

      renderer.setSize(w, h);
    };

    window.addEventListener(
      "resize",
      handleResize
    );

    // ---------------------------------------------
    // CLEANUP
    // ---------------------------------------------

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