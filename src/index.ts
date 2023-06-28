import express, {Request, Response} from 'express'
import bodyParser from 'body-parser'
import { Console, log } from 'console'
const app = express()
const port = 3000


let videos = [
  {
    id: 1,
  title: "string",
  author: "string",
  canBeDownloaded: false,
  minAgeRestriction: null,
  createdAt: new Date().toISOString(),
  publicationDate: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString(),
  availableResolutions: ["P144"]
  }, 
  {
    id: 2,
  title: "string",
  author: "string",
  canBeDownloaded: false,
  minAgeRestriction: null,
  createdAt: new Date().toISOString(),
  publicationDate: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString(),
  availableResolutions: ["P144"]
  }
]
const permissionVariants = ['P144', 'P240', 'P360', 'P480', 'P720', 'P1080', 'P1440', 'P2160']

const parserMiddleware = bodyParser({})
app.use(parserMiddleware)


app.get('/videos', (req: Request, res: Response) => {
 res.send(videos)
})

app.get('/videos/:id', (req: Request, res: Response) => {
  let video = videos.find(p => p.id === +req.params.id)
  if (video) {
    res.send(video)
  } else {
    res.sendStatus(404)
  }
})

app.post('/videos', (req: Request, res: Response) => {
  const title = req.body.title;
  const author = req.body.author;
  const availableResolutions = req.body.availableResolutions;
  let apiErrorResult =[];
  
  if (!title || typeof title !== 'string' || !title.trim() || title.length > 40) {
    apiErrorResult.push({message: 'string', field: "title"})
  }

  if (!author || typeof author !== 'string' || !author.trim() || author.length > 20) {
    apiErrorResult.push({message: 'string', field: "author"})
  }

  for (let i = 0; i < availableResolutions.length; i++ ) {
    if (permissionVariants.includes(availableResolutions[i]) === false) {
      apiErrorResult.push({message: 'availableResolutions', field: "availableResolutions"})
    }
  } 

  
  if (apiErrorResult.length !== 0) {
    res.status(400).send({ errorsMessages: apiErrorResult})
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
    availableResolutions: availableResolutions
  };

  videos.push(newVideo)
  res.status(201).send(newVideo)
})

app.put('/videos/:id', (req: Request, res: Response) => {
  const id = +req.params.id;
  let apiErrorResult = [];

  let video = videos.find(p => p.id === id);
  
  if (!video) {
    res.sendStatus(404)
  };

  const title = req.body.title;
  const author = req.body.author;
  const availableResolutions = req.body.availableResolutions;
  const canBeDownloaded = req.body.canBeDownloaded;
  const minAgeRestriction = req.body.minAgeRestriction;
  const dataPlus = new Date (video.createdAt);
  const publicationDate = dataPlus.setDate(dataPlus.getDate() + 1);
  const publicationDateISO = req.body.publicationDate;


  if (!title || typeof title !== 'string' || !title.trim() || title.length > 40) {
    apiErrorResult.push({message: 'string', field: "title"})
  }

  if (!author || typeof author !== 'string' || !author.trim() || author.length > 20) {
    apiErrorResult.push({message: 'string > 20', field: "author"})
  } 


  if (minAgeRestriction > 18 || minAgeRestriction < 1 ) {
    apiErrorResult.push({message : 'string', field : "minAgeRestriction"})
  }

  if (typeof canBeDownloaded !== undefined && typeof canBeDownloaded !== 'boolean') {
    apiErrorResult.push({message: 'canBeDownloaded', field: "canBeDownloaded"})
  }

  if (typeof publicationDateISO !== "string") {
    apiErrorResult.push({message: 'publicationDate', field: "publicationDate"})
  } 
  for (let i = 0; i < availableResolutions.length; i++ ) {
    if (permissionVariants.includes(availableResolutions[i]) === false) {
      apiErrorResult.push({message: 'availableResolutions', field: "availableResolutions"})
    }
  }

if (apiErrorResult.length > 0) {
    res.status(400).send({ errorsMessages: apiErrorResult})
  } else {
  video.title = title;
  video.author = author,
  video.canBeDownloaded = canBeDownloaded,
  video.availableResolutions = availableResolutions,
  video.minAgeRestriction = minAgeRestriction,
  video.publicationDate = publicationDateISO,
  res.sendStatus(204)
}
})

app.delete('/videos/:id', (req: Request, res: Response) => {
  for (let i=0; i<videos.length; i++) {
    if (videos[i].id === + req.params.id) {
      videos.splice(i, 1);
      res.sendStatus(204)
      return;
    }
  }
  res.sendStatus(404)
})
app.delete('/testing/all-data', (req: Request, res: Response) => {
    videos.splice(-1, 0);
      res.sendStatus(204)
})




app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})