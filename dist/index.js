"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const app = (0, express_1.default)();
const port = 3000;
const videos = [{
        id: 1,
        title: "string",
        author: "string",
        canBeDownloaded: false,
        minAgeRestriction: null,
        createdAt: new Date().toISOString(),
        publicationDate: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString(),
        availableResolutions: ["P144"]
    }, {
        id: 2,
        title: "string",
        author: "string",
        canBeDownloaded: false,
        minAgeRestriction: null,
        createdAt: new Date().toISOString(),
        publicationDate: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString(),
        availableResolutions: ["P144"]
    }
];
const permissionVariants = ['P144', 'P240', 'P360', 'P480', 'P720', 'P1080', 'P1440', 'P2160'];
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
        res.send(404);
    }
});
app.post('/videos', (req, res) => {
    const title = req.body.title;
    const author = req.body.author;
    const permission = req.body.availableResolutions;
    let apiErrorResult = [];
    let permissionV = permissionVariants.find(p => p === permission);
    if (!title || typeof title !== 'string' || !title.trim()) {
        apiErrorResult.push({ errorsMessages: [{
                    "message": 'string',
                    "field": "title"
                }]
        });
        return;
    }
    if (title.length > 40) {
        apiErrorResult.push({ errorsMessages: [{
                    "message": 'string',
                    "field": "title"
                }]
        });
        return;
    }
    if (author.length > 20) {
        apiErrorResult.push({ errorsMessages: [{
                    "message": 'string',
                    "field": "author"
                }]
        });
        return;
    }
    if (apiErrorResult.length > 0) {
        res.status(400).send(apiErrorResult);
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
        res.send(404);
    }
    ;
    const title = req.body.title;
    const author = req.body.author;
    const availableResolutions = req.body.availableResolutions;
    const canBeDownloaded = req.body.canBeDownloaded;
    const minAgeRestriction = req.body.minAgeRestriction;
    const publicationDate = new Date().toISOString();
    if (!title || typeof title !== 'string' || !title.trim()) {
        apiErrorResult.push({ errorsMessages: [{
                    "message": 'string',
                    "field": "title"
                }]
        });
        return;
    }
    if (video.author.length > 20) {
        apiErrorResult.push({ errorsMessages: [{
                    "message": 'string > 20',
                    "field": "author"
                }]
        });
        return;
    }
    if (video.minAgeRestriction > 18 || video.minAgeRestriction < 1 || typeof video.minAgeRestriction !== null) {
        apiErrorResult.push({ errorsMessages: [{
                    "message": 'string',
                    "field": "minAgeRestriction"
                }]
        });
        return;
    }
    if (apiErrorResult.length > 0) {
        res.status(400).send(apiErrorResult);
    }
    else {
        res.status(204);
    }
});
app.delete('/videos/:id', (req, res) => {
    for (let i = 0; i < videos.length; i++) {
        if (videos[i].id === +req.params.id) {
            videos.splice(i, 1);
            res.send(204);
            return;
        }
    }
    res.send(404);
});
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
