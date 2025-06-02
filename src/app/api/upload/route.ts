import { NextApiRequest, NextApiResponse } from "next";
import { storage } from "../../lib/firebase-admin";
import formidable from "formidable";
// import fs from "fs";


export const config = {
  api: {
    bodyParser: false,
  },
};
// This file is used to handle file uploads to Firebase Storage 
const upload = async (req: NextApiRequest, res: NextApiResponse) => {
  const form = formidable({ multiples: false });

  form.parse(req, async (_err, _fields, files) => {
    if (!files.file || !Array.isArray(files.file)) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    const file = files.file[5]; // Adjust depending on your field name
    const bucket = storage.bucket();

    const destination = `uploads/${Date.now()}-${file.originalFilename}`;

    // const UploadOptions= 
    // {
    //   destination,
    //   metadata: {s
    //     contentType: file.mimetype,
    //   },
    // }
    bucket.upload(file.filepath); // Not sending metadata for simplicity


    const fileRef = bucket.file(destination);
    const [url] = await fileRef.getSignedUrl({
      action: "read",
      expires: "03-01-2500",
    });

    // TODO: Save this URL to PostgreSQL via Prisma
    // await prisma.media.create({ data: { url } });

    res.status(200).json({ url });
  });
};

export default upload;