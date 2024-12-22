import { addExperienceAuto } from "./services";

export async function postExperiencesHandler(c: any) {
    const result = await addExperienceAuto();
    return c.json({ result });
}