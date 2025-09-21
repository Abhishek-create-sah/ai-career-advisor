const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3000;

// --- Middleware ---
app.set('view engine', 'ejs'); // Set EJS as the templating engine
app.use(express.static('public')); // Serve static files from the 'public' directory
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded bodies (as sent by HTML forms)

// --- Mock "AI" Recommender Logic ---
// In a real app, this would be an API call to a generative AI model.
// --- Mock "AI" Recommender Logic (UPDATED) ---
// --- Mock "AI" Recommender Logic (FINAL VERSION) ---
function getCareerRecommendations(userData) {
    const { skills } = userData;
    const userSkills = new Set(skills);

    const careers = [
        { name: 'Software Developer', required: ['JavaScript', 'Python', 'Databases', 'APIs'], salary: '₹8-15 LPA', growth: 'High' },
        { name: 'Data Analyst', required: ['SQL', 'Python', 'Statistics', 'Tableau'], salary: '₹6-12 LPA', growth: 'Very High' },
        { name: 'UX/UI Designer', required: ['Figma', 'User Research', 'Prototyping', 'HTML/CSS'], salary: '₹5-11 LPA', growth: 'High' }
    ];

    let recommendations = careers.map(career => {
        const matchedSkills = career.required.filter(skill => userSkills.has(skill));
        const skillGap = career.required.filter(skill => !userSkills.has(skill));
        const matchPercentage = Math.round((matchedSkills.length / career.required.length) * 100);
        const learningRoadmap = generateLearningRoadmap(skillGap);

        // *** NEW: Get the job market insights for this career ***
        const marketInsights = getJobMarketInsights(career.name);

        return {
            ...career,
            matchPercentage,
            matchedSkills,
            skillGap,
            learningRoadmap,
            marketInsights // *** NEW: Add insights to the object ***
        };
    });

    recommendations.sort((a, b) => b.matchPercentage - a.matchPercentage);
    return recommendations.slice(0, 3);
}

// --- Mock "AI" Learning Roadmap Generator ---
function generateLearningRoadmap(skillGap) {
    // In a real app, an AI would generate a detailed, personalized roadmap.
    // Here, we'll use a predefined set of resources for our prototype.
    const resourceDatabase = {
        'JavaScript': { course: 'The Complete JavaScript Course on Udemy', timeline: '4-6 Weeks' },
        'Python': { course: 'Python for Everybody on Coursera', timeline: '5-7 Weeks' },
        'Databases': { course: 'SQL - MySQL for Data Analytics on Coursera', timeline: '3-4 Weeks' },
        'APIs': { course: 'Postman: The Complete Guide - REST API Testing', timeline: '2-3 Weeks' },
        'SQL': { course: 'Introduction to SQL by W3Schools', timeline: '2-3 Weeks' },
        'Statistics': { course: 'Statistics for Data Science by IBM', timeline: '4-5 Weeks' },
        'Tableau': { course: 'Tableau 2022 A-Z: Hands-On Tableau Training', timeline: '3-4 Weeks' },
        'Figma': { course: 'Figma UI UX Design Essentials on Udemy', timeline: '2-4 Weeks' },
        'User Research': { course: 'Google UX Design Professional Certificate', timeline: '5-6 Weeks' },
        'Prototyping': { course: 'Learn Prototyping in Figma by Scrimba', timeline: '1-2 Weeks' },
        'HTML/CSS': { course: 'Build Responsive Real-World Websites by Jonas S.', timeline: '4-6 Weeks' },
    };

    return skillGap.map(skill => {
        return {
            skill: skill,
            resource: resourceDatabase[skill]?.course || 'Find a relevant course on Coursera or Udemy.',
            timeline: resourceDatabase[skill]?.timeline || 'Varies'
        };
    });
}

// --- Mock Job Market Insights Generator ---
function getJobMarketInsights(careerName) {
    // This data simulates real-time market trends for India.
    const insightsDatabase = {
        'Software Developer': {
            demand: 'Very High',
            topCities: ['Bengaluru', 'Hyderabad', 'Pune', 'Gurugram'],
            topCompanies: ['TCS', 'Infosys', 'Microsoft', 'Amazon']
        },
        'Data Analyst': {
            demand: 'High',
            topCities: ['Bengaluru', 'Mumbai', 'Chennai', 'Noida'],
            topCompanies: ['Accenture', 'Deloitte', 'Mu Sigma', 'Fractal Analytics']
        },
        'UX/UI Designer': {
            demand: 'High',
            topCities: ['Bengaluru', 'Pune', 'Mumbai', 'Remote'],
            topCompanies: ['Swiggy', 'Zomato', 'Flipkart', 'MakeMyTrip']
        }
    };

    return insightsDatabase[careerName] || { 
        demand: 'N/A', topCities: [], topCompanies: [] 
    };
}


// --- Routes ---
// GET route to render the main form
app.get('/', (req, res) => {
    res.render('index');
});

// POST route to handle form submission and display results
app.post('/recommend', (req, res) => {
    // The user's skills will be in req.body.skills
    // It might be a single string or an array depending on the form.
    let userSkills = req.body.skills || [];
    if (typeof userSkills === 'string') {
        userSkills = [userSkills]; // Ensure it's an array
    }
    
    const userData = {
        name: req.body.name,
        skills: userSkills
    };
    
    const recommendations = getCareerRecommendations(userData);

    res.render('results', { 
        userName: userData.name, 
        recommendations: recommendations 
    });
});

// --- Start Server ---
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});