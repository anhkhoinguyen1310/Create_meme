const fs = require("fs");
const photoHelper = require("../middlewares/photo.helper");

const createMeme = async (req, res, next) => {
    try {
        //Read data from Json file
        let rawData = fs.readFileSync("memes.json");
        let memes = JSON.parse(rawData).memes;

        const meme = {};
        const texts = JSON.parse(req.body.texts) || [];
        console.log({texts})
        const textsArr = [].concat(texts); // Make sure texts is an array.
        meme.texts = textsArr;

        // Prepare data for the new meme
        meme.id = Date.now();
        meme.originalImage = req.file.filename;
        meme.originalImagePath = req.file.path;
        const newFilename = `MEME_${meme.id}`;
        const newDirectory = req.file.destination;
        const newFilenameExtension = meme.originalImage.split(" ").slice(-1);
        meme.outputMemePath = `${newDirectory}/${newFilename}.${newFilenameExtension}`;
        //Put Text on Imgge
        await photoHelper.writeOnImage(
            meme.originalImagePath,
            meme.outputMemePath,
            meme.texts, 
        );
        //Add new memes to the begining of the list and save to Json file
        meme.createdAt = Date.now();
        meme.updatedAt = Date.now();
        memes.unshift(meme);
        fs.writeFileSync("memes.json", JSON.stringify({ memes }));
        res.status(201).json(meme);

    } catch (err) {
        next(err)
    }
}

const getAllMemes = async (req, res, next) => {
    try{
        let rawData = fs.readFileSync("memes.json");
        let memes = JSON.parse(rawData).memes;
        res.json({data:memes})
    }
    catch(err){
        next(err)
    }
}

module.exports = {
    createMeme,     
    getAllMemes,        
}
