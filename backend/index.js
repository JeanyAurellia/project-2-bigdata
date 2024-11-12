const express = require('express');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const cors = require('cors');
const os = require('os');

const app = express();
const PORT = 3000;

// Middleware untuk mengizinkan CORS
app.use(cors());
app.use(express.json()); // Untuk menerima data JSON dari body request

// Dapatkan direktori home user
const homeDir = os.homedir();
const clusteringResultsDir = path.resolve(homeDir, 'project-2/spark/cluster'); // Pastikan path ini benar

let clusteringResults = [];

// Fungsi untuk membaca dan mem-parsing file CSV
function readBatchFile(filePath) {
    return new Promise((resolve, reject) => {
        const results = [];
        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (row) => results.push(row))  // Kumpulkan baris ke dalam array
            .on('end', () => {
                resolve(results);  // Kembalikan hasil saat selesai
            })
            .on('error', (error) => {
                console.error(`Error reading file ${filePath}:`, error);
                reject(error);  // Tolak promise jika ada error
            });
    });
}

// Fungsi untuk mendapatkan semua file CSV dalam folder
function getCsvFilesFromDir(dir) {
    return new Promise((resolve, reject) => {
        fs.readdir(dir, (err, files) => {
            if (err) {
                console.error(`Error reading directory ${dir}:`, err);
                reject(err);
            } else {
                const csvFiles = files.filter(file => file.endsWith('.csv'));
                const filePaths = csvFiles.map(file => path.join(dir, file));
                resolve(filePaths);
            }
        });
    });
}

// Memuat semua file batch dari setiap folder batch
async function loadBatchFiles() {
    try {
        const batchDirs = [
            path.join(clusteringResultsDir, 'clustering_results_batch_1'),
            path.join(clusteringResultsDir, 'clustering_results_batch_2'),
            path.join(clusteringResultsDir, 'clustering_results_batch_3')
        ];

        let allBatchFiles = [];
        for (const dir of batchDirs) {
            if (fs.existsSync(dir)) {  // Cek jika folder batch ada
                const files = await getCsvFilesFromDir(dir);
                allBatchFiles = allBatchFiles.concat(files);
            } else {
                console.warn(`Directory ${dir} does not exist. Skipping...`);
            }
        }

        // Proses setiap file di allBatchFiles
        const fileData = await Promise.all(allBatchFiles.map(readBatchFile));
        clusteringResults = fileData.flat();  // Gabungkan semua hasil ke clusteringResults

        console.log(`Loaded ${clusteringResults.length} records from CSV files.`);

        // Define API endpoints setelah data selesai di-load
        defineApiEndpoints();

        // Mulai server Express
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Error loading batch files:', error);
    }
}

// Mendefinisikan endpoint API
function defineApiEndpoints() {
    // Endpoint untuk mendapatkan statistik setiap cluster (misalnya, total jumlah dan nilai rata-rata untuk beberapa fitur)
    app.get('/api/cluster-stats', (req, res) => {
        const clusterStats = {};
        clusteringResults.forEach(result => {
            const cluster = result['prediction'];
            if (!clusterStats[cluster]) {
                clusterStats[cluster] = { count: 0, totalCSAT: 0, totalPrice: 0 };
            }
            clusterStats[cluster].count += 1;
            clusterStats[cluster].totalCSAT += parseFloat(result['CSAT Score']) || 0;
            clusterStats[cluster].totalPrice += parseFloat(result['Item_price']) || 0;
        });

        // Hitung rata-rata berdasarkan total
        const stats = Object.keys(clusterStats).map(cluster => ({
            cluster,
            count: clusterStats[cluster].count,
            avgCSAT: clusterStats[cluster].totalCSAT / clusterStats[cluster].count,
            avgPrice: clusterStats[cluster].totalPrice / clusterStats[cluster].count
        }));

        res.json(stats);
    });

    // Endpoint untuk mengembalikan hasil clustering untuk Unique id tertentu
    app.get('/api/clustering-results/:uniqueId', (req, res) => {
        const uniqueId = req.params.uniqueId;
        const result = clusteringResults.find((item) => item['Unique id'] === uniqueId);

        if (result) {
            res.json(result);
        } else {
            res.status(404).send('Unique id tidak ditemukan');
        }
    });

    // Endpoint untuk mengembalikan seluruh hasil clustering
    app.get('/api/clustering-results', (req, res) => {
        res.json(clusteringResults);
    });
}

// Mulai proses memuat file batch
loadBatchFiles();
