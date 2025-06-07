import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const MAX_FILE_SIZE_MB = 5;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

export const generatePDF = async (elementId: string, filename: string = 'cv.pdf'): Promise<void> => {
  try {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error('Élément introuvable');
    }

    // Start with optimized settings for smaller file size
    let scale = 1.5; // Reduced from 2 to 1.5
    let quality = 0.85; // JPEG quality for compression
    let attempts = 0;
    const maxAttempts = 3;

    while (attempts < maxAttempts) {
      console.log(`Tentative ${attempts + 1} - Échelle: ${scale}, Qualité: ${quality}`);

      // Capture the element as canvas with optimized settings
      const canvas = await html2canvas(element, {
        scale: scale,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false, // Disable logging for performance
        imageTimeout: 0,
        removeContainer: true,
        foreignObjectRendering: false // Better compatibility
      });

      // Convert to compressed JPEG format
      const imgDataUrl = canvas.toDataURL('image/jpeg', quality);
      
      // Calculate dimensions for A4
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 295; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      // Create PDF with compression
      const pdf = new jsPDF({
        orientation: 'p',
        unit: 'mm',
        format: 'a4',
        compress: true // Enable PDF compression
      });

      let heightLeft = imgHeight;
      let position = 0;

      // Add first page
      pdf.addImage(imgDataUrl, 'JPEG', 0, position, imgWidth, imgHeight, undefined, 'MEDIUM');
      heightLeft -= pageHeight;

      // Add additional pages if needed
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgDataUrl, 'JPEG', 0, position, imgWidth, imgHeight, undefined, 'MEDIUM');
        heightLeft -= pageHeight;
      }

      // Get PDF as blob to check size
      const pdfBlob = pdf.output('blob');
      const fileSizeMB = pdfBlob.size / (1024 * 1024);
      
      console.log(`Taille du PDF: ${fileSizeMB.toFixed(2)} MB`);

      // If file size is acceptable, save and return
      if (pdfBlob.size <= MAX_FILE_SIZE_BYTES) {
        console.log('Taille acceptable, sauvegarde du PDF...');
        pdf.save(filename);
        return;
      }

      // If still too large and we have attempts left, reduce quality
      if (attempts < maxAttempts - 1) {
        if (scale > 1.0) {
          scale = Math.max(1.0, scale - 0.3); // Reduce scale
        }
        if (quality > 0.5) {
          quality = Math.max(0.5, quality - 0.15); // Reduce quality
        }
        attempts++;
        console.log('Fichier trop volumineux, tentative avec paramètres réduits...');
      } else {
        // Last attempt - use minimum settings
        console.log('Dernière tentative avec paramètres minimaux...');
        break;
      }
    }

    // If we reach here, create a heavily compressed version
    console.log('Création d\'une version fortement compressée...');
    await createMinimalPDF(element, filename);

  } catch (error) {
    console.error('Erreur lors de la génération du PDF:', error);
    throw error;
  }
};

// Fallback function for creating minimal size PDF
const createMinimalPDF = async (element: HTMLElement, filename: string): Promise<void> => {
  try {
    // Capture with minimal settings
    const canvas = await html2canvas(element, {
      scale: 1.0, // Minimum scale
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: false,
      imageTimeout: 0,
      removeContainer: true,
      foreignObjectRendering: false
    });

    // Convert to heavily compressed JPEG
    const imgDataUrl = canvas.toDataURL('image/jpeg', 0.5); // Low quality for minimum size
    
    const imgWidth = 210;
    const pageHeight = 295;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    const pdf = new jsPDF({
      orientation: 'p',
      unit: 'mm',
      format: 'a4',
      compress: true
    });

    let heightLeft = imgHeight;
    let position = 0;

    // Add pages with maximum compression
    pdf.addImage(imgDataUrl, 'JPEG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgDataUrl, 'JPEG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
      heightLeft -= pageHeight;
    }

    // Check final size
    const finalBlob = pdf.output('blob');
    const finalSizeMB = finalBlob.size / (1024 * 1024);
    
    console.log(`Taille finale du PDF: ${finalSizeMB.toFixed(2)} MB`);
    
    if (finalBlob.size > MAX_FILE_SIZE_BYTES) {
      console.warn(`Attention: Le fichier fait ${finalSizeMB.toFixed(2)} MB, ce qui dépasse la limite de ${MAX_FILE_SIZE_MB} MB`);
    }

    pdf.save(filename);
    
  } catch (error) {
    console.error('Erreur lors de la création du PDF minimal:', error);
    throw error;
  }
};

// Utility function to estimate optimal settings based on content
export const estimateOptimalSettings = (element: HTMLElement) => {
  const rect = element.getBoundingClientRect();
  const area = rect.width * rect.height;
  
  // Adjust settings based on content size
  let scale = 1.5;
  let quality = 0.85;
  
  if (area > 1000000) { // Large content
    scale = 1.2;
    quality = 0.75;
  } else if (area > 500000) { // Medium content
    scale = 1.3;
    quality = 0.8;
  }
  
  return { scale, quality };
};