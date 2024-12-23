import { addExperienceAuto } from "./services";

export async function postExperiencesHandler(c: any) {
    const result = await addExperienceAuto();
    return c.json({
        status: "Success",
        message: "Successfully post experiences into database",
        data: result
    }, 201);
}