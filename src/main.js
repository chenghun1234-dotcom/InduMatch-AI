import './style.css'
import * as tf from '@tensorflow/tfjs'
import * as mobilenet from '@tensorflow-models/mobilenet'

const dropZone = document.getElementById('drop-zone')
const fileInput = document.getElementById('file-input')
const loader = document.getElementById('loader')
const analysisResults = document.getElementById('analysis-results')
const imagePreview = document.getElementById('image-preview')
const detectedName = document.getElementById('detected-name')
const detectedDescription = document.getElementById('detected-description')
const specsTags = document.getElementById('specs-tags')
const matchingResults = document.getElementById('matching-results')

let model = null

// Load the model as soon as possible
async function loadModel() {
    try {
        console.log('Loading MobileNet...')
        model = await mobilenet.load()
        console.log('Model loaded.')
    } catch (err) {
        console.error('Failed to load model', err)
    }
}

loadModel()

dropZone.addEventListener('click', () => fileInput.click())

dropZone.addEventListener('dragover', (e) => {
    e.preventDefault()
    dropZone.style.borderColor = 'var(--accent-primary)'
})

dropZone.addEventListener('dragleave', () => {
    dropZone.style.borderColor = 'var(--border-color)'
})

dropZone.addEventListener('drop', (e) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) {
        handleImage(file)
    }
})

fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0]
    if (file) handleImage(file)
})

async function handleImage(file) {
    const reader = new FileReader()
    reader.onload = async (e) => {
        const imgUrl = e.target.result
        imagePreview.src = imgUrl
        
        // UI Transition
        dropZone.style.display = 'none'
        loader.style.display = 'flex'
        analysisResults.classList.remove('active')
        
        // Ensure model is loaded
        if (!model) await loadModel()
        
        // Analysis
        const imgElement = document.createElement('img')
        imgElement.src = imgUrl
        imgElement.onload = async () => {
            const predictions = await model.classify(imgElement)
            displayResults(predictions)
        }
    }
    reader.readAsDataURL(file)
}

function displayResults(predictions) {
    loader.style.display = 'none'
    analysisResults.classList.add('active')
    
    // Top prediction as the name and description
    const topMatch = predictions[0]
    const name = formatLabel(topMatch.className)
    const description = formatDescription(topMatch.className)
    
    detectedName.innerText = name
    detectedDescription.innerText = description
    
    // Generate simulated specs based on detection
    const tags = generateSpecs(topMatch.className)
    
    // Globalization: HS Code & Unit Conversion
    const hsCode = getHSCode(name)
    const metricSpecs = convertToMetric(tags)
    
    const allTags = [...metricSpecs, `HS: ${hsCode}`]
    specsTags.innerHTML = allTags.map(tag => `<span class="tag">${tag}</span>`).join('')
    
    // Generate matching buyers
    const buyers = getPotentialBuyers(topMatch.className)
    matchingResults.innerHTML = buyers.map(buyer => `
        <div class="match-item">
            <div class="company-info">
                <div style="display: flex; align-items: center; gap: 0.5rem">
                    <h3>${buyer.name}</h3>
                    <span style="font-size: 0.7rem; background: rgba(59, 130, 246, 0.1); padding: 1px 6px; border-radius: 4px; color: var(--accent-primary)">B2B Verified</span>
                </div>
                <p>${buyer.reason}</p>
            </div>
            <div class="relevance-score">${buyer.score}% Match</div>
        </div>
    `).join('')
}

function getHSCode(name) {
    if (name.includes('CABLE') || name.includes('WIRE')) return '8544.42.20'
    if (name.includes('CONNECTOR')) return '8536.69.40'
    return '8548.90.00'
}

function convertToMetric(specs) {
    return specs.map(spec => {
        if (spec.includes('AWG 18')) return `${spec} (≈0.82mm²)`
        return spec
    })
}

function formatLabel(label) {
    return label.split(',')[0].toUpperCase()
}

function formatDescription(label) {
    const parts = label.split(',')
    if (parts.length > 1) {
        return `Detected as ${parts.slice(1).join(', ')}. High-reliability industrial component.`
    }
    return 'Authenticated industrial part with verified supply chain metrics.'
}

function generateSpecs(label) {
    const baseSpecs = ['RoHS Compliant', 'Industrial Grade']
    if (label.toLowerCase().includes('cable') || label.toLowerCase().includes('wire')) {
        return [...baseSpecs, 'AWG 18 Standard', 'PVC Insulation', 'High Conductivity Copper']
    }
    if (label.toLowerCase().includes('computer') || label.toLowerCase().includes('keyboard')) {
        return [...baseSpecs, 'USB-C Interface', 'Low Latency', 'SMT Component']
    }
    return [...baseSpecs, 'Universal Fitting', 'ISO 9001 Certified']
}

function getPotentialBuyers(label) {
    const isCable = label.toLowerCase().includes('cable') || label.toLowerCase().includes('wire')
    
    if (isCable) {
        return [
            { name: 'Samsung Electronics (Hwaseong)', reason: 'Supply chain match for Home Appliances', score: 98 },
            { name: 'Hyundai Mobis', reason: 'High demand for automotive wiring harnesses', score: 92 },
            { name: 'LS Electric', reason: 'Direct match for power distribution units', score: 85 }
        ]
    }
    
    return [
        { name: 'Global Asset Recovery Ltd', reason: 'Specializes in mixed industrial surplus', score: 88 },
        { name: 'InduTrade Co.', reason: 'Regional distributor for general components', score: 75 }
    ]
}
