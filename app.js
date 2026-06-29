// --- APP STATE ---
let menuData = null;
let layoutData = null;
let activeGridWrapper = null;

// --- DOM ELEMENTS ---
const gridElement = document.getElementById('menu-grid');
const overlay = document.getElementById('seamless-overlay');
const seamlessCard = document.getElementById('seamless-card');
const seamlessCardInner = document.getElementById('seamless-card-inner');
const slFront = document.getElementById('sl-front');
const slBack = document.getElementById('sl-back');
const floatingGraphic = document.getElementById('floating-graphic');

// --- INITIALIZATION ---
async function initApp() {
    try {
        // --- PROD: Fetch JSON files ---
        // const menuRes = await fetch('menu.json');
        // menuData = await menuRes.json();
        
        // const layoutRes = await fetch('layout.json');
        // layoutData = await layoutRes.json();
        
        // --- DEV FALLBACK (For testing locally without a server) ---
        // If fetch fails (like running locally without a web server), you can inject the JSON here directly.
        // For this code structure, assume the data is successfully parsed into these variables:
        menuData = await fetchMockData('menu');
        layoutData = await fetchMockData('layout');

        applyCardStyles();
        buildGrid();
    } catch (error) {
        console.error("Failed to load JSON configurations:", error);
    }
}

// Applies global layout styles from layout.json
function applyCardStyles() {
    if(!layoutData.cardStyle) return;
    
    // Set custom CSS variables for the cards
    document.documentElement.style.setProperty('--clr-card-bg', layoutData.cardStyle.backgroundColor);
    document.documentElement.style.setProperty('--clr-border', layoutData.cardStyle.borderColor);
    
    // If texture mapping was added, you could apply it to `.card-face`, `.seamless-front`, etc. here.
}

// --- DYNAMIC CARD COMPILER ---
// Builds the inner HTML of a card side based on layout.json coordinates
function compileCardHTML(side, item, svgGraphic) {
    const layout = layoutData[side];
    let html = '';

    // Helper to generate absolute positioned element
    const makeEl = (config, extraClasses, content) => {
        if (!config || !config.visible) return '';
        
        let flexStyle = '';
        if (extraClasses.includes('el-pucks')) {
            const justify = config.align === 'center' ? 'center' : (config.align === 'right' ? 'flex-end' : 'flex-start');
            flexStyle = `display: flex; justify-content: ${justify};`;
        }

        const style = `top: ${config.top}px; left: ${config.left}px; width: ${config.width}px; text-align: ${config.align}; ${flexStyle}`;
        return `<div class="card-element ${extraClasses}" style="${style}">${content}</div>`;
    };

    // 1. Title
    html += makeEl(layout.title, 'el-title', item.name);
    
    // 2. Graphic
    html += makeEl(layout.graphic, 'el-graphic', svgGraphic);
    
    // 3. Pucks (Tags, Sizes)
    const pucksHTML = getPucksHTML(item, side === 'back'); // Show tags only on back usually
    html += makeEl(layout.pucks, 'el-pucks', pucksHTML);

    // 4. Description (Back only)
    if(layout.desc) html += makeEl(layout.desc, 'el-desc', item.description);
    
    // 5. Customization (Back only)
    if(layout.custom) {
        let listHTML = `<strong>Customization</strong><ul>`;
        item.customization.forEach(c => listHTML += `<li>• ${c}</li>`);
        listHTML += `</ul>`;
        html += makeEl(layout.custom, 'el-custom', listHTML);
    }

    return html;
}

// --- GRID BUILDER ---
function buildGrid() {
    gridElement.innerHTML = '';
    const allItems = menuData.categories.flatMap(category => category.items);

    allItems.forEach(item => {
        const svgGraphic = generateCupSVG(item.graphic.fluids, item.ounces);
        const frontHTML = compileCardHTML('front', item, svgGraphic);
        
        const wrapper = document.createElement('div');
        wrapper.className = 'tilt-wrapper';
        wrapper.innerHTML = `
            <div class="card-face">
                ${frontHTML}
            </div>
        `;
        
        wrapper.addEventListener('click', () => pickUpCard(item, wrapper, svgGraphic));
        gridElement.appendChild(wrapper);
    });

    attachTiltEffect();
}

// --- MOUSE TILT (Grid only) ---
function attachTiltEffect() {
    document.querySelectorAll('.tilt-wrapper').forEach(wrapper => {
        const face = wrapper.querySelector('.card-face');
        wrapper.addEventListener('mousemove', e => {
            const rect = wrapper.getBoundingClientRect();
            const x = e.clientX - rect.left, y = e.clientY - rect.top;
            const rotateX = ((y - rect.height / 2) / (rect.height / 2)) * -12; 
            const rotateY = ((x - rect.width / 2) / (rect.width / 2)) * 12;
            face.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });
        wrapper.addEventListener('mouseleave', () => { face.style.transform = `rotateX(0deg) rotateY(0deg)`; });
    });
}

