"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const app = (0, express_1.default)();
const port = 3000;
let videos = [
    { id: 1,
        title: "string",
        author: "string",
        canBeDownloaded: false,
        minAgeRestriction: null,
        createdAt: new Date().toISOString(),
        publicationDate: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString(),
        availableResolutions: ["P144"]
    },
    { id: 2,
        title: "string",
        author: "string",
        canBeDownloaded: false,
        minAgeRestriction: null,
        createdAt: new Date().toISOString(),
        publicationDate: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString(),
        availableResolutions: ["P144"]
    }
];
const parserMiddleware = (0, body_parser_1.default)({});
app.use(parserMiddleware);
app.get('/videos', (req, res) => {
    res.send(videos);
});
app.get('/videos/:id', (req, res) => {
    let video = videos.find(p => p.id === +req.params.id);
    if (video) {
        res.status(200).send(video);
    }
    else {
        res.sendStatus(404);
    }
});
app.post('/videos', (req, res) => {
    const title = req.body.title;
    const author = req.body.author;
    const permission = req.body.availableResolutions;
    let apiErrorResult = [];
    if (!title || typeof title !== 'string' || !title.trim() || title.length > 40) {
        apiErrorResult.push({
            "message": 'string',
            "field": "title"
        });
        return;
    }
    if (!author || typeof author !== 'string' || !author.trim() || author.length > 20) {
        apiErrorResult.push({
            "message": 'string',
            "field": "author"
        });
        return;
    }
    if (apiErrorResult.length !== 0) {
        res.status(400).send({ errorsMessages: apiErrorResult });
        return;
    }
    const newVideo = {
        id: +(new Date()),
        title: title,
        author: author,
        canBeDownloaded: false,
        minAgeRestriction: null,
        createdAt: new Date().toISOString(),
        publicationDate: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString(),
        availableResolutions: permission
    };
    videos.push(newVideo);
    res.status(201).send(newVideo);
});
app.put('/videos/:id', (req, res) => {
    const id = +req.params.id;
    let apiErrorResult = [];
    let video = videos.find(p => p.id === id);
    if (!video) {
        res.sendStatus(404);
        return;
    }
    ;
    const title = req.body.title;
    const author = req.body.author;
    const availableResolutions = req.body.availableResolutions;
    const canBeDownloaded = req.body.canBeDownloaded;
    const minAgeRestriction = req.body.minAgeRestriction;
    const publicationDate = new Date().toISOString();
    if (!title || typeof title !== 'string' || !title.trim() || title.length > 40) {
        apiErrorResult.push({
            "message": 'string',
            "field": "title"
        });
        return;
    }
    if (!author || typeof author !== 'string' || !author.trim() || author.length > 20) {
        apiErrorResult.push({
            "message": 'string > 20',
            "field": "author"
        });
        return;
    }
    if (minAgeRestriction > 18 || minAgeRestriction < 1) {
        apiErrorResult.push({
            "message": 'string',
            "field": "minAgeRestriction"
        });
        return;
    }
    if (typeof canBeDownloaded !== undefined && typeof canBeDownloaded !== 'boolean') {
        apiErrorResult.push({
            "message": 'canBeDownloaded',
            "field": "canBeDownloaded"
        });
        return;
    }
    if (typeof publicationDate !== "string") {
        apiErrorResult.push({
            "message": 'publicationDate',
            "field": "publicationDate"
        });
        return;
    }
    if (apiErrorResult.length !== 0) {
        res.status(400).send({ errorsMessages: apiErrorResult });
    }
    else {
        res.sendStatus(204);
    }
});
app.delete('/videos/:id', (req, res) => {
    for (let i = 0; i < videos.length; i++) {
        if (videos[i].id === +req.params.id) {
            videos.splice(i, 1);
            res.sendStatus(204);
            return;
        }
    }
    res.sendStatus(404);
});
app.delete('/testing/all-data', (req, res) => {
    videos.splice(-1, 0);
    res.sendStatus(204);
});
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
