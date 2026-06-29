/**
 * Halflings Hollow Espresso - Interactive Menu System
 * Uses layout.json and menu.json for configuration
 */

// --- APP STATE ---
let menuData = null;
let layoutData = null;
let activeGridWrapper = null;
let isAnimating = false;

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
        // Fetch JSON configurations
        const menuRes = await fetch('menu.json');
        if (!menuRes.ok) throw new Error(`Failed to fetch menu.json: ${menuRes.status}`);
        menuData = await menuRes.json();
        
        const layoutRes = await fetch('layout.json');
        if (!layoutRes.ok) throw new Error(`Failed to fetch layout.json: ${layoutRes.status}`);
        layoutData = await layoutRes.json();
        
        // Validate data structure
        if (!menuData.categories || !Array.isArray(menuData.categories)) {
            throw new Error('menu.json must contain a "categories" array');
        }
        if (!layoutData.front || !layoutData.back) {
            throw new Error('layout.json must contain "front" and "back" properties');
        }
        
        applyCardStyles();
        buildGrid();
    } catch (error) {
        console.error('App Initialization Error:', error);
        gridElement.innerHTML = `<div style="grid-column: 1/-1; padding: 2rem; text-align: center; color: #ff6b6b;"><h2>Failed to load menu data</h2><p>${error.message}</p><p style="font-size: 0.9rem; color: #ccc; margin-top: 1rem;">Check browser console for details</p></div>`;
    }
}

/**
 * Apply global card styles from layout.json
 */
function applyCardStyles() {
    if (!layoutData.cardStyle) return;
    
    if (layoutData.cardStyle.backgroundColor) {
        document.documentElement.style.setProperty('--clr-card-bg', layoutData.cardStyle.backgroundColor);
    }
    if (layoutData.cardStyle.borderColor) {
        document.documentElement.style.setProperty('--clr-border', layoutData.cardStyle.borderColor);
    }
}

/**
 * Compile card HTML for a given side (front/back) and item
 */
function compileCardHTML(side, item, svgGraphic) {
    const layout = layoutData[side];
    let html = '';

    const makeEl = (config, extraClasses, content) => {
        if (!config || !config.visible) return '';
        
        // Base positioning
        let style = `top: ${config.top || 0}px; left: ${config.left || 0}px; width: ${config.width || 'auto'}px; text-align: ${config.align || 'left'};`;
        
        // Layout specifics for pucks (flex container)
        if (extraClasses.includes('el-pucks')) {
            const justify = config.align === 'center' ? 'center' : (config.align === 'right' ? 'flex-end' : 'flex-start');
            style += ` display: flex; justify-content: ${justify};`;
        }

        // Apply Custom Typography from layout.json
        if (config.color) style += ` color: ${config.color};`;
        if (config.fontSize) style += ` font-size: ${config.fontSize}px;`;
        if (config.fontWeight) style += ` font-weight: ${config.fontWeight};`;
        if (config.lineHeight) style += ` line-height: ${config.lineHeight};`;

        return `<div class="card-element ${extraClasses}" style="${style}">${content}</div>`;
    };

    if (layout.title) html += makeEl(layout.title, 'el-title', item.name || '');
    if (layout.graphic) html += makeEl(layout.graphic, 'el-graphic', svgGraphic);
    
    if (layout.pucks) {
        const pucksHTML = getPucksHTML(item, side === 'back');
        html += makeEl(layout.pucks, 'el-pucks', pucksHTML);
    }

    if (layout.desc) html += makeEl(layout.desc, 'el-desc', item.description || '');
    
    if (layout.custom && item.customization && item.customization.length > 0) {
        let listHTML = `<strong>Customization</strong><ul>`;
        item.customization.forEach(c => listHTML += `<li>• ${c}</li>`);
        listHTML += `</ul>`;
        html += makeEl(layout.custom, 'el-custom', listHTML);
    }

    return html;
}

/**
 * Build the grid of cards from menu data
 */
