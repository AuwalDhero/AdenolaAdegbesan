const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const { OpenAI } = require('openai');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// OpenAI Configuration
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || 'proj_Np7UzQFkgLqEITkquQBisbmG'
});

// Email Configuration
const transporter = nodemailer.createTransport({

    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER || 'your-email@gmail.com',
        pass: process.env.EMAIL_PASS || 'your-app-password'
    }
});

// Store assessment data temporarily (in production, use a database)
const assessmentData = new Map();

// AI Strategy Report Templates
const reportTemplates = {
    Exploring: {
        title: "AI Opportunities Explorer Report",
        focus: "Discovery and Opportunity Assessment",
        keyAreas: [
            "Market-specific AI opportunity mapping",
            "Competitive landscape analysis", 
            "Technology readiness assessment",
            "ROI potential evaluation",
            "Risk mitigation strategies"
        ]
    },
    Planning: {
        title: "AI Implementation Planner Report", 
        focus: "Strategic Planning and Roadmap Development",
        keyAreas: [
            "Implementation timeline optimization",
            "Resource allocation strategy",
            "Cross-market compliance framework",
            "Team capability building plan",
            "Technology stack recommendations"
        ]
    },
    Implementing: {
        title: "AI Implementation Optimizer Report",
        focus: "Current Implementation Enhancement", 
        keyAreas: [
            "Implementation progress assessment",
            "Performance optimization strategies",
            "Cross-market scaling opportunities",
            "Risk management enhancement",
            "Success metric refinement"
        ]
    },
    Scaling: {
        title: "AI Scale Mastery Report",
        focus: "Enterprise-wide AI Scaling Strategy",
        keyAreas: [
            "Organizational AI maturity assessment",
            "Scaling framework development",
            "Change management strategy",
            "Advanced AI opportunity identification",
            "Long-term competitive positioning"
        ]
    }
};

// Market-specific insights
const marketInsights = {
    "Nigeria": {
        marketCharacteristics: "Rapidly growing tech ecosystem with increasing AI adoption in fintech and agriculture",
        opportunities: "Mobile-first AI solutions, local language processing, informal sector digitization",
        challenges: "Infrastructure limitations, regulatory uncertainty, talent acquisition",
        regulatoryEnvironment: "Evolving AI governance framework, data protection laws developing",
        culturalConsiderations: "Relationship-driven business culture, hierarchical decision-making structures"
    },
    "United Kingdom": {
        marketCharacteristics: "Mature AI market with strong regulatory framework and enterprise adoption",
        opportunities: "Financial services AI, healthcare innovation, manufacturing optimization",
        challenges: "GDPR compliance, Brexit implications, competitive market landscape",
        regulatoryEnvironment: "Comprehensive AI regulation, strict data protection, ethical AI guidelines",
        culturalConsiderations: "Evidence-based decision making, risk-averse culture, formal business practices"
    },
    "United States": {
        marketCharacteristics: "Leading AI innovation hub with massive market size and venture capital availability",
        opportunities: "Enterprise AI solutions, consumer AI applications, cutting-edge research commercialization",
        challenges: "Intense competition, regulatory complexity, high operational costs",
        regulatoryEnvironment: "Sector-specific regulations, state-level variations, emerging federal AI policy",
        culturalConsiderations: "Fast-paced decision making, innovation-focused culture, results-driven metrics"
    },
    "Multiple": {
        marketCharacteristics: "Complex multi-market operations requiring sophisticated coordination",
        opportunities: "Cross-market synergies, global scaling potential, diversified revenue streams",
        challenges: "Regulatory complexity, cultural adaptation, operational coordination",
        regulatoryEnvironment: "Multiple jurisdictions, varying compliance requirements, complex legal frameworks",
        culturalConsiderations: "Diverse stakeholder management, adaptive leadership styles, global-local balance"
    }
};

