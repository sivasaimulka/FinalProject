const express = require('express');
const axios = require('axios');
const swaggerUi = require('swagger-ui-express');
const yaml = require('yamljs');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware to parse JSON bodies
app.use(express.json());

// Azure Form Recognizer credentials and endpoint
const endpoint = "https://finalprojectsharanyasadhu.cognitiveservices.azure.com/";
const key = process.env.FORM_RECOGNIZER_API_KEY;

// Function to analyze document from URL
const analyzeDocumentFromUrl = async (formUrl) => {
    try {
        const response = await axios.post(`${endpoint}`, { formUrl }, {
            headers: {
                'Ocp-Apim-Subscription-Key': key,
                'Content-Type': 'application/json'
            }
        });
        return response.data.content;
    } catch (error) {
        console.error('Error analyzing document:', error);
        throw error;
    }
};

// Route to analyze document
app.post('/analyze', async (req, res) => {
    const  { formUrl }  = req.body;
    if (!formUrl) {
        return res.status(400).json({ error: 'formUrl is required' });
    }

    try {
        const content = await analyzeDocumentFromUrl(formUrl);
        res.json({ content });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Swagger UI setup
const swaggerDocument = yaml.load('./swagger.yaml');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
