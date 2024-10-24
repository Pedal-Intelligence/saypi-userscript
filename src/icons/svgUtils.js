export function createCallSvg(){
    const svg = createSvg(768, 768);
    svg.setAttribute('zoomAndPan', 'magnify');
    svg.setAttribute('preserveAspectRatio', "xMidYMid meet");
    return svg;
}

export function createSvg(viewBoxLeft, viewBoxBottom){
    const svg = createSvgElement('svg');
    svg.setAttribute('viewBox', '0 0' + viewBoxLeft + ' ' + viewBoxBottom);
    svg.setAttribute('version', "1.0");
    return svg;
}

export function createSvg(viewBox){
    const svg = createSvgElement('svg');
    svg.setAttribute('viewBox', viewBox);
    svg.setAttribute('version', "1.0");
    return svg;
}

export function createPath(className, fillColor, pathData){
    const path = document.createElementNS("http://www.w3.org/2000/svg", 'path');
    if(className !== ""){
        path.setAttribute('class', className);
    }
    if(fillColor !== ""){
        path.setAttribute('fill', fillColor);
    }
    path.setAttribute('fill-opacity', "1");
    path.setAttribute('fill-rule', "nonzero");
    path.setAttribute('d', pathData);
    return path;
}

export function appendPathTo(svg, className, fillColor, pathData){
    const path = createPath(className, fillColor, pathData);
    svg.appendChild(path);
}

export function addTransparentPathTo(svg, className, opacity, fillColor, pathData){
    const path = createPath(className, fillColor, pathData);
    path.setAttribute('fill-opacity', opacity);
    svg.appendChild(path);
}


export function createSvgElement(name){
    document.createElementNS('http://www.w3.org/2000/svg', name);
}

export function addLineTo(svg, className, x1, y1, x2, y2){
    let line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('class', className);
    line.setAttribute('x1', x1);
    line.setAttribute('y1', y1);
    line.setAttribute('x2', x2);
    line.setAttribute('y2', y2);
    svg.appendChild(line);
}


export function addStyleInDefsTo(svg, styleText){
    const defs = createSvgElement('defs');
    const style = createSvgElement('style');
    defs.appendChild(style);
    style.textContent = styleText;
    svg.appendChild(defs);
}


export function addRectTo(svg, className,  x, y, width, height, rx, ry){
    let rect = createSvgElement('rect');
    rect.setAttribute('class', className);
    rect.setAttribute('x', x);
    rect.setAttribute('y', y);
    rect.setAttribute('width', width);
    rect.setAttribute('height', height);
    rect.setAttribute('rx', rx);
    rect.setAttribute('ry', ry);
    svg.appendChild(rect);
}
