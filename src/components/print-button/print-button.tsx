'use client';

export const PrintButton = () => {
  const handlePrint = () => {
    if (window !== undefined) {
      window.print();
    }
  };

  return (
    <button onClick={handlePrint} type="button">
      Stampa
    </button>
  );
};
