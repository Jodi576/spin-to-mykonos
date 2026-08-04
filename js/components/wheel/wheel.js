export const slices = [
    "M", "Y", "K", "O", "N", "O", "S",
    "M", "Y", "K", "O", "N", "O", "S",
    "M", "Y", "K", "O", "N", "O", "S",
    "M", "Y", "K", "O", "N", "O", "S",
    "M", "Y"
];

export function createWheel() {

    const center = 250;
    const radius = 240;
    const textRadius = 185;

    let svg = `
<svg
    id="wheelSvg"
    viewBox="0 0 500 500"
    width="600"
    height="600">`;

    slices.forEach((label, i) => {

        const startAngle = (i * 360 / slices.length) - 90;
        const endAngle = ((i + 1) * 360 / slices.length) - 90;
        const midAngle = (startAngle + endAngle) / 2;

        const x1 = center + radius * Math.cos(startAngle * Math.PI / 180);
        const y1 = center + radius * Math.sin(startAngle * Math.PI / 180);

        const x2 = center + radius * Math.cos(endAngle * Math.PI / 180);
        const y2 = center + radius * Math.sin(endAngle * Math.PI / 180);

        const textX = center + textRadius * Math.cos(midAngle * Math.PI / 180);
        const textY = center + textRadius * Math.sin(midAngle * Math.PI / 180);

        const sliceColor = i % 2 === 0
            ? "#0B4FBC" 
            : "#FFFFFF";

        const rotation = midAngle + 90;

        const textColor = sliceColor === "#FFFFFF"
            ? "#0B3A82"
            : "#FFFFFF";

        svg += `
<path
    d="M250 250
       L${x1} ${y1}
       A240 240 0 0 1 ${x2} ${y2}
       Z"
    fill="${sliceColor}"
    stroke="#D4AF37"
    stroke-width="2"/>

<text
    x="${textX}"
    y="${textY}"
    fill="${textColor}"
    font-size="20"
    font-weight="bold"
    text-anchor="middle"
    dominant-baseline="middle"
    transform="rotate(${rotation} ${textX} ${textY})">
    ${label}
</text>
`;

    });

    svg += `

<circle
    cx="250"
    cy="250"
    r="42"
    fill="#D4AF37"
    stroke="#B8860B"
    stroke-width="4"/>

</svg>`;

    return svg;

}