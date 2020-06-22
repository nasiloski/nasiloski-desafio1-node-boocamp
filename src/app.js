const express = require('express');
const app = express();
const { uuid, isUuid } = require('uuidv4');
const cors = require('cors');

app.use(express.json());
app.use(cors());

function validadeId (req, res, next){
    const { id } = req.params;
    if(!isUuid(id)) return res.status(400).json({ error: 'Invalid repository ID.' });

    return next();
}

const repositories = [];

app.get('/repositories', (req, res) => {
    return res.json(repositories);
});

app.post('/repositories', (req, res) => {
    const { title, url, techs } = req.body;
    const repository = { id: uuid(), title, url, techs, likes: 0 };
    repositories.push(repository)
    return res.json(repository)
})

app.put('/repositories/:id', validadeId, (req, res) => {
    const { id } = req.params;
    const { title, url, techs } = req.body;

    const repoIndex = repositories.findIndex(repository => repository.id === id);
    if(repoIndex < 0) return res.status(400).json({ error: 'Repository not found' });

    const repository = {
        id,
        title,
        url,
        techs,
        likes: repositories[repoIndex].likes
    }
    repositories[repoIndex] = repository;
    return res.json(repository);
});

app.delete('/repositories/:id', validadeId,(req, res) => {
    const { id } = req.params;
    const repoIndex = repositories.findIndex(repository => repository.id === id);
    if(repoIndex < 0) return res.status(400).json({ error: 'Repository not found' });
    repositories.splice(repoIndex, 1)
    return res.status(204).send();
})

app.post('/repositories/:id/like', validadeId, (req, res) => {
    const { id } = req.params;
    const repoIndex = repositories.findIndex(repository => repository.id === id);
    repositories[repoIndex].likes = repositories[repoIndex].likes + 1;
    return res.json(repositories[repoIndex])

})


app.listen(3333, () => {
    console.log(`API:🚀 Backend started`);
});

