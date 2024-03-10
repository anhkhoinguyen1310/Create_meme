const Jimp = require("jimp");

const resize = async (req, res, next) => {
    if(req.file){
        try 
            {
                const img = await Jimp.read(req.file.path);
                await img.scaleToFit(400,400).writeAsync(req.file.path);
                console.log("resize used");
                next()

            } catch(err)
            {
                next(err)
            }

    } else {
        next(new Error("image required"))
    }
}

const blur = async (req, _, next) => {
    if(req.file){
        try 
            {
                const img = await Jimp.read(req.file.path);
                await img.blur(5).writeAsync(req.file.path);
                console.log("blur used");
                next()

            } catch(err)
            {
                console.error("Blur error:", err.message); 
                next(err)
            }

    } else {
        next(new Error("image required"))
    }
}

const writeTextOnImage = async (req, _, next) => {
    if(req.file){
        try 
            {
                const img = await Jimp.read(req.file.path);
                const font = await Jimp.loadFont(Jimp.FONT_SANS_128_BLACK)
                img.print(font, 10, 10, "Hello World").writeAsync(req.file.path)
                next()

            } catch(err)
            {
                console.error("write error:", err.message);
                next(err)
            }

    } else {
        next(new Error("image required"))
    }
}

const writeOnImage = async(originalImagePath, ouputImagePath, texts) => {
    try{
        const img = await Jimp.read(originalImagePath);
        const dimension = {
            width: img.bitmap.width,
            height: img.bitmap.height,
        };
        const promises = texts.map(async(text)=>{
            const font = await Jimp.loadFont(
                Jimp[`FONT_SANS_${text.size}_${text.color}`],
            );
        await img.print(
            font, 0,0,
            {
                text: text.content,
                alignmentX: Jimp[text.alignmentX],
                alignmentY: Jimp[text.alignmentY],
            },
            dimension.width,
            dimension.height,
        )
        });
        await Promise.all(promises);
        await img.writeAsync(ouputImagePath);

    } catch(err){
        throw err;
    }
}
// const processImage = async (req, res, next) => {
//     if(req.file){
//         try {
//             const img = await Jimp.read(req.file.path);
//             const font = await Jimp.loadFont(Jimp.FONT_SANS_128_WHITE);
//             img.print(font, 10, 10, "Hello World")
//                .scaleToFit(400, 400) // Resize
//                .blur(5); // Blur
//             await img.writeAsync(req.file.path); // Write once after all operations
//             console.log("Image processed");
//             next();
//         } catch(err) {
//             console.error("Processing error:", err.message);
//             next(err);
//         }
//     } else {
//         next(new Error("Image required"));
//     }
// };


module.exports = {
    resize,
    blur,
    writeTextOnImage,
    writeOnImage,
    //processImage,
}