// --- SEAMLESS PICK-UP ANIMATION ---
function pickUpCard(item, gridWrapper) {
    activeGridWrapper = gridWrapper;

    // Generate UNIQUE SVGs for each placement to avoid clip-path ID conflicts!
    const svgFront = generateCupSVG(item.graphic.fluids, item.ounces);
    const svgBack = generateCupSVG(item.graphic.fluids, item.ounces);
    const svgFloating = generateCupSVG(item.graphic.fluids, item.ounces);

    // 1. Compile HTML for the Seamless Card based on Layout
    slFront.innerHTML = compileCardHTML('front', item, svgFront);
    slBack.innerHTML = compileCardHTML('back', item, svgBack);
    floatingGraphic.innerHTML = svgFloating;

    // 2. Reset grid tilt to get pure screen coordinates
    gridWrapper.querySelector('.card-face').style.transform = 'rotateX(0deg) rotateY(0deg)';
    const rect = gridWrapper.getBoundingClientRect();

    // 3. Sync position
    seamlessCard.style.transition = 'none';
    seamlessCardInner.style.transition = 'none';
    seamlessCard.style.transform = `translate(${rect.left}px, ${rect.top}px) scale(1)`;
    seamlessCardInner.style.transform = `rotateY(0deg)`;
    
    // Swap visibility
    overlay.classList.add('active');
    seamlessCard.classList.remove('flipped');
    overlay.classList.remove('show-floating');
    activeGridWrapper.style.visibility = 'hidden';

    void seamlessCard.offsetWidth; // Force Reflow

    // 4. Animate to Center Screen
    const centerX = (window.innerWidth - 260) / 2;
    const centerY = (window.innerHeight - 380) / 2;

    seamlessCard.style.transition = 'transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)';
    seamlessCardInner.style.transition = 'transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)';
    seamlessCard.style.transform = `translate(${centerX}px, ${centerY}px) scale(1.3)`;
}

function dropCard() {
    if (!activeGridWrapper) return;
    
    const rect = activeGridWrapper.getBoundingClientRect();
    seamlessCard.style.transform = `translate(${rect.left}px, ${rect.top}px) scale(1)`;
    seamlessCardInner.style.transform = `rotateY(0deg)`;
    
    overlay.classList.remove('active');
    overlay.classList.remove('show-floating');

    setTimeout(() => {
        if (activeGridWrapper) {
            activeGridWrapper.style.visibility = 'visible';
            activeGridWrapper = null;
        }
    }, 500); 
}

// --- EVENT LISTENERS ---
seamlessCard.addEventListener('click', (e) => {
    e.stopPropagation();
    seamlessCard.classList.toggle('flipped');
    if (seamlessCard.classList.contains('flipped')) {
        seamlessCardInner.style.transform = `rotateY(180deg)`;
        overlay.classList.add('show-floating');
    } else {
        seamlessCardInner.style.transform = `rotateY(0deg)`;
        overlay.classList.remove('show-floating');
    }
});

overlay.addEventListener('click', (e) => {
    if (e.target === overlay || e.target.id === 'close-hint') dropCard();
});
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('active')) dropCard();
});
window.addEventListener('resize', () => {
    if (overlay.classList.contains('active')) dropCard();
});