// Generate personalized AI strategy report
async function generateAIReport(userData) {
    try {
        const template = reportTemplates[userData.businessStage];
        const marketInsight = marketInsights[userData.country];
        
        const prompt = `
        Generate a comprehensive Strategic AI Clarity Report for ${userData.fullName} based on the following information:
        
        Business Stage: ${userData.businessStage}
        Primary Market: ${userData.country}
        
        Report Template: ${template.title}
        Focus Area: ${template.focus}
        
        Market Context:
        ${JSON.stringify(marketInsight, null, 2)}
        
        Key Areas to Address:
        ${template.keyAreas.join('\n')}
        
        Please provide:
        1. Executive Summary (2-3 paragraphs)
        2. Current Stage Assessment
        3. Market-Specific Opportunities
        4. Strategic Recommendations (5-7 actionable items)
        5. Implementation Roadmap (30-60-90 day plan)
        6. Risk Mitigation Strategies
        7. Success Metrics and KPIs
        8. Next Steps
        
        Format the report professionally with clear sections and actionable insights.
        Make it specific to their business stage and market context.
        `;

        const completion = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [
                {
                    role: "system",
                    content: "You are Adenola Adegbesan, The AI Maverick - a strategic AI clarity coach and business advisor. Generate comprehensive, actionable AI strategy reports that provide clear direction and strategic insights for business leaders."
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            max_tokens: 3000,
            temperature: 0.7
        });

        return completion.choices[0].message.content;
    } catch (error) {
        console.error('Error generating AI report:', error);
        return generateFallbackReport(userData);
    }
}

// Fallback report generation if OpenAI fails
function generateFallbackReport(userData) {
    const template = reportTemplates[userData.businessStage];
    const marketInsight = marketInsights[userData.country];
    
    return `
# Strategic AI Clarity Report
## ${template.title}

**Prepared for:** ${userData.fullName}  
**Business Stage:** ${userData.businessStage}  
**Primary Market:** ${userData.country}  
**Report Date:** ${new Date().toLocaleDateString()}

---

## Executive Summary

This Strategic AI Clarity Report provides personalized recommendations for your AI transformation journey. Based on your current stage of ${userData.businessStage} in the ${userData.country} market, this report outlines strategic opportunities and actionable next steps.

Your market context shows: ${marketInsight.marketCharacteristics}

---

## Current Stage Assessment

**Stage:** ${userData.businessStage}
**Focus:** ${template.focus}

**Key Characteristics:**
${template.keyAreas.map(area => `- ${area}`).join('\n')}

---

## Market-Specific Opportunities

**Market:** ${userData.country}

**Primary Opportunities:**
${marketInsight.opportunities.split(',').map(opp => `- ${opp.trim()}`).join('\n')}

**Market Considerations:**
- ${marketInsight.marketCharacteristics}
- Regulatory Environment: ${marketInsight.regulatoryEnvironment}
- Cultural Factors: ${marketInsight.culturalConsiderations}

---

## Strategic Recommendations

1. **Immediate Actions (Next 30 Days)**
   - Conduct comprehensive AI readiness assessment
   - Identify key stakeholders and decision makers
   - Define clear business objectives for AI integration

2. **Short-term Goals (30-60 Days)**
   - Develop market-specific AI strategy
   - Create implementation timeline and resource plan
   - Establish success metrics and KPIs

3. **Medium-term Objectives (60-90 Days)**
   - Begin pilot AI implementations
   - Monitor performance and adjust strategy
   - Scale successful initiatives

---

## Risk Mitigation Strategies

**Key Challenges:**
${marketInsight.challenges.split(',').map(challenge => `- ${challenge.trim()}`).join('\n')}

**Mitigation Approaches:**
- Start with low-risk, high-impact AI applications
- Implement robust testing and validation processes
- Maintain compliance with local regulations
- Build internal AI expertise gradually

---

## Success Metrics and KPIs

**Performance Indicators:**
- AI implementation progress (% of planned initiatives deployed)
- Business impact metrics (efficiency gains, cost reduction, revenue growth)
- Market penetration and competitive positioning
- Team AI literacy and adoption rates

**Measurement Frequency:**
- Weekly progress reviews
- Monthly impact assessments  
- Quarterly strategy adjustments

---

## Next Steps

1. **Schedule Strategic Clarity Call** - Book a consultation to discuss implementation details
2. **Download Implementation Framework** - Access detailed guides and templates
3. **Join AI Leaders Community** - Connect with other executives in our network
4. **Subscribe to AI Insights** - Receive ongoing strategic updates and market analysis

---

**Report prepared by:** Adenola Adegbesan - The AI Maverick  
**Contact:** Strategic AI clarity for cross-market business growth  
**Next Action:** Schedule your Strategic Clarity Call at https://selar.com/366141ux1u
    `;
}

