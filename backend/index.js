const express = require('express');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const cors = require('cors');
const app = express();
const PORT = 3000;
const os = require('os');

// Get the user's home directory
const homeDir = os.homedir();

// Resolve the correct path using the home directory
const clusteringResultsDir = path.resolve(homeDir, 'project-2/spark/cluster');

let clusteringResults = [];

// Function to read and parse a CSV file
function readBatchFile(filePath) {
    return new Promise((resolve, reject) => {
        const results = [];
        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (row) => results.push(row))  // Collect rows into an array
            .on('end', () => {
                clusteringResults = clusteringResults.concat(results);  // Merge results into the main array
                console.log(`CSV file ${filePath} successfully processed`);
                resolve();
            })
            .on('error', reject);  // Reject if there's an error
    });
}

// Function to get all CSV files inside a folder
function getCsvFilesFromDir(dir) {
    return new Promise((resolve, reject) => {
        fs.readdir(dir, (err, files) => {
            if (err) {
                reject(err);
            } else {
                const csvFiles = files.filter(file => file.endsWith('.csv'));  // Filter only CSV files
                const filePaths = csvFiles.map(file => path.join(dir, file));  // Get the full path of the files
                resolve(filePaths);
            }
        });
    });
}

// Load all batch files from each batch folder
async function loadBatchFiles() {
    try {
        const batchDirs = [
            path.join(clusteringResultsDir, 'clustering_results_batch_1'),
            path.join(clusteringResultsDir, 'clustering_results_batch_2'),
            path.join(clusteringResultsDir, 'clustering_results_batch_3')
        ];

        // Get CSV files from all batch directories
        let allBatchFiles = [];
        for (const dir of batchDirs) {
            const files = await getCsvFilesFromDir(dir);
            allBatchFiles = allBatchFiles.concat(files);  // Merge all CSV file paths
        }

        // Process each file in allBatchFiles
        await Promise.all(allBatchFiles.map(readBatchFile));
        
        // Define the route for all clustering results
        app.get('/api/clustering-results', (req, res) => {
            res.json(clusteringResults);  // Return all clustering results
        });

        // Define the route for specific results by Unique id (used instead of transID)
        app.get('/api/clustering-results/:uniqueId', (req, res) => {
            const uniqueId = req.params.uniqueId;  // Fetch Unique id from the URL
            const result = clusteringResults.find((item) => item['Unique id'] === uniqueId);  // Search by Unique id

            if (result) {
                res.json(result);  // Return the specific result
            } else {
                res.status(404).send('Unique id not found');  // Return 404 if not found
            }
        });

        // Start the Express server
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Error loading batch files:', error);  // Handle errors
    }
}

// Start loading batch files
loadBatchFiles();