function buildGrid() {
    gridElement.innerHTML = '';
    
    if (!menuData || !menuData.categories) return;

    const allItems = menuData.categories.flatMap(category => category.items || []);

    if (allItems.length === 0) {
        gridElement.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 2rem; color: #999;">No menu items found</div>';
        return;
    }

    allItems.forEach(item => {
        if (!item.name || !item.graphic) return;

        // Generate unique SVG for grid card
        const svgGraphic = generateCupSVG(item.graphic.fluids, item.ounces, layoutData.front.graphic?.textStyle);
        const frontHTML = compileCardHTML('front', item, svgGraphic);
        
        const wrapper = document.createElement('div');
        wrapper.className = 'tilt-wrapper';
        wrapper.innerHTML = `<div class="card-face">${frontHTML}</div>`;
        
        wrapper.addEventListener('click', () => pickUpCard(item, wrapper));
        gridElement.appendChild(wrapper);
    });

    attachTiltEffect();
}

/**
 * Attach mouse tilt effect to grid cards
 */
function attachTiltEffect() {
    document.querySelectorAll('.tilt-wrapper').forEach(wrapper => {
        const face = wrapper.querySelector('.card-face');
        
        wrapper.addEventListener('mousemove', e => {
            if (isAnimating || !face) return;
            
            const rect = wrapper.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const rotateX = ((y - rect.height / 2) / (rect.height / 2)) * -12; 
            const rotateY = ((x - rect.width / 2) / (rect.width / 2)) * 12;
            face.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });
        
        wrapper.addEventListener('mouseleave', () => { 
            if (face) face.style.transform = `rotateX(0deg) rotateY(0deg)`; 
        });
    });
}

/**
 * Pick up card and animate to center screen
 */
function pickUpCard(item, gridWrapper) {
    if (isAnimating || !item.graphic) return;
    
    isAnimating = true;
    activeGridWrapper = gridWrapper;
    
    const textStyle = layoutData.front.graphic?.textStyle;

    // Generate UNIQUE SVGs for each placement to avoid clip-path ID conflicts
    const svgFront = generateCupSVG(item.graphic.fluids, item.ounces, textStyle);
    const svgBack = generateCupSVG(item.graphic.fluids, item.ounces, textStyle);
    const svgFloating = generateCupSVG(item.graphic.fluids, item.ounces, textStyle);

    slFront.innerHTML = compileCardHTML('front', item, svgFront);
    slBack.innerHTML = compileCardHTML('back', item, svgBack);
    floatingGraphic.innerHTML = svgFloating;

    // Reset grid tilt
    const cardFace = gridWrapper.querySelector('.card-face');
    if (cardFace) cardFace.style.transform = 'rotateX(0deg) rotateY(0deg)';
    
    const rect = gridWrapper.getBoundingClientRect();

    // Sync position (no transition yet)
    seamlessCard.style.transition = 'none';
    seamlessCardInner.style.transition = 'none';
    seamlessCard.style.transform = `translate(${rect.left}px, ${rect.top}px) scale(1)`;
    seamlessCardInner.style.transform = `rotateY(0deg)`;
    
    // Show overlay
    overlay.classList.add('active');
    seamlessCard.classList.remove('flipped');
    overlay.classList.remove('show-floating');
    activeGridWrapper.style.visibility = 'hidden';

    // Force reflow to trigger animation
    void seamlessCard.offsetWidth;

    // Animate to center
    const centerX = (window.innerWidth - 260) / 2;
    const centerY = (window.innerHeight - 380) / 2;

    seamlessCard.style.transition = 'transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)';
    seamlessCardInner.style.transition = 'transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)';
    seamlessCard.style.transform = `translate(${centerX}px, ${centerY}px) scale(1.3)`;
    
    setTimeout(() => { isAnimating = false; }, 500);
}

/**
 * Drop card back to grid position
 */
function dropCard() {
    if (!activeGridWrapper || isAnimating) return;
    
    isAnimating = true;
    
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
        isAnimating = false;
    }, 500);
}

/**
 * Toggle card flip
 */
function toggleCardFlip() {
    if (isAnimating) return;
    
    seamlessCard.classList.toggle('flipped');
    if (seamlessCard.classList.contains('flipped')) {
        seamlessCardInner.style.transform = `rotateY(180deg)`;
        overlay.classList.add('show-floating');
    } else {
        seamlessCardInner.style.transform = `rotateY(0deg)`;
        overlay.classList.remove('show-floating');
    }
}

// --- EVENT LISTENERS ---
seamlessCard.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleCardFlip();
});

overlay.addEventListener('click', (e) => {
    if (e.target === overlay || e.target.id === 'close-hint') {
        dropCard();
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('active')) {
        dropCard();
    }
});

window.addEventListener('resize', () => {
    if (overlay.classList.contains('active')) {
        dropCard();
    }
});

