import { getPose } from "./poseDictionary";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const rawText = body.raw_text;
    const glossSequence = body.gloss_sequence;

    if (
      typeof rawText !== "string" ||
      !Array.isArray(glossSequence)
    ) {
      return Response.json(
        {
          status: "error",
          message:
            "raw_text and gloss_sequence are required",
        },
        { status: 400 }
      );
    }

    const frames: any[] = [];

    for (const gloss of glossSequence) {
      const poses = getPose(gloss);

      if (!poses.length) continue;

      poses.forEach((p) => {
        frames.push({
          gloss: gloss.toUpperCase(),
          duration: p.duration,
          boneRotations: p.bones,
          morphTargetInfluences: p.morphs,
        });
      });
    }

    return Response.json({
      status: "success",
      raw_text: rawText,
      gloss_sequence: glossSequence,
      animation_data: {
        rig_type: "Mixamo",
        frames,
      },
    });
  } catch {
    return Response.json(
      {
        status: "error",
        message: "Invalid JSON request",
      },
      { status: 400 }
    );
  }
}