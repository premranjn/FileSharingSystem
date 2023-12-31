import dotenv from 'dotenv';

import File from '../models/file.js';
import { checkUser } from '../utils/upload.js';
import { files } from '../models/sequelize.js';

dotenv.config();

export const uploadImage = async (request, response, next) => {
    const fileObj = {
        path: request.file.path,
        name: request.file.originalname,
    };
    
    try {
        const userInfo = request.body.userInfo;
        if (userInfo === null) {
            return response.status(401).json({message: 'log in to access this page'});
        }

        const isPresent = await files.findOne({
            where: {
                className: request.body.className,
                pin: request.body.pin
            },
            attributes: ['id']
        });
        if (isPresent !== null) {
            return response.status(400).json({message: 'File with this pin already exists in tis class, try different pin'});
        }

        const file = await File.create(fileObj); //saves to db

        const newFile = {
            className: request.body.className, // replace with the actual owner number
            link: `http://${process.env.HOST}:${process.env.PORT}/file/${file._id}`, // replace with the correct file link
            pin: request.body.pin, // replace with the actual pin number
        };

        await files.create(newFile);

        response.status(200).json({ path: `http://${process.env.HOST}:${process.env.PORT}/file/${file._id}`});
    } catch (error) {
        console.error(error.message);
        response.status(500).json({ path: "not uploaded", error: error.message });
    }
}

export const getImage = async (request, response, next) => {
    try {   
        const file = await File.findById(request.params.fileId);
        
        file.downloadCount++;

        await file.save();

        response.download(file.path, "file");
    } catch (error) {
        console.error(error.message);
        response.status(500).json({ msg: error.message });
    }
}