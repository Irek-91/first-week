import express, {Request, Response} from 'express'
import bodyParser from 'body-parser'
const app = express()
const port = 3000


const videos = [{
  id: +(new Date()),
  title: "string",
  author: "string",
  canBeDownloaded: true,
  minAgeRestriction: null,
  createdAt: new Date().toISOString(),
  publicationDate: new Date().toISOString(),
  availableResolutions: ["P144"]
}]
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
    res.send(404)
  }
})

app.post('/videos', (req: Request, res: Response) => {
  const title = req.body.title
  const author = req.body.author
  const permission = req.body.availableResolutions
  const newVideo = {
    id: +(new Date()),
    title: title,
    author: author,
    canBeDownloaded: true,
    minAgeRestriction: null,
    createdAt: new Date().toISOString(),
    publicationDate: new Date().toISOString(),
    availableResolutions: permission
  };
  let permissionV = permissionVariants.find(p => p === permission)
  if (!permissionV) {
    res.status(400).send({
      "errorsMessages": [
        {
          "message": "",
          "field": permission
        }
      ]
    })
  }
  if (title.length > 40) {
    res.status(400).send({
      "errorsMessages": [
        {
    title: title,
          "message": 'maxLength: 40',
          "field": title
        }
      ]
    })
  }
  else if (author.length > 20) {
    res.status(400).send({
      "errorsMessages": [
        {
          "message": "maxLength: 20",
          "field": author
        }
      ]
    })
  }  
  else {videos.push(newVideo)
    res.status(201).send(newVideo)}
})

app.put('/videos/:id', (req: Request, res: Response) => {
  const permissionV = permissionVariants.find(p => p === req.body.availableResolution)
  const video = videos.find(p => p.id === +req.params.id)
  if (video) {
    video.title = req.body.title,
    video.author = req.body.author,
    video.availableResolutions = req.body.availableResolutions,
    video.canBeDownloaded = req.body.canBeDownloaded,
    video.minAgeRestriction = req.body.minAgeRestriction
    video.publicationDate = new Date().toISOString();
    if (video.title.length > 40) {
      res.status(400).send({
      "errorsMessages": [
        {
    title: video.title,
          "message": 'maxLength: 40',
          "field": video.title
        }
      ]
    })
  } else if (video.author.length > 20) {
    res.status(400).send({
      "errorsMessages": [
        {
          "message": "maxLength: 20",
          "field": video.author
        }
      ]
    })
  } else if (video.minAgeRestriction > 18 ||video.minAgeRestriction < 1 ) {
    res.status(400).send({
      "errorsMessages": [
        {
          "message": "maximum: 18, minimum: 1",
          "field": video.minAgeRestriction
        }
      ]
    })
  } else if (!permissionV) {
    res.status(400).send({
      "errorsMessages": [
        {
          "message": "",
          "field": video.availableResolutions
        }
      ]
    })
  } else {
    res.send(video)
  }}
   else {
    res.send(404)
  }
})

app.delete('/videos/:id', (req: Request, res: Response) => {
  for (let i=0; i<videos.length; i++) {
    if (videos[i].id === + req.params.id) {
      videos.splice(i, 1);
      res.send(204)
      return;
    }
  }
  res.send(404)
})




app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})