// --- UTILITIES ---

/**
 * Generate unique SVG cup with fluid layers
 */
function generateCupSVG(fluids, sizes, textStyle = {}) {
    let h, topW, botW, topY;
    const botY = 130;
    
    if (!sizes) sizes = [];
    if (sizes.includes('24oz')) { h = 120; topW = 86; botW = 54; topY = 10; } 
    else if (sizes.includes('8oz') && !sizes.includes('16oz') && !sizes.includes('12oz')) { h = 75; topW = 70; botW = 46; topY = 55; } 
    else if (sizes.includes('8oz') && sizes.includes('12oz')) { h = 85; topW = 76; botW = 48; topY = 45; } 
    else { h = 100; topW = 80; botW = 50; topY = 30; }

    const tSize = textStyle.fontSize || 8;
    const tWeight = textStyle.fontWeight || 900;
    const tSpace = textStyle.letterSpacing || 0.5;

    const topX1 = 50 - (topW / 2), topX2 = 50 + (topW / 2);
    const botX1 = 50 - (botW / 2), botX2 = 50 + (botW / 2);
    
    // Unique clip-path ID
    const clipId = `cupClip-${Math.random().toString(36).substr(2, 9)}`;
    
    let svg = `<svg viewBox="0 0 100 140" xmlns="http://www.w3.org/2000/svg">`;
    svg += `<defs><clipPath id="${clipId}"><polygon points="${topX1},${topY} ${topX2},${topY} ${botX2},${botY} ${botX1},${botY}" /></clipPath></defs>`;
    svg += `<g clip-path="url(#${clipId})">`;
    
    let currentY = botY;
    
    if (fluids && Array.isArray(fluids)) {
        fluids.forEach(layer => {
            const layerHeight = h * (layer.ratio || 0);
            const yPos = currentY - layerHeight;
            svg += `<rect x="0" y="${yPos}" width="100" height="${layerHeight + 1.5}" fill="${layer.color || '#ccc'}" />`;
            
            // Add text if visible
            if (layer.textVisible && layer.text) {
                const midY = currentY - (layerHeight / 2);
                const widthAtMid = botW + (topW - botW) * ((botY - midY) / (botY - topY));
                const safeW = Math.max(widthAtMid - 8, 20);
                const safeX = 50 - (safeW / 2);

                svg += `<foreignObject x="${safeX}" y="${yPos}" width="${safeW}" height="${layerHeight}" pointer-events="none">
                    <div xmlns="http://www.w3.org/1999/xhtml" style="display: flex; align-items: center; justify-content: center; width: 100%; height: 100%; text-align: center;">
                        <span style="color: ${layer.textColor || '#fff'}; font-size: ${tSize}px; font-weight: ${tWeight}; letter-spacing: ${tSpace}px; line-height: 1.1; font-family: 'Poppins', 'Montserrat', sans-serif;">
                            ${layer.text}
                        </span>
                    </div>
                </foreignObject>`;
            }
            currentY -= layerHeight;
        });
    }
    
    svg += `</g>`;

    // Cup outline
    svg += `<polygon points="${topX1},${topY} ${topX2},${topY} ${botX2},${botY} ${botX1},${botY}" fill="none" stroke="var(--clr-text-main)" stroke-width="3" stroke-linejoin="round"/>`;
    svg += `<line x1="${topX1 - 3}" y1="${topY}" x2="${topX2 + 3}" y2="${topY}" stroke="var(--clr-text-main)" stroke-width="3" stroke-linecap="round"/>`;
    svg += `</svg>`;
    
    return svg;
}

/**
 * Generate puck HTML (sizes, temp, tags)
 */
function getPucksHTML(item, includeTags) {
    let html = '';
    
    if (item.ounces && Array.isArray(item.ounces)) {
        item.ounces.forEach(size => { 
            html += `<span class="puck puck-size">${size}</span>`; 
        });
    }
    
    const tempClass = item.temp === 'HOT' ? 'puck-hot' : 'puck-cold';
    html += `<span class="puck ${tempClass}">${item.temp || 'HOT'}</span>`;
    
    if (includeTags && item.tags && Array.isArray(item.tags)) {
        item.tags.forEach(tag => { 
            html += `<span class="puck puck-tag">${tag}</span>`; 
        });
    }
    
    return html;
}

// --- START APPLICATION ---
document.addEventListener('DOMContentLoaded', initApp);
