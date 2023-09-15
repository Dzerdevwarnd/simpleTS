"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
app.use(express_1.default.json());
var AvailableResolutions;
(function (AvailableResolutions) {
    AvailableResolutions["P144"] = "P144";
    AvailableResolutions["P240"] = "P240";
    AvailableResolutions["P360"] = "P360";
    AvailableResolutions["P480"] = "P480";
    AvailableResolutions["P720"] = "P720";
    AvailableResolutions["P1080"] = "P1080";
    AvailableResolutions["P1440"] = "P1440";
    AvailableResolutions["P2160"] = "P2160";
})(AvailableResolutions || (AvailableResolutions = {}));
const videos = [
    {
        id: 1,
        title: 'test',
        author: 'string',
        canBeDownloaded: true,
        minAgeRestriction: null,
        createdAt: '2023-09-15T08:36:39.218Z',
        publicationDate: '2023-09-15T08:36:39.218Z',
        availableResolutions: [AvailableResolutions.P144],
    },
];
app.get('/videos', (req, res) => {
    res.send(videos);
});
app.get('/videos', (req, res) => {
    let video = videos.find(p => p.id === +req.params.id);
    if (!videos) {
        res.sendStatus(404);
        return;
    }
    res.send(video);
});
app.post('videos', (req, res) => {
    let errors = {
        errorsMessages: [],
    };
    let { title, author, availableResolutions } = req.body;
    if (!title || !title.length || title.trim().length > 40) {
        errors.errorsMessages.push({ message: 'Invalid title', field: 'title' });
    }
    if (!author || !author.length || author.trim().length > 20) {
        errors.errorsMessages.push({ message: 'Invalid author', field: 'author' });
    }
    if (Array.isArray(availableResolutions)) {
        availableResolutions.map((r) => {
            !AvailableResolutions[r] &&
                errors.errorsMessages.push({
                    message: 'Invalid availableResolutions',
                    field: 'availableResolutions',
                });
        });
    }
    else {
        availableResolutions = [];
    }
    if (errors.errorsMessages.length) {
        res.status(400).send(errors);
        return;
    }
    const createdAt = new Date();
    const publicationDate = new Date();
    publicationDate.setDate(createdAt.getDate() + 1);
    const newVideo = {
        id: +new Date(),
        canBeDownloaded: false,
        minAgeRestriction: null,
        createdAt: createdAt.toISOString(),
        publicationDate: createdAt.toISOString(),
        title,
        author,
        availableResolutions,
    };
    videos.push(newVideo);
    res.status(201).send(newVideo);
});
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
