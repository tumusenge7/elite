const db = require('./backend/config/db');

const services = [
    {
        name: 'Residential Construction',
        description: 'Elite home building with precision and luxury craftsmanship.',
        detailed_description: 'We specialise in high-end residential projects, from colonial-style estates to modern minimalist villas. Our team handles everything from foundation to the final interior polish.',
        main_image: 'https://images.unsplash.com/photo-1503387762-592dea58ef23?q=80&w=1200',
        gallery_images: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=800,https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800'
    },
    {
        name: 'Commercial Infrastructure',
        description: 'Large-scale building solutions for the modern business world.',
        detailed_description: 'From office towers to retail plazas, we deliver structural excellence on time and within budget. Our commercial division is equipped for complex architectural demands.',
        main_image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200',
        gallery_images: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=800,https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=800'
    },
    {
        name: 'Interior Architecture',
        description: 'Harmonising space, light, and texture for perfect living.',
        detailed_description: 'Our design-build approach ensures that the interior of your property is as impressive as the exterior. We use premium materials and bespoke fittings.',
        main_image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1200',
        gallery_images: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=800,https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a?q=80&w=800'
    }
];

const projects = [
    {
        title: 'The Elite Heights',
        category: 'Residential',
        description: 'A 45-unit luxury apartment complex with panoramic city views.',
        image: 'https://images.unsplash.com/photo-1545324418-f1d3c5b53574?q=80&w=1200'
    },
    {
        title: 'Central Business Plaza',
        category: 'Commercial',
        description: 'Sustainable office space featuring smart-grid technology.',
        image: 'https://images.unsplash.com/photo-1554435493-93422e8220c8?q=80&w=1200'
    },
    {
        title: 'Riverside Modern Estate',
        category: 'Private Villa',
        description: 'Custom waterfront home with integrated automation and private dock.',
        image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200'
    },
    {
        title: 'Industrial Logistics Hub',
        category: 'Industrial',
        description: 'State-of-the-art warehousing facility for international trade.',
        image: 'https://images.unsplash.com/photo-1586528116311-ad86d7c44367?q=80&w=1200'
    }
];

const seedData = async () => {
    console.log(' Seeding Professional Content...');

    // Clear existing (optional)
    // await new Promise(r => db.query('DELETE FROM services', r));
    // await new Promise(r => db.query('DELETE FROM projects', r));

    for (const s of services) {
        await new Promise((resolve) => {
            db.query('INSERT INTO services (name, description, detailed_description, main_image, gallery_images) VALUES (?,?,?,?,?)',
                [s.name, s.description, s.detailed_description, s.main_image, s.gallery_images], resolve);
        });
        console.log(` Service Added: ${s.name}`);
    }

    for (const p of projects) {
        await new Promise((resolve) => {
            db.query('INSERT INTO projects (title, category, description, image) VALUES (?,?,?,?)',
                [p.title, p.category, p.description, p.image], resolve);
        });
        console.log(` Project Added: ${p.title}`);
    }

    console.log(' Seeding Complete. Your website is now populated!');
    process.exit(0);
};

seedData();