// API Routes

// Handle lead form submission
app.post('/api/lead-submission', async (req, res) => {
    try {
        const { fullName, email, country, businessStage } = req.body;
        
        // Validate required fields
        if (!fullName || !email || !country || !businessStage) {
            return res.status(400).json({ 
                success: false, 
                message: 'All fields are required' 
            });
        }
        
        // Store user data
        const userId = Date.now().toString();
        const userData = { fullName, email, country, businessStage, id: userId };
        assessmentData.set(userId, userData);
        
        // Generate personalized AI report
        const reportContent = await generateAIReport(userData);
        
        // Send email with report
        const mailOptions = {
            from: process.env.EMAIL_USER || 'your-email@gmail.com',
            to: email,
            subject: `Your Strategic AI Clarity Report - ${fullName}`,
            html: `
                <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                    <h1 style="color: #0B1B3A;">Your Strategic AI Clarity Report</h1>
                    <p>Dear ${fullName},</p>
                    <p>Thank you for completing the AI Strategy Assessment. Your personalized Strategic AI Clarity Report is ready!</p>
                    
                    <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <h3>Your Assessment Summary:</h3>
                        <ul>
                            <li><strong>Business Stage:</strong> ${businessStage}</li>
                            <li><strong>Primary Market:</strong> ${country}</li>
                            <li><strong>Report Focus:</strong> ${reportTemplates[businessStage].focus}</li>
                        </ul>
                    </div>
                    
                    <h2>Your Complete Report:</h2>
                    <div style="background: #fff; border: 1px solid #ddd; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <pre style="white-space: pre-wrap; font-family: inherit;">${reportContent}</pre>
                    </div>
                    
                    <div style="background: #C9A44A; color: #0B1B3A; padding: 15px; border-radius: 8px; margin: 20px 0; text-align: center;">
                        <h3>Ready for 1-on-1 Strategic Guidance?</h3>
                        <p>Book a Strategic Clarity Call to discuss your specific implementation:</p>
                        <a href="https://selar.com/366141ux1u" style="background: #0B1B3A; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Book Consultation Now</a>
                    </div>
                    
                    <p>Best regards,<br>
                    <strong>Adenola Adegbesan</strong><br>
                    The AI Maverick - Strategic AI Clarity Coach</p>
                    
                    <hr style="margin: 30px 0;">
                    <p style="font-size: 12px; color: #666;">
                        This report is generated based on your AI Strategy Assessment responses. 
                        For personalized implementation guidance, schedule a Strategic Clarity Call.
                    </p>
                </div>
            `
        };
        
        await transporter.sendMail(mailOptions);
        
        res.json({ 
            success: true, 
            message: 'Report generated and sent successfully',
            userId: userId
        });
        
    } catch (error) {
        console.error('Error processing lead submission:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error processing your request. Please try again.' 
        });
    }
});

