import express from 'express';
import tokenMiddleware from '../middleware/token-middleware.js';
import checkApiKeyMiddleware from '../middleware/apikey-middleware.js';
import { getAllInstansiController } from '../controllers/instansi-controller.js';

const arisRouter = express.Router();

// Add the test endpoint
// router.get('/get-group-children', TestController.testGetGroupChildren);

// Check API key middleware
arisRouter.use(checkApiKeyMiddleware);

// Obtain token middleware
arisRouter.use(tokenMiddleware);

// Instansi API
// Get all instansi
arisRouter.get('/instansi', getAllInstansiController);
// Get all peta rencana for spesific instansi
arisRouter.get('/instansi/:id/peta-rencana', (req, res) => {
    res.send('Peta Rencana API');
});

// Peta Rencana API
// Get all peta rencana with program and kegiatan
arisRouter.get('/peta-rencana', (req, res) => {
    res.send('Peta Rencana API');
});
// Get all program and kegiatan for spesific peta rencana
arisRouter.get('/peta-rencana/:id/program-kegiatan', (req, res) => {
    res.send('Program Kegiatan API');
});

// Program Kegiatan API
// Get kegiatan by id
arisRouter.get('/kegiatan/:id/domain', (req, res) => {
    res.send('Kegiatan API');
});

// Get domain aplikasi for spesific kegiatan
arisRouter.get('/kegiatan/:id/domain/aplikasi', (req, res) => {
    res.send('Domain Aplikasi API');
});
// Get domain proses bisnis for spesific kegiatan
arisRouter.get('/kegiatan/:id/domain/proses-bisnis', (req, res) => {
    res.send('Domain Proses Bisnis API');
});
// Get domain layanan for spesific kegiatan
arisRouter.get('/kegiatan/:id/domain/layanan', (req, res) => {
    res.send('Domain Layanan API');
});
// Get domain data for spesific kegiatan
arisRouter.get('/kegiatan/:id/domain/data', (req, res) => {
    res.send('Domain Data API');
});
// Get domain infrastruktur for spesific kegiatan
arisRouter.get('/kegiatan/:id/domain/infrastruktur', (req, res) => {
    res.send('Domain Infrastruktur API');
});
// Get domain keamanan for spesific kegiatan
arisRouter.get('/kegiatan/:id/domain/keamanan', (req, res) => {
    res.send('Domain Keamanan API');
});



export default arisRouter;