import fs from 'fs';
import { parse } from 'path';
import * as pdfjLib from 'pdfjs-dist/legacy/build/pdf.mjs'
import { askAi } from '../sevices/openRouter.service.js';

export const analyzeResume = async (req,res)=>{
    try {
        if(!req.file)
            return res.status(400).json({ message: "Resume File Required"});
        const filePath = req.file.path;
        const fileBuffer = await fs.promises.readFile(filePath);
        const unit8Array = new Uint8Array(fileBuffer);

        const pdf = await pdfjLib.getDocument({data:unit8Array}).promise;

        let resumeTxt = "";
        for(let pn=1;pn<=pdf.numPages;pn++){
            const page = await pdf.getPage(pn);
            const content = await page.getTextContent();
            const pageText = content.items.map(item=>item.str).join(" ");
            resumeTxt += pageText+"\n";
            resumeTxt = resumeTxt.replace(/\s+/g," ").trim;
        }
        const message = [
            {
                role: "system",
                content: `
                Extract stuctured data from resume.
                Return strictly json:
                {
                    "role":"string",
                    "experience": "string",
                    "projects": ["project1", "project2"],
                    "skills": ["skill1", "skill2"],
                    "education": ["data1","data2"]
                }
                `
            },
            {
                role: "user",
                content: resumeTxt
            }
        ];

        const aiRes = await askAi(message);
        const parsed = JSON.parse(aiRes);
        fs.unlinkSync(filePath);

        return re.status(200).json({
            role: parsed.role,
            experience: parsed.experience,
            projects: parsed.projects,
            skills: parsed.skills,
            education: parsed.education,

        })
    } catch (error) {
        if(req.file && fs.existsSync(req.file.path))
            fs.unlinkSync(req.file.path);

        return res.status(500).json({ message: error.message});
    }
}
