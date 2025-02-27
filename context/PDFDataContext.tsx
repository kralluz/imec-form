// app/context/PDFDataContext.tsx
import React, { createContext, useState, ReactNode } from 'react';

interface PDFDataContextType {
  pdfData: any;
  setPDFData: React.Dispatch<React.SetStateAction<Partial<any>>>;
}

export const PDFDataContext = createContext<PDFDataContextType | undefined>(
  undefined
);

export const PDFDataProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [pdfData, setPDFData] = useState<Partial<any>>({});

  return (
    <PDFDataContext.Provider value={{ pdfData, setPDFData }}>
      {children}
    </PDFDataContext.Provider>
  );
};