// Handle download form submission
app.post('/api/download-report', async (req, res) => {
    try {
        const { email } = req.body;
        
        if (!email) {
            return res.status(400).json({ 
                success: false, 
                message: 'Email is required' 
            });
        }
        
        // Generate a generic strategic AI report
        const genericReport = `
# Strategic AI Clarity Report - Executive Summary

## The AI Transformation Imperative

Artificial Intelligence is reshaping business landscapes across Nigeria, the UK, and the US. Organizations that achieve strategic AI clarity gain significant competitive advantages through enhanced efficiency, improved decision-making, and innovative service delivery.

## Strategic AI Implementation Framework

### Phase 1: Foundation Building (0-3 months)
- **AI Readiness Assessment**: Evaluate current capabilities and gaps
- **Strategy Alignment**: Connect AI initiatives to business objectives  
- **Team Development**: Build internal AI literacy and expertise
- **Technology Stack**: Select appropriate AI tools and platforms

### Phase 2: Pilot Implementation (3-6 months)
- **Proof of Concept**: Start with low-risk, high-impact use cases
- **Performance Monitoring**: Track ROI and business impact metrics
- **Iterative Improvement**: Refine based on initial results
- **Knowledge Transfer**: Document learnings and best practices

### Phase 3: Scale and Optimize (6-12 months)
- **Enterprise Deployment**: Roll out successful pilots across organization
- **Advanced Applications**: Implement more sophisticated AI solutions
- **Cross-Functional Integration**: Embed AI across business processes
- **Continuous Innovation**: Stay ahead of AI technology trends

## Market-Specific Considerations

### Nigeria
- **Opportunities**: Mobile-first solutions, local language AI, fintech innovation
- **Challenges**: Infrastructure development, talent acquisition
- **Success Factors**: Partnership with local tech ecosystem, gradual implementation

### United Kingdom  
- **Opportunities**: Financial services AI, healthcare innovation, manufacturing optimization
- **Challenges**: GDPR compliance, competitive landscape
- **Success Factors**: Regulatory compliance, proven ROI demonstration

### United States
- **Opportunities**: Enterprise AI solutions, consumer applications, research commercialization
- **Challenges**: Intense competition, regulatory complexity
- **Success Factors**: Innovation focus, rapid scaling capabilities

## Risk Mitigation Strategies

1. **Start Small**: Begin with pilot projects to minimize risk
2. **Measure Everything**: Track performance metrics and ROI
3. **Build Expertise**: Invest in team training and development
4. **Stay Compliant**: Ensure regulatory adherence across markets
5. **Plan for Change**: Prepare for organizational transformation

## Next Steps

1. **Assess Your Current Position**: Complete the AI Readiness Assessment
2. **Define Your Strategy**: Clarify business objectives and AI alignment
3. **Start Implementation**: Begin with pilot projects in key areas
4. **Measure and Adjust**: Continuously monitor and refine your approach
5. **Scale Success**: Expand successful initiatives across the organization

---

**Ready for Personalized Guidance?**

Schedule a Strategic Clarity Call to discuss your specific AI implementation needs:
https://selar.com/366141ux1u

**About Adenola Adegbesan - The AI Maverick**
Strategic AI clarity coach and business advisor helping leaders navigate AI transformation across Nigeria, UK, and US markets.
        `;
        
        // Send email with report
        const mailOptions = {
            from: process.env.EMAIL_USER || 'your-email@gmail.com',
            to: email,
            subject: 'Your Strategic AI Clarity Report',
            html: `
                <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                    <h1 style="color: #0B1B3A;">Your Strategic AI Clarity Report</h1>
                    <p>Thank you for your interest in Strategic AI Clarity! Your report is attached below.</p>
                    
                    <div style="background: #fff; border: 1px solid #ddd; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <pre style="white-space: pre-wrap; font-family: inherit;">${genericReport}</pre>
                    </div>
                    
                    <div style="background: #C9A44A; color: #0B1B3A; padding: 15px; border-radius: 8px; margin: 20px 0; text-align: center;">
                        <h3>Ready for Personalized AI Strategy?</h3>
                        <p>Get a customized report based on your specific business needs:</p>
                        <a href="https://selar.com/366141ux1u" style="background: #0B1B3A; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Take AI Assessment</a>
                    </div>
                    
                    <p>Best regards,<br>
                    <strong>Adenola Adegbesan</strong><br>
                    The AI Maverick - Strategic AI Clarity Coach</p>
                </div>
            `
        };
        
        await transporter.sendMail(mailOptions);
        
        res.json({ 
            success: true, 
            message: 'Report sent successfully'
        });
        
    } catch (error) {
        console.error('Error processing download request:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error processing your request. Please try again.' 
        });
    }
});

// Get assessment results
app.get('/api/assessment-results/:userId', (req, res) => {
    const userId = req.params.userId;
    const userData = assessmentData.get(userId);
    
    if (userData) {
        res.json({
            success: true,
            data: userData
        });
    } else {
        res.status(404).json({
            success: false,
            message: 'Assessment data not found'
        });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ 
        success: true, 
        message: 'Server is running',
        timestamp: new Date().toISOString()
    });
});

// Serve static files
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Error handling middleware
app.use((error, req, res, next) => {
    console.error('Server error:', error);
    res.status(500).json({
        success: false,
        message: 'Internal server error'
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/api/health`);
});

module.exports = app;