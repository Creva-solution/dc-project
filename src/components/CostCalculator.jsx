import { useState } from 'react';
import { Calculator, Download } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const ITEMS = [
    {
        id: 'area', label: 'Construction Area', unit: 'sq.ft', type: 'dropdown', defaultCost: 2250, options: [
            { label: 'Basic (₹2,250/sq.ft)', value: 2250 },
            { label: 'Essential (₹2,550/sq.ft)', value: 2550 },
            { label: 'Luxury (₹3,000/sq.ft)', value: 3000 }
        ]
    },
    { id: 'waterSump', label: 'Water Sump', unit: 'Litres', type: 'fixed', defaultCost: 20 },
    { id: 'septicTank', label: 'Septic Tank', unit: 'Litres', type: 'fixed', defaultCost: 25 },
    { id: 'compoundWall', label: 'Compound Wall', unit: 'rft', type: 'fixed', defaultCost: 1200 },
    { id: 'weatheringCourse', label: 'Weathering Course', unit: 'sq.ft', type: 'fixed', defaultCost: 150 },
    { id: 'overHeadTank', label: 'Over Head Tank', unit: 'Litres', type: 'fixed', defaultCost: 20 },
];

const CostCalculator = () => {
    const [data, setData] = useState(
        ITEMS.reduce((acc, item) => {
            acc[item.id] = { quantity: '', cost: item.defaultCost };
            return acc;
        }, {})
    );

    const handleQuantityChange = (id, val) => {
        setData(prev => ({
            ...prev,
            [id]: { ...prev[id], quantity: val }
        }));
    };

    const handleCostChange = (id, val) => {
        setData(prev => ({
            ...prev,
            [id]: { ...prev[id], cost: Number(val) }
        }));
    };

    const formatINR = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount);
    };

    const calculateRowTotal = (id) => {
        const itemData = data[id];
        const q = parseFloat(itemData.quantity) || 0;
        return q * itemData.cost;
    };

    const calculateGrandTotal = () => {
        return ITEMS.reduce((total, item) => total + calculateRowTotal(item.id), 0);
    };

    const handleDownloadPDF = () => {
        const totalAmount = calculateGrandTotal();
        if (totalAmount === 0) {
            alert("Please enter quantities to calculate an estimate before downloading.");
            return;
        }

        const runPdfGeneration = (hasImg, img) => {
            const doc = new jsPDF();
            const pageWidth = doc.internal.pageSize.getWidth();
            const pageHeight = doc.internal.pageSize.getHeight();

            const drawWatermark = () => {
                if (hasImg) {
                    const imgWMWidth = 140;
                    const imgWMHeight = (img.height * imgWMWidth) / img.width;
                    const xWM = (pageWidth - imgWMWidth) / 2;
                    const yWM = (pageHeight - imgWMHeight) / 2;
                    doc.setGState(new doc.GState({ opacity: 0.05 }));
                    doc.addImage(img, 'PNG', xWM, yWM, imgWMWidth, imgWMHeight);
                    doc.setGState(new doc.GState({ opacity: 1.0 }));
                } else {
                    doc.setGState(new doc.GState({ opacity: 0.05 }));
                    doc.setTextColor(100, 100, 100);
                    doc.setFontSize(50);
                    doc.text("DC CONSTRUCTIONS", pageWidth / 2, pageHeight / 2, { angle: 45, align: "center" });
                    doc.setGState(new doc.GState({ opacity: 1.0 }));
                }
            };

            // 1. Draw watermark for Page 1
            drawWatermark();

            // 2. Header Section
            let currentY = 15;
            if (hasImg) {
                const logoWidth = 35;
                const logoHeight = (img.height * logoWidth) / img.width;
                const logoX = (pageWidth - logoWidth) / 2;
                doc.addImage(img, 'PNG', logoX, currentY, logoWidth, logoHeight);
                currentY += logoHeight + 6;
            }

            doc.setTextColor(11, 61, 145); // Primary Blue
            doc.setFontSize(22);
            doc.setFont("helvetica", "bold");
            doc.text("DC CONSTRUCTIONS", pageWidth / 2, currentY, { align: "center" });
            currentY += 8;

            doc.setTextColor(50, 50, 50);
            doc.setFontSize(14);
            doc.text("Construction Cost Estimate", pageWidth / 2, currentY, { align: "center" });
            currentY += 6;

            // Date Line
            doc.setFontSize(10);
            doc.setTextColor(100, 100, 100);
            doc.setFont("helvetica", "normal");
            const dateStr = new Date().toLocaleString();
            doc.text(`Generated on: ${dateStr}`, pageWidth / 2, currentY, { align: "center" });
            currentY += 6;

            // Contact Line
            doc.setFontSize(9);
            doc.setTextColor(80, 80, 80);
            doc.text("Phone: +91 7299114595   |   Email: dcconstructions22@gmail.com   |   Website: www.dcconstructions.in", pageWidth / 2, currentY, { align: "center" });
            currentY += 6;

            // Divider Line
            doc.setDrawColor(200, 200, 200);
            doc.setLineWidth(0.5);
            doc.line(15, currentY, pageWidth - 15, currentY);
            currentY += 10;

            // --- Table Data Prep ---
            const tableColumn = ["Item", "Quantity", "Cost per Unit", "Total Cost"];
            const tableRows = [];

            ITEMS.forEach(item => {
                const rowTotal = calculateRowTotal(item.id);
                if (rowTotal > 0 || data[item.id].quantity) {
                    const qValue = data[item.id].quantity || '0';
                    const quantityStr = `${qValue} ${item.unit}`;
                    const costStr = `Rs. ${item.type === 'dropdown' ? data[item.id].cost : item.defaultCost} / ${item.unit}`;
                    const totalStr = formatINR(rowTotal).replace('₹', 'Rs. ');

                    tableRows.push([item.label, quantityStr, costStr, totalStr]);
                }
            });

            // --- Generate Table ---
            autoTable(doc, {
                startY: currentY,
                head: [tableColumn],
                body: tableRows,
                theme: 'grid',
                headStyles: { fillColor: [11, 61, 145], textColor: 255, fontStyle: 'bold', halign: 'center' },
                columnStyles: {
                    0: { fontStyle: 'bold' },
                    1: { halign: 'center' },
                    2: { halign: 'center' },
                    3: { halign: 'right', fontStyle: 'bold' }
                },
                alternateRowStyles: { fillColor: [249, 250, 251] },
                styles: { fontSize: 10, cellPadding: 6, lineColor: [220, 220, 220], lineWidth: 0.1 },
                margin: { top: 20 },
                didDrawPage: function (data) {
                    if (data.pageNumber > 1) {
                        drawWatermark();
                    }
                    // Add Custom Footer to every page
                    doc.setFontSize(9);
                    doc.setTextColor(150, 150, 150);
                    doc.setFont("helvetica", "italic");
                    doc.text("This is an estimated cost. Final pricing may vary based on exact material selection.", pageWidth / 2, pageHeight - 20, { align: "center" });

                    doc.setFont("helvetica", "bold");
                    doc.setTextColor(11, 61, 145);
                    doc.text("DC Constructions", pageWidth / 2, pageHeight - 14, { align: "center" });

                    doc.setFont("helvetica", "normal");
                    doc.setTextColor(100, 100, 100);
                    doc.text("Engineering Excellence. Living Elegance.", pageWidth / 2, pageHeight - 9, { align: "center" });
                }
            });

            // --- Final Total Section ---
            let finalY = doc.lastAutoTable.finalY + 15;

            // Checking if we ran off the bottom of the page before adding the block
            if (finalY + 30 > pageHeight - 30) {
                doc.addPage();
                finalY = 20;
            }

            // Add highlighted box for Estimated Total
            const boxWidth = 95;
            const boxHeight = 25;
            const boxX = pageWidth - 15 - boxWidth;

            doc.setFillColor(240, 246, 255); // Soft blue highlight
            doc.setDrawColor(11, 61, 145);     // Primary Dark Blue Border
            doc.setLineWidth(0.5);
            doc.roundedRect(boxX, finalY, boxWidth, boxHeight, 3, 3, 'FD');

            doc.setFontSize(14);
            doc.setTextColor(50, 50, 50);
            doc.setFont("helvetica", "bold");
            doc.text("Estimated Total:", boxX + 10, finalY + 16);

            doc.setTextColor(11, 61, 145); // Dark Blue text for Final amount
            doc.setFontSize(18);
            doc.text(`${formatINR(totalAmount).replace('₹', 'Rs. ')}`, boxX + boxWidth - 10, finalY + 16, { align: "right" });

            doc.save(`DC_Construction_Quote.pdf`);
        };

        const img = new Image();
        img.src = '/images/dc-logo.svg';

        img.onload = () => {
            try {
                // Convert SVG to PNG properly for jsPDF
                const canvas = document.createElement('canvas');
                canvas.width = img.width || 908;
                canvas.height = img.height || 585;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

                const pngDataUrl = canvas.toDataURL('image/png');
                const pngImg = new Image();
                pngImg.src = pngDataUrl;
                pngImg.onload = () => {
                    runPdfGeneration(true, pngImg);
                };
                pngImg.onerror = () => {
                    // Fallback to direct img if canvas export fails
                    runPdfGeneration(true, img);
                };
            } catch (e) {
                runPdfGeneration(true, img);
            }
        };

        img.onerror = () => {
            console.warn("Logo failed to load. Generating PDF with fallback text watermark.");
            runPdfGeneration(false, null);
        };
    };

    return (
        <div className="max-w-5xl mx-auto px-4" id="calculator">
            <div className="text-center mb-10 print:mb-6">
                <h2 className="text-3xl md:text-5xl font-black text-primary flex items-center justify-center gap-3">
                    <Calculator className="text-accent hidden sm:block" size={40} />
                    Cost Calculator
                </h2>
                <p className="text-gray-500 mt-3 text-lg print:text-sm">Estimate your construction budget item by item.</p>
            </div>

            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden mb-8 print:shadow-none print:border-gray-300">
                {/* Desktop Table View */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-primary text-white print:bg-gray-100 print:text-black print:border-b-2 print:border-black">
                                <th className="p-5 font-bold w-[30%]">Item</th>
                                <th className="p-5 font-bold w-[25%]">Quantity</th>
                                <th className="p-5 font-bold w-[25%]">Cost per Unit</th>
                                <th className="p-5 font-bold text-right w-[20%]">Total Cost</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 print:divide-gray-400">
                            {ITEMS.map((item) => (
                                <tr key={item.id} className="hover:bg-gray-50 transition print:break-inside-avoid">
                                    <td className="p-5 font-bold text-gray-800 text-lg">{item.label}</td>
                                    <td className="p-5">
                                        <div className="flex items-center gap-2 print:hidden">
                                            <input
                                                type="number"
                                                min="0"
                                                value={data[item.id].quantity}
                                                onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                                                className="w-full max-w-[140px] px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-secondary transition bg-gray-50"
                                                placeholder={`e.g. 100`}
                                            />
                                            <span className="text-gray-500 font-semibold">{item.unit}</span>
                                        </div>
                                        {/* For printing */}
                                        <div className="hidden print:block text-gray-800">
                                            {data[item.id].quantity || '0'} {item.unit}
                                        </div>
                                    </td>
                                    <td className="p-5">
                                        <div className="print:hidden">
                                            {item.type === 'dropdown' ? (
                                                <select
                                                    value={data[item.id].cost}
                                                    onChange={(e) => handleCostChange(item.id, e.target.value)}
                                                    className="w-full max-w-[220px] px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-secondary transition bg-gray-50 font-semibold text-primary outline-none hover:bg-white"
                                                >
                                                    {item.options.map(opt => (
                                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                                    ))}
                                                </select>
                                            ) : (
                                                <span className="text-gray-600 font-semibold px-4 py-3 bg-gray-50 border border-transparent rounded-lg inline-block">₹{item.defaultCost} <span className="text-sm">/ {item.unit}</span></span>
                                            )}
                                        </div>
                                        <div className="hidden print:block text-gray-800">
                                            ₹{data[item.id].cost} / {item.unit}
                                        </div>
                                    </td>
                                    <td className="p-5 text-right font-black text-xl text-primary">
                                        {formatINR(calculateRowTotal(item.id))}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr className="bg-gray-50 border-t border-gray-200 print:border-t-2 print:border-black">
                                <td colSpan="3" className="p-8 text-right font-black text-2xl text-primary">
                                    Total Cost:
                                </td>
                                <td className="p-8 text-right font-black text-3xl text-accent">
                                    {formatINR(calculateGrandTotal())}
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>

                {/* Mobile Cards View */}
                <div className="md:hidden pb-10 bg-gray-50/50 print:hidden space-y-4 pt-4 px-4">
                    {ITEMS.map((item) => (
                        <div key={item.id} className="p-4 bg-white rounded-[16px] shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                            <h3 className="font-bold text-gray-800 text-[17px] mb-4">{item.label}</h3>

                            <div className="flex flex-col gap-3">
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-[12px] font-bold text-gray-400 uppercase tracking-widest pl-1">Quantity ({item.unit})</label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={data[item.id].quantity}
                                        onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                                        className="w-full px-4 py-3.5 border border-gray-200 rounded-[12px] focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary/50 bg-gray-50 transition-all font-semibold"
                                        placeholder={`Qty in ${item.unit}`}
                                    />
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <label className="text-[12px] font-bold text-gray-400 uppercase tracking-widest pl-1">Rate</label>
                                    {item.type === 'dropdown' ? (
                                        <select
                                            value={data[item.id].cost}
                                            onChange={(e) => handleCostChange(item.id, e.target.value)}
                                            className="w-full px-4 py-3.5 border border-gray-200 rounded-[12px] focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary/50 bg-gray-50 transition-all font-semibold text-primary appearance-none"
                                        >
                                            <option value={item.options[0].value}>{item.options[0].label}</option>
                                            <option value={item.options[1].value}>{item.options[1].label}</option>
                                            <option value={item.options[2].value}>{item.options[2].label}</option>
                                        </select>
                                    ) : (
                                        <div className="flex items-center px-4 py-3.5 bg-gray-50 border border-gray-100 rounded-[12px] text-gray-500 font-semibold gap-1">
                                            ₹{item.defaultCost} <span className="text-gray-400 font-medium">/ {item.unit}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="pt-4 mt-4 border-t border-gray-100 flex justify-between items-end">
                                <span className="text-gray-400 font-bold uppercase text-[11px] tracking-wider mb-1">Item Total</span>
                                <span className="font-black text-primary text-[22px] leading-none">{formatINR(calculateRowTotal(item.id))}</span>
                            </div>
                        </div>
                    ))}

                    <div className="mt-8 p-6 bg-primary rounded-[16px] shadow-lg relative overflow-hidden flex flex-col items-center justify-center min-h-[140px]">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-xl"></div>
                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-10 -mb-10 blur-xl"></div>
                        <span className="text-white/80 font-bold text-[13px] tracking-widest uppercase mb-2 relative z-10">Estimated Total</span>
                        <div className="font-black text-[36px] text-white tracking-tight relative z-10 break-all text-center leading-none">
                            {formatINR(calculateGrandTotal())}
                        </div>
                    </div>
                </div>
            </div>

            {/* Sticky Action Footer purely for mobile, heavily padded layout for Desktop */}
            <div className="flex flex-col md:flex-row justify-center print:hidden mb-32 md:mb-12 px-4 md:px-0">
                <button
                    onClick={handleDownloadPDF}
                    className="w-full md:w-auto flex items-center justify-center gap-3 bg-accent text-white font-bold px-8 py-4 md:py-5 rounded-2xl shadow-md hover:shadow-xl hover:bg-primary transition-all duration-300 md:hover:-translate-y-1 group relative overflow-hidden"
                >
                    <Download size={22} className="relative z-10 md:group-hover:translate-y-1 transition duration-300" />
                    <span className="relative z-10 text-[15px] md:text-[16px]">Download PDF Quote</span>
                    <div className="absolute inset-0 bg-black/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300 rounded-2xl"></div>
                </button>
            </div>

        </div>
    );
};

export default CostCalculator;
