"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
exports.app = (0, express_1.default)();
const port = process.env.PORT || 3004;
exports.app.use(express_1.default.json());
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
exports.app.get('/videos', (req, res) => {
    res.sendStatus(201).send(videos);
});
exports.app.get('/videos/:id', (req, res) => {
    const id = +req.params.id;
    const video = videos.find((video) => video.id === id);
    if (!video) {
        res.sendStatus(404);
        return;
    }
    res.send(video);
});
exports.app.post('/videos', (req, res) => {
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
    let publicationDate = new Date();
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
exports.app.put('/videos/:id', (req, res) => {
    let errors = {
        errorsMessages: [],
    };
    let { title, author, availableResolutions, canBeDownloaded, minAgeRestriction, publicationDate, } = req.body;
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
    const id = +req.params.id;
    let video = videos.find((video) => video.id === id);
    if (video) {
        video.title = title;
        video.author = author;
        video.availableResolutions = availableResolutions;
        video.canBeDownloaded = canBeDownloaded;
        video.minAgeRestriction = minAgeRestriction;
        video.publicationDate = publicationDate;
    }
    else {
        res.status(404);
    }
    res.status(204).send(video);
});
exports.app.delete('/videos/:id', (req, res) => {
    const id = +req.params.id;
    let video = videos.find((video) => video.id === id);
    let index = videos.findIndex(n => n.id === id);
    if (!video) {
        res.sendStatus(404);
        return;
    }
    else {
        videos.splice(index, 1);
        res.send(204);
        return;
    }
});
exports.app.delete('/testing/all-data', (req, res) => {
    if (!videos) {
        res.sendStatus(404);
        return;
    }
    else {
        videos.splice(0, videos.length);
        res.send(204);
        return;
    }
});
exports.app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
