const fs = require('fs');
const https = require('https');
const path = require('path');

const icons = [
    { name: 'green.png', url: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png' },
    { name: 'red.png', url: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png' },
    { name: 'orange.png', url: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png' },
    { name: 'shadow.png', url: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png' }
];

const download = (url, dest) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
        response.pipe(file);
        file.on('finish', () => {
            file.close();
            console.log(`Downloaded ${dest}`);
        });
    }).on('error', (err) => {
        fs.unlink(dest);
        console.error(`Error downloading ${url}:`, err.message);
    });
};

icons.forEach(icon => {
    const dest = path.join(__dirname, 'client/public/markers', icon.name);
    download(icon.url, dest);
});
