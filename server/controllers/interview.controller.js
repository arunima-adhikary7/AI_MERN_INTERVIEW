import fs from 'fs';
import * as pdfjLib from 'pdfjs-dist/legacy/build/pdf.mjs'

export const analyzeResume = async (res,res)=>{
    try {
        if(!req.file)
            return res.status(400).json({ message: "Resume File Required"});
        const filePath = req.file.path;
        const fileBuffer = await fs.promises.readFile(filePath);
        const unit8Array = new Uint8Array(fileBuffer);

        const pdf = await pdfjLib.getDocument({data:unit8Array}).promise;
    } catch (error) {
        
    }
}
