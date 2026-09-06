import { getPose } from "./poseDictionary";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const rawText = body.raw_text;
    const glossSequence = body.gloss_sequence;

    if (typeof rawText !== "string" || !Array.isArray(glossSequence)) {
      return Response.json(
        {
          status: "error",
          message: "raw_text and gloss_sequence are required"
        },
        { status: 400 }
      );
    }

    const frames = glossSequence.map((gloss: string) => {
      const pose = getPose(gloss);

      return {
        gloss: gloss.toUpperCase(),
        duration: pose?.duration ?? 500,
        boneRotations: pose?.bones ?? {},
        morphTargetInfluences: pose?.morphs ?? {}
      };
    });

    return Response.json({
      status: "success",
      raw_text: rawText,
      gloss_sequence: glossSequence,
      animation_data: {
        rig_type: "CharacterCreator_CC_Base",
        frames
      }
    });
  } catch {
    return Response.json(
      {
        status: "error",
        message: "Invalid JSON request"
      },
      { status: 400 }
    );
  }
}
