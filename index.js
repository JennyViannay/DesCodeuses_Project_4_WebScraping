import express from "express";
import cors from "cors";
import axios from "axios";
import { JSDOM } from "jsdom";
import { ExportToCsv } from 'export-to-csv';

const server = express();
const port = process.env.PORT || 5050;
const client_directory = process.env.PWD + '/public';
const csvOptions = {
    fieldSeparator: ',',
    quoteStrings: '"',
    decimalSeparator: '.',
    showLabels: true,
    showTitle: true,
    title: 'Products from the web',
    useTextFile: false,
    useBom: true,
    useKeysAsHeaders: true,
    // headers: ['Column 1', 'Column 2', etc...] <-- Won't work with useKeysAsHeaders present!
};
const csvExporter = new ExportToCsv(csvOptions);

server.use(cors('*'));
server.use(express.json());
server.use(express.urlencoded({
    extended: true
}));
server.use(express.static(client_directory));

let website_url = 'https://laptopwithlinux.com/';

server.get('/', (req, res) => {
    res.sendFile(client_directory + 'index.html')
});

server.get('/api', async (req, res) => {
    const category = req.query.category;
    console.log(category);
    const url = website_url + category;
    try {
        axios.get(url)
            .then(response => {
                JSDOM.fromURL(url).then(dom => {
                    const laptopsGrid = dom.window.document.getElementById('us_grid_1').querySelectorAll('article');
                    const articles = [];
                    laptopsGrid.forEach(laptop => {
                        const article = {};
                        article.title = laptop.querySelector('h2').textContent;
                        article.image = laptop.querySelector('img').src.replace('cdn.', '');
                        article.infos = [];
                        article.price = laptop.getElementsByTagName('bdi')[0].textContent;
                        const infosText = Array.from(laptop.getElementsByClassName('progress_info'));
                        const infosLabel = Array.from(laptop.getElementsByClassName('progress_text'));

                        for (let i = 0; i < infosText.length; i++) {
                            article.infos.push({ 'label': infosLabel[i].textContent, 'value': infosText[i].textContent });
                        }
                        articles.push(article);
                    });

                    csvExporter.generateCsv(articles);
                    res.send(articles).status(200);
                }).catch(err => {
                    console.log('err :', err);
                })
            })
    } catch (error) {
        res.status(500).send('Error server, try again !')
    }
});

server.listen(port, () => console.log(`Server is running on port ${port}`));