// --- UTILS (SVG Generator & Pucks) ---
function generateCupSVG(fluids, sizes) {
    let h, topW, botW, topY;
    const botY = 130;
    
    if (sizes.includes('24oz')) { h = 120; topW = 86; botW = 54; topY = 10; } 
    else if (sizes.includes('8oz') && !sizes.includes('16oz') && !sizes.includes('12oz')) { h = 75; topW = 70; botW = 46; topY = 55; } 
    else if (sizes.includes('8oz') && sizes.includes('12oz')) { h = 85; topW = 76; botW = 48; topY = 45; } 
    else { h = 100; topW = 80; botW = 50; topY = 30; }

    const topX1 = 50 - (topW/2), topX2 = 50 + (topW/2), botX1 = 50 - (botW/2), botX2 = 50 + (botW/2);
    let svg = `<svg viewBox="0 0 100 140" xmlns="http://www.w3.org/2000/svg">`;
    const clipId = `cupClip-${Math.random().toString(36).substr(2, 9)}`;
    svg += `<defs><clipPath id="${clipId}"><polygon points="${topX1},${topY} ${topX2},${topY} ${botX2},${botY} ${botX1},${botY}" /></clipPath></defs>`;

    svg += `<g clip-path="url(#${clipId})">`;
    let currentY = botY;
    
    fluids.forEach(layer => {
        const layerHeight = h * layer.ratio;
        const yPos = currentY - layerHeight;
        svg += `<rect x="0" y="${yPos}" width="100" height="${layerHeight + 1.5}" fill="${layer.color}" />`;
        
        if (layer.textVisible && layer.text) {
            const midY = currentY - (layerHeight / 2);
            const widthAtMid = botW + (topW - botW) * ((botY - midY) / (botY - topY));
            const safeW = widthAtMid - 8; 
            const safeX = 50 - (safeW / 2);

            svg += `
            <foreignObject x="${safeX}" y="${yPos}" width="${safeW}" height="${layerHeight}" pointer-events="none">
                <div xmlns="http://www.w3.org/1999/xhtml" style="display: flex; align-items: center; justify-content: center; width: 100%; height: 100%; text-align: center;">
                    <span style="color: ${layer.textColor}; font-size: 8px; font-weight: 900; letter-spacing: 0.5px; line-height: 1.1; font-family: 'Gotham', sans-serif;">
                        ${layer.text}
                    </span>
                </div>
            </foreignObject>`;
        }
        currentY -= layerHeight;
    });
    svg += `</g>`;

    svg += `<polygon points="${topX1},${topY} ${topX2},${topY} ${botX2},${botY} ${botX1},${botY}" fill="none" stroke="var(--clr-text-main)" stroke-width="3" stroke-linejoin="round"/>`;
    svg += `<line x1="${topX1 - 3}" y1="${topY}" x2="${topX2 + 3}" y2="${topY}" stroke="var(--clr-text-main)" stroke-width="3" stroke-linecap="round"/>`;
    svg += `</svg>`;
    return svg;
}

function getPucksHTML(item, includeTags) {
    let html = '';
    item.ounces.forEach(size => { html += `<span class="puck puck-size">${size}</span>`; });
    const tempClass = item.temp === 'HOT' ? 'puck-hot' : 'puck-cold';
    html += `<span class="puck ${tempClass}">${item.temp}</span>`;
    if (includeTags && item.tags) {
        item.tags.forEach(tag => { html += `<span class="puck puck-tag">${tag}</span>`; });
    }
    return html;
}

// Dev fallback function to allow the preview to run without a fetch server
async function fetchMockData(type) {
    if (type === 'layout') return {"cardStyle":{"backgroundColor":"#20130C","borderColor":"#A77D43","texture":"none"},"front":{"title":{"top":20,"left":10,"width":240,"align":"center","visible":true},"graphic":{"top":60,"left":10,"width":240,"align":"center","visible":true},"pucks":{"top":330,"left":10,"width":240,"align":"center","visible":true}},"back":{"title":{"top":20,"left":20,"width":220,"align":"left","visible":true},"desc":{"top":60,"left":20,"width":220,"align":"left","visible":true},"custom":{"top":140,"left":20,"width":220,"align":"left","visible":true},"pucks":{"top":270,"left":20,"width":220,"align":"left","visible":true}}};
    if (type === 'menu') return {"categories":[{"categoryId":"hot_drinks","categoryName":"Hot Classics","items":[{"id":"h1","name":"The Shire's Shot","ounces":["8oz","12oz"],"temp":"HOT","description":"A bold double shot of our house blend, layered with perfectly textured steamed milk.","tags":["Caffeinated","House Special"],"customization":["Whole Milk Standard","Oat Milk (+$.50)","Extra Shot (+$1)"],"graphic":{"fluids":[{"color":"#57151a","ratio":0.35,"textVisible":true,"text":"ESPRESSO","textColor":"#F9F6F0"},{"color":"#dcb871","ratio":0.45,"textVisible":true,"text":"STEAMED MILK","textColor":"#20130C"},{"color":"#e2ddcd","ratio":0.15,"textVisible":true,"text":"FOAM","textColor":"#20130C"}]}},{"id":"h2","name":"Hobbiton Hazelnut","ounces":["12oz","16oz"],"temp":"HOT","description":"Smooth espresso married with textured milk and our rich roasted hazelnut syrup.","tags":["Sweet","Nutty"],"customization":["Hot Only","Half-Sweet Available"],"graphic":{"fluids":[{"color":"#452610","ratio":0.2,"textVisible":true,"text":"HAZELNUT SYRUP","textColor":"#F9F6F0"},{"color":"#c39556","ratio":0.65,"textVisible":true,"text":"ESPRESSO & MILK","textColor":"#20130C"},{"color":"#ffffff","ratio":0.15,"textVisible":true,"text":"CREMA","textColor":"#20130C"}]}}]}]};
}

// Start
document.addEventListener('DOMContentLoaded', initApp);