import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
const doc = new jsPDF();
autoTable(doc, { head: [['A']], body: [['a']] });
console.log(doc.lastAutoTable);
